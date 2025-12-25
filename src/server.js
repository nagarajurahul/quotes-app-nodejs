import app from "./app.js";

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
