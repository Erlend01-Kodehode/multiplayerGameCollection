import db from "../db.js";

export const createpin = (req, res) => {
  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  const tryInsertPin = () => {
    const pin = generatePin();

    const checkQuery = "SELECT pin_code FROM pin WHERE pin_code = ? LIMIT 1";
    db.get(checkQuery, [pin], (err, row) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      if (row) {
        return tryInsertPin();
      } else {
        const insertQuery = "INSERT INTO pin (pin_code) VALUES (?)";
        db.run(insertQuery, [pin], function (err) {
          if (err) {
            console.error("Insert error:", err.message);
            return res.status(500).json({ error: "Failed to create pin" });
          }

          return res.status(201).json({ pin_code: pin });
        });
      }
    });
  };

  tryInsertPin();
};
