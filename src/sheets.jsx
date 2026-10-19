import React, {useEffect, useState} from 'react';
import {Bell, Check, ChevronDown, ChevronLeft, Coins, CreditCard, Crown, Lock, Mail, ShieldCheck, Sparkles, Trash2, Wallet, X} from 'lucide-react';
import {CHANNELS, CREATORS, FIRST_PACK_BONUS, GENRES, PACKS, PLANS, PRICE, epHook} from './data.js';
import {useStore, firstPack, planPrice, preferred, subActive, subLapsed, visible} from './store.jsx';
import {Brand, EpisodeGrid, fmtDate, useFollow} from './screens.jsx';
import {Avatar, Poster} from './media.jsx';

const later = (fn) => fn && setTimeout(fn, 30); // let the reducer commit before a follow-up gate check
const money = (n) => `$${Number(n).toFixed(2)}`;

export function SheetHost() {
  const {ui} = useStore();
  const sh = ui.sheet;
  if (!sh) return null;
  const Comp = {onboard: Onboard, signin: SignIn, age: AgeCheck, notify: Notify, creator: Creator, unlock: Unlock, wallet: WalletSheet,
    pay: Pay, membership: Membership, eps: Eps, report: Report, help: Help, legal: Legal, deleteAccount: DeleteAccount,
    orders: Orders, analytics: Analytics}[sh.type];
  const blocking = sh.type === 'onboard' && sh.first;
  return (
    <div className="sheet-wrap" onClick={blocking ? undefined : ui.close}>
      <div className={`sheet sheet-${sh.type}`} onClick={(e) => e.stopPropagation()}>
        {!blocking && <button className="sheet-x" onClick={ui.close}><X size={18} /></button>}
        <Comp {...sh} />
      </div>
    </div>
  );
}

// ── Onboarding: 1–3 interests, entry genre preselected ──
function Onboard({first}) {
  const {st, dispatch, ui, t} = useStore();
  const [pick, setPick] = useState(preferred(st));
  const toggle = (g) => setPick((p) => (p.includes(g) ? p.filter((x) => x !== g) : p.length < 3 ? [...p, g] : p));
  const done = (genres) => {
    if (genres.length) { dispatch({type: 'genres', genres}); if (!st.entry || !ui.tab) ui.setTab(genres[0]); } else dispatch({type: 'onboarded'});
    ui.close();
  };
  return (
    <div className="sheet-body">
      {first && <Brand />}
      <h3>{t('obTitle')}</h3>
      <p className="muted">{t('obSub')}</p>
      <div className="genre-pick">
        {GENRES.map((g) => (
          <button key={g.id} className={pick.includes(g.id) ? 'on' : ''} style={{'--h': g.hue}} onClick={() => toggle(g.id)}>
            <b>{t('g_' + g.id)}</b><span>{t('gl_' + g.id)}</span>{pick.includes(g.id) && <Check size={16} className="ck" />}
          </button>
        ))}
      </div>
      <button className="btn-primary block" disabled={!pick.length} onClick={() => done(pick)}>{t('obGo')}</button>
      <button className="btn-text block" onClick={() => done([])}>{t('obSkip')}</button>
    </div>
  );
}

// ── Sign in: one Inkseq account for watching and creating ──
function SignIn({reason, then}) {
  const {dispatch, ui, t} = useStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const done = (method, handle) => { dispatch({type: 'signin', method, handle}); ui.close(); ui.toast(t('welcome', {h: handle})); later(then); };
  if (sent) return (
    <div className="sheet-body center">
      <div className="sheet-icon"><Mail size={26} /></div>
      <h3>{t('linkSent', {e: email})}</h3>
      <button className="btn-primary block" onClick={() => done('email', email)}>{t('openLink')}</button>
    </div>
  );
  return (
    <div className="sheet-body">
      <h3>{reason === 'purchase' ? t('siPurchase') : t('siTitle')}</h3>
      <p className="muted">{reason === 'purchase' ? t('siBodyPurchase') : t('siBody')}</p>
      <button className="opt rec" onClick={() => done('inkseq', 'reader@inkseq.com')}><span className="ink-logo">i</span><div><b>{t('siInkseq')}</b></div></button>
      <button className="opt" onClick={() => done('google', 'reader4821@gmail.com')}><span className="g-logo">G</span><div><b>{t('siGoogle')}</b></div></button>
      <div className="email-row">
        <input type="email" placeholder={t('emailPh')} value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-ghost" disabled={!/.+@.+\..+/.test(email)} onClick={() => setSent(true)}>{t('sendLink')}</button>
      </div>
      {reason === 'purchase' && <p className="fine">{t('siBody')}</p>}
    </div>
  );
}

