exports.getHealth = (req, res) => {
  res.json({ status: "UP", timestamp: new Date().toISOString() });
};
