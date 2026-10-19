// Demo catalogue for Inkseq TV. Curated, reviewed works only; no adult content.
// Text here is English; Chinese lives in data_zh.js under the same ids.

export const BRAND = 'inkseq tv';
export const PRICE = {ep: 40};          // coins per episode
export const FIRST_PACK_BONUS = 0.5;    // first coin pack: +50% of its base coins
export const WINBACK_WEEK = 4.99;       // lapsed members: first week back
export const CHECKIN_COINS = 10;

export const GENRES = [
  {id: 'romance', hue: 335},
  {id: 'anime', hue: 205},
  {id: 'literary', hue: 35},
  {id: 'scifi', hue: 185},
  {id: 'history', hue: 15},
  {id: 'mystery', hue: 270},
];
// Neighbouring genres used for the ~20% discovery share of the feed.
export const ADJACENT = {
  romance: ['history', 'literary'], anime: ['scifi', 'history'], literary: ['romance', 'history'],
  scifi: ['anime', 'mystery'], history: ['literary', 'romance'], mystery: ['scifi', 'literary'],
};
export const CHANNELS = ['tiktok', 'shorts', 'xhs', 'bilibili', 'seo', 'creator', 'direct'];

export const PACKS = [
  {id: 'p100', coins: 100, bonus: 0, usd: 4.99},
  {id: 'p300', coins: 300, bonus: 30, usd: 12.99},
  {id: 'p700', coins: 700, bonus: 100, usd: 24.99, hot: true},
  {id: 'p1500', coins: 1500, bonus: 300, usd: 49.99},
];
export const PLANS = [
  {id: 'week', usd: 9.99, days: 7},
  {id: 'month', usd: 29.99, days: 30, best: true},
];

export const CREATORS = {
  lumen: {name: 'Lumen Studio', hue: 330},
  mira: {name: 'Mira K.', hue: 20},
  yuki: {name: 'Yuki Lab', hue: 205},
  ironquill: {name: 'Iron Quill', hue: 40},
  northwind: {name: 'Northwind Pictures', hue: 190},
};

