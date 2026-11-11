// Builds preview/index.html: a mock VS Code window for every theme variant,
// so palettes can be judged in a browser before installing anything.

// Sample code. «role|text» marks a highlighted span; everything else is plain text.
const SAMPLE = `«comment|// Plan the late-night run along the coast»
«keyword|import» { «type|Route», «type|Crew» } «keyword|from» «string|"./coast"»;

«keyword|const» «constant|SUNSET_HOUR» «operator|=» «number|19»;
«keyword|const» «variable|pattern» «operator|=» «regex|/^ocean-(\\d+)$/i»;

«decorator|@tracked»
«keyword|export class» «type|NightDrive»<«type|T» «keyword|extends» «type|Route»> {
  «keyword|private» «property|speed»: «type|number» «operator|=» «number|88»;

  «keyword|constructor»(«keyword|readonly» «param|crew»: «type|Crew», «keyword|private» «param|route»: «type|T») {}

  «keyword|async» «func|cruise»(«param|stops»: «type|T»[]): «type|Promise»<«type|string»> {
    «keyword|for» («keyword|const» «variable|stop» «keyword|of» «param|stops») {
      «keyword|if» («variable|stop».«property|hour» «operator|>=» «constant|SUNSET_HOUR» «operator|&&» «variable|pattern».«func|test»(«variable|stop».«property|id»)) {
        «variable|console».«func|log»(«string|\`Rolling past »«keyword|\${»«variable|stop».«property|name»«keyword|}»«escape|\\n»«string|\`»);
      }
    }
    «keyword|return» «keyword|this».«property|crew».«func|names»().«func|join»(«string|", "»);
  }
}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderCode(p) {
  const html = esc(SAMPLE).replace(/«(\w+)\|([\s\S]*?)»/g, (_, role, text) => {
    if (role === 'comment') return `<span style="color:${p.comment};font-style:italic">${text}</span>`;
    const italic = ['param', 'decorator'].includes(role) ? ';font-style:italic' : '';
    return `<span style="color:${p.syntax[role]}${italic}">${text}</span>`;
  });
  return html
    .split('\n')
    .map((line, i) => {
      const current = i === 13;
      return `<div class="ln" style="${current ? `background:${p.bgHighlight}` : ''}"><span class="num" style="color:${current ? p.accentAlt : p.fgSubtle}">${i + 1}</span><span>${line || ' '}</span></div>`;
    })
    .join('');
}

function renderWindow(name, v) {
  const p = v.palette;
  const a = p.ansi;
  const files = ['coast.ts', 'nightDrive.ts', 'crew.ts', 'README.md'];
  return `
<figure class="win" style="background:${p.bg};color:${p.fg};border-color:${p.border}">
  <div class="title" style="background:${p.bgDeep};color:${p.fgMuted};border-color:${p.border}">${esc(name)}</div>
  <div class="body">
    <aside class="activity" style="background:${p.bgDeep};border-color:${p.border}">
      <i style="background:${p.accent}"></i><i style="background:${p.fgSubtle}"></i><i style="background:${p.fgSubtle}"></i>
    </aside>
    <aside class="side" style="background:${p.bgAlt};color:${p.fgMuted};border-color:${p.border}">
      <div class="side-h" style="color:${p.fg}">Explorer</div>
      ${files.map((f, i) => `<div class="file" style="${i === 1 ? `background:${p.accent}2e;color:${p.fg}` : ''}">${f}</div>`).join('')}
      <div class="file" style="color:${p.success}">heist.test.ts</div>
      <div class="file" style="color:${p.info}">routes.json</div>
    </aside>
    <div class="main">
      <div class="tabs" style="background:${p.bgAlt};border-color:${p.border}">
        <span class="tab" style="background:${p.bg};color:${p.fg};box-shadow:inset 0 2px 0 ${p.accent}">nightDrive.ts</span>
        <span class="tab" style="color:${p.fgSubtle}">crew.ts</span>
      </div>
      <pre class="code">${renderCode(p)}</pre>
      <div class="term" style="background:${p.bgAlt};border-color:${p.border}">
        <div><span style="color:${a.green}">➜</span> <span style="color:${a.cyan}">arrebol</span> <span style="color:${a.blue}">git:(</span><span style="color:${a.red}">main</span><span style="color:${a.blue}">)</span> npm run build</div>
        <div><span style="color:${a.green}">✔</span> ${esc(name)} <span style="color:${a.brightBlack}">(contrast ok)</span></div>
        <div><span style="color:${a.yellow}">!</span> 1 warning <span style="color:${a.magenta}">→ themes/</span></div>
      </div>
    </div>
  </div>
  <div class="status" style="background:${p.bgDeep};color:${p.fgMuted};border-color:${p.border}">
    <span style="background:${p.accent};color:${p.accentFg};padding:0 8px">main</span><span>TypeScript</span><span style="color:${p.error}">⨯ 0</span><span style="color:${p.warning}">⚠ 1</span>
  </div>
