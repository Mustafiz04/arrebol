#!/usr/bin/env node
// Arrebol build: reads every collection in src/collections, generates the theme
// JSON files in themes/, checks contrast, registers the themes in package.json
// and writes preview/index.html.
//
//   node src/build.js           build everything
//   node src/build.js --check   only run the contrast checks

const fs = require('fs');
const path = require('path');
const { buildTheme } = require('./lib/template');
const { checkPalette } = require('./lib/contrast-check');
const { buildPreview } = require('./lib/preview');

const ROOT = path.join(__dirname, '..');
const BRAND = 'Arrebol';
const checkOnly = process.argv.includes('--check');

const collectionsDir = path.join(__dirname, 'collections');
const collections = fs
  .readdirSync(collectionsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => require(path.join(collectionsDir, d.name, 'collection.js')))
  .sort((a, b) => a.label.localeCompare(b.label));

const built = [];
let failures = 0;

for (const collection of collections) {
  for (const variant of collection.variants) {
    const label = `${BRAND} ${collection.label} ${variant.label}`;
    const file = `arrebol-${collection.id}-${variant.id}.json`;

    const results = checkPalette(variant.palette);
    const failed = results.filter((r) => !r.ok);
    failures += failed.length;
    const lowest = results.reduce((m, r) => (r.ratio / r.min < m.ratio / m.min ? r : m));
    console.log(`${failed.length ? '✗' : '✔'} ${label}  (${results.length} checks, tightest: ${lowest.label} ${lowest.ratio.toFixed(2)}:1)`);
    for (const f of failed) console.log(`    ${f.label}: ${f.ratio.toFixed(2)}:1, needs ${f.min}:1`);

    built.push({ label, file, collection, variant });
  }
}

if (failures) {
  console.error(`\n${failures} contrast check(s) failed. Adjust the palette and run again.`);
  process.exit(1);
}
if (checkOnly) process.exit(0);

// Clear stale generated themes, then write fresh ones.
const themesDir = path.join(ROOT, 'themes');
fs.mkdirSync(themesDir, { recursive: true });
for (const f of fs.readdirSync(themesDir)) if (f.endsWith('.json')) fs.unlinkSync(path.join(themesDir, f));
for (const t of built) {
  const theme = buildTheme(t.collection, t.variant, t.label);
  fs.writeFileSync(path.join(themesDir, t.file), JSON.stringify(theme, null, 2) + '\n');
}

// Register themes in package.json so VS Code can find them.
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.contributes = pkg.contributes || {};
pkg.contributes.themes = built.map((t) => ({
  label: t.label,
  uiTheme: t.variant.type === 'dark' ? 'vs-dark' : 'vs',
  path: `./themes/${t.file}`,
}));
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

fs.mkdirSync(path.join(ROOT, 'preview'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'preview', 'index.html'), buildPreview(built));

console.log(`\nBuilt ${built.length} theme(s) into themes/ and updated package.json.`);
console.log('Preview: preview/index.html');
