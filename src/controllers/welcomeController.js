export const getWelcomeMessage = (req, res) => {
  if (req.accepts("html")) {
    // HTML Response
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Quotes App</title>
        <style>
          body {
            display: flex; justify-content: center; align-items: center;
            height: 100vh; margin: 0;
            font-family: "Segoe UI", Tahoma, sans-serif;
            background: linear-gradient(to right, #ff9966, #ff5e62);
          }
          .container {
            text-align: center; color: #fff;
            animation: fadeIn 0.8s ease-in-out;
          }
          h1 {
            font-size: 2.2rem; margin-bottom: 1rem;
          }
          p {
            font-size: 1.2rem; margin-bottom: 2rem;
          }
          button {
            padding: 0.8rem 1.6rem;
            border: none; border-radius: 8px;
            background: #fff; color: #ff5e62;
            font-size: 1rem; font-weight: bold;
            cursor: pointer; transition: all 0.3s ease;
          }
          button:hover {
            background: #ffebeb; transform: scale(1.05);
          }
          @keyframes fadeIn {
            from {opacity:0; transform:translateY(10px);}
            to {opacity:1; transform:translateY(0);}
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✨ Welcome to Quotes App</h1>
          <p>Discover random quotes that inspire, motivate, and brighten your day.</p>
          <form method="GET" action="/quotes/random">
            <button type="submit">Check now! 🌟 </button>
          </form>
        </div>
      </body>
      </html>
    `);
  } else {
    // JSON Response
    res.json({
      message: "Hello, Welcome to the Quotes App! Please check /quotes/random for random quotes",
      description: "Discover random quotes that inspire, motivate, and brighten your day.",
      next_steps: {
        random_quote: "/quotes/random",
        health_check: "/health"
      }
    });
  }
};
