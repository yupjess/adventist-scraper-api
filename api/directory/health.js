const data = require("../../../data/directory.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    total_records: data.length,
    data_source: "static",
    records_by_type: {
      Church: data.filter((d) => d.type === "Church").length,
      Company: data.filter((d) => d.type === "Company").length,
    },
    uptime: process.uptime(),
  });
};
