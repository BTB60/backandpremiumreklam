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

// Initialize database
async function initDB(sql: any) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'DECORATOR',
        level INTEGER DEFAULT 1,
        total_orders INTEGER DEFAULT 0,
        bonus_points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error) {
    console.error("DB init error:", error);
  }
}

// POST - Login
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
    await initDB(sql); // Initialize database
    
    const body = await request.json();
    const { username, password } = body;

    // Find user in Neon PostgreSQL database
    const result = await sql`
      SELECT id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
      FROM users 
      WHERE username = ${username} AND password_hash = ${password}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "İstifadəçi adı və ya şifrə yanlışdır" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: result[0] });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}
