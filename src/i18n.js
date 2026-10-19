import {SERIES_EN, EP_TITLES_EN, REPORT_REASONS_EN, CREATORS} from './data.js';
import {SERIES_ZH, EP_TITLES_ZH, REPORT_REASONS_ZH, CREATORS_ZH} from './data_zh.js';

export const LANGS = [{id: 'en', label: 'English'}, {id: 'zh', label: '中文'}];
export const defaultLang = () => ((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');

// key → [English, 中文]. Voice: a friend recommending a story. Story first, plain prices, no pressure.
const S = {
  // genres
  g_foryou: ['For you', '为你推荐'], g_romance: ['Romance', '情感短剧'], g_anime: ['Anime', '二次元动画'], g_literary: ['Classics', '文学改编'],
  g_scifi: ['Sci-fi', '科幻'], g_history: ['History & myth', '历史神话'], g_mystery: ['Mystery & horror', '悬疑恐怖'],
  gl_romance: ['Love stories that take their time.', '慢慢靠近的感情故事。'], gl_anime: ['Original animated worlds, a few minutes at a time.', '原创动画世界，一集几分钟。'],
  gl_literary: ['Great books, retold for your phone.', '经典名著，竖屏重述。'], gl_scifi: ['Space, signals and strange futures.', '太空、信号和奇异的未来。'],
  gl_history: ['Courts, legends and old myths.', '宫廷、传说和古老的神话。'], gl_mystery: ['Whodunits and things that go bump at 3am.', '推理谜案，以及凌晨三点的怪事。'],
  // nav
  tabHome: ['Home', '首页'], tabDiscover: ['Discover', '发现'], tabList: ['My list', '追剧'], tabMe: ['Me', '我的'],
  search: ['Search titles', '搜索剧名'], all: ['All', '全部'], noResult: ['Nothing found', '没有找到'],
  // home
  continueWatching: ['Continue watching', '继续观看'], pickedForYou: ['Picked for you', '为你挑选'], alsoLike: ['You might also like', '你可能也喜欢'],
  newIn: ['New in {g}', '{g} 新作'], moreLike: ['More like this', '同类推荐'],
  landingHi: ['{g} on Inkseq TV', 'Inkseq TV · {g}'], landingSub: ['Start any story — the first episodes need no sign-up.', '随便挑一个故事看看，前几集不用注册。'],
  hiddenMature: ['Rated 16+ and hidden: {n}', '已隐藏 {n} 部 16+ 作品'], showThem: ['Show', '显示'],
  watching: ['{n} watching', '{n} 在看'], eps: ['{n} eps', '共{n}集'], score: ['★ {n}', '{n}分'],
  watchFrom1: ['Watch from Ep 1', '从第1集看起'], continueEp: ['Continue Ep {n}', '继续看第{n}集'], details: ['Details', '详情'],
  epProgress: ['Ep {n} of {m}', '第{n}集 / 共{m}集'], previewTag: ['Trailer', '预告'],
  // series
  by: ['by {c}', '{c} 出品'], follow: ['Follow', '关注'], following: ['Following', '已关注'],
  followShow: ['Follow show', '追剧'], followingShow: ['Following', '已追'],
  freeNote: ['Episodes 1–{n} are free to watch. After that, {p} coins an episode.', '第1–{n}集可以直接看，之后每集 {p} 币。'],
  madeWith: ['Made with Inkseq · make your own story', '用 Inkseq 制作 · 你也可以做自己的故事'], madeWithToast: ['Opens inkseq.com (demo)', '打开 inkseq.com（演示）'],
  free: ['Free', '免费'], owned: ['Owned', '已解锁'], rating16: ['16+', '16+'],
  creatorWorks: ['Shows by {c}', '{c} 的作品'],
  // player
  episodes: ['Episodes', '选集'], share: ['Share', '分享'], report: ['Report', '举报'], shareCopied: ['Link copied', '链接已复制'],
  demoLen: ['{s}s / 14s (demo)', '{s}s / 14s（演示）'], nextUp: ['Next episode', '下一集'], playIn: ['Ep {n} in {s}s', '{s}s 后播放第{n}集'],
  unlockEp: ['Unlock Ep {n}', '解锁第{n}集'], replay: ['Replay', '重看'], theEnd: ['The end', '全剧终'], backToShow: ['Back to show', '返回剧集'],
  autoUnlocked: ['Ep {n} unlocked · -{p} coins', '已解锁第{n}集 · -{p} 币'],
  // onboarding
  obTitle: ['What do you like to watch?', '你喜欢看什么？'], obSub: ['Pick up to three. You can change this anytime in Me.', '最多选三个，之后可以在「我的」里修改。'],
  obGo: ['Start watching', '开始看'], obSkip: ['Skip', '跳过'],
  // account
  siTitle: ['Sign in', '登录'], siPurchase: ['Sign in first', '先登录一下'],
  siBody: ['One Inkseq account works for watching here and creating on inkseq.com.', '一个 Inkseq 账号，在这里看剧，也能去 inkseq.com 创作。'],
  siBodyPurchase: ['So what you buy stays yours on any phone or computer.', '这样你买的东西，换手机、换电脑都还在。'],
  siInkseq: ['Continue with your Inkseq account', '用 Inkseq 账号继续'], siGoogle: ['Continue with Google', '用 Google 继续'],
  emailPh: ['you@example.com', '你的邮箱'], sendLink: ['Email me a link', '发登录链接'], linkSent: ['Check {e} for your sign-in link.', '登录链接已发到 {e}。'], openLink: ['Open the link (demo)', '打开链接（演示）'],
  welcome: ['Welcome, {h}', '欢迎，{h}'], guest: ['Guest', '游客'], guestNote: ['Not signed in — your history stays on this device', '未登录 — 观看记录只保存在这台设备'],
  signedIn: ['Inkseq account', 'Inkseq 账号'], signInBtn: ['Sign in', '登录'], signOut: ['Sign out', '退出登录'],
  // follow / notify
  notifyTitle: ['Want a note when new episodes arrive?', '新集上线时提醒你？'],
  notifyBody: ['We\'ll only write when a show or creator you follow posts something new. Turn it off anytime.', '只在你关注的剧或创作者有更新时提醒，随时可以关掉。'],
  notifyEmail: ['By email', '邮件提醒'], notifyPush: ['Browser notification', '浏览器通知'], notifyNo: ['Not now', '暂时不用'],
  notifyOn: ['We\'ll let you know when there\'s something new', '有更新会告诉你'], notifications: ['New-episode notes', '更新提醒'],
  notifyEmailShort: ['Email', '邮件'], notifyPushShort: ['Browser', '浏览器'], off: ['Off', '关闭'],
  followedShows: ['Shows you follow', '追的剧'], followedCreators: ['Creators you follow', '关注的创作者'],
  noHistory: ['Nothing watched yet.', '还没有看过的剧。'], noFollows: ['Follow a show and it will appear here.', '追一部剧，它就会出现在这里。'],
  // 16+
  ageTitle: ['Show titles rated 16+?', '显示 16+ 作品？'],
  ageBody: ['Some horror and mature romance is rated 16+. Please confirm your year of birth.', '部分恐怖和成熟向的情感剧是 16+ 分级，请确认你的出生年份。'],
  ageYear: ['Year of birth', '出生年份'], ageConfirm: ['Confirm', '确认'], ageUnder: ['These titles stay hidden for now.', '这些作品会继续隐藏。'],
  ageOk: ['16+ titles are now shown', '已显示 16+ 作品'], showMature: ['Show 16+ titles', '显示 16+ 作品'],
  // money
  myCoins: ['TV coins', 'TV 币'], topUp: ['Get coins ›', '买币 ›'], membership: ['Membership', '会员'], none: ['None', '未开通'], join: ['See plans ›', '看看套餐 ›'],
  walletNote: ['TV coins are separate from your Inkseq creator credits.', 'TV 币和 Inkseq 创作额度是分开的。'],
  thisEp: ['This episode', '本集'], coins: ['{n} coins', '{n} 币'], balance: ['Balance {n} coins', '余额 {n} 币'],
  unlock: ['Unlock this episode', '解锁这一集'], getCoins: ['Get coins', '买币'], autoNextCheck: ['Unlock the next episodes automatically', '以后自动解锁下一集'],
  orJoin: ['If you watch a lot, a membership covers every episode', '如果看得多，会员可以看所有剧集'], unlockedToast: ['Ep {n} unlocked', '已解锁第{n}集'],
  topUpTitle: ['Get coins', '买币'], coinsTab: ['Coins', '币'], memberTab: ['Membership', '会员'],
  coinsInfo: ['Balance {n} coins · {p} coins per episode', '余额 {n} 币 · 每集 {p} 币'], hotPack: ['Most chosen', '选的人最多'], bonus: ['+{n} extra', '多送 {n}'],
  firstPack: ['Your first pack comes with 50% extra coins', '第一次购买多送 50% 的币'], firstLine: ['+{n} extra on your first pack', '第一次多送 {n}'],
  weekly: ['Weekly', '周卡'], monthly: ['Monthly', '月卡'], planNote: ['Every episode for {d} days', '{d} 天内所有剧集都能看'], perDay: ['Lower price per day', '每天更便宜'],
  winbackTag: ['Welcome back', '欢迎回来'],
  pay: ['Pay {x}', '支付 {x}'], payCard: ['Card, Apple Pay or Google Pay', '银行卡、Apple Pay 或 Google Pay'], payBy: ['Secure checkout by Stripe', '由 Stripe 安全处理'],
  renewNote: ['Renews at {p} every {d} days until you cancel — one tap in Me › Membership.', '每 {d} 天自动续费 {p}，直到你取消（在「我的 › 会员」一键取消）。'],
  noCN: ['Purchases aren\'t available in mainland China yet. Free episodes are.', '暂不支持中国大陆地区购买，免费剧集可以正常观看。'],
  hosted: ['Stripe Checkout (demo)', 'Stripe 支付页（演示）'], item: ['Item', '商品'], amount: ['Amount', '金额'],
  hostedNote: ['In production you\'d pay on Stripe\'s page; card numbers never touch our servers.', '正式版在 Stripe 的页面付款，卡号不经过我们的服务器。'],
  simPay: ['Simulate payment', '模拟支付'], simDecline: ['Simulate decline', '模拟被拒'],
  declined: ['Your bank declined the payment. You can try another card.', '银行拒绝了这笔付款，可以换一张卡试试。'], paidOk: ['Paid', '支付成功'],
  topUpOk: ['+{n} coins', '+{n} 币'], memberOk: ['{x} is active', '{x}已开通'], otherMethod: ['Back', '返回'],
  // membership
  msTitle: ['Your membership', '我的会员'], msPlan: ['Plan', '套餐'], msRenews: ['Renews', '续费日'], msEnds: ['Ends', '到期日'], msAuto: ['Auto-renew', '自动续费'],
  msAutoNote: ['We\'ll charge {p} on {d} and email you 3 days before. Cancel anytime.', '{d} 将扣款 {p}，扣款前 3 天邮件提醒。随时可以取消。'],
  msCancel: ['Cancel auto-renew', '取消自动续费'], msCancelQ: ['Cancel auto-renew?', '确定取消自动续费？'],
  msCancelBody: ['You keep every episode until {d}. You won\'t be charged again.', '在 {d} 之前所有剧集照常观看，之后不会再扣款。'],
  msKeep: ['Keep it', '保留'], msConfirmCancel: ['Yes, cancel', '确定取消'], msCanceled: ['Auto-renew is off. Access until {d}.', '已取消自动续费，{d} 前可以继续看。'],
  msLapsed: ['Your membership ended on {d}', '你的会员已于 {d} 到期'], msWinback: ['Good to see you again. Your first week back is {p}.', '好久不见。回来的第一周 {p}。'],
  msNone: ['Members watch every episode on Inkseq TV.', '会员可以看 Inkseq TV 上的所有剧集。'],
  renewDemo: ['Demo: jump to renewal date', '演示：跳到续费日'], renewedToast: ['Renewed — charged {p}', '已续费，扣款 {p}'], lapsedToast: ['Membership ended', '会员已到期'],
  // check-in
  checkinTitle: ['A few coins for today', '今天的小礼物'], checkinBtn: ['Take {n} coins', '收下 {n} 币'], checkinDone: ['See you tomorrow', '明天见'],
  // me
  interests: ['Your interests', '你的兴趣'], edit: ['Edit', '修改'], autoNext: ['Auto-unlock next episode', '自动解锁下一集'], language: ['Language', '语言'],
  orders: ['Purchases', '消费记录'], help: ['Help', '帮助'], legal: ['Terms & privacy', '条款与隐私'], deleteAcc: ['Delete account', '删除账号'],
  count: ['{n}', '{n} 条'], noRecords: ['Nothing yet', '还没有记录'],
  deleteBody: ['This deletes your Inkseq account, watch history, coins and membership — on Inkseq TV and inkseq.com. It can\'t be undone.', '将删除你的 Inkseq 账号、观看记录、币和会员（Inkseq TV 和 inkseq.com 都会删除），无法撤销。'],
  deleteConfirm: ['Delete', '删除'], cancel: ['Cancel', '取消'], deleted: ['Account deleted', '账号已删除'],
  // report / help / legal
  reportTitle: ['Report this episode', '举报这一集'], notePh: ['Anything else? (optional)', '补充说明（可选）'], send: ['Send', '发送'],
  reportToast: ['Thanks — we\'ll look at it within 48 hours', '谢谢，我们会在 48 小时内处理'],
  faq: [[
    ['What shows on my card statement?', '"INKSEQ TV". If you don\'t recognise a charge, write to us first — we refund faster than a bank dispute.'],
    ['How do I cancel?', 'Me › Membership › Cancel auto-renew. One tap. You keep access until the end of the paid period.'],
    ['Can I get a refund?', 'Unused coin packs within 14 days and memberships cancelled within 48 hours of the first charge are refunded in full.'],
    ['Can I buy from mainland China?', 'Not yet — our payment provider doesn\'t support it. Free episodes work everywhere we operate.'],
    ['Who makes these shows?', 'Creators using Inkseq. Every show is reviewed by our team before it appears here.'],
  ], [
    ['银行卡账单上显示什么？', '显示「INKSEQ TV」。看到不认识的扣款，请先联系我们，比找银行退款更快。'],
    ['怎么取消会员？', '我的 › 会员 › 取消自动续费，一键完成。已付费的时间内可以继续看。'],
    ['可以退款吗？', '14 天内没用过的币、首次扣款后 48 小时内取消的会员，都可以全额退款。'],
    ['中国大陆可以购买吗？', '暂时不行，我们的支付服务商还不支持。免费剧集可以正常观看。'],
    ['这些剧是谁做的？', '用 Inkseq 创作的创作者。每部剧上线前都经过我们团队审核。'],
  ]],
  contact: ['Write to us', '联系我们'], contactPh: ['How can we help? (order number helps)', '有什么可以帮你？（附上订单号更快）'], ticketToast: ['Sent — we\'ll reply by email', '已发送，我们会邮件回复'],
  legalBody: ['Inkseq TV is operated by [[Inkseq TV Pty Ltd]], a subsidiary of [[Inkseq Pty Ltd]]. Terms, privacy, content ratings and the copyright (DMCA) notice will be published here before launch.', 'Inkseq TV 由 [[Inkseq TV Pty Ltd]] 运营（[[Inkseq Pty Ltd]] 的子公司）。服务条款、隐私政策、内容分级说明和版权（DMCA）声明会在上线前发布在这里。'],
  // demo
  demoTools: ['Demo tools', '演示工具'], addCoins: ['+200 coins', '+200 币'], analytics: ['Analytics', '数据'], resetAll: ['Reset', '重置'], resetDone: ['Reset', '已重置'],
  phonePreview: ['Phone preview', '手机预览'], toDesk: ['Switch to website', '切换到网页版'],
  // analytics
  anTitle: ['Genre × channel', '题材 × 渠道'], anSample: ['Load sample data', '载入示例数据'], anClear: ['Clear', '清空'],
  anNote: ['Sample data is synthetic, for layout only. This device\'s own visits are included.', '示例数据是模拟的，只用来看版式；这台设备自己的访问也计算在内。'],
  anGenre: ['By genre', '按题材'], anChannel: ['By channel', '按渠道'], anMatrix: ['Paying rate, genre × channel', '付费率：题材 × 渠道'],
  anVisitors: ['Visitors', '访客'], anSignup: ['Sign-up', '注册率'], anPay: ['Paying', '付费率'], anD1: ['D1', '次日留存'], anD7: ['D7', '7日留存'],
  anEps: ['Eps/session', '每次集数'], anDone: ['Completion', '完播率'], anFollow: ['Follow', '关注率'],
  // notes
  notesTitle: ['Inkseq TV · demo', 'Inkseq TV · 演示'],
  notesIntro: ['The viewing site for stories made with Inkseq. Visuals are placeholders.', '观看用 Inkseq 制作的故事的网站。画面都是占位。'],
  notesTry: ['Things to try', '可以试试'],
  notesList: [[
    'Open /romance or /anime?ref=tiktok — a genre landing page; the genre sticks on your next visit',
    'First visit: pick 1–3 interests (entry genre preselected)',
    'Continue watching sits on top; episodes end with next-episode countdown and similar picks',
    'Follow a show or creator → opt-in new-episode notes',
    'Me › Show 16+ titles → year-of-birth check',
    'Me › Demo tools › Analytics → genre × channel funnel (load sample data)',
    'Open /s/seventh to land on a show page (one URL per show for SEO)',
  ], [
    '打开 /romance 或 /anime?ref=tiktok：题材落地页；下次来还停在这个题材',
    '第一次访问：选 1–3 个兴趣（默认选中入口题材）',
    '「继续观看」在最上面；每集结束有下一集倒计时和同类推荐',
    '关注剧集或创作者 → 自愿开启更新提醒',
    '我的 › 显示 16+ 作品 → 确认出生年份',
    '我的 › 演示工具 › 数据 → 题材 × 渠道漏斗（可载入示例数据）',
    '打开 /s/seventh 直接进入剧集页（每部剧一个网址，便于 SEO）',
  ]],
};

export function makeT(lang) {
  const i = lang === 'zh' ? 1 : 0;
  return (key, vars) => {
    const e = S[key];
    if (!e) return key;
    let v = e[i];
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
    return v;
  };
}

const cache = {};
export function catalogue(lang) {
  if (cache[lang]) return cache[lang];
  const zh = lang === 'zh';
  const list = zh ? SERIES_EN.map((s) => ({...s, ...SERIES_ZH[s.id]})) : SERIES_EN;
  const titles = zh ? EP_TITLES_ZH : EP_TITLES_EN;
  return (cache[lang] = {
    list,
    byId: Object.fromEntries(list.map((s) => [s.id, s])),
    creatorName: (id) => (zh ? CREATORS_ZH[id] : CREATORS[id].name),
    epTitle: (s, n) => (zh ? `第${n}集 · ` : `Ep ${n} · `) + titles[(n + s.id.length) % titles.length],
    reasons: zh ? REPORT_REASONS_ZH : REPORT_REASONS_EN,
  });
}
