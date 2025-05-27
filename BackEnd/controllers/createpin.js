
import db from "../db.js";

export const createpin = (req, res) => {
  const { pin } = req.body;

  // Validate that a PIN is provided.
  if (!pin) {
    return res
      .status(400)
      .json({ error: "PIN is required to be added to the database." });
  }

  // Validate that the PIN is exactly 4 digits.
  if (!/^\d{4}$/.test(pin)) {
    return res
      .status(400)
      .json({ error: "PIN must be a 4-digit number." });
  }

  // SQL query to insert the provided PIN into your "pin" table.
  const sql = `INSERT INTO pin(pin_code) VALUES(?)`;
  const params = [pin];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Database insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Return the newly inserted record's ID along with the PIN.
    res.status(200).json({
      id: this.lastID,
      pin,
      message: "PIN stored successfully in the database."
    });
  });
};