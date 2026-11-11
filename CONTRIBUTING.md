# Adding a theme

Each theme lives in its own folder under `src/collections/`. The shared template in `src/lib/template.js` turns a palette into a complete theme (editor, UI, terminal, git, diff, semantic highlighting), so you only describe colors.

## 1. Create the folder

```
src/collections/<your-id>/
  collection.js
  night.js
  day.js
```

Easiest start: copy `src/collections/neon-coast/` and rename it.

## 2. Describe the collection

```js
// src/collections/<your-id>/collection.js
module.exports = {
  id: 'your-id',                 // used in file names: arrebol-your-id-night.json
  label: 'Your Theme',           // shown as "Arrebol Your Theme Night"
  description: 'One line about the mood.',
  variants: [require('./night'), require('./day')],
};
```

Variants are a list, so a collection can have one variant or several (for example Night, Dusk and Day).

## 3. Fill in the palette

Every variant has the same palette keys, which the template maps onto VS Code:

| Key | Used for |
| --- | --- |
| `bg` | Editor background |
| `bgAlt` | Sidebar, panels, terminal, inactive tabs |
| `bgDeep` | Activity bar, title bar, status bar |
| `bgFloat` | Menus, hovers, suggestions, notifications |
| `bgHighlight` | Current line |
| `border` | All borders and separators |
| `fg`, `fgMuted`, `fgSubtle` | Main text, secondary text, line numbers and inactive items |
| `comment` | Code comments |
| `accent`, `accentAlt`, `accentFg` | Main accent (buttons, badges, active tab), second accent, text on the accent |
| `cursor`, `selection` | Cursor and selection |
| `error`, `warning`, `info`, `success` | Diagnostics, git status, diff |
| `syntax.*` | keyword, func, string, number, type, variable, param, property, constant, operator, punctuation, tag, attribute, regex, escape, decorator, namespace |
| `ansi.*` | The 16 terminal colors |

## 4. Build and check

```bash
npm run build
```

The build prints every variant and its tightest contrast ratio. If a color fails, it tells you which one and the ratio it needs. Darken it for light themes or lighten it for dark themes and build again.

Open `preview/index.html` to see the result, or press `F5` to try it in VS Code.

## Palette tips

- Pick the mood first: 2 or 3 signature colors from the idea, then build the backgrounds around them.
- Keep backgrounds low-saturation tints of the mood color rather than pure gray or black; it makes a theme feel like itself.
- Give the most frequent tokens (keywords, strings, functions) the signature colors. Rare tokens can use the quieter ones.
- Keep `variable` close to `fg`. Code is mostly variables, and coloring them loudly makes everything noisy.
- In light variants, use deeper versions of the same hues rather than new hues, so dark and light feel like one theme.
