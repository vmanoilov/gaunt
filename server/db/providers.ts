import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_PATH = path.join(__dirname, 'providers.db');

export async function getDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ProviderConfig (
      id TEXT PRIMARY KEY,
      providerName TEXT,
      providerSlug TEXT,
      apiKey TEXT,
      model TEXT,
      getKeyUrl TEXT,
      customConnectorCode TEXT
    );
  `);
  return db;
}
