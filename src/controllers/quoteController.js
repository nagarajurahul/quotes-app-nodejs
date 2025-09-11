import pool from "../config/db.js";

export const getRandomQuote = async (req, res) => {
  try {
    // Step 1: Count rows
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM quotes");

    if (total === 0) {
      return res.status(404).json({ message: "No quotes found" });
    }

    // Step 2: Pick random offset
    const randomOffset = Math.floor(Math.random() * total);

    // Step 3: Fetch one row at that offset
    const [rows] = await pool.query("SELECT * FROM quotes LIMIT 1 OFFSET ?", [randomOffset]);

    const quote = rows[0];
    res.json({
      id: quote.id,
      quote_text: quote.quote_text,
      author: quote.author_name
    });

  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};
