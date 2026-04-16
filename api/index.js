module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  res.status(200).json({
    name: "Adventist Directory API",
    version: "2.0.0",
    description: "Philippine SDA Church & Company Directory — served from static dataset",
    total_records: 3448,
    endpoints: {
      health: "GET /api/directory/health",
      privacy: "GET /api/directory/privacy/policy",
      scrape: "GET /api/directory/scrape?start=0&end=4",
      search: "GET /api/directory/search?q=<query>",
    },
    notes: {
      scrape:
        "start and end are page numbers (25 records/page). start=0&end=4 returns pages 0–4 (records 0–124).",
      search:
        "Searches name, city, field, and type fields. Case-insensitive. Supports ?field=<field>&type=<Church|Company>&city=<city> filters.",
    },
  });
};
