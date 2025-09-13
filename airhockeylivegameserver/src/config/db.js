import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: `postgresql://postgres:${process.env.db_password}@db.uqfefheoupocxczeqrwy.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

export default pool;
