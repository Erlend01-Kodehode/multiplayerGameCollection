import sqlite3 from "sqlite3";
import { resolve } from "path";

const dbPath = resolve("db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

export default db;