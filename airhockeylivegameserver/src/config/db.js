import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: `postgresql://postgres.uqfefheoupocxczeqrwy:${process.env.db_password}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres`,
  ssl: { rejectUnauthorized: false },
});

export default pool;
