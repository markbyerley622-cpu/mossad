/**
 * MOSSAD AI AGENT - Frontend Application
 */

class MossadApp {
  constructor() {
    this.ws = null;
    this.feedItems = [];
    this.maxFeedItems = 50;
    this.devPanelOpen = false;

    this.init();
  }

  init() {
    this.connectWebSocket();
    this.setupKeyboardShortcuts();
    this.setupDevPanel();
    this.startClock();
    this.createStarField();
  }

  // ═══════════════════════════════════════════════════════════
  // WebSocket Connection
  // ═══════════════════════════════════════════════════════════

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✡ Connected to MOSSAD AI AGENT');
      this.addFeedItem('Connected to MOSSAD network', 'system');
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.handleMessage(msg);
    };

    this.ws.onclose = () => {
      console.log('Disconnected. Reconnecting...');
      this.addFeedItem('Connection lost. Reconnecting...', 'alert');
      setTimeout(() => this.connectWebSocket(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'init':
        this.updateStats(msg.data.stats);
        this.renderMissions(msg.data.missions);
        this.renderLeaderboard(msg.data.leaderboard);
        break;

      case 'ambient':
        this.addFeedItem(msg.data.message, this.detectMessageType(msg.data.message));
        break;

      case 'payout':
        this.showPayoutHighlight(msg.data);
        break;

      case 'stats':
        this.updateStats(msg.data);
        break;

      case 'pong':
        // Heartbeat response
        break;
    }
  }

  detectMessageType(message) {
    if (message.includes('goy') || message.includes('Goy')) return 'goy';
    if (message.includes('MISSION') || message.includes('BOUNTY')) return 'mission';
    if (message.includes('PAYOUT') || message.includes('TRANSFER') || message.includes('SOL →')) return 'payout';
    if (message.includes('SYSTEM')) return 'system';
    if (message.includes('ALERT') || message.includes('WARNING')) return 'alert';
    return 'info';
  }

  // ═══════════════════════════════════════════════════════════
  // UI Updates
  // ═══════════════════════════════════════════════════════════

  updateStats(stats) {
    document.getElementById('nodeCount').textContent = stats.networkNodes || 47;
    document.getElementById('agentCount').textContent = stats.activeAgents || 892;
    document.getElementById('activeMissions').textContent = stats.activeMissions || 23;
    document.getElementById('totalMissions').textContent = stats.totalMissions || 147;
    document.getElementById('totalPayouts').textContent = (stats.totalPayouts || 1847).toLocaleString();
    document.getElementById('totalSol').textContent = (stats.totalSolDistributed || 12453.7).toLocaleString();
    document.getElementById('activeAgentsDisplay').textContent = stats.activeAgents || 892;
  }

  renderMissions(missions) {
    const container = document.getElementById('missionsList');
    container.innerHTML = missions.filter(m => m.status === 'ACTIVE').slice(0, 5).map(m => `
      <div class="mission-item">
        <div class="mission-header">
          <span class="mission-id">${m.id}</span>
          <span class="mission-difficulty ${m.difficulty.toLowerCase()}">${m.difficulty}</span>
        </div>
        <div class="mission-title">${m.title}</div>
        <div class="mission-footer">
          <span class="mission-reward">${m.reward.toFixed(1)} SOL</span>
          <div class="mission-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(m.submissions / m.maxSubmissions * 100)}%"></div>
            </div>
            <span class="progress-text">${m.submissions}/${m.maxSubmissions}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderLeaderboard(leaders) {
    const container = document.getElementById('leaderboard');
    container.innerHTML = leaders.slice(0, 8).map((user, i) => {
      const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
      const badge = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${user.rank}`;
      const badgeClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';

      return `
        <div class="leaderboard-item ${rankClass}">
          <div class="rank-badge ${badgeClass}">${badge}</div>
          <div class="leader-info">
            <div class="leader-name">${user.username}</div>
            <div class="leader-score">${user.score.toLocaleString()} pts</div>
          </div>
          <div class="leader-earnings">${user.earnings.toFixed(1)} SOL</div>
        </div>
      `;
    }).join('');
  }

  addFeedItem(message, type = 'info') {
    const feed = document.getElementById('liveFeed');
    const timestamp = new Date().toLocaleTimeString();

    const item = document.createElement('div');
    item.className = `feed-item ${type}`;
    item.innerHTML = `
      <span class="feed-timestamp">${timestamp}</span>
      <span class="feed-message">${message}</span>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Limit feed items
    while (feed.children.length > this.maxFeedItems) {
      feed.removeChild(feed.lastChild);
    }
  }

  showPayoutHighlight(payout) {
    const feed = document.getElementById('liveFeed');

    const item = document.createElement('div');
    item.className = 'payout-highlight';
    item.innerHTML = `
      <div class="payout-header">◆◆◆ PAYOUT CONFIRMED ◆◆◆</div>
      <div class="payout-detail">
        <span class="payout-label">User:</span>
        <span class="payout-value">${payout.username}</span>
      </div>
      <div class="payout-detail">
        <span class="payout-label">Amount:</span>
        <span class="payout-value amount">${payout.amount} SOL</span>
      </div>
      <div class="payout-detail">
        <span class="payout-label">Tx:</span>
        <span class="payout-value tx" onclick="window.open('${payout.txUrl}', '_blank')">${payout.txUrl.slice(0, 50)}...</span>
      </div>
      <div class="payout-verified">✓ VERIFIED</div>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      item.style.opacity = '0.5';
    }, 30000);
  }

  // ═══════════════════════════════════════════════════════════
  // Keyboard Shortcuts
  // ═══════════════════════════════════════════════════════════

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // CTRL+D - Toggle dev panel
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.toggleDevPanel();
      }

      // CTRL+L - Clear feed
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('liveFeed').innerHTML = '';
        this.addFeedItem('Feed cleared', 'system');
      }

      // ESC - Close dev panel
      if (e.key === 'Escape' && this.devPanelOpen) {
        this.toggleDevPanel();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Dev Panel
  // ═══════════════════════════════════════════════════════════

  setupDevPanel() {
    const submitPayout = document.getElementById('submitPayout');
    const updateStats = document.getElementById('updateStats');

    submitPayout.addEventListener('click', () => this.submitPayout());
    updateStats.addEventListener('click', () => this.updateStatsManual());

    // Enter key submits
    document.querySelectorAll('.dev-field input').forEach(input => {
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

    if (this.devPanelOpen) {
      panel.classList.add('active');
      document.getElementById('inputUsername').focus();
    } else {
      panel.classList.remove('active');
    }
  }

  submitPayout() {
    const username = document.getElementById('inputUsername').value.trim();
    const txUrl = document.getElementById('inputTxUrl').value.trim();
    const amount = document.getElementById('inputAmount').value.trim();

    if (!username || !txUrl || !amount) {
      alert('Please fill in all payout fields');
      return;
    }

    // Send to server
    fetch('/api/payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, txUrl, amount })
    })
    .then(res => res.json())
    .then(data => {
      // Clear inputs
      document.getElementById('inputUsername').value = '';
      document.getElementById('inputTxUrl').value = '';
      document.getElementById('inputAmount').value = '';

      // Close panel
      this.toggleDevPanel();
    })
    .catch(err => {
      console.error('Payout error:', err);
      alert('Failed to submit payout');
    });
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
      alert('Please fill in at least one stat field');
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
      this.addFeedItem('System stats manually updated', 'system');

      // Clear inputs
      document.getElementById('inputAgents').value = '';
      document.getElementById('inputPayouts').value = '';
      document.getElementById('inputNodes').value = '';
      document.getElementById('inputSolDist').value = '';

      // Close panel
      this.toggleDevPanel();
    })
    .catch(err => {
      console.error('Stats update error:', err);
      alert('Failed to update stats');
    });
  }

  // ═══════════════════════════════════════════════════════════
  // Visual Effects
  // ═══════════════════════════════════════════════════════════

  startClock() {
    const updateClock = () => {
      const now = new Date();
      document.getElementById('clock').textContent = now.toLocaleTimeString();
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  createStarField() {
    const field = document.getElementById('starField');
    const starCount = 30;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.textContent = '✡';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.fontSize = `${8 + Math.random() * 10}px`;
      field.appendChild(star);
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MossadApp();
});