// ── 16+: year-of-birth confirmation, hidden by default ──
function AgeCheck({then}) {
  const {dispatch, ui, t} = useStore();
  const [year, setYear] = useState('');
  const y = Number(year);
  const ok = y > 1900 && y <= new Date().getFullYear();
  const confirm = () => {
    if (new Date().getFullYear() - y >= 16) { dispatch({type: 'mature', on: true}); ui.close(); ui.toast(t('ageOk')); later(then); }
    else { dispatch({type: 'mature', on: false}); ui.close(); ui.toast(t('ageUnder')); }
  };
  return (
    <div className="sheet-body">
      <div className="sheet-icon"><ShieldCheck size={26} /></div>
      <h3>{t('ageTitle')}</h3>
      <p className="muted">{t('ageBody')}</p>
      <input className="year-input" inputMode="numeric" placeholder={t('ageYear')} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))} />
      <button className="btn-primary block" disabled={!ok} onClick={confirm}>{t('ageConfirm')}</button>
    </div>
  );
}

// ── New-episode notes: asked once on first follow, opt-in ──
function Notify() {
  const {st, dispatch, ui, t} = useStore();
  const set = (channel) => { dispatch({type: 'notify', channel}); ui.close(); if (channel) ui.toast(t('notifyOn')); };
  return (
    <div className="sheet-body">
      <div className="sheet-icon"><Bell size={24} /></div>
      <h3>{t('notifyTitle')}</h3>
      <p className="muted">{t('notifyBody')}</p>
      <button className={`opt ${st.notify === 'email' ? 'rec' : ''}`} onClick={() => set('email')}><Mail size={20} /><div><b>{t('notifyEmail')}</b></div></button>
      <button className={`opt ${st.notify === 'push' ? 'rec' : ''}`} onClick={() => set('push')}><Bell size={20} /><div><b>{t('notifyPush')}</b></div></button>
      <button className="btn-text block" onClick={() => set(null)}>{t('notifyNo')}</button>
    </div>
  );
}

function Creator({cid}) {
  const {st, ui, t, C} = useStore();
  const follow = useFollow();
  const works = C.list.filter((s) => s.creator === cid && visible(st, s));
  const on = st.followsCreators.includes(cid);
  return (
    <div className="sheet-body">
      <div className="creator-head"><Avatar name={C.creatorName(cid)} hue={CREATORS[cid].hue} size={52} /><div className="grow"><h3>{C.creatorName(cid)}</h3></div>
        <button className={`btn-ghost sm ${on ? 'on' : ''}`} onClick={() => follow.creator(cid)}>{on ? t('following') : t('follow')}</button></div>
      <div className="sub">{t('creatorWorks', {c: C.creatorName(cid)})}</div>
      <div className="creator-works">{works.map((s) => <div key={s.id} onClick={() => { ui.close(); ui.push({type: 'series', sid: s.id}); }}><Poster s={s} size="sm" /><span>{s.title}</span></div>)}</div>
    </div>
  );
}

function PlanRow({onPick}) {
  const {st, t} = useStore();
  return (
    <div className="plans">
      {PLANS.map((p) => {
        const price = planPrice(st, p), deal = price !== p.usd;
        return (
          <button key={p.id} className={`plan ${p.best || deal ? 'best' : ''}`} onClick={() => onPick(p)}>
            {(deal || p.best) && <em>{deal ? t('winbackTag') : t('perDay')}</em>}<Crown size={16} /><b>{t(p.id === 'week' ? 'weekly' : 'monthly')}</b>
            <span className="usd">{money(price)}{deal && <s>{money(p.usd)}</s>}</span><span className="muted">{t('planNote', {d: p.days})}</span>
          </button>
        );
      })}
    </div>
  );
}
const packOrder = (p) => ({id: 'o' + Date.now(), kind: 'pack', base: p.coins, coins: p.coins + p.bonus, usd: p.usd});
const planOrder = (p, st) => ({id: 'o' + Date.now(), kind: 'plan', plan: p.id, days: p.days, usd: planPrice(st, p)});

