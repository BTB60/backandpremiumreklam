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

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Try PostgreSQL if available
    const sql = await getSql();
    if (sql) {
      const result = await sql`
        SELECT id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
        FROM users 
        WHERE username = ${username} AND password_hash = ${password}
      `;

      if (result && result.length > 0) {
        return NextResponse.json({ user: result[0] });
      }
    }

    // Fallback to in-memory storage
    const users = getUsers();
    const user = users.find(
      (u: any) => u.username === username && u.password_hash === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "İstifadəçi adı və ya şifrə yanlışdır" },
        { status: 401 }
      );
    }

    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}
