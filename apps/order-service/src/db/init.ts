import { pool } from './client.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function waitForDB(retries = 15, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      client.release();
      console.log('✅ Database is ready');
      return true;
    } catch {
      console.log(`⏳ Waiting for database... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error('❌ Database not ready after retries');
  return false;
}

async function initDB() {
  console.log('🔄 Initializing database...');
  const dbReady = await waitForDB();
  if (!dbReady) {
    console.error('❌ Database not ready. Exiting.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    // Проверяем, есть ли таблица orders, если нет — создаём
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'orders'
      );
    `;
    const result = await client.query(checkTableQuery);
    if (result.rows[0].exists) {
      console.log('✅ Table "orders" already exists, skipping initialization');
      client.release();
      return;
    }

    // Создаём таблицу и индексы
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_init.sql'), 'utf8');
    await client.query(sql);
    console.log('✅ Database schema created successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

initDB().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
