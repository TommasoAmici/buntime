import { Database } from "bun:sqlite";

export const db = new Database("buntime.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(username)
);
`);

db.run(
  `CREATE TABLE IF NOT EXISTS heartbeats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INT NOT NULL,
      branch TEXT NOT NULL,
      category TEXT NOT NULL,
      cursorpos INT,
      dependencies TEXT,
      entity TEXT NOT NULL,
      is_write BOOL NOT NULL,
      language TEXT NOT NULL,
      lineno INT,
      lines INT NOT NULL,
      project TEXT NOT NULL,
      time REAL NOT NULL,
      type TEXT NOT NULL,
      operating_system TEXT NOT NULL,
      machine TEXT NOT NULL,
      user_agent TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
);
