const data = require("../../../data/directory.json");

const PAGE_SIZE = 25;

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  const startPage = parseInt(req.query.start ?? "0", 10);
  const endPage = parseInt(req.query.end ?? "0", 10);

  // Validate
  if (isNaN(startPage) || isNaN(endPage)) {
    return res.status(400).json({ error: "start and end must be integers." });
  }
  if (startPage < 0 || endPage < startPage) {
    return res.status(400).json({
      error: "start must be >= 0 and end must be >= start.",
    });
  }

  const MAX_PAGES = Math.ceil(data.length / PAGE_SIZE) - 1;
  if (endPage > MAX_PAGES) {
    return res.status(400).json({
      error: `end exceeds available pages. Max page is ${MAX_PAGES}.`,
      total_records: data.length,
      page_size: PAGE_SIZE,
      total_pages: MAX_PAGES + 1,
    });
  }

  const startIndex = startPage * PAGE_SIZE;
  const endIndex = (endPage + 1) * PAGE_SIZE; // inclusive end page

  const records = data.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    meta: {
      start_page: startPage,
      end_page: endPage,
      page_size: PAGE_SIZE,
      total_records: data.length,
      total_pages: Math.ceil(data.length / PAGE_SIZE),
      records_returned: records.length,
      index_range: { from: startIndex, to: Math.min(endIndex, data.length) - 1 },
    },
    data: records,
  });
};
