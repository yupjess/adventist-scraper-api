# Adventist Directory API v2

A Vercel serverless API serving the Philippine SDA (Seventh-day Adventist) Church & Company directory from a static JSON dataset — no scraping needed.

## 📦 Dataset

- **3,448 records** — churches and companies across the Philippines
- Fields: `number`, `name`, `city`, `country`, `members`, `type`, `field`, `links`
- Types: `Church`, `Company`
- Conferences/Missions: 20 unique fields (Central Luzon, Romblon, Mindanao, etc.)

---

## 🚀 Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow the prompts — no env vars needed
```

---

## 📡 Endpoints

### `GET /` — API Info
Returns metadata and endpoint list.

---

### `GET /api/directory/health`
Health check. Returns total records and record breakdown.

**Response:**
```json
{
  "status": "ok",
  "total_records": 3448,
  "records_by_type": { "Church": 3400, "Company": 48 }
}
```

---

### `GET /api/directory/scrape?start=0&end=4`
Paginated data retrieval. `start` and `end` are **page numbers** (25 records/page).

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `start` | int | `0` | Starting page number |
| `end` | int | `0` | Ending page number (inclusive) |

**Example:** `?start=0&end=3` → returns pages 0–3 (records 0–99)

**Max page:** `137` (3448 records ÷ 25 = 138 pages, index 0–137)

---

### `GET /api/directory/search?q=<query>`
Full-text and filter search.

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Searches `name`, `city`, `field`, `type` |
| `field` | string | Filter by conference/mission name |
| `type` | string | Filter by `Church` or `Company` |
| `city` | string | Filter by city name |
| `limit` | int | Max results (default: 100, max: 500) |

**Examples:**
```
/api/directory/search?q=angeles
/api/directory/search?type=Church&city=Manila
/api/directory/search?field=Romblon+Mission&limit=50
/api/directory/search?q=central&type=Company
```

---

### `GET /api/directory/privacy/policy`
Returns the privacy policy JSON, compliant with RA 10173 (Philippines Data Privacy Act).

---

## 🏗️ Project Structure

```
/
├── api/
│   ├── index.js                      → GET /
│   └── directory/
│       ├── health.js                 → GET /api/directory/health
│       ├── scrape.js                 → GET /api/directory/scrape
│       ├── search.js                 → GET /api/directory/search
│       └── privacy/
│           └── policy.js            → GET /api/directory/privacy/policy
├── data/
│   └── directory.json               → 3,448 records
├── vercel.json
└── package.json
```

---

## 📝 Notes

- **CORS** is enabled for all origins (`*`) — works with your frontend directly.
- No database, no environment variables, no external dependencies.
- All filtering is case-insensitive and partial-match for `q`, `field`, and `city`.
- `type` filter is exact match (case-insensitive): use `Church` or `Company`.
