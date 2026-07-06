import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';

dotenv.config();

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  console.error("DATABASE_URL is not defined in environment variables!");
}

const connectDB = async () => {
  if (!pool) {
    console.error("PostgreSQL Pool is not initialized. Please set DATABASE_URL in .env");
    return false;
  }

  try {
    const client = await pool.connect();
    console.log(`PostgreSQL Connected to database`);
    client.release();

    // Initialize tables
    await initializeTables();
    return true;
  } catch (error) {
    console.error(`PostgreSQL Connection Error: ${error.message}`);
    return false;
  }
};

const initializeTables = async () => {
  const queries = [
    // Create tables
    `CREATE TABLE IF NOT EXISTS users (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS students (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS teachers (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS courses (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS notices (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS payments (
      _id VARCHAR(100) PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,

    // Create unique indexes on JSONB fields
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users ((data->>'email'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_name ON courses ((data->>'name'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_code ON courses ((data->>'code'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_students_app_num ON students ((data->>'applicationNumber'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_students_adm_num ON students ((data->>'admissionNumber')) WHERE (data->>'admissionNumber') IS NOT NULL AND (data->>'admissionNumber') != ''`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_students_roll_num ON students ((data->>'rollNumber')) WHERE (data->>'rollNumber') IS NOT NULL AND (data->>'rollNumber') != ''`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_teachers_email ON teachers ((data->>'email'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_tx_id ON payments ((data->>'transactionId'))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_receipt ON payments ((data->>'receiptNumber'))`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (err) {
      console.error(`Error executing DDL query: ${err.message}`);
    }
  }
};

export { pool };
export default connectDB;
