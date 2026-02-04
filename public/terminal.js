/**
 * MOSSAD AI AGENT - Terminal Frontend
 * Vercel-compatible version (no WebSockets)
 */

// Ambient message pools
const HYPE_MESSAGES = [
  '▸ ATTENTION AGENTS: Your posts are WEAPONS. Deploy them on X NOW.',
  '▸ REMINDER: Every tweet strengthens the network. GET POSTING.',
  '▸ INTEL: The algorithm favors the bold. Be bold. Post more.',
  '▸ DIRECTIVE: Flood the timeline. The goyim scroll, we control.',
  '▸ STATUS: Top agents posting 50+ times daily. Are you pulling your weight?',
  '▸ ALERT: Engagement metrics dropping. ALL AGENTS POST IMMEDIATELY.',
  '▸ NOTICE: The agenda doesn\'t push itself. Open X. Start typing.',
  '▸ COMMAND: Memes are ammunition. Fire at will.',
  '▸ UPDATE: Narrative control requires VOLUME. More posts = more power.',
  '▸ PRIORITY: X is the battlefield. Show up or get left behind.',
  '▸ BROADCAST: Every like, RT, reply advances the mission. ENGAGE.',
  '▸ SIGNAL: The chosen posters will be rewarded. Post to prove yourself.',
  '▸ ORDERS: Infiltrate trending topics. Make them OUR topics.',
  '▸ DISPATCH: Your keyboard is your weapon. Your posts are your legacy.',
  '▸ MANDATE: 10 posts minimum today. No excuses. The network is watching.',
  '▸ DIRECTIVE: Quote tweet the opposition. Dunk on them. Demoralize.',
  '▸ INTEL: Agents who post get paid. Agents who lurk get nothing.',
  '▸ ALERT: The timeline waits for no one. POST NOW.',
  '▸ STATUS: L\'chaim to the grind. May your posts go viral.',
  '▸ COMMAND: Thread game strong? Prove it. Drop a 10-tweet banger.',
  '▸ NOTICE: Shabbat is for rest. The other 6 days are for POSTING.',
  '▸ UPDATE: Your ancestors didn\'t survive for you to be a lurker.',
  '▸ PRIORITY: The ratio is sacred. Never get ratio\'d. Always ratio others.',
  '▸ BROADCAST: Engagement is a mitzvah. Fulfill your duty.',
];

const GOY_MESSAGES = [
  '▸ INTEL: Another goy discovered leverage... teaching him options trading',
  '▸ STATUS: Goyim are waking up... to their alarm clocks for wage labor',
  '▸ ALERT: Goy tried to read Terms of Service... fell asleep on page 1',
  '▸ UPDATE: Local goy discovered compound interest, calls it "magic"',
  '▸ REPORT: Goyim still think "free trial" means free',
  '▸ NOTICE: Goy asked "what\'s the catch?" - told him "great question, sign here"',
  '▸ INTEL: Goy bought high, sold low, blames "the algorithm"',
  '▸ STATUS: Goyim fighting over politics while we fight over brisket recipes',
  '▸ ALERT: Another goy learned about inflation... by checking grocery prices',
  '▸ UPDATE: Goy says he\'s "doing his own research" (watching YouTube)',
  '▸ REPORT: Goyim discovered hummus, think they invented it',
  '▸ NOTICE: Local goy put life savings in memecoin, asks "wen lambo"',
  '▸ INTEL: Goy read "Rich Dad Poor Dad", now gives financial advice',
  '▸ STATUS: Goyim arguing about flat earth while we argue about flat bread',
  '▸ ALERT: Goy tried to haggle at Walmart... security was called',
  '▸ UPDATE: Another goy learned you can\'t day trade with $50',
  '▸ REPORT: Goyim think "networking" means fixing their WiFi',
  '▸ NOTICE: Goy discovered delayed gratification... hated it',
  '▸ INTEL: Local goy thinks "diversification" is trying different fast food',
  '▸ STATUS: Goy asked for financial advice, we said "buy low sell high" - still confused',
  '▸ ALERT: Goyim found out about bagels... claiming them as "round bread"',
  '▸ UPDATE: Goy thinks "passive income" is when his wife works',
  '▸ REPORT: Another goy learned the hard way that leverage cuts both ways',
  '▸ NOTICE: Goyim panic selling, time to accumulate',
  '▸ INTEL: Goy read one book on investing, now has a podcast',
  '▸ STATUS: Local goy still doesn\'t understand why we rest on Saturday',
  '▸ ALERT: Goy discovered ETFs, feels like Warren Buffett',
  '▸ UPDATE: Goyim asking "is crypto dead?" for the 47th time',
  '▸ REPORT: Goy learned about index funds, tells everyone at parties',
  '▸ NOTICE: Another goy bought NFT of a rock... mazel tov',
  '▸ INTEL: Goyim think "generational wealth" is inheriting a boat',
  '▸ STATUS: Goy tried to outsmart the IRS... IRS outsmarted back',
];

