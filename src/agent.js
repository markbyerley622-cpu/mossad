/**
 * MOSSAD AI Agent
 * Main agent class that orchestrates the terminal UI
 */

import { renderer } from './ui/renderer.js';
import { inputHandler } from './ui/input.js';
import store from './state/store.js';
import { getRandomAmbientMessage } from './data/ambientMessages.js';
import { COLORS } from './ui/theme.js';

class MossadAgent {
  constructor() {
    this.isRunning = false;
    this.ambientInterval = null;
    this.renderInterval = null;
    this.lastAmbientTime = 0;
    this.ambientDelay = 2000; // Base delay between ambient messages (ms)
    this.ambientVariance = 1500; // Random variance in delay
  }

  async start() {
    this.isRunning = true;

    // Initialize input handling
    inputHandler.initialize();

    // Setup event handlers
    this.setupEventHandlers();

    // Initial render
    this.render();

    // Start ambient output
    this.startAmbientOutput();

    // Start render loop
    this.startRenderLoop();

    // Welcome message
    this.addMessage('MOSSAD AI AGENT v1.0 INITIALIZED', 'SYSTEM');
    this.addMessage('Network connection established', 'SYSTEM');
    this.addMessage('Press CTRL+D to access Developer Panel', 'INFO');
  }

  setupEventHandlers() {
    // Exit handler
    inputHandler.on('exit', () => {
      this.shutdown();
    });

    // Refresh handler
    inputHandler.on('refresh', () => {
      this.render();
    });

    // Dev panel toggle
    inputHandler.on('devPanelToggle', (isOpen) => {
      if (isOpen) {
        this.pauseAmbient();
        this.addMessage('Developer Panel opened', 'SYSTEM');
      } else {
        this.resumeAmbient();
        this.addMessage('Developer Panel closed', 'SYSTEM');
      }
      this.render();
    });

    // Dev panel updates
    inputHandler.on('devPanelUpdate', () => {
      this.render();
    });

    // Dev panel submit
    inputHandler.on('devPanelSubmit', (data) => {
      this.processPayout(data);
    });
  }

  addMessage(message, type = 'INFO') {
    renderer.addToFeed(message, type);
  }

  processPayout(data) {
    // Validate data
    const { username, txUrl, amount } = data;

    if (!username || !txUrl || !amount) {
      this.addMessage('PAYOUT REJECTED: Missing required fields', 'ALERT');
      return;
    }

    // Process the payout
    const payout = store.addPayout({
      username,
      txUrl,
      amount: `${parseFloat(amount).toFixed(2)}`
    });

    // Add highlighted payout message
    this.addMessage(`PAYOUT CONFIRMED: ${username} received ${amount} SOL`, 'PAYOUT');
    this.addMessage(`Tx: ${txUrl}`, 'PAYOUT');
    this.addMessage('✓ VERIFIED on Solscan', 'SUCCESS');

    // Update leaderboard
    store.updateLeaderboard(username, Math.round(parseFloat(amount) * 100), parseFloat(amount));

    this.render();
  }

  startAmbientOutput() {
    const scheduleNext = () => {
      if (!this.isRunning) return;

      const delay = this.ambientDelay + Math.random() * this.ambientVariance;
      this.ambientInterval = setTimeout(() => {
        if (!inputHandler.isDevPanelOpen() && this.isRunning) {
          const message = getRandomAmbientMessage();
          const type = message.startsWith('▸ MISSION') ? 'MISSION' :
            message.startsWith('◆') ? 'PAYOUT' :
              message.startsWith('[ SYSTEM ]') ? 'SYSTEM' : 'INFO';

          this.addMessage(message.replace(/^[\▸◆\[\]SYSTEM ]+/, '').trim(), type);
          this.render();
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }

  pauseAmbient() {
    if (this.ambientInterval) {
      clearTimeout(this.ambientInterval);
      this.ambientInterval = null;
    }
  }

  resumeAmbient() {
    if (!this.ambientInterval) {
      this.startAmbientOutput();
    }
  }

  startRenderLoop() {
    // Render at 2 FPS for cursor blink effect
    this.renderInterval = setInterval(() => {
      if (this.isRunning) {
        this.render();
      }
    }, 500);
  }

  render() {
    const isDevPanelOpen = inputHandler.isDevPanelOpen();
    const devPanelInput = inputHandler.getDevPanelInput();

    renderer.render(isDevPanelOpen, devPanelInput);
  }

  shutdown() {
    this.isRunning = false;

    if (this.ambientInterval) {
      clearTimeout(this.ambientInterval);
    }
    if (this.renderInterval) {
      clearInterval(this.renderInterval);
    }

    inputHandler.cleanup();
    renderer.showCursor();
    renderer.clear();

    console.log(`${COLORS.neonBlue}✡ MOSSAD AI AGENT SHUTDOWN ✡${COLORS.reset}`);
    console.log(`${COLORS.gray}Session terminated. Shalom!${COLORS.reset}\n`);

    process.exit(0);
  }
}

export const agent = new MossadAgent();
export default agent;
