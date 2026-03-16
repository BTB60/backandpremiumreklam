import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Get database URL from environment
function getDatabaseUrl(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.premiumreklambaku_POSTGRES_URL ||
    process.env.premiumreklambaku_DATABASE_URL ||
    ""
  );
}

// Initialize orders table
async function initOrdersTable(sql: any) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'PENDING',
        total_price DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error("Orders table init error:", error);
  }
}

// GET - Fetch all orders (for admin) or user orders
export async function GET(request: NextRequest) {
  try {
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      return NextResponse.json({ orders: [] }, { status: 500 });
    }

    const sql = neon(dbUrl);
    await initOrdersTable(sql);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let orders;
    if (userId) {
      // Get orders for specific user
      orders = await sql`
        SELECT o.*, u.full_name as user_name, u.username as user_username
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ${userId}
        ORDER BY o.created_at DESC
      `;
    } else {
      // Get all orders (for admin)
      orders = await sql`
        SELECT o.*, u.full_name as user_name, u.username as user_username
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `;
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET orders error:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const sql = neon(dbUrl);
    await initOrdersTable(sql);

    const body = await request.json();

    const result = await sql`
      INSERT INTO orders (user_id, title, description, status, total_price)
      VALUES (${body.userId}, ${body.title}, ${body.description || ''}, ${body.status || 'PENDING'}, ${body.totalPrice || 0})
      RETURNING *
    `;

    return NextResponse.json({ order: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST order error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const sql = neon(dbUrl);
    const body = await request.json();

    const result = await sql`
      UPDATE orders
      SET status = ${body.status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${body.orderId}
      RETURNING *
    `;

    return NextResponse.json({ order: result[0] });
  } catch (error) {
    console.error("PATCH order error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}