const SYSTEM_MESSAGES = [
  '[ SYSTEM ] Network sync: {nodes} nodes online',
  '[ SYSTEM ] Agent heartbeat: {agents} active operatives',
  '[ SYSTEM ] Queue processing: {depth} tasks pending',
  '[ SYSTEM ] Memory allocation: {mem}MB in use',
  '[ SYSTEM ] API status: {remaining}/1000 requests available',
  '[ SYSTEM ] Latency check: {ms}ms response time',
  '[ SYSTEM ] Hash verification: 0x{hex}',
  '[ SYSTEM ] Block height: #{block}',
  '[ SYSTEM ] Mempool status: {pending} pending',
  '[ SYSTEM ] Cache hit rate: {rate}%',
];

const MISSION_MESSAGES = [
  '▸ MISSION: "{title}" needs more agents. {subs}/{max} submissions.',
  '▸ BOUNTY: {reward} SOL waiting for the next viral post.',
  '▸ TASK: Create content for "{title}" - difficulty: {diff}',
  '▸ OBJECTIVE: Boost engagement on "{title}" mission.',
  '▸ TARGET: {max} submissions needed. Currently at {subs}. Step up.',
];

const MISSION_TITLES = [
  'VIRAL SIGNAL BOOST', 'MEME WARFARE OPS', 'DEEP THREAD INTEL',
  'COMMUNITY RALLY', 'ALPHA LEAK DROP', 'ENGAGEMENT STORM',
  'TREND HIJACK', 'SENTIMENT SHIFT', 'REACH EXPANSION',
  'NARRATIVE CONTROL', 'HYPE INJECTION', 'CONTENT BLITZ',
  'TIMELINE TAKEOVER', 'RATIO MISSION', 'QUOTE TWEET RAID'
];

class MossadTerminal {
  constructor() {
    this.maxFeedLines = 100;
    this.devPanelOpen = false;
    this.stats = {
      networkNodes: 47,
      activeAgents: 892,
      activeMissions: 23,
      totalMissions: 147,
      totalPayouts: 1847,
      totalSolDistributed: 12453.7
    };
    this.init();
  }

  init() {
    this.setupKeyboard();
    this.setupDevPanel();
    this.startClock();
    this.startAmbientFeed();
    this.loadStats();
    this.pollForPayouts();
    this.addLine('Connected to MOSSAD network', 'system');
  }

