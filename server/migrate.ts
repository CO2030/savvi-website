
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import { sql } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

async function migrate() {
  console.log('Creating database tables...');

  try {
    // Create waitlist_entries table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS waitlist_entries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        user_type TEXT NOT NULL,
        health_goal TEXT NOT NULL,
        dietary_concern TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    // Create newsletter_subscribers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      )
    `);

    // Create contact_submissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        reason TEXT NOT NULL,
        message TEXT,
        created_at TEXT NOT NULL
      )
    `);

    // Create users table (for admin)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    await pool.end();
  }
}

migrate();
