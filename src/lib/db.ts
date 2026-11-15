import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'apsca.db');

let dbInstance: sqlite3.Database | null = null;

export function getDatabase(): sqlite3.Database {
  if (!dbInstance) {
    dbInstance = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error connecting to SQLite database:', err);
      } else {
        console.log('Connected to APSCA SQLite database at', DB_PATH);
      }
    });

    // Initialize Schema
    dbInstance.serialize(() => {
      dbInstance!.run(`
        CREATE TABLE IF NOT EXISTS members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          membership_id TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          dob TEXT,
          gender TEXT,
          mobile TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          address TEXT,
          city TEXT,
          district TEXT,
          state TEXT DEFAULT 'Andhra Pradesh',
          pincode TEXT,
          organization TEXT,
          local_union_address TEXT,
          nominee_name TEXT,
          membership_plan TEXT NOT NULL,
          amount REAL DEFAULT 0,
          payment_status TEXT DEFAULT 'pending',
          payment_method TEXT DEFAULT 'free',
          payment_id TEXT,
          photo_url TEXT,
          id_proof_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'active'
        )
      `);

      dbInstance!.run(`
        CREATE INDEX IF NOT EXISTS idx_members_mobile ON members(mobile);
      `);
      dbInstance!.run(`
        CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
      `);
      dbInstance!.run(`
        CREATE INDEX IF NOT EXISTS idx_members_membership_id ON members(membership_id);
      `);
    });
  }

  return dbInstance;
}

export function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export function run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}