// ── Unlock: shown on the cliffhanger ──
function Unlock({sid, ep, then}) {
  const {st, dispatch, ui, t, C, needAccount} = useStore();
  const s = C.byId[sid];
  const enough = st.coins >= PRICE.ep;
  const reopen = () => ui.open({type: 'unlock', sid, ep, then});
  return (
    <div className="sheet-body">
      <div className="unlock-head"><Lock size={18} /><div><b>{s.title} · {C.epTitle(s, ep)}</b><span>“{epHook(s, ep)}”</span></div></div>
      <div className="price-row"><span>{t('thisEp')}</span><b><Coins size={16} />{t('coins', {n: PRICE.ep})}</b><span className="muted">{t('balance', {n: st.coins})}</span></div>
      {enough
        ? <button className="btn-primary block" onClick={() => { dispatch({type: 'unlock', sid, ep}); ui.close(); ui.toast(t('unlockedToast', {n: ep})); later(then); }}>{t('unlock')}</button>
        : <button className="btn-primary block" onClick={() => ui.open({type: 'wallet', then: reopen})}>{t('getCoins')}</button>}
      <label className="check"><input type="checkbox" checked={st.autoUnlock} onChange={(e) => dispatch({type: 'auto', on: e.target.checked})} />{t('autoNextCheck')}</label>
      <div className="or">{t('orJoin')}</div>
      <PlanRow onPick={(p) => needAccount(() => ui.open({type: 'pay', order: planOrder(p, st), then: () => later(then)}))} />
    </div>
  );
}

function WalletSheet({tab: t0 = 'coins', then}) {
  const {st, ui, t, needAccount} = useStore();
  const [tab, setTab] = useState(t0);
  const first = firstPack(st);
  const pay = (order) => needAccount(() => ui.open({type: 'pay', order, then}));
  return (
    <div className="sheet-body">
      <h3><Wallet size={18} />{t('topUpTitle')}</h3>
      <div className="seg small"><button className={tab === 'coins' ? 'on' : ''} onClick={() => setTab('coins')}>{t('coinsTab')}</button><button className={tab === 'plans' ? 'on' : ''} onClick={() => setTab('plans')}>{t('memberTab')}</button></div>
      {tab === 'coins' ? <>
        <div className="muted small-gap">{t('coinsInfo', {n: st.coins, p: PRICE.ep})}</div>
        {first && <div className="first-banner">{t('firstPack')}</div>}
        <div className="packs">
          {PACKS.map((p) => (
            <button key={p.id} className={`pack ${p.hot ? 'hot' : ''}`} onClick={() => pay(packOrder(p))}>
              {p.hot && <em>{t('hotPack')}</em>}<b><Coins size={16} />{p.coins}</b>
              {p.bonus > 0 && <span className="bonus">{t('bonus', {n: p.bonus})}</span>}
              {first && <span className="bonus first">{t('firstLine', {n: Math.round(p.coins * FIRST_PACK_BONUS)})}</span>}
              <span className="usd">{money(p.usd)}</span>
            </button>
          ))}
        </div>
      </> : <><div className="muted small-gap">{t('msNone')}</div><PlanRow onPick={(p) => pay(planOrder(p, st))} /></>}
      <p className="fine">{t('walletNote')} {t('noCN')}</p>
    </div>
  );
}

