module.exports = {
  id: 'night',
  label: 'Night',
  type: 'dark',
  palette: {
    // Surfaces
    bg: '#161021', // humid purple night
    bgAlt: '#120d1b', // sidebar, panels
    bgDeep: '#0d0914', // activity bar, title bar
    bgFloat: '#1d1529', // widgets, menus, hovers
    bgHighlight: '#201831', // current line
    border: '#2c2240',

    // Text
    fg: '#efe8f7',
    fgMuted: '#a79cbf',
    fgSubtle: '#5f5578', // line numbers, inactive
    comment: '#7a6e99',

    // Accents
    accent: '#ff4fa3', // neon pink sign
    accentAlt: '#ffa25c', // sunset orange
    accentFg: '#1a0f1f', // text on accent
    cursor: '#ff4fa3',
    selection: '#3d2a5e',

    // Status
    error: '#ff5d73',
    warning: '#ffb454',
    info: '#62c8ff',
    success: '#52e3a4',

    syntax: {
      keyword: '#ff4fa3',
      func: '#ffa25c',
      string: '#4fe3c1', // ocean teal
      number: '#ffd36b', // gold
      type: '#6ccbff', // sky blue
      variable: '#efe8f7',
      param: '#f3b8d9',
      property: '#c6a6ff', // dusk lavender
      constant: '#ff8a7a', // coral
      operator: '#f07dc0',
      punctuation: '#b3a6cc',
      tag: '#ff4fa3',
      attribute: '#ffa25c',
      regex: '#8ee26b', // palm green
      escape: '#ffd36b',
      decorator: '#ffd36b',
      namespace: '#6ccbff',
    },

    ansi: {
      black: '#2c2240', red: '#ff5d73', green: '#52e3a4', yellow: '#ffd36b',
      blue: '#62c8ff', magenta: '#ff4fa3', cyan: '#4fe3c1', white: '#d9d0ea',
      brightBlack: '#6f6590', brightRed: '#ff8396', brightGreen: '#7cf0bd', brightYellow: '#ffe194',
      brightBlue: '#92d9ff', brightMagenta: '#ff7fbd', brightCyan: '#84f0d8', brightWhite: '#ffffff',
    },
  },
};
