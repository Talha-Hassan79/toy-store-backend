/**
 * Setup script for Neon PostgreSQL
 * This script will:
 * 1. Create all required tables
 * 2. Seed an admin user (admin@toystore.com / AdminPassword123!)
 * 
 * Run with: node scratch/setup_postgres.js
 */

const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in your .env file');
  process.exit(1);
}

async function setup() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // 1. Create User table
    console.log('📋 Creating "user" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "role" VARCHAR DEFAULT 'user',
        "isVerified" BOOLEAN DEFAULT false,
        "verificationToken" VARCHAR
      );
    `);
    console.log('   ✅ user table ready');

    // 2. Create Product table
    console.log('📋 Creating "product" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "product" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "category" VARCHAR NOT NULL,
        "price" DECIMAL NOT NULL,
        "stock" INTEGER NOT NULL,
        "status" VARCHAR NOT NULL,
        "images" TEXT NOT NULL DEFAULT '[]'
      );
    `);
    console.log('   ✅ product table ready');

    // 3. Create Order table
    console.log('📋 Creating "order" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "order" (
        "id" VARCHAR PRIMARY KEY,
        "customer" VARCHAR NOT NULL,
        "email" VARCHAR,
        "phone" VARCHAR,
        "address" VARCHAR,
        "date" VARCHAR NOT NULL,
        "total" DECIMAL NOT NULL,
        "status" VARCHAR NOT NULL,
        "paymentMethod" VARCHAR,
        "items" INTEGER NOT NULL,
        "itemsList" TEXT
      );
    `);
    console.log('   ✅ order table ready');

    // 4. Create Messages table
    console.log('📋 Creating "messages" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "subject" VARCHAR,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('   ✅ messages table ready');

    // 5. Seed admin user
    console.log('\n👤 Setting up admin user...');
    const adminEmail = 'admin@toystore.com';
    const adminPassword = 'AdminPassword123!';
    const adminName = 'Super Admin';

    // Check if admin already exists
    const existing = await client.query('SELECT id FROM "user" WHERE email = $1', [adminEmail]);
    
    if (existing.rows.length > 0) {
      console.log('   ⚠️  Admin user already exists, updating...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await client.query(
        'UPDATE "user" SET "password" = $1, "role" = $2, "isVerified" = $3, "verificationToken" = NULL WHERE email = $4',
        [hashedPassword, 'admin', true, adminEmail]
      );
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await client.query(
        'INSERT INTO "user" ("name", "email", "password", "role", "isVerified") VALUES ($1, $2, $3, $4, $5)',
        [adminName, adminEmail, hashedPassword, 'admin', true]
      );
    }
    console.log('   ✅ Admin user ready');

    // 6. Verify tables
    console.log('\n📊 Verifying tables...');
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('   Tables found:', tables.rows.map(r => r.table_name).join(', '));

    console.log('\n🎉 Setup complete! Your database is ready.');
    console.log('\n   Admin Login Credentials:');
    console.log('   📧 Email:    admin@toystore.com');
    console.log('   🔑 Password: AdminPassword123!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

setup();
