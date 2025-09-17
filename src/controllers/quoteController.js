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
    // res.json({
    //   id: quote.QuoteID,
    //   quote_text: quote.QuoteText,
    //   author: quote.Author,
    //   category: quote.Category,
    //   created_at: quote.CreatedAt
    // });


    // 🎨 Dynamic gradients with button colors (purple/blue only)
    const themes = [
      { bg: "linear-gradient(to right, #6a11cb, #2575fc)", btn: "#2575fc", btnHover: "#6a11cb" }, // Violet → Bright Blue
      { bg: "linear-gradient(to right, #7F00FF, #E100FF)", btn: "#E100FF", btnHover: "#7F00FF" }, // Bright Purple → Magenta Purple
      { bg: "linear-gradient(to right, #3a7bd5, #3a6073)", btn: "#3a7bd5", btnHover: "#3a6073" }, // Sky Blue → Soft Indigo
      { bg: "linear-gradient(to right, #667eea, #764ba2)", btn: "#667eea", btnHover: "#764ba2" }, // Periwinkle → Medium Purple
      { bg: "linear-gradient(to right, #56ccf2, #2f80ed)", btn: "#2f80ed", btnHover: "#56ccf2" }, // Light Aqua Blue → Strong Blue
      { bg: "linear-gradient(to right, #a18cd1, #fbc2eb)", btn: "#a18cd1", btnHover: "#fbc2eb" }, // Lavender → Pinkish Purple
      { bg: "linear-gradient(to right, #8e2de2, #4a00e0)", btn: "#4a00e0", btnHover: "#8e2de2" }  // Bright Purple Gradient
    ];


    const theme = themes[Math.floor(Math.random() * themes.length)];

    // Step 5: Return HTML or JSON
    if (req.accepts("html")) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Random Quote</title>
          <style>
            body {
              display: flex; justify-content: center; align-items: center;
              height: 100vh; margin: 0;
              font-family: "Segoe UI", Tahoma, sans-serif;
              background: ${theme.bg};
              transition: background 0.8s ease-in-out;
            }
            .card {
              background: #fff; border-radius: 15px; padding: 2rem;
              max-width: 600px; text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              animation: fadeIn 0.6s ease-in-out;
            }
            h1 { font-size: 1.6rem; color: #333; margin-bottom: 1rem; }
            p { font-size: 1.2rem; font-style: italic; color: #444; margin-bottom: 1rem; }
            .author { font-weight: bold; margin-bottom: 0.5rem; }
            .meta { font-size: 0.9rem; color: #777; }
            button {
              margin-top: 1.5rem; padding: 0.6rem 1.2rem;
              border: none; border-radius: 8px;
              background: ${theme.btn}; color: #fff; font-size: 1rem;
              cursor: pointer; transition: background 0.3s ease;
            }
            button:hover { background: ${theme.btnHover}; }
            a.home-link {
              display: inline-block;
              margin-top: 1.2rem;
              font-size: 1rem;
              color: ${theme.btn};
              text-decoration: underline;
              transition: color 0.3s ease;
            }
            a.home-link:hover { color: ${theme.btnHover}; }
            @keyframes fadeIn {
              from {opacity:0; transform:translateY(10px);}
              to {opacity:1; transform:translateY(0);}
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🌟 Random Quote</h1>
            <p>"${quote.QuoteText}"</p>
            <div class="author">— ${quote.Author}</div>
            <div class="meta">
              Category: ${quote.Category || "General"}<br/>
              Added: ${new Date(quote.CreatedAt).toLocaleDateString()}
            </div>
            <form method="GET" action="/quotes/random">
              <button type="submit">Get Another Quote</button>
            </form>
            <a href="/" class="home-link">⬅ Back to Home</a>
          </div>
        </body>
        </html>
      `);
    } else {
      res.json({
        id: quote.QuoteID,
        text: quote.QuoteText,
        author: quote.Author,
        category: quote.Category,
        created_at: quote.CreatedAt,
        theme // 🔑 include theme info for frontend clients too
      });
    }


  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};
