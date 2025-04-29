import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

export const getQuery = async (query, args) => {
  const result = await pool.query(query, args);
  return result.rows
} 

export const executeQuery = async (query, args) => {
  await pool.query(query, args);
} 