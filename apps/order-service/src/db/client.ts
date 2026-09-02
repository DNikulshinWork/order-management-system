import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'order',
  password: process.env.DB_PASSWORD || 'order123',
  database: process.env.DB_NAME || 'order_service',
  max: 20,
  idleTimeoutMillis: 30000,
});

export { pool };
