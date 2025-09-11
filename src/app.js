const express = require("express");
const app = express();

// Routes
app.use("/hello", require("./routes/hello"));
app.use("/health", require("./routes/health"));

module.exports = app;