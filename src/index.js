const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Hello World API
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// Health Check API
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
