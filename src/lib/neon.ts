import { neon } from "@neondatabase/serverless";

// Initialize Neon client - use Vercel Neon integration URL
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.premiumreklambaku_POSTGRES_URL ||
  process.env.premiumreklambaku_DATABASE_URL ||
  "";

const sql = neon(DATABASE_URL);

// Initialize database schema
export async function initDB() {
  try {
    // Create users table
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

    // Create orders table
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

    // Create default admin if not exists
    const adminCheck = await sql`SELECT * FROM users WHERE username = 'admin'`;
    if (adminCheck.length === 0) {
      await sql`
        INSERT INTO users (full_name, username, phone, email, password_hash, role, level)
        VALUES ('Admin', 'admin', '+994507988177', 'premiumreklam@bk.ru', 'admin123', 'ADMIN', 100)
      `;
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

export { sql };
