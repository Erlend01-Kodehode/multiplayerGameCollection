import db from "../db.js";

export const checkpin = (req, res) => {
  // Grab the 'pin' value from the query string
  const { pin } = req.query;

  // If no pin is provided, return a 400 error
  if (!pin) {
    return res.status(400).json({ error: "The 'pin' query parameter is required." });
  }

  // Query the SQLite database for the given pin_code
  db.get("SELECT * FROM pin WHERE pin_code = ?", [pin], (err, row) => {
    if (err) {
      // If an error occurred during the query, send a 500 error with the error message
      return res.status(500).json({ error: err.message });
    }

    // If no row was found, the pin does not exist in the table
    if (!row) {
      return res.status(404).json({ error: "Pin not found." });
    }

    // If the pin is found, return a success message along with the pin record
    return res.status(200).json({ message: "Pin verified successfully.", pin: row });
  });
};
