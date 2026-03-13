import { NextRequest, NextResponse } from "next/server";

// Check if DATABASE_URL is available
const DATABASE_URL = process.env.DATABASE_URL || "";

// Only import neon if URL is available
const getSql = async () => {
  if (!DATABASE_URL) {
    return null;
  }
  const { neon } = await import("@neondatabase/serverless");
  return neon(DATABASE_URL);
};

// Local in-memory storage fallback
declare global {
  var __users: any[] | undefined;
}

const getUsers = () => {
  if (!global.__users) {
    global.__users = [
      {
        id: 1,
        full_name: "Admin",
        username: "admin",
        phone: "+994507988177",
        email: "premiumreklam@bk.ru",
        password_hash: "admin123",
        role: "ADMIN",
        level: 100,
        total_orders: 0,
        bonus_points: 0,
        created_at: new Date().toISOString(),
      },
    ];
  }
  return global.__users;
};

const saveUsers = (users: any[]) => {
  global.__users = users;
};

// GET - Fetch all users (for admin panel)
export async function GET() {
  try {
    // Try PostgreSQL if available
    const sql = await getSql();
    if (sql) {
      const users = await sql`
        SELECT id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
        FROM users ORDER BY created_at DESC
      `;
      return NextResponse.json({ users });
    }

    // Fallback to in-memory storage
    const users = getUsers().map(({ password_hash, ...user }) => user);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET users error:", error);
    const users = getUsers().map(({ password_hash, ...user }) => user);
    return NextResponse.json({ users });
  }
}

// POST - Create new user (registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try PostgreSQL if available
    const sql = await getSql();
    if (sql) {
      // Check if username exists
      const existing = await sql`SELECT * FROM users WHERE username = ${body.username}`;
      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Bu istifadəçi adı artıq mövcuddur" },
          { status: 400 }
        );
      }

      // Create new user
      const result = await sql`
        INSERT INTO users (full_name, username, phone, password_hash, role, level)
        VALUES (${body.fullName}, ${body.username}, ${body.phone || ''}, ${body.password}, 'DECORATOR', 1)
        RETURNING id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
      `;

      return NextResponse.json({ user: result[0] }, { status: 201 });
    }

    // Fallback to in-memory storage
    const users = getUsers();
    
    // Check if username exists
    if (users.find((u: any) => u.username === body.username)) {
      return NextResponse.json(
        { error: "Bu istifadəçi adı artıq mövcuddur" },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      full_name: body.fullName,
      username: body.username,
      phone: body.phone || "",
      email: "",
      password_hash: body.password,
      role: "DECORATOR",
      level: 1,
      total_orders: 0,
      bonus_points: 0,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password_hash, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}
