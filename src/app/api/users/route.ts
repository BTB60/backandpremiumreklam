import { NextRequest, NextResponse } from "next/server";
import { getSql, initDB } from "@/lib/neon";

// Type for query results
type QueryResult = any[] | Record<string, any>[];

// GET - Fetch all users (for admin panel)
export async function GET() {
  try {
    await initDB();
    const users = await getSql()`
      SELECT id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
      FROM users ORDER BY created_at DESC
    ` as QueryResult;
    return NextResponse.json({ users: Array.isArray(users) ? users : [] });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ users: [] }, { status: 500 });
  }
}

// POST - Create new user (registration)
export async function POST(request: NextRequest) {
  try {
    await initDB();
    const body = await request.json();

    // Check if username exists
    const existing = await getSql()`SELECT * FROM users WHERE username = ${body.username}` as QueryResult;
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "Bu istifadəçi adı artıq mövcuddur" },
        { status: 400 }
      );
    }

    // Create new user
    const result = await getSql()`
      INSERT INTO users (full_name, username, phone, password_hash, role, level)
      VALUES (${body.fullName}, ${body.username}, ${body.phone || ''}, ${body.password}, 'DECORATOR', 1)
      RETURNING id, full_name, username, phone, email, role, level, total_orders, bonus_points, created_at
    ` as QueryResult;

    if (!Array.isArray(result) || result.length === 0) {
      throw new Error("Failed to create user");
    }

    return NextResponse.json({ user: result[0] }, { status: 201 });
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { error: "Server xətası" },
      { status: 500 }
    );
  }
}
