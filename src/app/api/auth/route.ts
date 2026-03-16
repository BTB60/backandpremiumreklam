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