</figure>`;
}

function buildPreview(themes) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Arrebol theme preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
  :root { --page: #f3ede6; --ink: #241a2e; --soft: #6b5d7d; }
  @media (prefers-color-scheme: dark) { :root { --page: #0f0b16; --ink: #efe8f7; --soft: #a79cbf; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--page); color: var(--ink); font-family: "Instrument Serif", Georgia, serif; }
  header { max-width: 1180px; margin: 0 auto; padding: 56px 24px 16px; }
  h1 { font-size: clamp(48px, 9vw, 112px); font-weight: 400; margin: 0; line-height: .95; letter-spacing: -0.02em;
       background: linear-gradient(100deg, #ff4fa3 0%, #ffa25c 55%, #ffd36b 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  header p { font-size: 22px; color: var(--soft); max-width: 60ch; margin: 12px 0 0; }
  h2 { font-weight: 400; font-style: italic; font-size: 30px; margin: 40px 0 16px; }
  main { max-width: 1180px; margin: 0 auto; padding: 0 24px 72px; }
  .win { margin: 0 0 32px; border: 1px solid; border-radius: 10px; overflow: hidden; font-family: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 13px; box-shadow: 0 24px 60px -30px rgba(0,0,0,.5); }
  .title { text-align: center; padding: 7px; font-size: 12px; border-bottom: 1px solid; }
  .body { display: flex; min-height: 420px; }
  .activity { width: 44px; border-right: 1px solid; display: flex; flex-direction: column; align-items: center; gap: 14px; padding-top: 14px; }
  .activity i { width: 18px; height: 18px; border-radius: 4px; opacity: .85; }
  .side { width: 180px; border-right: 1px solid; padding: 10px 0; flex-shrink: 0; }
  .side-h { padding: 0 14px 8px; font-size: 11px; }
  .file { padding: 3px 14px; }
  .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .tabs { display: flex; border-bottom: 1px solid; }
  .tab { padding: 8px 16px; }
  .code { margin: 0; padding: 10px 0; overflow-x: auto; line-height: 1.6; flex: 1; font: inherit; }
  .ln { display: flex; padding-right: 16px; white-space: pre; }
  .num { width: 48px; text-align: right; padding-right: 18px; flex-shrink: 0; }
  .term { border-top: 1px solid; padding: 10px 16px; line-height: 1.7; }
  .status { display: flex; gap: 16px; font-size: 12px; border-top: 1px solid; padding: 3px 0; }
  @media (max-width: 760px) { .side { display: none; } }
</style>
</head>
<body>
<header>
  <h1>Arrebol</h1>
  <p>The glow clouds catch at sunset, made into color themes for VS Code.</p>
</header>
<main>
${themes.map((t) => `<h2>${esc(t.label)}</h2>${renderWindow(t.label, t.variant)}`).join('\n')}
</main>
</body>
</html>`;
}

module.exports = { buildPreview };
