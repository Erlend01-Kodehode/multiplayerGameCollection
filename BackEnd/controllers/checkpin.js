import db from "../db.js";

export const checkPin = (req, res) => {
  const { pin } = req.params;

  if (!pin) {
    return res.status(400).json({ error: "PIN is required" });
  } else if (pin.length !== 4) {
    return res.status(403).json({ error: "PIN not valid" });
  }

  const query = "SELECT pin_code FROM pin WHERE pin_code = ? LIMIT 1";

  db.get(query, [pin], (err, row) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    } else if (row) {
      return res.status(200).json({ message: "Valid PIN code" });
    } else {
      return res.status(404).json({ error: "PIN code not found" });
    }
  });
};