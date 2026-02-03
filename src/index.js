#!/usr/bin/env node
/**
 * MOSSAD AI AGENT
 * Terminal-based AI agent platform with bounty/mission system
 *
 * Features:
 * - Real-time ambient network chatter
 * - Mission tracking and leaderboards
 * - Secret developer panel (CTRL+D)
 * - SOL payout management
 *
 * Keybinds:
 * - CTRL+D: Open/close Developer Panel
 * - CTRL+C: Exit
 * - CTRL+L: Refresh screen
 */

import { agent } from './agent.js';
import { COLORS } from './ui/theme.js';
import { MASCOT_MAIN } from './ui/mascot.js';

// ASCII banner
const BANNER = `
${COLORS.neonBlue}
███╗   ███╗ ██████╗ ███████╗███████╗ █████╗ ██████╗
████╗ ████║██╔═══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗
██╔████╔██║██║   ██║███████╗███████╗███████║██║  ██║
██║╚██╔╝██║██║   ██║╚════██║╚════██║██╔══██║██║  ██║
██║ ╚═╝ ██║╚██████╔╝███████║███████║██║  ██║██████╔╝
╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝
${COLORS.reset}
${COLORS.gold}              ✡ AI AGENT TERMINAL ✡${COLORS.reset}
${COLORS.cyan}          Social Bounty Intelligence System${COLORS.reset}
${COLORS.gray}                    v1.0.0${COLORS.reset}
`;

async function main() {
  // Clear screen
  console.clear();

  // Show startup banner
  console.log(BANNER);
  console.log(MASCOT_MAIN);

  console.log(`${COLORS.brightBlue}Initializing systems...${COLORS.reset}`);
  await sleep(500);

  console.log(`${COLORS.cyan}▸ Loading mission database...${COLORS.reset}`);
  await sleep(300);

  console.log(`${COLORS.cyan}▸ Connecting to network nodes...${COLORS.reset}`);
  await sleep(300);

  console.log(`${COLORS.cyan}▸ Syncing leaderboard data...${COLORS.reset}`);
  await sleep(300);

  console.log(`${COLORS.cyan}▸ Establishing secure channels...${COLORS.reset}`);
  await sleep(400);

  console.log(`\n${COLORS.green}✓ All systems operational${COLORS.reset}`);
  console.log(`${COLORS.dim}Press any key to continue...${COLORS.reset}`);

  // Wait for keypress
  await waitForKey();

  // Start the main agent
  await agent.start();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForKey() {
  return new Promise(resolve => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (err) => {
  console.error(`${COLORS.red}Fatal Error: ${err.message}${COLORS.reset}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(`${COLORS.red}Unhandled Promise Rejection: ${reason}${COLORS.reset}`);
});

// Run
main().catch(console.error);
