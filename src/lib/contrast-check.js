// Contrast rules every theme must pass. The build fails if one doesn't.
// WCAG: 4.5 = normal text (AA), 3.0 = large/secondary text and UI elements.
const { contrast } = require('./color');

const RULES = [
  // [label, foreground getter, background getter, minimum ratio]
  ['Body text on editor', (p) => p.fg, (p) => p.bg, 7],
  ['Body text on current line', (p) => p.fg, (p) => p.bgHighlight, 7],
  ['Body text on selection', (p) => p.fg, (p) => p.selection, 4.5],
  ['Muted text on sidebar', (p) => p.fgMuted, (p) => p.bgAlt, 4.5],
  ['Comments on editor', (p) => p.comment, (p) => p.bg, 3],
  ['Line numbers on editor', (p) => p.fgSubtle, (p) => p.bg, 2.2],
  ['Text on accent buttons', (p) => p.accentFg, (p) => p.accent, 4.5],
  ['Cursor on editor', (p) => p.cursor, (p) => p.bg, 3],
  ...['error', 'warning', 'info', 'success'].map((k) => [`${k} on editor`, (p) => p[k], (p) => p.bg, 4.5]),
];

const SYNTAX_MIN = 4.5;

function checkPalette(p) {
  const results = RULES.map(([label, fg, bg, min]) => {
    const ratio = contrast(fg(p), bg(p));
    return { label, ratio, min, ok: ratio >= min };
  });
  for (const [role, color] of Object.entries(p.syntax)) {
    const ratio = contrast(color, p.bg);
    results.push({ label: `syntax.${role} on editor`, ratio, min: SYNTAX_MIN, ok: ratio >= SYNTAX_MIN });
    const onLine = contrast(color, p.bgHighlight);
    results.push({ label: `syntax.${role} on current line`, ratio: onLine, min: SYNTAX_MIN, ok: onLine >= SYNTAX_MIN });
  }
  return results;
}

module.exports = { checkPalette };
