import express from "express";
import helloRoute from "./routes/hello.js";
import healthRoute from "./routes/health.js";
import quotesRoute from "./routes/quotes.js";

const app = express();

// Mount routers
app.use("/hello", helloRoute);
app.use("/health", healthRoute);
app.use("/quotes", quotesRoute);

export default app;
