/**
 * validate.js
 * Runs in CI (GitHub Actions) to check data/directory.json
 * before Vercel deploys the new data.
 */

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../data/directory.json");
const REQUIRED_FIELDS = ["number", "name", "city", "country", "members", "type", "field"];
const VALID_TYPES = ["Church", "Company"];

let errors = [];
let warnings = [];

// ── 1. File exists ────────────────────────────────────────────────────────────
if (!fs.existsSync(FILE)) {
  console.error("❌ data/directory.json not found.");
  process.exit(1);
}

// ── 2. Parse JSON ─────────────────────────────────────────────────────────────
let data;
try {
  data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
} catch (e) {
  console.error("❌ Invalid JSON:", e.message);
  process.exit(1);
}

// ── 3. Must be a non-empty array ──────────────────────────────────────────────
if (!Array.isArray(data)) {
  console.error("❌ Expected an array at the root level.");
  process.exit(1);
}
if (data.length === 0) {
  console.error("❌ Array is empty — refusing to deploy blank data.");
  process.exit(1);
}

// ── 4. Check each record ──────────────────────────────────────────────────────
data.forEach((record, i) => {
  const id = `Record #${i + 1} (number: ${record.number ?? "??"}, name: "${record.name ?? "??"}") `;

  // Required fields present
  for (const field of REQUIRED_FIELDS) {
    if (record[field] === undefined || record[field] === null) {
      errors.push(`${id}— missing required field: "${field}"`);
    }
  }

  // Type must be valid
  if (record.type && !VALID_TYPES.includes(record.type)) {
    warnings.push(`${id}— unexpected type: "${record.type}" (expected Church or Company)`);
  }

  // members should be a number
  if (record.members !== undefined && typeof record.members !== "number") {
    warnings.push(`${id}— "members" should be a number, got ${typeof record.members}`);
  }

  // links should be an array
  if (record.links !== undefined && !Array.isArray(record.links)) {
    warnings.push(`${id}— "links" should be an array`);
  }
});

// ── 5. Duplicate number check ─────────────────────────────────────────────────
const numbers = data.map((r) => r.number).filter(Boolean);
const dupes = numbers.filter((n, i) => numbers.indexOf(n) !== i);
if (dupes.length > 0) {
  warnings.push(`Duplicate record numbers found: ${[...new Set(dupes)].join(", ")}`);
}

// ── 6. Report ─────────────────────────────────────────────────────────────────
console.log(`\n📋 Validation Report — data/directory.json`);
console.log(`   Total records : ${data.length}`);
console.log(`   Churches      : ${data.filter((r) => r.type === "Church").length}`);
console.log(`   Companies     : ${data.filter((r) => r.type === "Company").length}`);
console.log(`   Errors        : ${errors.length}`);
console.log(`   Warnings      : ${warnings.length}\n`);

if (warnings.length > 0) {
  console.warn("⚠️  Warnings:");
  warnings.forEach((w) => console.warn("   •", w));
  console.log();
}

if (errors.length > 0) {
  console.error("❌ Errors (deployment blocked):");
  errors.forEach((e) => console.error("   •", e));
  process.exit(1);
}

console.log("✅ All checks passed — safe to deploy.\n");