// ── Checkout: Stripe-hosted page (Inkseq TV's own Stripe account) ──
function Pay({order, then}) {
  const {st, dispatch, ui, t} = useStore();
  const [state, setState] = useState('ready');
  const title = order.kind === 'pack' ? t('coins', {n: order.coins}) : t(order.plan === 'week' ? 'weekly' : 'monthly');
  useEffect(() => { if (state === 'processing') { const x = setTimeout(() => setState('ok'), 1400); return () => clearTimeout(x); } }, [state]);
  useEffect(() => {
    if (state !== 'ok') return;
    const x = setTimeout(() => {
      const bonus = order.kind === 'pack' && firstPack(st) ? Math.round(order.base * FIRST_PACK_BONUS) : 0;
      dispatch({type: 'paid', order});
      ui.close();
      ui.toast(order.kind === 'pack' ? t('topUpOk', {n: order.coins + bonus}) : t('memberOk', {x: title}));
      later(then);
    }, 600);
    return () => clearTimeout(x);
  }, [state]);
  return (
    <div className="sheet-body">
      <h3>{t('pay', {x: title})}</h3>
      <div className="amount">{money(order.usd)} <span>USD</span></div>
      {order.kind === 'plan' && <p className="renew-note">{t('renewNote', {p: money(order.usd), d: order.days})}</p>}
      <div className="hosted">
        <div className="hosted-h"><Lock size={14} />{t('hosted')}</div>
        <div className="hosted-row"><span>{t('item')}</span><b>{title}</b></div>
        <div className="hosted-row"><span>{t('amount')}</span><b>{money(order.usd)}</b></div>
        <div className="hosted-row"><span><CreditCard size={13} /> {t('payCard')}</span><b>{t('payBy')}</b></div>
        <div className="hosted-note">{t('hostedNote')}</div>
        {state === 'declined' && <div className="err">{t('declined')}</div>}
        {state === 'processing' && <div className="spinner sm" />}
        {state === 'ok' && <div className="okmsg"><Check size={16} />{t('paidOk')}</div>}
      </div>
      <div className="row-btns">
        <button className="btn-primary" disabled={state === 'processing' || state === 'ok'} onClick={() => setState('processing')}>{t('simPay')}</button>
        <button className="btn-ghost" onClick={() => setState('declined')}>{t('simDecline')}</button>
      </div>
      <p className="fine">{t('noCN')}</p>
    </div>
  );
}

function Membership() {
  const {st, dispatch, ui, t, needAccount} = useStore();
  const [confirm, setConfirm] = useState(false);
  const sub = st.sub;
  const end = sub && fmtDate(sub.until, st.lang);
  const buy = (p) => needAccount(() => ui.open({type: 'pay', order: planOrder(p, st), then: () => ui.open({type: 'membership'})}));
  if (confirm) return (
    <div className="sheet-body">
      <h3>{t('msCancelQ')}</h3>
      <p className="muted">{t('msCancelBody', {d: end})}</p>
      <div className="row-btns">
        <button className="btn-primary" onClick={() => setConfirm(false)}>{t('msKeep')}</button>
        <button className="btn-ghost" onClick={() => { dispatch({type: 'autoRenew', on: false}); setConfirm(false); ui.toast(t('msCanceled', {d: end})); }}>{t('msConfirmCancel')}</button>
      </div>
    </div>
  );
  return (
    <div className="sheet-body">
      <h3><Crown size={18} />{t('msTitle')}</h3>
      {subActive(st) ? <>
        <div className="kv"><span>{t('msPlan')}</span><b>{t(sub.plan === 'week' ? 'weekly' : 'monthly')} · {money(sub.usd)}</b></div>
        <div className="kv"><span>{sub.autoRenew ? t('msRenews') : t('msEnds')}</span><b>{end}</b></div>
        <label className="list-row bare"><span>{t('msAuto')}</span><input type="checkbox" className="switch" checked={sub.autoRenew} onChange={(e) => (e.target.checked ? dispatch({type: 'autoRenew', on: true}) : setConfirm(true))} /></label>
        <p className="fine">{sub.autoRenew ? t('msAutoNote', {p: money(sub.usd), d: end}) : t('msCanceled', {d: end})}</p>
        {sub.autoRenew && <button className="btn-ghost block" onClick={() => setConfirm(true)}>{t('msCancel')}</button>}
      </> : <>
        {subLapsed(st) ? <div className="winback"><b>{t('msLapsed', {d: end})}</b><span>{t('msWinback', {p: money(planPrice(st, PLANS[0]))})}</span></div> : <p className="muted">{t('msNone')}</p>}
        <PlanRow onPick={buy} />
      </>}
      <p className="fine">{t('noCN')}</p>
    </div>
  );
}

function Eps({sid, ep, onPick}) {
  const {t, C} = useStore();
  const s = C.byId[sid];
  return (
    <div className="sheet-body">
      <h3>{s.title}</h3>
      <div className="muted small-gap">{t('freeNote', {n: s.free, p: PRICE.ep})}</div>
      <EpisodeGrid s={s} current={ep} onPick={onPick} />
    </div>
  );
}

