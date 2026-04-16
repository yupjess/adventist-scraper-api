const data = require("../../../data/directory.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  const q = (req.query.q ?? "").trim().toLowerCase();
  const filterField = (req.query.field ?? "").trim().toLowerCase();
  const filterType = (req.query.type ?? "").trim().toLowerCase();
  const filterCity = (req.query.city ?? "").trim().toLowerCase();
  const limitParam = parseInt(req.query.limit ?? "100", 10);
  const limit = isNaN(limitParam) || limitParam < 1 ? 100 : Math.min(limitParam, 500);

  if (!q && !filterField && !filterType && !filterCity) {
    return res.status(400).json({
      error:
        "Provide at least one query parameter: q, field, type, or city.",
      examples: [
        "/api/directory/search?q=manila",
        "/api/directory/search?type=Church&city=La+Paz",
        "/api/directory/search?field=Romblon+Mission",
        "/api/directory/search?q=angeles&type=Church&limit=50",
      ],
    });
  }

  let results = data;

  // Full-text search across name, city, field, type
  if (q) {
    results = results.filter(
      (r) =>
        (r.name ?? "").toLowerCase().includes(q) ||
        (r.city ?? "").toLowerCase().includes(q) ||
        (r.field ?? "").toLowerCase().includes(q) ||
        (r.type ?? "").toLowerCase().includes(q)
    );
  }

  // Exact filter: field (conference/mission)
  if (filterField) {
    results = results.filter((r) =>
      (r.field ?? "").toLowerCase().includes(filterField)
    );
  }

  // Exact filter: type (Church | Company)
  if (filterType) {
    results = results.filter(
      (r) => (r.type ?? "").toLowerCase() === filterType
    );
  }

  // Exact filter: city
  if (filterCity) {
    results = results.filter((r) =>
      (r.city ?? "").toLowerCase().includes(filterCity)
    );
  }

  const total = results.length;
  const limited = results.slice(0, limit);

  res.status(200).json({
    success: true,
    query: { q, field: filterField || undefined, type: filterType || undefined, city: filterCity || undefined },
    meta: {
      total_matches: total,
      returned: limited.length,
      limit,
    },
    data: limited,
  });
};
