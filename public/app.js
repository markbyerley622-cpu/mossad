/**
 * MOSSAD AI AGENT - Terminal Frontend
 */

class MossadTerminal {
  constructor() {
    this.ws = null;
    this.maxFeedLines = 100;
    this.devPanelOpen = false;
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.setupKeyboard();
    this.setupDevPanel();
    this.startClock();
  }

  // WebSocket
  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${protocol}//${window.location.host}`);

    this.ws.onopen = () => {
      this.addLine('Connected to MOSSAD network', 'system');
    };

    this.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      this.handleMessage(msg);
    };

    this.ws.onclose = () => {
      this.addLine('Connection lost. Reconnecting...', 'system');
      setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'init':
        this.updateStats(msg.data.stats);
        break;

      case 'ambient':
        const type = this.getMessageType(msg.data.message);
        this.addLine(msg.data.message, type);
        break;

      case 'payout':
        this.showPayout(msg.data);
        break;

      case 'stats':
        this.updateStats(msg.data);
        break;
    }
  }

  getMessageType(message) {
    if (message.includes('ATTENTION') || message.includes('REMINDER') ||
        message.includes('DIRECTIVE') || message.includes('COMMAND') ||
        message.includes('MANDATE') || message.includes('ORDERS') ||
        message.includes('PRIORITY') || message.includes('BROADCAST')) {
      return 'hype';
    }
    if (message.toLowerCase().includes('goy')) return 'goy';
    if (message.includes('SYSTEM')) return 'system';
    if (message.includes('MISSION') || message.includes('BOUNTY') || message.includes('TASK')) return 'mission';
    return 'info';
  }

  // UI Updates
  addLine(message, type = 'info') {
    const feed = document.getElementById('liveFeed');
    const timestamp = new Date().toLocaleTimeString();

    const line = document.createElement('div');
    line.className = `feed-line ${type}`;
    line.innerHTML = `<span class="timestamp">${timestamp}</span> <span class="message">${message}</span>`;

    feed.insertBefore(line, feed.firstChild);

    // Trim old lines
    while (feed.children.length > this.maxFeedLines) {
      feed.removeChild(feed.lastChild);
    }
  }

  showPayout(payout) {
    const feed = document.getElementById('liveFeed');

    const block = document.createElement('div');
    block.className = 'payout-block';
    block.innerHTML = `
      <div class="payout-title">◆◆◆ PAYOUT CONFIRMED ◆◆◆</div>
      <div class="payout-info">User: <span>${payout.username}</span></div>
      <div class="payout-info">Amount: <span style="color:#ffd700;font-weight:bold">${payout.amount} SOL</span></div>
      <div class="payout-info">Tx: <span style="cursor:pointer;text-decoration:underline" onclick="window.open('${payout.txUrl}','_blank')">${payout.txUrl}</span></div>
      <div class="payout-verified">✓ VERIFIED</div>
    `;

    feed.insertBefore(block, feed.firstChild);
  }

  updateStats(stats) {
    document.getElementById('nodeCount').textContent = stats.networkNodes || 47;
    document.getElementById('agentCount').textContent = stats.activeAgents || 892;
    document.getElementById('activeMissions').textContent = stats.activeMissions || 23;
    document.getElementById('totalMissions').textContent = stats.totalMissions || 147;
    document.getElementById('totalPayouts').textContent = (stats.totalPayouts || 1847).toLocaleString();
    document.getElementById('totalSol').textContent = (stats.totalSolDistributed || 12453.7).toLocaleString();
    document.getElementById('activeAgentsDisplay').textContent = stats.activeAgents || 892;
  }

  // Keyboard
  setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.toggleDevPanel();
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('liveFeed').innerHTML = '';
        this.addLine('Feed cleared', 'system');
      }
      if (e.key === 'Escape' && this.devPanelOpen) {
        this.toggleDevPanel();
      }
    });
  }

  // Dev Panel
  setupDevPanel() {
    document.getElementById('submitPayout').addEventListener('click', () => this.submitPayout());
    document.getElementById('updateStats').addEventListener('click', () => this.updateStatsManual());

    // Enter to submit
    document.querySelectorAll('.dev-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const section = input.closest('.dev-section');
          if (section.querySelector('#submitPayout')) {
            this.submitPayout();
          } else {
            this.updateStatsManual();
          }
        }
      });
    });
  }

  toggleDevPanel() {
    const panel = document.getElementById('devPanel');
    this.devPanelOpen = !this.devPanelOpen;
    panel.classList.toggle('active', this.devPanelOpen);
    if (this.devPanelOpen) {
      document.getElementById('inputUsername').focus();
    }
  }

  submitPayout() {
    const username = document.getElementById('inputUsername').value.trim();
    const txUrl = document.getElementById('inputTxUrl').value.trim();
    const amount = document.getElementById('inputAmount').value.trim();

    if (!username || !txUrl || !amount) {
      alert('Fill in all payout fields');
      return;
    }

    fetch('/api/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, txUrl, amount })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById('inputUsername').value = '';
      document.getElementById('inputTxUrl').value = '';
      document.getElementById('inputAmount').value = '';
      this.toggleDevPanel();
    })
    .catch(err => alert('Failed to submit payout'));
  }

  updateStatsManual() {
    const agents = document.getElementById('inputAgents').value.trim();
    const payouts = document.getElementById('inputPayouts').value.trim();
    const nodes = document.getElementById('inputNodes').value.trim();
    const solDistributed = document.getElementById('inputSolDist').value.trim();

    const updates = {};
    if (agents) updates.agents = agents;
    if (payouts) updates.payouts = payouts;
    if (nodes) updates.nodes = nodes;
    if (solDistributed) updates.solDistributed = solDistributed;

    if (Object.keys(updates).length === 0) {
      alert('Fill in at least one stat');
      return;
    }

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    .then(res => res.json())
    .then(data => {
      this.updateStats(data);
      this.addLine('System stats updated by admin', 'system');
      document.getElementById('inputAgents').value = '';
      document.getElementById('inputPayouts').value = '';
      document.getElementById('inputNodes').value = '';
      document.getElementById('inputSolDist').value = '';
      this.toggleDevPanel();
    })
    .catch(err => alert('Failed to update stats'));
  }

  // Clock
  startClock() {
    const update = () => {
      document.getElementById('clock').textContent = new Date().toLocaleTimeString();
    };
    update();
    setInterval(update, 1000);
  }
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  window.terminal = new MossadTerminal();
});
