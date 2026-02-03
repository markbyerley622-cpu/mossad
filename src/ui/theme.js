/**
 * MOSSAD AI Terminal Theme
 * Blue/Cyan neon aesthetic with box-drawing characters
 */

// ANSI escape codes for terminal styling
export const COLORS = {
  // Primary blue palette
  blue: '\x1b[38;5;27m',
  brightBlue: '\x1b[38;5;39m',
  electricBlue: '\x1b[38;5;45m',
  neonBlue: '\x1b[38;5;51m',

  // Cyan accents
  cyan: '\x1b[38;5;37m',
  brightCyan: '\x1b[38;5;51m',

  // Supporting colors
  white: '\x1b[38;5;255m',
  gray: '\x1b[38;5;240m',
  darkGray: '\x1b[38;5;236m',
  green: '\x1b[38;5;46m',
  yellow: '\x1b[38;5;226m',
  gold: '\x1b[38;5;220m',
  orange: '\x1b[38;5;208m',
  red: '\x1b[38;5;196m',
  purple: '\x1b[38;5;135m',

  // Special
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  blink: '\x1b[5m',
  inverse: '\x1b[7m',
  underline: '\x1b[4m',
};

// Background colors
export const BG = {
  black: '\x1b[48;5;232m',
  darkBlue: '\x1b[48;5;17m',
  blue: '\x1b[48;5;19m',
  brightBlue: '\x1b[48;5;27m',
  gray: '\x1b[48;5;236m',
  reset: '\x1b[49m',
};

// Box drawing characters
export const BOX = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
  teeRight: '╠',
  teeLeft: '╣',
  teeDown: '╦',
  teeUp: '╩',
  cross: '╬',

  // Light variants
  lightTopLeft: '┌',
  lightTopRight: '┐',
  lightBottomLeft: '└',
  lightBottomRight: '┘',
  lightHorizontal: '─',
  lightVertical: '│',
  lightTeeRight: '├',
  lightTeeLeft: '┤',

  // Blocks and bars
  fullBlock: '█',
  lightShade: '░',
  mediumShade: '▒',
  darkShade: '▓',
  upperHalf: '▀',
  lowerHalf: '▄',
  leftHalf: '▌',
  rightHalf: '▐',
};

// Symbols
export const SYMBOLS = {
  bullet: '•',
  diamond: '◆',
  star: '★',
  starOutline: '☆',
  arrow: '▸',
  arrowDouble: '»',
  check: '✓',
  cross: '✗',
  circle: '●',
  circleOutline: '○',
  square: '■',
  squareOutline: '□',
  triangle: '▲',
  triangleDown: '▼',
  lightning: '⚡',
  skull: '☠',
  crown: '♔',
  heart: '♥',
  spade: '♠',
  infinity: '∞',
  sigma: 'Σ',
  delta: 'Δ',
  omega: 'Ω',
  cursor: '▌',
  cursorBlink: '█',
  link: '🔗',
  money: '💰',
  fire: '🔥',
  rocket: '🚀',
  target: '🎯',
};

// Jewish-themed Star of David character (using Unicode)
export const STAR_OF_DAVID = '✡';
export const MENORAH = '🕎';
export const CHAI = 'חי';

// Helper functions
export function colorize(text, color) {
  return `${color}${text}${COLORS.reset}`;
}

export function bold(text) {
  return `${COLORS.bold}${text}${COLORS.reset}`;
}

export function dim(text) {
  return `${COLORS.dim}${text}${COLORS.reset}`;
}

export function underline(text) {
  return `${COLORS.underline}${text}${COLORS.reset}`;
}

export function bg(text, bgColor) {
  return `${bgColor}${text}${BG.reset}`;
}

// Create a horizontal line
export function horizontalLine(width, char = BOX.horizontal) {
  return char.repeat(width);
}

// Create a box around text
export function boxText(text, width = 40, title = '') {
  const lines = text.split('\n');
  const contentWidth = width - 4;

  let result = '';

  // Top border with optional title
  if (title) {
    const titlePart = ` ${title} `;
    const leftPad = Math.floor((width - 2 - titlePart.length) / 2);
    const rightPad = width - 2 - leftPad - titlePart.length;
    result += `${BOX.topLeft}${BOX.horizontal.repeat(leftPad)}${titlePart}${BOX.horizontal.repeat(rightPad)}${BOX.topRight}\n`;
  } else {
    result += `${BOX.topLeft}${BOX.horizontal.repeat(width - 2)}${BOX.topRight}\n`;
  }

  // Content lines
  for (const line of lines) {
    const paddedLine = line.padEnd(contentWidth).slice(0, contentWidth);
    result += `${BOX.vertical} ${paddedLine} ${BOX.vertical}\n`;
  }

  // Bottom border
  result += `${BOX.bottomLeft}${BOX.horizontal.repeat(width - 2)}${BOX.bottomRight}`;

  return result;
}

// Progress bar
export function progressBar(current, max, width = 20, filled = '█', empty = '░') {
  const percentage = Math.min(current / max, 1);
  const filledCount = Math.round(percentage * width);
  const emptyCount = width - filledCount;
  return `${filled.repeat(filledCount)}${empty.repeat(emptyCount)}`;
}

// Styled status indicator
export function statusIndicator(status) {
  const statusMap = {
    'ACTIVE': `${COLORS.green}● ACTIVE${COLORS.reset}`,
    'PENDING': `${COLORS.yellow}○ PENDING${COLORS.reset}`,
    'COMPLETE': `${COLORS.brightBlue}✓ COMPLETE${COLORS.reset}`,
    'FAILED': `${COLORS.red}✗ FAILED${COLORS.reset}`,
    'ONLINE': `${COLORS.green}● ONLINE${COLORS.reset}`,
    'OFFLINE': `${COLORS.red}● OFFLINE${COLORS.reset}`,
    'SYNCING': `${COLORS.yellow}◐ SYNCING${COLORS.reset}`,
  };
  return statusMap[status] || status;
}

export default {
  COLORS,
  BG,
  BOX,
  SYMBOLS,
  STAR_OF_DAVID,
  MENORAH,
  CHAI,
  colorize,
  bold,
  dim,
  underline,
  bg,
  horizontalLine,
  boxText,
  progressBar,
  statusIndicator,
};
