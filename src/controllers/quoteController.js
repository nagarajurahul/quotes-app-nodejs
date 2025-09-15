import { getPool } from "../config/db.js";

export const getRandomQuote = async (req, res) => {
  try {
    const pool = await getPool();

    // Step 1: Count only active quotes
    const countResult = await pool.request().query("SELECT COUNT(*) AS total FROM Quotes WHERE IsActive = 1");
    const total = countResult.recordset[0].total;

    if (total === 0) {
      return res.status(404).json({ message: "No active quotes found" });
    }

    // Step 2: Pick random offset
    const randomOffset = Math.floor(Math.random() * total);

    // Step 3: Fetch one random active quote
    const result = await pool.request()
      .input("offset", randomOffset)
      .query(`
        SELECT QuoteID, QuoteText, Author, Category, CreatedAt
        FROM Quotes
        WHERE IsActive = 1
        ORDER BY QuoteID
        OFFSET @offset ROWS
        FETCH NEXT 1 ROWS ONLY;
      `);

    const quote = result.recordset[0];

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    // Step 4: Log access in QuoteAudit (PII audit trail)
    await pool.request()
      .input("quoteId", quote.QuoteID)
      .input("accessedBy", "webapp-quotesapp-prod") // use MSI / service principal name in real app
      .input("action", "READ")
      .query(`
        INSERT INTO QuoteAudit (QuoteID, AccessedBy, Action)
        VALUES (@quoteId, @accessedBy, @action);
      `);

    // Step 5: Return response
    res.json({
      id: quote.QuoteID,
      quote_text: quote.QuoteText,
      author: quote.Author,
      category: quote.Category,
      created_at: quote.CreatedAt
    });

  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};
