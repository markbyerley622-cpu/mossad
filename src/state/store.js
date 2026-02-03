/**
 * Global State Store
 * In-memory state management with reactive updates
 * Designed for future migration to SQLite/Redis/Postgres
 */

class Store {
  constructor() {
    this.listeners = new Map();

    this.state = {
      missions: [],
      users: new Map(),
      payouts: [],
      leaderboard: [],
      activityFeed: [],
      stats: {
        totalMissions: 0,
        activeMissions: 0,
        totalPayouts: 0,
        totalSolDistributed: 0,
        activeAgents: 0,
        networkNodes: 0
      },
      devPanel: {
        isOpen: false,
        inputMode: null,
        currentInput: {
          username: '',
          txUrl: '',
          amount: ''
        }
      }
    };

    this._initializeMockData();
  }

  _initializeMockData() {
    // Initialize with sample missions
    this.state.missions = [
      {
        id: 'MSN-001',
        title: 'VIRAL SIGNAL BOOST',
        description: 'Amplify network reach on X platform',
        reward: 5.0,
        difficulty: 'MEDIUM',
        status: 'ACTIVE',
        submissions: 12,
        maxSubmissions: 50,
        creator: 'GENESIS_NODE',
        tags: ['viral', 'engagement', 'reach']
      },
      {
        id: 'MSN-002',
        title: 'MEME WARFARE OPS',
        description: 'Deploy strategic humor assets',
        reward: 2.5,
        difficulty: 'EASY',
        status: 'ACTIVE',
        submissions: 34,
        maxSubmissions: 100,
        creator: 'MEME_COUNCIL',
        tags: ['meme', 'creative', 'humor']
      },
      {
        id: 'MSN-003',
        title: 'DEEP THREAD INTEL',
        description: 'Craft detailed analysis threads',
        reward: 10.0,
        difficulty: 'HARD',
        status: 'ACTIVE',
        submissions: 3,
        maxSubmissions: 10,
        creator: 'ALPHA_HQ',
        tags: ['analysis', 'thread', 'research']
      },
      {
        id: 'MSN-004',
        title: 'COMMUNITY RALLY',
        description: 'Unite agents under common signal',
        reward: 3.0,
        difficulty: 'MEDIUM',
        status: 'PENDING',
        submissions: 0,
        maxSubmissions: 25,
        creator: 'COLLECTIVE_OPS',
        tags: ['community', 'unity', 'signal']
      }
    ];

    // Initialize leaderboard
    this.state.leaderboard = [
      { rank: 1, username: '@cryptomaxi_99', score: 15420, earnings: 142.5, streak: 12 },
      { rank: 2, username: '@degen_sarah', score: 12890, earnings: 98.3, streak: 8 },
      { rank: 3, username: '@alpha_hunter', score: 11200, earnings: 87.2, streak: 15 },
      { rank: 4, username: '@memeLord_420', score: 9850, earnings: 72.1, streak: 5 },
      { rank: 5, username: '@signal_boost', score: 8920, earnings: 65.8, streak: 7 },
      { rank: 6, username: '@thread_master', score: 7650, earnings: 54.2, streak: 4 },
      { rank: 7, username: '@viral_vince', score: 6890, earnings: 48.9, streak: 6 },
      { rank: 8, username: '@engagement_ace', score: 5420, earnings: 41.3, streak: 3 }
    ];

    // Initialize stats
    this.state.stats = {
      totalMissions: 147,
      activeMissions: 23,
      totalPayouts: 1847,
      totalSolDistributed: 12453.7,
      activeAgents: 892,
      networkNodes: 47
    };
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key).delete(callback);
  }

  emit(key) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(this.state[key]));
    }
  }

  // Mission operations
  getMissions() {
    return this.state.missions;
  }

  getActiveMissions() {
    return this.state.missions.filter(m => m.status === 'ACTIVE');
  }

  addMission(mission) {
    this.state.missions.push(mission);
    this.state.stats.totalMissions++;
    if (mission.status === 'ACTIVE') this.state.stats.activeMissions++;
    this.emit('missions');
  }

  // Payout operations
  addPayout(payout) {
    const payoutEntry = {
      id: `PAY-${Date.now()}`,
      timestamp: new Date(),
      verified: true,
      ...payout
    };
    this.state.payouts.unshift(payoutEntry);
    this.state.stats.totalPayouts++;
    this.state.stats.totalSolDistributed += parseFloat(payout.amount) || 0;

    // Add to activity feed
    this.addActivity({
      type: 'PAYOUT',
      message: `PAYOUT CONFIRMED: ${payout.username} received ${payout.amount} SOL`,
      data: payoutEntry
    });

    this.emit('payouts');
    return payoutEntry;
  }

  getPayouts(limit = 10) {
    return this.state.payouts.slice(0, limit);
  }

  // Leaderboard operations
  getLeaderboard(limit = 10) {
    return this.state.leaderboard.slice(0, limit);
  }

  updateLeaderboard(username, scoreIncrease, earnings) {
    const existing = this.state.leaderboard.find(u => u.username === username);
    if (existing) {
      existing.score += scoreIncrease;
      existing.earnings += earnings;
    } else {
      this.state.leaderboard.push({
        rank: this.state.leaderboard.length + 1,
        username,
        score: scoreIncrease,
        earnings,
        streak: 1
      });
    }
    // Re-sort and re-rank
    this.state.leaderboard.sort((a, b) => b.score - a.score);
    this.state.leaderboard.forEach((u, i) => u.rank = i + 1);
    this.emit('leaderboard');
  }

  // Activity feed
  addActivity(activity) {
    this.state.activityFeed.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date(),
      ...activity
    });
    // Keep feed manageable
    if (this.state.activityFeed.length > 100) {
      this.state.activityFeed = this.state.activityFeed.slice(0, 100);
    }
    this.emit('activityFeed');
  }

  getActivityFeed(limit = 20) {
    return this.state.activityFeed.slice(0, limit);
  }

  // Stats
  getStats() {
    return { ...this.state.stats };
  }

  // Dev panel state
  setDevPanelOpen(isOpen) {
    this.state.devPanel.isOpen = isOpen;
    this.emit('devPanel');
  }

  isDevPanelOpen() {
    return this.state.devPanel.isOpen;
  }

  getDevPanelInput() {
    return { ...this.state.devPanel.currentInput };
  }

  setDevPanelInput(field, value) {
    this.state.devPanel.currentInput[field] = value;
  }

  clearDevPanelInput() {
    this.state.devPanel.currentInput = {
      username: '',
      txUrl: '',
      amount: ''
    };
  }
}

// Singleton export
export const store = new Store();
export default store;
