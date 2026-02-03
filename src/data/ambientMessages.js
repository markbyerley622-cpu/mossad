/**
 * Ambient Message Generator
 * Hype messages to get agents posting on X
 */

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
  '▸ SIGNAL: The early bird gets the impressions. Post at peak hours.',
  '▸ ORDERS: Be fruitful and multiply... your post count.',
  '▸ DISPATCH: From the river to the sea, your posts will be seen by me.',
];

const GOY_OBSERVATIONS = [
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

const NETWORK_STATUS = [
  '[ SYSTEM ] Network sync: ${nodes} nodes online',
  '[ SYSTEM ] Agent heartbeat: ${agents} active operatives',
  '[ SYSTEM ] Queue processing: ${depth} tasks pending',
  '[ SYSTEM ] Memory allocation: ${mem}MB in use',
  '[ SYSTEM ] API status: ${remaining}/${total} requests available',
  '[ SYSTEM ] Latency check: ${ms}ms response time',
  '[ SYSTEM ] Hash verification: 0x${hex}',
  '[ SYSTEM ] Block height: #${block}',
  '[ SYSTEM ] Mempool status: ${pending} pending',
  '[ SYSTEM ] Cache hit rate: ${rate}%',
];

const MISSION_CHATTER = [
  '▸ MISSION: "${title}" needs more agents. ${subs}/${max} submissions.',
  '▸ BOUNTY: ${reward} SOL waiting for the next viral post.',
  '▸ TASK: Create content for "${title}" - difficulty: ${diff}',
  '▸ OBJECTIVE: Boost engagement on "${title}" mission.',
  '▸ TARGET: ${max} submissions needed. Currently at ${subs}. Step up.',
];

const AGENT_CODENAMES = [
  'shadow_walker', 'crypto_sage', 'meme_architect', 'signal_hunter',
  'alpha_seeker', 'viral_agent', 'thread_weaver', 'engagement_ops',
  'data_phantom', 'network_ghost', 'boost_master', 'trend_scout',
  'intel_broker', 'reach_maximizer', 'content_asset', 'social_cipher',
  'bagel_baron', 'shekel_savant', 'latke_lord', 'matzo_master',
  'zion_poster', 'based_rabbi', 'kosher_king', 'chosen_chad'
];

const MISSION_TITLES = [
  'VIRAL SIGNAL BOOST', 'MEME WARFARE OPS', 'DEEP THREAD INTEL',
  'COMMUNITY RALLY', 'ALPHA LEAK DROP', 'ENGAGEMENT STORM',
  'TREND HIJACK', 'SENTIMENT SHIFT', 'REACH EXPANSION',
  'NARRATIVE CONTROL', 'HYPE INJECTION', 'CONTENT BLITZ',
  'BAGEL DISTRIBUTION', 'SHEKEL ACCUMULATION', 'CHUTZPAH DEPLOYMENT',
  'TIMELINE TAKEOVER', 'RATIO MISSION', 'QUOTE TWEET RAID'
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
    .replace(/\$\{agents\}/g, randomInt(800, 950))
    .replace(/\$\{pending\}/g, randomInt(5, 25))
    .replace(/\$\{coef\}/g, (randomInt(10, 35) / 10).toFixed(1))
    .replace(/\$\{title\}/g, randomChoice(MISSION_TITLES))
    .replace(/\$\{subs\}/g, randomInt(5, 45))
    .replace(/\$\{max\}/g, randomInt(50, 100))
    .replace(/\$\{reward\}/g, (randomInt(10, 100) / 10).toFixed(1))
    .replace(/\$\{diff\}/g, randomChoice(['EASY', 'MEDIUM', 'HARD']))
    .replace(/\$\{remaining\}/g, randomInt(800, 950))
    .replace(/\$\{total\}/g, 1000)
    .replace(/\$\{depth\}/g, randomInt(0, 12))
    .replace(/\$\{num\}/g, randomInt(15, 35))
    .replace(/\$\{mem\}/g, randomInt(128, 512))
    .replace(/\$\{rate\}/g, randomInt(85, 99));
}

export function getRandomAmbientMessage() {
  const roll = Math.random();

  let pool;
  if (roll < 0.40) {
    pool = HYPE_MESSAGES; // 40% hype to post
  } else if (roll < 0.65) {
    pool = GOY_OBSERVATIONS; // 25% goy humor
  } else if (roll < 0.85) {
    pool = MISSION_CHATTER; // 20% mission stuff
  } else {
    pool = NETWORK_STATUS; // 15% system
  }

  return interpolate(randomChoice(pool));
}

export function getHypeMessage() {
  return randomChoice(HYPE_MESSAGES);
}

export function getGoyMessage() {
  return interpolate(randomChoice(GOY_OBSERVATIONS));
}

export function getMissionUpdate() {
  return interpolate(randomChoice(MISSION_CHATTER));
}

export function getSystemMessage() {
  return interpolate(randomChoice(NETWORK_STATUS));
}

export { AGENT_CODENAMES, MISSION_TITLES, HYPE_MESSAGES, GOY_OBSERVATIONS };