// rating: 'G' | 'PG' | 'PG-13' | '16+'. 16+ titles are hidden until the viewer confirms their age.
export const SERIES_EN = [
  {id: 'midnight', genre: 'romance', creator: 'lumen', eps: 24, free: 5, hue: [332, 262], rating: 'PG-13', heat: '1.28M', score: 9.1,
    title: 'The Midnight Contract', tags: ['Contract marriage', 'Slow burn'],
    logline: 'To save her father\'s gallery, Lena signs a one-year marriage contract with a cold-hearted investor. Rule one: no falling in love.',
    cast: [{name: 'Lena Lin', role: 'Gallery curator'}, {name: 'Julian Sloane', role: 'Investor'}],
    lines: ['Rule one. No falling in love.', 'What are you looking at?', 'Don\'t forget — this is a deal.', 'Then why haven\'t you left?', 'I never said I didn\'t care.', 'This time, I\'m not letting go.'],
    hooks: ['Someone changed the last page of the contract', 'Her ex shows up at the wedding', 'He says her name for the first time']},
  {id: 'rooftop', genre: 'romance', creator: 'mira', eps: 20, free: 5, hue: [196, 280], rating: 'PG-13', heat: '547K', score: 8.6,
    title: 'The Neighbor Upstairs', tags: ['City life', 'Healing'],
    logline: 'Fresh off a breakup, Ivy moves into a rooftop flat. Next door lives a man who only plays piano after midnight.',
    cast: [{name: 'Ivy Moore', role: 'Bartender'}, {name: 'Leo Grant', role: 'Composer'}],
    lines: ['You\'re playing that song again.', 'Did I keep you up?', 'It\'s windy on the roof.', 'You knew I was listening?', 'I\'m bad at goodbyes.', 'The next one\'s for you.'],
    hooks: ['The night the power went out', 'She finds her name in his sheet music', 'He\'s moving out']},
  {id: 'divorce', genre: 'romance', creator: 'lumen', eps: 30, free: 5, hue: [350, 300], rating: '16+', heat: '962K', score: 8.8,
    title: 'After the Divorce', tags: ['Second chance', 'Mature'],
    logline: 'Three years after he left her with nothing, Clara walks into his boardroom as the new majority investor.',
    cast: [{name: 'Clara Shen', role: 'Investor'}, {name: 'Adrian Cole', role: 'CEO'}],
    lines: ['Good morning, Mr. Cole.', 'You signed these papers yourself.', 'I\'m not here for you.', 'Then why are you shaking?', 'Some debts are paid in full.', 'Say it. Say you were wrong.'],
    hooks: ['The vote is tomorrow', 'His new fiancée knows who she is', 'A letter he never sent']},
  {id: 'courier', genre: 'anime', creator: 'yuki', eps: 16, free: 4, hue: [205, 160], rating: 'G', heat: '833K', score: 9.3,
    title: 'Starlight Courier', tags: ['Fantasy', 'Adventure'],
    logline: 'Among floating islands, a courier delivers the letters no one else can reach — until one is addressed to her.',
    cast: [{name: 'Suzu', role: 'Sky courier'}, {name: 'Kai', role: 'Lighthouse keeper'}],
    lines: ['Special delivery!', 'Hold on tight!', 'The wind is changing.', 'Who wrote this?', 'Some letters take years.', 'I\'ll find the sender.'],
    hooks: ['A letter with no return address', 'The lighthouse goes dark', 'The storm wall opens']},
  {id: 'neonrain', genre: 'anime', creator: 'yuki', eps: 18, free: 4, hue: [285, 190], rating: 'PG-13', heat: '612K', score: 8.9,
    title: 'Ronin of the Neon Rain', tags: ['Cyberpunk', 'Action'],
    logline: 'In a rain-soaked future Kyoto, a swordsman with a borrowed memory hunts the man who sold it.',
    cast: [{name: 'Ren', role: 'Ronin'}, {name: 'Aya', role: 'Data broker'}],
    lines: ['The rain never stops here.', 'Whose memory is this?', 'Draw.', 'You can\'t buy a past.', 'Then I\'ll take it back.', 'One more cut.'],
    hooks: ['The broker lied', 'His own face on a wanted poster', 'The tower at the end of the rain']},
  {id: 'thornfield', genre: 'literary', creator: 'ironquill', eps: 20, free: 5, hue: [35, 10], rating: 'PG', heat: '402K', score: 9.0,
    title: 'Thornfield', tags: ['Classic', 'Jane Eyre'],
    logline: 'Charlotte Brontë\'s Jane Eyre, retold in vertical episodes: a governess, a guarded master, and a secret in the attic.',
    cast: [{name: 'Jane Eyre', role: 'Governess'}, {name: 'Edward Rochester', role: 'Master of Thornfield'}],
    lines: ['I am no bird.', 'Do you think me handsome?', 'What was that sound?', 'I would always rather be happy than dignified.', 'Reader…', 'I have come home.'],
    hooks: ['Fire in the master\'s room', 'A stranger at the wedding', 'A voice across the moors']},
  {id: 'montecristo', genre: 'literary', creator: 'ironquill', eps: 24, free: 5, hue: [220, 40], rating: 'PG-13', heat: '688K', score: 9.2,
    title: 'The Count Returns', tags: ['Classic', 'Revenge'],
    logline: 'Dumas\'s The Count of Monte Cristo: betrayed and imprisoned for fourteen years, Edmond returns with a fortune and a plan.',
    cast: [{name: 'Edmond Dantès', role: 'The Count'}, {name: 'Mercédès', role: 'His lost love'}],
    lines: ['Wait and hope.', 'Fourteen years.', 'You don\'t remember me?', 'I am the Count of Monte Cristo.', 'Justice is patient.', 'All human wisdom…'],
    hooks: ['The treasure map', 'A familiar face at the ball', 'The prosecutor\'s secret']},
  {id: 'europa', genre: 'scifi', creator: 'northwind', eps: 16, free: 4, hue: [185, 230], rating: 'PG-13', heat: '520K', score: 8.7,
    title: 'Last Signal from Europa', tags: ['Space', 'Survival'],
    logline: 'Under the ice of Jupiter\'s moon, the last crew member hears a signal that shouldn\'t exist.',
    cast: [{name: 'Dr. Mara Okafor', role: 'Biologist'}, {name: 'HALCYON', role: 'Station AI'}],
    lines: ['Mission day 412.', 'Did you hear that?', 'It\'s repeating.', 'That\'s not our frequency.', 'Open the lower hatch.', 'We are not alone down here.'],
    hooks: ['The signal answers back', 'The AI hides a log', 'Something under the ice moves']},
  {id: 'orbit', genre: 'scifi', creator: 'mira', eps: 20, free: 5, hue: [170, 260], rating: 'PG', heat: '310K', score: 8.4,
    title: 'Orbit Nine', tags: ['Space station', 'Found family'],
    logline: 'Nine strangers keep a failing station in orbit for 90 days. Only eight are who they say they are.',
    cast: [{name: 'Commander Ruiz', role: 'Station chief'}, {name: 'Pell', role: 'Engineer'}],
    lines: ['Ninety days. That\'s all.', 'Who changed the oxygen schedule?', 'Earth is not answering.', 'Trust the checklist.', 'One of us is lying.', 'Look at the stars with me.'],
    hooks: ['A tenth heartbeat on the scanner', 'The supply ship is empty', 'The commander\'s real name']},
  {id: 'palace', genre: 'history', creator: 'mira', eps: 24, free: 5, hue: [40, 350], rating: 'PG-13', heat: '779K', score: 8.9,
    title: 'The Regent\'s Secret', tags: ['Court intrigue', 'Historical'],
    logline: 'Sent to spy on the Prince Regent, court lady Wen Ci gets closer with every test — until she loses her heart in the game.',
    cast: [{name: 'Wen Ci', role: 'Court lady'}, {name: 'Xiao Heng', role: 'Prince Regent'}],
    lines: ['Who sent you?', 'I only brought the tea.', 'Look at me.', 'No one in this palace is innocent.', 'Then do you trust me?', 'Take me away before dawn.'],
    hooks: ['The tea is poisoned', 'The secret letter is intercepted', 'Snow falls on the cold palace']},
  {id: 'moon', genre: 'history', creator: 'yuki', eps: 12, free: 3, hue: [210, 45], rating: 'PG', heat: '455K', score: 9.0,
    title: 'Chang\'e: The Moon Promise', tags: ['Mythology', 'Fantasy'],
    logline: 'The archer who shot down nine suns and the woman who drank the elixir — the old myth, told from her side.',
    cast: [{name: 'Chang\'e', role: 'Immortal of the moon'}, {name: 'Hou Yi', role: 'The archer'}],
    lines: ['Nine suns burned the earth.', 'There is only one elixir.', 'Don\'t look back.', 'The moon is cold, and far.', 'Every autumn, he waits.', 'Light the lanterns for me.'],
    hooks: ['A thief in the archer\'s house', 'The jade rabbit\'s warning', 'One night, once a year']},
  {id: 'seventh', genre: 'mystery', creator: 'northwind', eps: 16, free: 4, hue: [270, 0], rating: '16+', heat: '701K', score: 8.8,
    title: 'The Seventh Floor', tags: ['Horror', 'Apartment'],
    logline: 'The building has six floors. The elevator goes to seven.',
    cast: [{name: 'Noor', role: 'New tenant'}, {name: 'Mr. Hale', role: 'Building manager'}],
    lines: ['There is no seventh floor.', 'Then who keeps calling the elevator?', 'Don\'t answer the knock.', 'The lights flicker at 3:07.', 'It knows your name.', 'Get out before the doors close.'],
    hooks: ['A tenant list with her name on it', 'The manager\'s locked room', 'The doors open on seven']},
  {id: 'witness', genre: 'mystery', creator: 'ironquill', eps: 20, free: 5, hue: [250, 200], rating: 'PG-13', heat: '498K', score: 8.6,
    title: 'The Quiet Witness', tags: ['Detective', 'Whodunit'],
    logline: 'The only witness to a murder hasn\'t spoken in ten years. A rookie detective has three days to make her trust him.',
    cast: [{name: 'Det. Sam Ito', role: 'Rookie detective'}, {name: 'Iris', role: 'The witness'}],
    lines: ['She saw everything.', 'Draw it for me.', 'The clock was wrong.', 'Who has a key?', 'Everyone here is lying.', 'Now I know who it was.'],
    hooks: ['Her drawing shows a second person', 'The victim was alive at midnight', 'The detective\'s own alibi']},
];

export const EP_TITLES_EN = ['First Meeting', 'The Deal', 'Testing', 'Turning Point', 'Heartbeat', 'Misunderstanding', 'Showdown', 'Closer', 'Secrets', 'Crisis', 'Confession', 'The Choice'];
export const REPORT_REASONS_EN = ['Inappropriate for its rating', 'Copyright', 'Harmful or illegal', 'Wrong subtitles or broken video', 'Other'];

export function epLines(s, n, count = 6) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(s.lines[(n * 3 + i * 5) % s.lines.length]);
  return out;
}
export const epHook = (s, n) => s.hooks[n % s.hooks.length];
