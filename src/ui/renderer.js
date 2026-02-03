/**
 * Terminal UI Renderer
 * Handles all screen rendering and updates
 */

import { COLORS, BG, BOX, SYMBOLS, progressBar, statusIndicator, bold, dim } from './theme.js';
import { MASCOT_MINI, getMascotFrame, MASCOT_HAPPY, MASCOT_ALERT } from './mascot.js';
import store from '../state/store.js';

class Renderer {
  constructor() {
    this.width = process.stdout.columns || 120;
    this.height = process.stdout.rows || 40;
    this.frame = 0;
    this.cursorVisible = true;
    this.lastRender = Date.now();

    // Activity feed buffer
    this.feedBuffer = [];
    this.maxFeedLines = 15;

    // Listen for terminal resize
    process.stdout.on('resize', () => {
      this.width = process.stdout.columns || 120;
      this.height = process.stdout.rows || 40;
    });
  }

  // Clear screen and reset cursor
  clear() {
    process.stdout.write('\x1b[2J\x1b[H');
  }

  // Move cursor to position
  moveTo(x, y) {
    process.stdout.write(`\x1b[${y};${x}H`);
  }

  // Hide/show cursor
  hideCursor() {
    process.stdout.write('\x1b[?25l');
  }

  showCursor() {
    process.stdout.write('\x1b[?25h');
  }

  // Write text at position
  writeAt(x, y, text) {
    this.moveTo(x, y);
    process.stdout.write(text);
  }

  // Render the header bar
  renderHeader() {
    const stats = store.getStats();
    const statusColor = COLORS.green;

    const title = `${COLORS.bold}${COLORS.neonBlue}✡ MOSSAD AI AGENT ✡${COLORS.reset}`;
    const status = `${statusColor}● ONLINE${COLORS.reset}`;
    const nodeInfo = `${COLORS.cyan}NODES: ${stats.networkNodes}${COLORS.reset}`;
    const agentInfo = `${COLORS.cyan}AGENTS: ${stats.activeAgents}${COLORS.reset}`;

    // Calculate timestamp
    const now = new Date();
    const timestamp = `${COLORS.gray}${now.toLocaleTimeString()}${COLORS.reset}`;

    // Build header
    const headerBg = BG.darkBlue;
    const line1 = `${headerBg}${COLORS.brightBlue}${'═'.repeat(this.width)}${COLORS.reset}`;

    // Center title with info on sides
    const leftInfo = ` ${status} │ ${nodeInfo} │ ${agentInfo} `;
    const rightInfo = ` ${timestamp} `;

    const titleLen = 19; // Visual length without ANSI codes
    const leftLen = 30;
    const rightLen = 12;
    const padding = Math.max(0, Math.floor((this.width - titleLen) / 2) - leftLen);

    console.log(line1);
    console.log(`${headerBg}${leftInfo}${' '.repeat(padding)}${title}${' '.repeat(Math.max(0, this.width - leftLen - padding - titleLen - rightLen))}${rightInfo}${COLORS.reset}`);
    console.log(line1);
  }

