/**
 * MOSSAD AI Mascot
 * A cool Jewish-themed character for the terminal UI
 */

import { COLORS, SYMBOLS, STAR_OF_DAVID } from './theme.js';

// Main mascot ASCII art - A cool agent with Star of David
export const MASCOT_MAIN = `
${COLORS.brightBlue}        ╭─────────────────╮${COLORS.reset}
${COLORS.brightBlue}        │${COLORS.neonBlue}  ✡ MOSSAD AI ✡  ${COLORS.brightBlue}│${COLORS.reset}
${COLORS.brightBlue}        ╰────────┬────────╯${COLORS.reset}
${COLORS.cyan}               ╱ ╲${COLORS.reset}
${COLORS.white}              ┌───┐${COLORS.reset}
${COLORS.white}             ╱│${COLORS.neonBlue}◉ ◉${COLORS.white}│╲${COLORS.reset}
${COLORS.cyan}            ┌┘ └───┘ └┐${COLORS.reset}
${COLORS.cyan}            │ ${COLORS.gold}┌─────┐${COLORS.cyan} │${COLORS.reset}
${COLORS.cyan}            │ ${COLORS.gold}│ ✡✡✡ │${COLORS.cyan} │${COLORS.reset}
${COLORS.cyan}            │ ${COLORS.gold}└─────┘${COLORS.cyan} │${COLORS.reset}
${COLORS.brightBlue}            ╰┬─────┬╯${COLORS.reset}
${COLORS.gray}             │     │${COLORS.reset}
${COLORS.gray}            ═╧═   ═╧═${COLORS.reset}
`;

// Compact mascot for smaller spaces
export const MASCOT_SMALL = `
${COLORS.neonBlue}  ╔═════════════╗
  ║ ${COLORS.gold}✡${COLORS.neonBlue} AGENT ${COLORS.gold}✡${COLORS.neonBlue}  ║
  ║   ${COLORS.white}◉   ◉${COLORS.neonBlue}   ║
  ║   ${COLORS.cyan}╰───╯${COLORS.neonBlue}   ║
  ╚═════════════╝${COLORS.reset}
`;

// Mini mascot for tight spaces
export const MASCOT_MINI = `${COLORS.neonBlue}[${COLORS.gold}✡${COLORS.neonBlue}]${COLORS.reset}`;

// Animated blinking eyes mascot (returns different frames)
export function getMascotFrame(frame = 0) {
  const eyes = frame % 10 === 0 ? '─ ─' : '◉ ◉'; // Blink every 10 frames
  return `
${COLORS.brightBlue}    ╭───────────────╮${COLORS.reset}
${COLORS.brightBlue}    │${COLORS.neonBlue} ✡ MOSSAD AI ✡ ${COLORS.brightBlue}│${COLORS.reset}
${COLORS.brightBlue}    ╰───────┬───────╯${COLORS.reset}
${COLORS.white}           ╱ ╲${COLORS.reset}
${COLORS.white}         ┌─────┐${COLORS.reset}
${COLORS.white}         │${COLORS.neonBlue} ${eyes} ${COLORS.white}│${COLORS.reset}
${COLORS.white}         │ ${COLORS.cyan}‿‿‿${COLORS.white} │${COLORS.reset}
${COLORS.cyan}         └──┬──┘${COLORS.reset}
${COLORS.cyan}       ╔════╧════╗${COLORS.reset}
${COLORS.cyan}       ║ ${COLORS.gold}✡ ✡ ✡${COLORS.cyan} ║${COLORS.reset}
${COLORS.cyan}       ╚═════════╝${COLORS.reset}
`;
}

// Mascot with speech bubble
export function mascotSays(message) {
  const maxWidth = 30;
  const lines = [];
  let currentLine = '';

  for (const word of message.split(' ')) {
    if ((currentLine + ' ' + word).trim().length <= maxWidth) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const bubbleWidth = Math.max(...lines.map(l => l.length)) + 4;

  let bubble = `${COLORS.white}   ${'─'.repeat(bubbleWidth)}${COLORS.reset}\n`;
  for (const line of lines) {
    bubble += `${COLORS.white}  │ ${line.padEnd(bubbleWidth - 4)} │${COLORS.reset}\n`;
  }
  bubble += `${COLORS.white}   ${'─'.repeat(bubbleWidth)}${COLORS.reset}\n`;
  bubble += `${COLORS.white}        ╲${COLORS.reset}\n`;

  return bubble + MASCOT_SMALL;
}

// Status mascot variations
export const MASCOT_HAPPY = `${COLORS.neonBlue}[${COLORS.gold}✡${COLORS.green}◡‿◡${COLORS.gold}✡${COLORS.neonBlue}]${COLORS.reset}`;
export const MASCOT_ALERT = `${COLORS.neonBlue}[${COLORS.gold}✡${COLORS.yellow}◉_◉${COLORS.gold}✡${COLORS.neonBlue}]${COLORS.reset}`;
export const MASCOT_ERROR = `${COLORS.neonBlue}[${COLORS.gold}✡${COLORS.red}×_×${COLORS.gold}✡${COLORS.neonBlue}]${COLORS.reset}`;
export const MASCOT_THINKING = `${COLORS.neonBlue}[${COLORS.gold}✡${COLORS.cyan}◔_◔${COLORS.gold}✡${COLORS.neonBlue}]${COLORS.reset}`;

// Large decorative Star of David
export const STAR_LARGE = `
${COLORS.gold}        △${COLORS.reset}
${COLORS.gold}       ╱ ╲${COLORS.reset}
${COLORS.gold}      ╱   ╲${COLORS.reset}
${COLORS.gold}  ───┼─────┼───${COLORS.reset}
${COLORS.gold}      ╲   ╱${COLORS.reset}
${COLORS.gold}       ╲ ╱${COLORS.reset}
${COLORS.gold}        ▽${COLORS.reset}
`;

export default {
  MASCOT_MAIN,
  MASCOT_SMALL,
  MASCOT_MINI,
  MASCOT_HAPPY,
  MASCOT_ALERT,
  MASCOT_ERROR,
  MASCOT_THINKING,
  getMascotFrame,
  mascotSays,
  STAR_LARGE,
};
