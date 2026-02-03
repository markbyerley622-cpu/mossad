/**
 * Input Handler
 * Manages keyboard input and dev panel controls
 */

import readline from 'readline';

class InputHandler {
  constructor() {
    this.listeners = new Map();
    this.devPanelOpen = false;
    this.devPanelInput = {
      username: '',
      txUrl: '',
      amount: '',
      activeField: 0
    };
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    // Enable raw mode for immediate key detection
    if (process.stdin.isTTY) {
      readline.emitKeypressEvents(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();

      process.stdin.on('keypress', (str, key) => {
        this.handleKeypress(str, key);
      });

      this.isInitialized = true;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  handleKeypress(str, key) {
    if (!key) return;

    // Global shortcuts (work everywhere)
    if (key.ctrl && key.name === 'c') {
      this.emit('exit');
      return;
    }

    // CTRL+D - Toggle dev panel
    if (key.ctrl && key.name === 'd') {
      this.toggleDevPanel();
      return;
    }

    // CTRL+L - Clear/refresh
    if (key.ctrl && key.name === 'l') {
      this.emit('refresh');
      return;
    }

    // Dev panel specific handling
    if (this.devPanelOpen) {
      this.handleDevPanelInput(str, key);
      return;
    }

    // Normal mode key handling
    this.emit('keypress', { str, key });
  }

  toggleDevPanel() {
    this.devPanelOpen = !this.devPanelOpen;

    if (this.devPanelOpen) {
      // Reset input state when opening
      this.devPanelInput = {
        username: '',
        txUrl: '',
        amount: '',
        activeField: 0
      };
      this.emit('devPanelOpen');
    } else {
      this.emit('devPanelClose');
    }

    this.emit('devPanelToggle', this.devPanelOpen);
  }

  handleDevPanelInput(str, key) {
    const fields = ['username', 'txUrl', 'amount'];
    const currentField = fields[this.devPanelInput.activeField];

    // ESC - Close panel
    if (key.name === 'escape') {
      this.devPanelOpen = false;
      this.emit('devPanelClose');
      this.emit('devPanelToggle', false);
      return;
    }

    // TAB - Next field
    if (key.name === 'tab') {
      this.devPanelInput.activeField = (this.devPanelInput.activeField + 1) % 3;
      this.emit('devPanelUpdate', this.devPanelInput);
      return;
    }

    // ENTER - Submit
    if (key.name === 'return') {
      // Validate and submit
      const { username, txUrl, amount } = this.devPanelInput;

      if (username && txUrl && amount) {
        this.emit('devPanelSubmit', {
          username: username.startsWith('@') ? username : `@${username}`,
          txUrl,
          amount
        });

        // Close panel after submit
        this.devPanelOpen = false;
        this.emit('devPanelClose');
        this.emit('devPanelToggle', false);
      }
      return;
    }

    // BACKSPACE - Delete character
    if (key.name === 'backspace') {
      this.devPanelInput[currentField] = this.devPanelInput[currentField].slice(0, -1);
      this.emit('devPanelUpdate', this.devPanelInput);
      return;
    }

    // Regular character input
    if (str && str.length === 1 && !key.ctrl && !key.meta) {
      // Validate amount field (numbers and decimal only)
      if (currentField === 'amount') {
        if (/[\d.]/.test(str)) {
          this.devPanelInput[currentField] += str;
        }
      } else {
        this.devPanelInput[currentField] += str;
      }
      this.emit('devPanelUpdate', this.devPanelInput);
    }
  }

  isDevPanelOpen() {
    return this.devPanelOpen;
  }

  getDevPanelInput() {
    return { ...this.devPanelInput };
  }

  cleanup() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
}

export const inputHandler = new InputHandler();
export default inputHandler;