function Report({sid, ep}) {
  const {dispatch, ui, t, C} = useStore();
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState('');
  return (
    <div className="sheet-body">
      <h3>{t('reportTitle')}</h3>
      <div className="muted small-gap">{C.byId[sid].title} · {C.epTitle(C.byId[sid], ep)}</div>
      <div className="reasons">{C.reasons.map((r, i) => <button key={r} className={reason === i ? 'on' : ''} onClick={() => setReason(i)}>{r}</button>)}</div>
      <textarea placeholder={t('notePh')} value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="btn-primary block" disabled={reason == null} onClick={() => { dispatch({type: 'report', report: {sid, ep, reason, note}}); ui.close(); ui.toast(t('reportToast')); }}>{t('send')}</button>
    </div>
  );
}

function Help() {
  const {dispatch, ui, t} = useStore();
  const [open, setOpen] = useState(0);
  const [msg, setMsg] = useState('');
  return (
    <div className="sheet-body">
      <h3>{t('help')}</h3>
      <div className="faq">
        {t('faq').map(([q, a], i) => (
          <div key={q} className={`faq-item ${open === i ? 'open' : ''}`}>
            <button onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><ChevronDown size={16} /></button>
            {open === i && <p>{a}</p>}
          </div>
        ))}
      </div>
      <h3 className="mt">{t('contact')}</h3>
      <textarea placeholder={t('contactPh')} value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button className="btn-primary block" disabled={msg.trim().length < 3} onClick={() => { dispatch({type: 'ticket', ticket: {msg}}); setMsg(''); ui.toast(t('ticketToast')); }}>{t('send')}</button>
    </div>
  );
}

function Legal() {
  const {t} = useStore();
  const html = t('legalBody').replace(/\[\[(.+?)\]\]/g, '<mark>$1</mark>');
  return <div className="sheet-body"><h3>{t('legal')}</h3><p className="muted" dangerouslySetInnerHTML={{__html: html}} /></div>;
}

function DeleteAccount() {
  const {dispatch, ui, t} = useStore();
  return (
    <div className="sheet-body">
      <div className="sheet-icon warn"><Trash2 size={24} /></div>
      <h3>{t('deleteAcc')}</h3>
      <p className="muted">{t('deleteBody')}</p>
      <div className="row-btns">
        <button className="btn-ghost" onClick={ui.close}>{t('cancel')}</button>
        <button className="btn-danger" onClick={() => { dispatch({type: 'signout'}); ui.close(); ui.home(); ui.toast(t('deleted')); }}>{t('deleteConfirm')}</button>
      </div>
    </div>
  );
}

function Orders() {
  const {st, t, C} = useStore();
  return (
    <div className="sheet-body">
      <h3>{t('orders')}</h3>
      {!st.orders.length && <div className="empty">{t('noRecords')}</div>}
      {st.orders.map((o) => (
        <div className="kv" key={o.id}>
          <span>{fmtDate(o.at, st.lang)}</span>
          <b>{o.kind === 'unlock' ? `${C.byId[o.sid].title} · ${C.epTitle(C.byId[o.sid], o.ep)} · ${t('coins', {n: o.coins})}`
            : o.kind === 'pack' ? `${t('coins', {n: o.coins + (o.firstBonus || 0)})} · ${money(o.usd)}`
              : `${t(o.plan === 'week' ? 'weekly' : 'monthly')} · ${money(o.usd)}`}</b>
        </div>
      ))}
    </div>
  );
}

// ── Analytics: visitors → sign-ups → payers by genre × channel, plus retention and engagement ──
function makeSample() {
  // Synthetic visitors so the layout can be judged; numbers are invented.
  const gW = {romance: 1.4, anime: 1.2, literary: .6, scifi: .8, history: .7, mystery: .9};
  const cW = {tiktok: 1.6, shorts: 1.2, xhs: .9, bilibili: .8, seo: .7, creator: .5, direct: .4};
  const payG = {romance: .06, anime: .035, literary: .04, scifi: .03, history: .045, mystery: .04};
  const payC = {tiktok: .7, shorts: .8, xhs: 1.1, bilibili: .9, seo: 1.4, creator: 1.6, direct: 1.2};
  const out = [];
  let seed = 7;
  const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (const g of Object.keys(gW)) for (const c of Object.keys(cW)) {
    const n = Math.round(60 * gW[g] * cW[c]);
    for (let i = 0; i < n; i++) {
      const signed = r() < .18 * payC[c];
      out.push({g, c, signed, paid: signed && r() < payG[g] * payC[c] * 4.5, d1: r() < .32 * (g === 'anime' ? 1.2 : 1), d7: r() < .12 * (g === 'romance' ? 1.3 : 1),
        eps: 1 + Math.floor(r() * (g === 'romance' ? 7 : 5)), done: .55 + r() * .35, fol: r() < .09 * payC[c]});
    }
  }
  return out;
}

