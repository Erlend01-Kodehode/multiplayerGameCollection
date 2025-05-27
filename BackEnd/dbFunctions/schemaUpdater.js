
export function updatePinTableSchema(db) {
  // Use db.serialize() to run schema update operations sequentially
  db.serialize(() => {
    // Check if the "pin" table exists.
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='pin'",
      (err, row) => {
        if (err) {
          console.error("Error checking for table 'pin':", err.message);
          return;
        }
        if (row) {
          // The "pin" table exists: now check its columns.
          db.all("PRAGMA table_info(pin);", (err, columns) => {
            if (err) {
              console.error("Error retrieving table info:", err.message);
              return;
            }
            const colNames = columns.map((col) => col.name);
            if (!colNames.includes("created_at")) {
              // If the 'created_at' column is missing, alter the table to add it.
              const alterQuery = `
                ALTER TABLE pin 
                ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
              `;
              db.run(alterQuery, (err) => {
                if (err) {
                  console.error("Error adding 'created_at' column:", err.message);
                } else {
                  console.log("Column 'created_at' was successfully added to the 'pin' table.");
                }
              });
            } else {
              console.log("Column 'created_at' already exists in the 'pin' table.");
            }
          });
        } else {
          console.log("Table 'pin' does not exist. Please create the table first.");
        }
      }
    );
  });
}