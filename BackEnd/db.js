
import sqlite3 from "sqlite3";
import { resolve } from "path";
import { updatePinTableSchema } from "./dbFunctions/schemaUpdater.js";

const dbPath = resolve("db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite:", err.message);
    return;
  }
  console.log("Connected to SQLite database.");
});

// Set a busy timeout so that SQLite waits up to 5 seconds for the lock to clear.
db.configure("busyTimeout", 5000);

// Call the modularized schema update function.
// All operations inside updatePinTableSchema will execute sequentially.
updatePinTableSchema(db);

export default db;