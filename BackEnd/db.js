import sqlite3 from "sqlite3";
import { resolve } from "path";

const dbPath = resolve("db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database.");

    const createPinTable = `
      CREATE TABLE IF NOT EXISTS pin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pin_code TEXT NOT NULL
      ); 
    `;
    db.run(createPinTable, (err) => {
      if (err) {
        console.error("Error creating pin table:", err.message);
      } else {
        console.log("Pin table is ready.");
      }
    });
  }
});

export default db;