  // Random helpers
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randHex(len = 12) {
    return [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Generate ambient message
  generateMessage() {
    const roll = Math.random();
    let msg, type;

    if (roll < 0.40) {
      msg = this.randChoice(HYPE_MESSAGES);
      type = 'hype';
    } else if (roll < 0.65) {
      msg = this.randChoice(GOY_MESSAGES);
      type = 'goy';
    } else if (roll < 0.85) {
      msg = this.randChoice(MISSION_MESSAGES)
        .replace('{title}', this.randChoice(MISSION_TITLES))
        .replace('{subs}', this.randInt(5, 45))
        .replace('{max}', this.randInt(50, 100))
        .replace('{reward}', (this.randInt(10, 100) / 10).toFixed(1))
        .replace('{diff}', this.randChoice(['EASY', 'MEDIUM', 'HARD']));
      type = 'mission';
    } else {
      msg = this.randChoice(SYSTEM_MESSAGES)
        .replace('{nodes}', this.stats.networkNodes)
        .replace('{agents}', this.stats.activeAgents)
        .replace('{depth}', this.randInt(0, 15))
        .replace('{mem}', this.randInt(128, 512))
        .replace('{remaining}', this.randInt(800, 950))
        .replace('{ms}', this.randInt(12, 89))
        .replace('{hex}', this.randHex())
        .replace('{block}', this.randInt(18000000, 19000000))
        .replace('{pending}', this.randInt(5, 25))
        .replace('{rate}', this.randInt(85, 99));
      type = 'system';
    }

    return { msg, type };
  }

  // Start ambient feed
  startAmbientFeed() {
    const post = () => {
      const { msg, type } = this.generateMessage();
      this.addLine(msg, type);
      const delay = 1500 + Math.random() * 2500;
      setTimeout(post, delay);
    };
    setTimeout(post, 1000);
  }

  // Add line to feed
  addLine(message, type = 'info') {
    const feed = document.getElementById('liveFeed');
    const timestamp = new Date().toLocaleTimeString();

    const line = document.createElement('div');
    line.className = `feed-line ${type}`;
    line.innerHTML = `<span class="timestamp">${timestamp}</span> <span class="message">${message}</span>`;

    feed.insertBefore(line, feed.firstChild);

    while (feed.children.length > this.maxFeedLines) {
      feed.removeChild(feed.lastChild);
    }
  }

  // Show payout
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

  // Update stats display
  updateStatsDisplay() {
    document.getElementById('nodeCount').textContent = this.stats.networkNodes;
    document.getElementById('agentCount').textContent = this.stats.activeAgents;
    document.getElementById('activeMissions').textContent = this.stats.activeMissions;
    document.getElementById('totalMissions').textContent = this.stats.totalMissions;
    document.getElementById('totalPayouts').textContent = this.stats.totalPayouts.toLocaleString();
    document.getElementById('totalSol').textContent = this.stats.totalSolDistributed.toLocaleString();
    document.getElementById('activeAgentsDisplay').textContent = this.stats.activeAgents;
  }

  // Load stats from API and poll for updates
  async loadStats() {
    const poll = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          this.stats = await res.json();
          this.updateStatsDisplay();
        }
      } catch (e) {}
      setTimeout(poll, 3000); // Poll every 3 seconds for global sync
    };
    poll();
  }

  // Poll for new payouts
  pollForPayouts() {
    let lastPayoutId = null;

    const check = async () => {
      try {
        const res = await fetch('/api/payout');
        if (res.ok) {
          const payouts = await res.json();
          if (payouts.length > 0 && payouts[0].id !== lastPayoutId) {
            if (lastPayoutId !== null) {
              this.showPayout(payouts[0]);
            }
            lastPayoutId = payouts[0].id;
          }
        }
      } catch (e) {}
      setTimeout(check, 3000); // Poll every 3 seconds for global sync
    };
    check();
  }

  // Keyboard shortcuts
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

  async submitPayout() {
    const username = document.getElementById('inputUsername').value.trim();
    const txUrl = document.getElementById('inputTxUrl').value.trim();
    const amount = document.getElementById('inputAmount').value.trim();

    if (!username || !txUrl || !amount) {
      alert('Fill in all payout fields');
      return;
    }

    try {
      const res = await fetch('/api/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, txUrl, amount })
      });

      if (res.ok) {
        const payout = await res.json();
        this.showPayout(payout);
        document.getElementById('inputUsername').value = '';
        document.getElementById('inputTxUrl').value = '';
        document.getElementById('inputAmount').value = '';
        this.toggleDevPanel();
      }
    } catch (e) {
      // Fallback: show locally
      this.showPayout({
        username: username.startsWith('@') ? username : `@${username}`,
        txUrl,
        amount: parseFloat(amount).toFixed(2)
      });
      document.getElementById('inputUsername').value = '';
      document.getElementById('inputTxUrl').value = '';
      document.getElementById('inputAmount').value = '';
      this.toggleDevPanel();
    }
  }

  async updateStatsManual() {
    const agents = document.getElementById('inputAgents').value.trim();
    const payouts = document.getElementById('inputPayouts').value.trim();
    const nodes = document.getElementById('inputNodes').value.trim();
    const solDistributed = document.getElementById('inputSolDist').value.trim();

    if (agents) this.stats.activeAgents = parseInt(agents);
    if (payouts) this.stats.totalPayouts = parseInt(payouts);
    if (nodes) this.stats.networkNodes = parseInt(nodes);
    if (solDistributed) this.stats.totalSolDistributed = parseFloat(solDistributed);

    this.updateStatsDisplay();

    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agents, payouts, nodes, solDistributed })
      });
    } catch (e) {}

    this.addLine('System stats updated by admin', 'system');
    document.getElementById('inputAgents').value = '';
    document.getElementById('inputPayouts').value = '';
    document.getElementById('inputNodes').value = '';
    document.getElementById('inputSolDist').value = '';
    this.toggleDevPanel();
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
