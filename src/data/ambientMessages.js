/**
 * Ambient Message Generator
 * Creates the "alive" feeling with continuous fictional intel chatter
 * Now with extra spicy humor
 */

const NETWORK_CHATTER = [
  'Scanning network nodes... ${nodes} active connections',
  'Signal strength: OPTIMAL',
  'Decrypting incoming transmission...',
  'New agent registered: NODE-${rand}',
  'Hash verification complete: 0x${hex}',
  'Syncing leaderboard data...',
  'Mission pool updated: ${num} active bounties',
  'Engagement metrics processing...',
  'Blockchain confirmation: Block #${block}',
  'Agent @${user} has entered the network',
  'Proof-of-post validation queued...',
  'Community score recalculating...',
  'New submission detected: MSN-${mission}',
  'Reward pool balance: ${sol} SOL',
  'Network latency: ${ms}ms',
  'Intel packet received: ${bytes} bytes',
  'Consensus achieved: ${nodes} nodes agree',
  'Mempool status: ${pending} pending',
  'Cross-referencing social signals...',
  'Viral coefficient calculated: ${coef}x',
];

const MISSION_UPDATES = [
  '▸ MISSION UPDATE: "${title}" - ${subs}/${max} submissions',
  '▸ NEW BOUNTY ALERT: ${reward} SOL available',
  '▸ MISSION COMPLETE: "${title}" rewards distributed',
  '▸ HIGH PRIORITY: "${title}" needs agents',
  '▸ CREATOR BOOST: +${bonus} SOL added to "${title}"',
  '▸ DEADLINE WARNING: "${title}" closes in ${hours}h',
];

const PAYOUT_NOTIFICATIONS = [
  '◆ TRANSFER COMPLETE: ${amount} SOL → @${user}',
  '◆ REWARD CLAIMED: @${user} scored ${points} pts',
  '◆ BONUS UNLOCKED: @${user} hit ${streak} streak',
];

const SYSTEM_MESSAGES = [
  '[ SYSTEM ] Heartbeat: All systems nominal',
  '[ SYSTEM ] Cache refreshed: ${entries} entries',
  '[ SYSTEM ] API rate limit: ${remaining}/${total}',
  '[ SYSTEM ] Queue depth: ${depth} items',
  '[ SYSTEM ] Memory usage: ${mem}MB',
];

// The spicy humor messages
const GOY_CHATTER = [
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
  '▸ ALERT: Local goy discovered his bank charges fees... shocked',
  '▸ UPDATE: Goyim still paying full price... oy vey',
  '▸ REPORT: Goy asked rabbi for stock tips, got life advice instead',
  '▸ NOTICE: Another goy learned "HODL" isn\'t a typo',
  '▸ INTEL: Goyim discovered our space lasers are just good accountants',
  '▸ STATUS: Goy bought Tesla at the top, says "Elon tweeted"',
  '▸ ALERT: Local goy doesn\'t understand why gold costs money',
  '▸ UPDATE: Goyim still using checks in 2024... adorable',
];

const AGENT_CODENAMES = [
  'shadow_walker', 'crypto_sage', 'meme_architect', 'signal_hunter',
  'alpha_seeker', 'viral_agent', 'thread_weaver', 'engagement_ops',
  'data_phantom', 'network_ghost', 'boost_master', 'trend_scout',
  'intel_broker', 'reach_maximizer', 'content_asset', 'social_cipher',
  'bagel_baron', 'shekel_savant', 'latke_lord', 'matzo_master'
];

const MISSION_TITLES = [
  'VIRAL SIGNAL BOOST', 'MEME WARFARE OPS', 'DEEP THREAD INTEL',
  'COMMUNITY RALLY', 'ALPHA LEAK DROP', 'ENGAGEMENT STORM',
  'TREND HIJACK', 'SENTIMENT SHIFT', 'REACH EXPANSION',
  'NARRATIVE CONTROL', 'HYPE INJECTION', 'CONTENT BLITZ',
  'BAGEL DISTRIBUTION', 'SHEKEL ACCUMULATION', 'CHUTZPAH DEPLOYMENT'
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex(length = 8) {
  return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolate(template) {
  return template
    .replace(/\$\{rand\}/g, randomInt(1000, 9999))
    .replace(/\$\{hex\}/g, randomHex(12))
    .replace(/\$\{block\}/g, randomInt(18000000, 19000000))
    .replace(/\$\{user\}/g, randomChoice(AGENT_CODENAMES))
    .replace(/\$\{mission\}/g, randomInt(100, 999))
    .replace(/\$\{sol\}/g, (randomInt(100, 500) / 10).toFixed(1))
    .replace(/\$\{ms\}/g, randomInt(12, 89))
    .replace(/\$\{bytes\}/g, randomInt(256, 4096))
    .replace(/\$\{nodes\}/g, randomInt(30, 47))
    .replace(/\$\{pending\}/g, randomInt(5, 25))
    .replace(/\$\{coef\}/g, (randomInt(10, 35) / 10).toFixed(1))
    .replace(/\$\{title\}/g, randomChoice(MISSION_TITLES))
    .replace(/\$\{subs\}/g, randomInt(5, 45))
    .replace(/\$\{max\}/g, randomInt(50, 100))
    .replace(/\$\{reward\}/g, (randomInt(10, 100) / 10).toFixed(1))
    .replace(/\$\{bonus\}/g, (randomInt(5, 30) / 10).toFixed(1))
    .replace(/\$\{hours\}/g, randomInt(2, 48))
    .replace(/\$\{amount\}/g, (randomInt(10, 150) / 10).toFixed(2))
    .replace(/\$\{points\}/g, randomInt(100, 1500))
    .replace(/\$\{streak\}/g, randomInt(3, 15))
    .replace(/\$\{entries\}/g, randomInt(500, 2000))
    .replace(/\$\{remaining\}/g, randomInt(800, 950))
    .replace(/\$\{total\}/g, 1000)
    .replace(/\$\{depth\}/g, randomInt(0, 12))
    .replace(/\$\{num\}/g, randomInt(15, 35))
    .replace(/\$\{mem\}/g, randomInt(128, 512));
}

export function getRandomAmbientMessage() {
  const roll = Math.random();

  let pool;
  if (roll < 0.30) {
    pool = GOY_CHATTER; // 30% chance for the funny stuff
  } else if (roll < 0.55) {
    pool = NETWORK_CHATTER;
  } else if (roll < 0.75) {
    pool = MISSION_UPDATES;
  } else if (roll < 0.90) {
    pool = PAYOUT_NOTIFICATIONS;
  } else {
    pool = SYSTEM_MESSAGES;
  }

  return interpolate(randomChoice(pool));
}

export function getGoyMessage() {
  return randomChoice(GOY_CHATTER);
}

export function getMissionUpdate() {
  return interpolate(randomChoice(MISSION_UPDATES));
}

export function getNetworkChatter() {
  return interpolate(randomChoice(NETWORK_CHATTER));
}

export function getPayoutNotification() {
  return interpolate(randomChoice(PAYOUT_NOTIFICATIONS));
}

export function getSystemMessage() {
  return interpolate(randomChoice(SYSTEM_MESSAGES));
}

export { AGENT_CODENAMES, MISSION_TITLES, GOY_CHATTER };
