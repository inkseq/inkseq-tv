import React, {createContext, useCallback, useContext, useEffect, useReducer, useRef, useState} from 'react';
import {ADJACENT, CHECKIN_COINS, FIRST_PACK_BONUS, PRICE, SERIES_EN, WINBACK_WEEK} from './data.js';
import {catalogue, defaultLang, makeT} from './i18n.js';

const KEY = 'inkseq-tv-v1';
const DAY = 86400000;
const today = () => new Date().toDateString();
const META = Object.fromEntries(SERIES_EN.map((s) => [s.id, s]));

// What a viewer accumulates. In production: server-side per Inkseq account (anonymous id + cookie before sign-in).
const initial = {
  lang: defaultLang(),
  entry: null,          // {genre, ref, at}: first genre landing / deep link. Later visits open on this genre.
  genres: [],           // onboarding interests (1–3)
  onboarded: false,
  account: null,        // shared Inkseq account
  showMature: false,    // 16+ titles hidden until the viewer confirms their age
  coins: 0, sub: null, unlocked: {}, autoUnlock: false,
  progress: {}, followsSeries: [], followsCreators: [], notify: null, notifyAsked: false,
  orders: [], reports: [], tickets: [], checkin: null, events: [], sample: null,
};

function load() {
  try { return {...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}')}; } catch { return initial; }
}

const epKey = (sid, ep) => `${sid}:${ep}`;
export const subActive = (st) => !!st.sub && st.sub.until > Date.now();
export const subLapsed = (st) => !!st.sub && st.sub.until <= Date.now();
export const firstPack = (st) => !st.orders.some((o) => o.kind === 'pack');
export const planPrice = (st, p) => (subLapsed(st) && p.id === 'week' ? WINBACK_WEEK : p.usd);
export const canCheckin = (st) => st.checkin !== today();
export const isUnlocked = (st, sid, ep) => subActive(st) || !!st.unlocked[epKey(sid, ep)];
export const visible = (st, s) => s.rating !== '16+' || st.showMature;
export const preferred = (st) => (st.genres.length ? st.genres : st.entry ? [st.entry.genre] : []);

// What stands between the viewer and an episode: null when it can play.
export function blocker(st, sid, ep) {
  const s = META[sid];
  if (s.rating === '16+' && !st.showMature) return 'age';
  if (ep <= s.free) return null;
  if (isUnlocked(st, sid, ep)) return null;
  return 'unlock';
}

// Feed: ~80% preferred genres, ~20% adjacent ones; within each, best-rated first, unwatched before watched.
export function rankFor(st, list) {
  const pref = preferred(st);
  const shown = list.filter((s) => visible(st, s));
  if (!pref.length) return [...shown].sort((a, b) => b.score - a.score);
  const adj = new Set(pref.flatMap((g) => ADJACENT[g]).filter((g) => !pref.includes(g)));
  const order = (a, b) => (!!st.progress[a.id] - !!st.progress[b.id]) || b.score - a.score;
  const p = shown.filter((s) => pref.includes(s.genre)).sort(order);
  const a = shown.filter((s) => adj.has(s.genre)).sort(order);
  const rest = shown.filter((s) => !pref.includes(s.genre) && !adj.has(s.genre)).sort(order);
  const out = [];
  while (p.length || a.length) {
    out.push(...p.splice(0, 4));
    if (a.length) out.push(a.shift());
  }
  return [...out, ...rest];
}

function reduce(st, a) {
  const now = Date.now();
  const ev = (name, props) => [{name, props: props || {}, ref: st.entry?.ref || 'direct', at: now}, ...st.events].slice(0, 3000);
  switch (a.type) {
    case 'entry': return st.entry && !a.force ? st : {...st, entry: {genre: a.genre, ref: a.ref || 'direct', at: now}};
    case 'genres': return {...st, genres: a.genres.slice(0, 3), onboarded: true, events: ev('onboard', {genres: a.genres})};
    case 'onboarded': return {...st, onboarded: true};
    case 'track': return {...st, events: ev(a.name, a.props)};
    case 'signin': return {...st, account: {method: a.method, handle: a.handle, at: now}, events: ev('signup', {method: a.method})};
    case 'signout': return {...initial, lang: st.lang, entry: st.entry, onboarded: true};
    case 'mature': return {...st, showMature: a.on};
    case 'lang': return {...st, lang: a.lang};
    case 'progress': return {...st, progress: {...st.progress, [a.sid]: {ep: a.ep, at: now}}};
    case 'followSeries': {
      const on = !st.followsSeries.includes(a.sid);
      return {...st, followsSeries: on ? [a.sid, ...st.followsSeries] : st.followsSeries.filter((x) => x !== a.sid), events: on ? ev('follow', {kind: 'series', sid: a.sid}) : st.events};
    }
    case 'followCreator': {
      const on = !st.followsCreators.includes(a.cid);
      return {...st, followsCreators: on ? [a.cid, ...st.followsCreators] : st.followsCreators.filter((x) => x !== a.cid), events: on ? ev('follow', {kind: 'creator', cid: a.cid}) : st.events};
    }
    case 'notify': return {...st, notify: a.channel, notifyAsked: true};
    case 'unlock': {
      if (st.coins < PRICE.ep) return st;
      return {...st, coins: st.coins - PRICE.ep, unlocked: {...st.unlocked, [epKey(a.sid, a.ep)]: true},
        orders: [{id: 'u' + now, kind: 'unlock', sid: a.sid, ep: a.ep, coins: -PRICE.ep, at: now}, ...st.orders]};
    }
    case 'paid': {
      const o = {...a.order, at: now};
      const events = ev('purchase', {kind: o.kind, usd: o.usd});
      if (o.kind === 'pack') {
        if (firstPack(st)) o.firstBonus = Math.round(o.base * FIRST_PACK_BONUS);
        return {...st, coins: st.coins + o.coins + (o.firstBonus || 0), orders: [o, ...st.orders], events};
      }
      const base = subActive(st) ? st.sub.until : now;
      return {...st, sub: {plan: o.plan, until: base + o.days * DAY, autoRenew: true, usd: o.usd}, orders: [o, ...st.orders], events};
    }
    case 'autoRenew': return st.sub ? {...st, sub: {...st.sub, autoRenew: a.on}} : st;
    case 'renewTick': {
      if (!st.sub) return st;
      if (st.sub.autoRenew) {
        const days = st.sub.plan === 'week' ? 7 : 30;
        return {...st, sub: {...st.sub, until: now + days * DAY},
          orders: [{id: 'r' + now, kind: 'plan', plan: st.sub.plan, days, usd: st.sub.usd, renewal: true, at: now}, ...st.orders]};
      }
      return {...st, sub: {...st.sub, until: now - 1000}};
    }
    case 'auto': return {...st, autoUnlock: a.on};
    case 'checkin': return canCheckin(st) ? {...st, checkin: today(), coins: st.coins + CHECKIN_COINS} : st;
    case 'report': return {...st, reports: [{id: 'r' + now, ...a.report, at: now}, ...st.reports]};
    case 'ticket': return {...st, tickets: [{id: 't' + now, ...a.ticket, at: now}, ...st.tickets]};
    case 'grant': return {...st, coins: st.coins + a.coins};
    case 'sample': return {...st, sample: a.sample};
    case 'clearAnalytics': return {...st, sample: null, events: []};
    case 'reset': return {...initial, lang: st.lang};
    default: return st;
  }
}

const Ctx = createContext(null);

export function StoreProvider({children}) {
  const [st, dispatch] = useReducer(reduce, undefined, load);
  const ref = useRef(st);
  ref.current = st;
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* private mode */ } }, [st]);

  const [stack, setStack] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState(null); // home genre tab; null → entry genre or "for you"
  useEffect(() => { if (!toast) return; const x = setTimeout(() => setToast(null), 2400); return () => clearTimeout(x); }, [toast]);

  const ui = {
    stack, tab, setTab,
    push: (v) => setStack((s) => [...s, v]),
    pop: () => setStack((s) => s.slice(0, -1)),
    replaceTop: (v) => setStack((s) => [...s.slice(0, -1), v]),
    home: () => setStack([]),
    sheet, open: setSheet, close: () => setSheet(null),
    toast: (m) => setToast({m, k: Date.now()}), toastState: toast,
  };

  const track = useCallback((name, props) => dispatch({type: 'track', name, props}), []);

  // Gate an episode: 16+ confirmation, then coins/membership. Reads the latest state.
  const attempt = useCallback((sid, ep, go) => {
    const cur = ref.current;
    const b = blocker(cur, sid, ep);
    if (!b) { go(); return; }
    if (b === 'age') { setSheet({type: 'age', then: () => attempt(sid, ep, go)}); return; }
    if (cur.autoUnlock && cur.coins >= PRICE.ep) {
      dispatch({type: 'unlock', sid, ep});
      setToast({m: makeT(cur.lang)('autoUnlocked', {n: ep, p: PRICE.ep}), k: Date.now()});
      go();
      return;
    }
    dispatch({type: 'track', name: 'paywall_view', props: {sid, ep, genre: META[sid].genre}});
    setSheet({type: 'unlock', sid, ep, then: () => attempt(sid, ep, go)});
  }, []);

  // Purchases need an account so they survive a new device.
  const needAccount = useCallback((then) => {
    if (ref.current.account) { then(); return; }
    setSheet({type: 'signin', reason: 'purchase', then});
  }, []);

  // First follow asks once whether the viewer wants new-episode notes (opt-in).
  const askNotify = useCallback(() => {
    if (!ref.current.notifyAsked) setTimeout(() => setSheet({type: 'notify'}), 250);
  }, []);

  const t = makeT(st.lang);
  const C = catalogue(st.lang);
  useEffect(() => { document.documentElement.lang = st.lang === 'zh' ? 'zh-CN' : 'en'; }, [st.lang]);
  return <Ctx.Provider value={{st, dispatch, ui, attempt, needAccount, askNotify, track, t, C}}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