function Analytics() {
  const {st, dispatch, t} = useStore();
  const own = (() => {
    const plays = st.events.filter((e) => e.name === 'play_start').length;
    if (!st.events.some((e) => e.name === 'landing')) return [];
    const done = st.events.filter((e) => e.name === 'play_complete').length;
    return [{g: st.entry?.genre || preferred(st)[0] || 'romance', c: st.entry?.ref && CHANNELS.includes(st.entry.ref) ? st.entry.ref : 'direct', signed: !!st.account,
      paid: st.orders.some((o) => o.usd), d1: false, d7: false, eps: plays, done: plays ? done / plays : 0, fol: st.followsSeries.length + st.followsCreators.length > 0}];
  })();
  const rows = [...(st.sample || []), ...own];
  const pct = (a, b) => (b ? `${Math.round((a / b) * 1000) / 10}%` : '—');
  const agg = (f) => {
    const v = rows.filter(f);
    return {n: v.length, s: v.filter((x) => x.signed).length, p: v.filter((x) => x.paid).length, d1: v.filter((x) => x.d1).length, d7: v.filter((x) => x.d7).length,
      eps: v.reduce((a, x) => a + x.eps, 0), done: v.reduce((a, x) => a + x.done, 0), fol: v.filter((x) => x.fol).length};
  };
  const maxPay = Math.max(.001, ...GENRES.flatMap((g) => CHANNELS.map((c) => { const a = agg((x) => x.g === g.id && x.c === c); return a.n ? a.p / a.n : 0; })));
  return (
    <div className="sheet-body analytics">
      <h3>{t('anTitle')}</h3>
      <div className="row-btns">
        <button className="btn-ghost" onClick={() => dispatch({type: 'sample', sample: makeSample()})}>{t('anSample')}</button>
        <button className="btn-ghost" onClick={() => dispatch({type: 'clearAnalytics'})}>{t('anClear')}</button>
      </div>
      <p className="fine">{t('anNote')}</p>
      <div className="sub mt">{t('anGenre')}</div>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th /><th>{t('anVisitors')}</th><th>{t('anSignup')}</th><th>{t('anPay')}</th><th>{t('anD1')}</th><th>{t('anD7')}</th><th>{t('anEps')}</th><th>{t('anDone')}</th><th>{t('anFollow')}</th></tr></thead>
        <tbody>{GENRES.map((g) => { const a = agg((x) => x.g === g.id); return (
          <tr key={g.id}><td>{t('g_' + g.id)}</td><td>{a.n}</td><td>{pct(a.s, a.n)}</td><td>{pct(a.p, a.n)}</td><td>{pct(a.d1, a.n)}</td><td>{pct(a.d7, a.n)}</td>
            <td>{a.n ? (a.eps / a.n).toFixed(1) : '—'}</td><td>{a.n ? `${Math.round((a.done / a.n) * 100)}%` : '—'}</td><td>{pct(a.fol, a.n)}</td></tr>); })}</tbody>
      </table></div>
      <div className="sub mt">{t('anChannel')}</div>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th /><th>{t('anVisitors')}</th><th>{t('anSignup')}</th><th>{t('anPay')}</th></tr></thead>
        <tbody>{CHANNELS.map((c) => { const a = agg((x) => x.c === c); return <tr key={c}><td>{c}</td><td>{a.n}</td><td>{pct(a.s, a.n)}</td><td>{pct(a.p, a.n)}</td></tr>; })}</tbody>
      </table></div>
      <div className="sub mt">{t('anMatrix')}</div>
      <div className="tbl-wrap"><table className="tbl heat">
        <thead><tr><th />{CHANNELS.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{GENRES.map((g) => (
          <tr key={g.id}><td>{t('g_' + g.id)}</td>{CHANNELS.map((c) => { const a = agg((x) => x.g === g.id && x.c === c); const v = a.n ? a.p / a.n : 0;
            return <td key={c} style={{background: `rgba(255,77,125,${(v / maxPay) * .55})`}}>{a.n ? pct(a.p, a.n) : '—'}</td>; })}</tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}