  // Render mission panel
  renderMissions() {
    const missions = store.getActiveMissions().slice(0, 4);

    console.log(`\n${COLORS.brightBlue}${BOX.topLeft}${'═'.repeat(50)}${BOX.topRight}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.bold}${COLORS.neonBlue}  ◆ ACTIVE MISSIONS                              ${COLORS.reset}${COLORS.brightBlue}${BOX.vertical}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.teeRight}${'─'.repeat(50)}${BOX.teeLeft}${COLORS.reset}`);

    for (const mission of missions) {
      const progress = progressBar(mission.submissions, mission.maxSubmissions, 12);
      const diffColor = mission.difficulty === 'HARD' ? COLORS.red :
        mission.difficulty === 'MEDIUM' ? COLORS.yellow : COLORS.green;

      console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.reset} ${COLORS.cyan}${mission.id}${COLORS.reset} ${COLORS.white}${mission.title.padEnd(20).slice(0, 20)}${COLORS.reset} ${diffColor}${mission.difficulty.padEnd(6)}${COLORS.reset} ${COLORS.gold}${mission.reward.toFixed(1)} SOL${COLORS.reset}`);
      console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.reset}       ${COLORS.gray}${progress} ${mission.submissions}/${mission.maxSubmissions}${COLORS.reset}`);
    }

    console.log(`${COLORS.brightBlue}${BOX.bottomLeft}${'═'.repeat(50)}${BOX.bottomRight}${COLORS.reset}`);
  }

  // Render leaderboard
  renderLeaderboard() {
    const leaders = store.getLeaderboard(6);

    console.log(`\n${COLORS.brightBlue}${BOX.topLeft}${'═'.repeat(44)}${BOX.topRight}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.bold}${COLORS.gold}  ♔ LEADERBOARD                            ${COLORS.reset}${COLORS.brightBlue}${BOX.vertical}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.teeRight}${'─'.repeat(44)}${BOX.teeLeft}${COLORS.reset}`);

    for (const user of leaders) {
      const rankColor = user.rank === 1 ? COLORS.gold :
        user.rank === 2 ? COLORS.white :
          user.rank === 3 ? COLORS.orange : COLORS.gray;
      const medal = user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : '  ';

      console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.reset} ${medal} ${rankColor}#${user.rank}${COLORS.reset} ${COLORS.cyan}${user.username.padEnd(16).slice(0, 16)}${COLORS.reset} ${COLORS.white}${user.score.toString().padStart(6)}${COLORS.reset} ${COLORS.gold}${user.earnings.toFixed(1).padStart(6)} SOL${COLORS.reset}`);
    }

    console.log(`${COLORS.brightBlue}${BOX.bottomLeft}${'═'.repeat(44)}${BOX.bottomRight}${COLORS.reset}`);
  }

  // Render stats bar
  renderStats() {
    const stats = store.getStats();

    console.log(`\n${COLORS.brightBlue}${BOX.lightTopLeft}${'─'.repeat(this.width - 4)}${BOX.lightTopRight}${COLORS.reset}`);

    const statsLine = [
      `${COLORS.cyan}MISSIONS:${COLORS.reset} ${COLORS.white}${stats.activeMissions}/${stats.totalMissions}${COLORS.reset}`,
      `${COLORS.cyan}PAYOUTS:${COLORS.reset} ${COLORS.white}${stats.totalPayouts}${COLORS.reset}`,
      `${COLORS.cyan}DISTRIBUTED:${COLORS.reset} ${COLORS.gold}${stats.totalSolDistributed.toFixed(1)} SOL${COLORS.reset}`,
      `${COLORS.cyan}AGENTS:${COLORS.reset} ${COLORS.white}${stats.activeAgents}${COLORS.reset}`,
    ].join('  │  ');

    console.log(`${COLORS.brightBlue}${BOX.lightVertical}${COLORS.reset}  ${statsLine}`);
    console.log(`${COLORS.brightBlue}${BOX.lightBottomLeft}${'─'.repeat(this.width - 4)}${BOX.lightBottomRight}${COLORS.reset}`);
  }

  // Add message to feed buffer
  addToFeed(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    const typeColors = {
      'INFO': COLORS.gray,
      'MISSION': COLORS.cyan,
      'PAYOUT': COLORS.gold,
      'SYSTEM': COLORS.brightBlue,
      'ALERT': COLORS.yellow,
      'SUCCESS': COLORS.green,
    };

    const color = typeColors[type] || COLORS.gray;
    const prefix = type === 'PAYOUT' ? `${COLORS.gold}◆${COLORS.reset}` : `${color}▸${COLORS.reset}`;

    this.feedBuffer.unshift({
      timestamp,
      message,
      type,
      formatted: `${COLORS.dim}${timestamp}${COLORS.reset} ${prefix} ${color}${message}${COLORS.reset}`
    });

    // Trim buffer
    if (this.feedBuffer.length > this.maxFeedLines * 2) {
      this.feedBuffer = this.feedBuffer.slice(0, this.maxFeedLines * 2);
    }
  }

  // Render activity feed
  renderFeed() {
    console.log(`\n${COLORS.brightBlue}${BOX.topLeft}${'═'.repeat(this.width - 4)}${BOX.topRight}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.bold}${COLORS.neonBlue}  ⚡ LIVE NETWORK FEED                                                        ${COLORS.reset}${COLORS.brightBlue}${' '.repeat(Math.max(0, this.width - 80))}${BOX.vertical}${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}${BOX.teeRight}${'─'.repeat(this.width - 4)}${BOX.teeLeft}${COLORS.reset}`);

    const displayLines = this.feedBuffer.slice(0, this.maxFeedLines);
    for (const item of displayLines) {
      const line = item.formatted.slice(0, this.width - 6);
      console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.reset} ${line}`);
    }

    // Fill remaining space
    const remaining = this.maxFeedLines - displayLines.length;
    for (let i = 0; i < remaining; i++) {
      console.log(`${COLORS.brightBlue}${BOX.vertical}${COLORS.reset}`);
    }

    console.log(`${COLORS.brightBlue}${BOX.bottomLeft}${'═'.repeat(this.width - 4)}${BOX.bottomRight}${COLORS.reset}`);
  }

  // Render payout notification (highlighted)
  renderPayoutHighlight(payout) {
    console.log(`\n${COLORS.gold}${BG.darkBlue}${'═'.repeat(this.width - 2)}${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}${COLORS.bold}  ◆◆◆ PAYOUT CONFIRMED ◆◆◆${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}  ${COLORS.white}User:   ${COLORS.cyan}${payout.username}${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}  ${COLORS.white}Amount: ${COLORS.gold}${COLORS.bold}${payout.amount} SOL${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}  ${COLORS.white}Tx:     ${COLORS.brightBlue}${payout.txUrl}${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}  ${COLORS.green}${COLORS.bold}✓ VERIFIED${COLORS.reset}`);
    console.log(`${COLORS.gold}${BG.darkBlue}${'═'.repeat(this.width - 2)}${COLORS.reset}\n`);
  }

  // Render footer with keybind hints
  renderFooter() {
    const hints = [
      `${COLORS.dim}[CTRL+D] Dev Panel${COLORS.reset}`,
      `${COLORS.dim}[CTRL+C] Exit${COLORS.reset}`,
      `${COLORS.dim}[CTRL+L] Clear${COLORS.reset}`,
    ].join('  │  ');

    console.log(`\n${COLORS.gray}${'─'.repeat(this.width - 2)}${COLORS.reset}`);
    console.log(`  ${hints}  ${MASCOT_MINI}`);
  }

  // Render dev panel overlay
  renderDevPanel(inputState) {
    const panelWidth = 60;
    const panelHeight = 18;
    const startX = Math.floor((this.width - panelWidth) / 2);
    const startY = Math.floor((this.height - panelHeight) / 2);

    // Store current content and render overlay
    console.log('\n'.repeat(2));

    console.log(`${COLORS.brightBlue}╔${'═'.repeat(panelWidth - 2)}╗${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}║${COLORS.bold}${COLORS.neonBlue}  ✡ DEVELOPER PANEL ✡${' '.repeat(panelWidth - 24)}${COLORS.reset}${COLORS.brightBlue}║${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}║${COLORS.dim}  Manual Payout Entry System${' '.repeat(panelWidth - 32)}${COLORS.reset}${COLORS.brightBlue}║${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}╠${'─'.repeat(panelWidth - 2)}╣${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}║${COLORS.reset}${' '.repeat(panelWidth - 2)}${COLORS.brightBlue}║${COLORS.reset}`);

    // Input fields
    const fields = [
      { label: 'X USERNAME', key: 'username', placeholder: '@username' },
      { label: 'SOLSCAN TX URL', key: 'txUrl', placeholder: 'https://solscan.io/tx/...' },
      { label: 'SOL AMOUNT', key: 'amount', placeholder: '0.00' },
    ];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = inputState[field.key] || '';
      const isActive = inputState.activeField === i;
      const cursor = isActive && this.cursorVisible ? '█' : '';

      const labelColor = isActive ? COLORS.neonBlue : COLORS.cyan;
      const valueColor = isActive ? COLORS.white : COLORS.gray;
      const borderColor = isActive ? COLORS.neonBlue : COLORS.gray;

      console.log(`${COLORS.brightBlue}║${COLORS.reset}  ${labelColor}${field.label}:${COLORS.reset}${' '.repeat(panelWidth - field.label.length - 5)}${COLORS.brightBlue}║${COLORS.reset}`);
      console.log(`${COLORS.brightBlue}║${COLORS.reset}  ${borderColor}[${COLORS.reset} ${valueColor}${(value || field.placeholder).padEnd(panelWidth - 10).slice(0, panelWidth - 10)}${cursor} ${borderColor}]${COLORS.reset}${COLORS.brightBlue}║${COLORS.reset}`);
      console.log(`${COLORS.brightBlue}║${COLORS.reset}${' '.repeat(panelWidth - 2)}${COLORS.brightBlue}║${COLORS.reset}`);
    }

    console.log(`${COLORS.brightBlue}╠${'─'.repeat(panelWidth - 2)}╣${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}║${COLORS.reset}  ${COLORS.dim}[TAB] Next Field  [ENTER] Submit  [ESC] Cancel${' '.repeat(panelWidth - 50)}${COLORS.reset}${COLORS.brightBlue}║${COLORS.reset}`);
    console.log(`${COLORS.brightBlue}╚${'═'.repeat(panelWidth - 2)}╝${COLORS.reset}`);
  }

  // Full render cycle
  render(showDevPanel = false, devPanelInput = null) {
    this.frame++;
    this.cursorVisible = Math.floor(Date.now() / 500) % 2 === 0;

    this.clear();
    this.hideCursor();
    this.renderHeader();

    if (showDevPanel && devPanelInput) {
      this.renderDevPanel(devPanelInput);
    } else {
      // Two column layout
      this.renderMissions();
      this.renderLeaderboard();
      this.renderStats();
      this.renderFeed();
      this.renderFooter();
    }
  }
}

export const renderer = new Renderer();
export default renderer;
