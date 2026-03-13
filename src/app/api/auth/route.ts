import { NextRequest, NextResponse } from "next/server";
import { getSql, initDB } from "@/lib/neon";

// Type for query results
type QueryResult = any[] | Record<string, any>[];

// POST - Login
export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();
    const { username, password } = body;

    // Find user in Neon database
    const result = await getSql()`
      SELECT id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
      FROM users 
      WHERE username = ${username} AND password_hash = ${password}
    ` as QueryResult;

    if (!Array.isArray(result) || result.length === 0) {
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
