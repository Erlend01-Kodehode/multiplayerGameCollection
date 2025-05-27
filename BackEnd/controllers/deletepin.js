import db from "../db.js";

export const deletePin = (req, res) => {
  const { pin } = req.params;
  console.log("Received delete request for pin:", pin);

  if (!pin) {
    return res.status(400).json({ error: "PIN is required" });
  }

  const query = "DELETE FROM pin WHERE pin_code = ?";

  db.run(query, [pin], function (err) {
    if (err) {
      console.error("Database error while deleting PIN:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "PIN not found." });
    }

    return res
      .status(200)
      .json({ message: `PIN ${pin} deleted successfully.` });
  });
};
