/**
 * MOSSAD AI AGENT - Web Server
 * Express + WebSocket server for browser-based terminal UI
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import store from './state/store.js';
import { getRandomAmbientMessage } from './data/ambientMessages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(join(__dirname, '../public')));
app.use(express.json());

// API Routes
app.get('/api/stats', (req, res) => {
  res.json(store.getStats());
});

app.get('/api/missions', (req, res) => {
  res.json(store.getMissions());
});

app.get('/api/leaderboard', (req, res) => {
  res.json(store.getLeaderboard(10));
});

app.get('/api/payouts', (req, res) => {
  res.json(store.getPayouts(20));
});

app.post('/api/payout', (req, res) => {
  const { username, txUrl, amount } = req.body;
  if (!username || !txUrl || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const payout = store.addPayout({
    username: username.startsWith('@') ? username : `@${username}`,
    txUrl,
    amount: parseFloat(amount).toFixed(2)
  });
  broadcast({ type: 'payout', data: payout });
  res.json(payout);
});

app.post('/api/stats', (req, res) => {
  const { agents, payouts, nodes, solDistributed } = req.body;
  const stats = store.getStats();

  if (agents !== undefined) stats.activeAgents = parseInt(agents);
  if (payouts !== undefined) stats.totalPayouts = parseInt(payouts);
  if (nodes !== undefined) stats.networkNodes = parseInt(nodes);
  if (solDistributed !== undefined) stats.totalSolDistributed = parseFloat(solDistributed);

  // Update store stats
  Object.assign(store.state.stats, stats);

  broadcast({ type: 'stats', data: stats });
  res.json(stats);
});

// WebSocket connections
const clients = new Set();

function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`Client connected. Total: ${clients.size}`);

  // Send initial state
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      stats: store.getStats(),
      missions: store.getMissions(),
      leaderboard: store.getLeaderboard(10),
      payouts: store.getPayouts(10)
    }
  }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total: ${clients.size}`);
  });

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      handleClientMessage(ws, msg);
    } catch (e) {
      console.error('Invalid message:', e);
    }
  });
});

function handleClientMessage(ws, msg) {
  switch (msg.type) {
    case 'payout':
      const payout = store.addPayout(msg.data);
      broadcast({ type: 'payout', data: payout });
      break;

    case 'updateStats':
      Object.assign(store.state.stats, msg.data);
      broadcast({ type: 'stats', data: store.getStats() });
      break;

    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
  }
}

// Ambient message broadcaster
let ambientInterval;
function startAmbientBroadcast() {
  const sendAmbient = () => {
    const message = getRandomAmbientMessage();
    broadcast({
      type: 'ambient',
      data: {
        message,
        timestamp: new Date().toISOString()
      }
    });

    // Random delay between 1.5-4 seconds
    const delay = 1500 + Math.random() * 2500;
    ambientInterval = setTimeout(sendAmbient, delay);
  };
  sendAmbient();
}

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ✡  MOSSAD AI AGENT SERVER  ✡                         ║
║                                                           ║
║     Server running at: http://localhost:${PORT}             ║
║     WebSocket ready for connections                       ║
║                                                           ║
║     Press CTRL+C to stop                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  startAmbientBroadcast();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  clearTimeout(ambientInterval);
  wss.close();
  server.close();
  process.exit(0);
});
