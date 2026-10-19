import React, {useEffect, useRef, useState} from 'react';
import {Bell, ChevronLeft, ChevronRight, Coins, Crown, ExternalLink, Flame, Gift, Globe, Heart, LifeBuoy, Lock, Play, Search, Share2, ShieldCheck, Sparkles, Tags, Trash2, UserRound} from 'lucide-react';
import {BRAND, CHECKIN_COINS, CREATORS, GENRES, PRICE, WINBACK_WEEK, epLines} from './data.js';
import {LANGS} from './i18n.js';
import {useStore, blocker, canCheckin, isUnlocked, preferred, rankFor, subActive, subLapsed, visible} from './store.jsx';
import {Avatar, FakeVideo, Poster, Rating} from './media.jsx';

export const fmtDate = (t, lang) => new Date(t).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-AU', {month: 'short', day: 'numeric'});
export const Brand = () => <span className="brand">{BRAND}<i>.</i></span>;

export function LangSwitch({compact}) {
  const {st, dispatch} = useStore();
  const next = st.lang === 'zh' ? 'en' : 'zh';
  return (
    <button className={`lang-btn ${compact ? 'compact' : ''}`} onClick={() => dispatch({type: 'lang', lang: next})}>
      <Globe size={15} />{compact ? (st.lang === 'zh' ? '中' : 'EN') : LANGS.find((l) => l.id === st.lang).label}
    </button>
  );
}

// Follow a show; the first follow asks once about new-episode notes.
export function useFollow() {
  const {st, dispatch, askNotify} = useStore();
  return {
    series: (sid) => { const on = !st.followsSeries.includes(sid); dispatch({type: 'followSeries', sid}); if (on) askNotify(); },
    creator: (cid) => { const on = !st.followsCreators.includes(cid); dispatch({type: 'followCreator', cid}); if (on) askNotify(); },
  };
}

export function usePlay() {
  const {st, ui, attempt} = useStore();
  return (sid, ep) => {
    const n = ep || st.progress[sid]?.ep || 1;
    attempt(sid, n, () => ui.push({type: 'player', sid, ep: n}));
  };
}

// ── Cards and rows ──
export function Card({s, wide}) {
  const {st, ui, t} = useStore();
  const p = st.progress[s.id];
  return (
    <div className={`card ${wide ? 'wide' : ''}`} onClick={() => ui.push({type: 'series', sid: s.id})}>
      <Poster s={s} />
      <div className="t">{s.title}</div>
      <div className="sub">{p ? t('epProgress', {n: p.ep, m: s.eps}) : `${t('g_' + s.genre)} · ${t('score', {n: s.score})}`}</div>
      {p && <div className="bar"><i style={{width: `${(p.ep / s.eps) * 100}%`}} /></div>}
    </div>
  );
}

export function Row({title, list}) {
  if (!list.length) return null;
  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-list">{list.map((s) => <Card key={s.id} s={s} />)}</div>
    </section>
  );
}

export function useContinue() {
  const {st, C} = useStore();
  return Object.entries(st.progress).sort((a, b) => b[1].at - a[1].at).map(([sid]) => C.byId[sid]).filter((s) => s && visible(st, s));
}

export function GenreTabs() {
  const {st, ui, t} = useStore();
  const pref = preferred(st);
  const order = [...pref, ...GENRES.map((g) => g.id).filter((g) => !pref.includes(g))];
  const cur = ui.tab || 'foryou';
  return (
    <div className="gtabs">
      {['foryou', ...order].map((g) => (
        <button key={g} className={cur === g ? 'on' : ''} onClick={() => ui.setTab(g)}>{t('g_' + g)}</button>
      ))}
    </div>
  );
}

// ── Home: "For you" or one genre. Entry genre opens by default. ──
export function Home() {
  const {st, ui, t, C} = useStore();
  const cont = useContinue();
  const play = usePlay();
  const tab = ui.tab || 'foryou';
  const hidden = C.list.filter((s) => s.rating === '16+' && !st.showMature);
  const hiddenHere = tab === 'foryou' ? hidden : hidden.filter((s) => s.genre === tab);
  const mature = hiddenHere.length > 0 && <div className="hidden-note"><Lock size={13} />{t('hiddenMature', {n: hiddenHere.length})} · <button onClick={() => ui.open({type: 'age'})}>{t('showThem')}</button></div>;

  if (tab === 'foryou') {
    const ranked = rankFor(st, C.list);
    const pref = preferred(st);
    return (
      <div className="home">
        <Row title={t('continueWatching')} list={cont} />
        <Row title={t('pickedForYou')} list={ranked.slice(0, 8)} />
        {pref.map((g) => <Row key={g} title={t('g_' + g)} list={C.list.filter((s) => s.genre === g && visible(st, s))} />)}
        <Row title={t('alsoLike')} list={ranked.slice(8)} />
        {mature}
      </div>
    );
  }
  const g = GENRES.find((x) => x.id === tab);
  const list = C.list.filter((s) => s.genre === tab && visible(st, s)).sort((a, b) => b.score - a.score);
  const hero = list[0];
  const landing = st.entry?.genre === tab && !Object.keys(st.progress).length;
  const adjacent = rankFor({...st, genres: [tab]}, C.list).filter((s) => s.genre !== tab).slice(0, 6);
  return (
    <div className="home">
      {landing && <div className="landing" style={{'--h': g.hue}}><b>{t('landingHi', {g: t('g_' + tab)})}</b><span>{t('gl_' + tab)} {t('landingSub')}</span></div>}
      <Row title={t('continueWatching')} list={cont.filter((s) => s.genre === tab)} />
      {hero && (
        <div className="hero" onClick={() => ui.push({type: 'series', sid: hero.id})}>
          <Poster s={hero} size="lg" />
          <div className="hero-meta">
            <div className="sub hot"><Flame size={13} />{t('watching', {n: hero.heat})} · {t('score', {n: hero.score})}</div>
            <h1>{hero.title}</h1>
            <p>{hero.logline}</p>
            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); play(hero.id); }}><Play size={16} fill="currentColor" />{st.progress[hero.id] ? t('continueEp', {n: st.progress[hero.id].ep}) : t('watchFrom1')}</button>
          </div>
        </div>
      )}
      <div className="grid">{list.slice(1).map((s) => <Card key={s.id} s={s} />)}</div>
      {mature}
      <Row title={t('alsoLike')} list={adjacent} />
    </div>
  );
}

// ── Discover: vertical trailer feed, ranked for this viewer ──
export function Discover() {
  const {st, ui, t, C} = useStore();
  const follow = useFollow();
  const play = usePlay();
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);
  const box = useRef(null);
  const list = rankFor(st, C.list);
  useEffect(() => { const x = setInterval(() => setTick((v) => v + 1), 2600); return () => clearInterval(x); }, []);
  return (
    <div className="feed" ref={box} onScroll={() => setActive(Math.round(box.current.scrollTop / box.current.clientHeight))}>
      {list.map((s, i) => (
        <section className="feed-item" key={s.id}>
          <FakeVideo s={s} playing={i === active} line={i === active ? epLines(s, 1, 6)[tick % 6] : null}>
            <span className="chip-preview">{t('previewTag')} · {t('g_' + s.genre)}</span>
          </FakeVideo>
          <div className="feed-rail">
            <button className={st.followsSeries.includes(s.id) ? 'on' : ''} onClick={() => follow.series(s.id)}><Heart size={26} fill={st.followsSeries.includes(s.id) ? 'currentColor' : 'none'} /><span>{st.followsSeries.includes(s.id) ? t('followingShow') : t('followShow')}</span></button>
            <button onClick={() => ui.toast(t('shareCopied'))}><Share2 size={24} /><span>{t('share')}</span></button>
          </div>
          <div className="feed-info">
            <div className="feed-title" onClick={() => ui.push({type: 'series', sid: s.id})}>{s.title} <ChevronRight size={18} /></div>
            <div className="feed-tags"><Rating r={s.rating} />{s.tags.map((x) => <span key={x}>#{x}</span>)}</div>
            <div className="feed-hook">{s.logline}</div>
            <button className="btn-watch" onClick={() => play(s.id)}><Play size={16} fill="currentColor" />{st.progress[s.id] ? t('continueEp', {n: st.progress[s.id].ep}) : t('watchFrom1')}</button>
          </div>
        </section>
      ))}
    </div>
  );
}

// ── My list: continue watching, followed shows and creators ──
export function MyList() {
  const {st, ui, t, C} = useStore();
  const cont = useContinue();
  const play = usePlay();
  return (
    <div className="page">
      <h2 className="page-h">{t('continueWatching')}</h2>
      {!cont.length && <div className="empty">{t('noHistory')}</div>}
      {cont.map((s) => (
        <div className="row-card" key={s.id} onClick={() => play(s.id)}>
          <Poster s={s} size="sm" />
          <div className="grow"><div className="t">{s.title}</div><div className="sub">{t('epProgress', {n: st.progress[s.id].ep, m: s.eps})}</div>
            <div className="bar"><i style={{width: `${(st.progress[s.id].ep / s.eps) * 100}%`}} /></div></div>
          <Play size={20} />
        </div>
      ))}
      <h2 className="page-h">{t('followedShows')}</h2>
      {!st.followsSeries.length && <div className="empty">{t('noFollows')}</div>}
      <div className="grid">{st.followsSeries.map((sid) => C.byId[sid]).filter((s) => visible(st, s)).map((s) => <Card key={s.id} s={s} />)}</div>
      {st.followsCreators.length > 0 && <>
        <h2 className="page-h">{t('followedCreators')}</h2>
        {st.followsCreators.map((cid) => (
          <div className="row-card" key={cid} onClick={() => ui.open({type: 'creator', cid})}>
            <Avatar name={C.creatorName(cid)} hue={CREATORS[cid].hue} /><div className="grow"><div className="t">{C.creatorName(cid)}</div></div><ChevronRight size={18} />
          </div>
        ))}
      </>}
    </div>
  );
}

// ── Show page (one URL per show: /s/<id>) ──
export function SeriesPage({sid}) {
  const {st, ui, t, C} = useStore();
  const follow = useFollow();
  const play = usePlay();
  const s = C.byId[sid];
  const cur = st.progress[sid]?.ep || 1;
  const similar = rankFor({...st, genres: [s.genre]}, C.list).filter((x) => x.id !== sid).slice(0, 6);
  const fs = st.followsSeries.includes(sid), fc = st.followsCreators.includes(s.creator);
  return (
    <div className="page series">
      <div className="series-hero">
        <Poster s={s} size="lg" />
        <button className="icon-btn back" onClick={ui.pop}><ChevronLeft size={22} /></button>
        <div className="series-hero-meta">
          <div className="chips-inline"><span className="gchip" onClick={() => { ui.home(); ui.setTab(s.genre); }}>{t('g_' + s.genre)}</span><Rating r={s.rating} /></div>
          <h1>{s.title}</h1>
          <div className="sub"><Flame size={13} />{t('watching', {n: s.heat})} · {t('score', {n: s.score})} · {t('eps', {n: s.eps})}</div>
        </div>
      </div>
      <div className="creator-row">
        <span onClick={() => ui.open({type: 'creator', cid: s.creator})}><Avatar name={C.creatorName(s.creator)} hue={CREATORS[s.creator].hue} size={30} /><b>{t('by', {c: C.creatorName(s.creator)})}</b></span>
        <button className={`btn-ghost sm ${fc ? 'on' : ''}`} onClick={() => follow.creator(s.creator)}>{fc ? t('following') : t('follow')}</button>
      </div>
      <p className="logline">{s.logline}</p>
      <div className="feed-tags">{s.tags.map((x) => <span key={x}>#{x}</span>)}</div>
      <div className="cast">{s.cast.map((c) => <div key={c.name} className="cast-c"><div className="avatar" style={{'--h': s.hue[0]}}>{c.name[0]}</div><b>{c.name}</b><span>{c.role}</span></div>)}</div>
      <div className="actions">
        <button className="btn-primary" onClick={() => play(sid, cur)}><Play size={16} fill="currentColor" />{st.progress[sid] ? t('continueEp', {n: cur}) : t('watchFrom1')}</button>
        <button className={`btn-ghost ${fs ? 'on' : ''}`} onClick={() => follow.series(sid)}><Heart size={16} fill={fs ? 'currentColor' : 'none'} />{fs ? t('followingShow') : t('followShow')}</button>
      </div>
      <div className="seg-note">{t('freeNote', {n: s.free, p: PRICE.ep})}</div>
      <EpisodeGrid s={s} current={st.progress[sid]?.ep} onPick={(n) => play(sid, n)} />
      <Row title={t('moreLike')} list={similar} />
      <button className="made-with" onClick={() => ui.toast(t('madeWithToast'))}><Sparkles size={14} />{t('madeWith')}<ExternalLink size={13} /></button>
    </div>
  );
}

export function EpisodeGrid({s, current, onPick}) {
  const {st, t} = useStore();
  return (
    <div className="eps">
      {Array.from({length: s.eps}, (_, i) => i + 1).map((n) => {
        const b = blocker(st, s.id, n);
        const owned = isUnlocked(st, s.id, n) && !subActive(st);
        return (
          <button key={n} className={`ep ${n === current ? 'cur' : ''} ${b ? 'locked' : ''}`} onClick={() => onPick(n)}>
            {n}
            {n <= s.free && <em className="tag free">{t('free')}</em>}
            {b === 'unlock' && <Lock size={11} className="lk" />}
            {n > s.free && owned && <em className="tag own">{t('owned')}</em>}
          </button>
        );
      })}
    </div>
  );
}

// ── Me ──
export function Me() {
  const {st, dispatch, ui, t} = useStore();
  const acc = st.account;
  const sub = subActive(st);
  return (
    <div className="page">
      <div className="me-head" onClick={() => !acc && ui.open({type: 'signin'})}>
        <div className="avatar big">{acc ? acc.handle[0].toUpperCase() : (st.lang === 'zh' ? '游' : 'G')}</div>
        <div className="grow"><div className="t">{acc ? acc.handle : t('guest')}</div><div className="sub">{acc ? t('signedIn') : t('guestNote')}</div></div>
        {!acc && <button className="btn-ghost sm">{t('signInBtn')}</button>}
      </div>

      {subLapsed(st) && <div className="winback" onClick={() => ui.open({type: 'membership'})}><b>{t('msLapsed', {d: fmtDate(st.sub.until, st.lang)})}</b><span>{t('msWinback', {p: `$${WINBACK_WEEK}`})}</span></div>}

      <div className="card-row">
        <div className="mini-card" onClick={() => ui.open({type: 'wallet'})}>
          <div className="sub"><Coins size={14} />{t('myCoins')}</div><div className="num">{st.coins}</div><span className="link">{t('topUp')}</span>
        </div>
        <div className={`mini-card vip ${sub ? 'on' : ''}`} onClick={() => ui.open({type: 'membership'})}>
          <div className="sub"><Crown size={14} />{t('membership')}</div>
          <div className="num sm">{sub ? t(st.sub.plan === 'week' ? 'weekly' : 'monthly') : t('none')}</div>
          <span className="link">{sub ? `${st.sub.autoRenew ? t('msRenews') : t('msEnds')} ${fmtDate(st.sub.until, st.lang)}` : t('join')}</span>
        </div>
      </div>
      <p className="fine">{t('walletNote')}</p>

      <div className="checkin">
        <Gift size={18} /><span>{t('checkinTitle')}</span>
        <button className={canCheckin(st) ? 'btn-primary sm' : 'btn-ghost sm'} disabled={!canCheckin(st)} onClick={() => dispatch({type: 'checkin'})}>
          {canCheckin(st) ? t('checkinBtn', {n: CHECKIN_COINS}) : t('checkinDone')}
        </button>
      </div>

      <div className="list">
        <div className="list-row" onClick={() => ui.open({type: 'onboard'})}><Tags size={18} /><span>{t('interests')}</span><em>{preferred(st).map((g) => t('g_' + g)).join(' · ') || '—'}</em><ChevronRight size={16} /></div>
        <label className="list-row"><ShieldCheck size={18} /><span>{t('showMature')}</span>
          <input type="checkbox" className="switch" checked={st.showMature} onChange={(e) => (e.target.checked ? ui.open({type: 'age'}) : dispatch({type: 'mature', on: false}))} /></label>
        <div className="list-row" onClick={() => ui.open({type: 'notify'})}><Bell size={18} /><span>{t('notifications')}</span><em>{st.notify === 'email' ? t('notifyEmailShort') : st.notify === 'push' ? t('notifyPushShort') : t('off')}</em><ChevronRight size={16} /></div>
        <label className="list-row"><Sparkles size={18} /><span>{t('autoNext')}</span>
          <input type="checkbox" className="switch" checked={st.autoUnlock} onChange={(e) => dispatch({type: 'auto', on: e.target.checked})} /></label>
        <div className="list-row" onClick={() => dispatch({type: 'lang', lang: st.lang === 'zh' ? 'en' : 'zh'})}><Globe size={18} /><span>{t('language')}</span><em>{st.lang === 'zh' ? '中文' : 'English'}</em><ChevronRight size={16} /></div>
        <div className="list-row" onClick={() => ui.open({type: 'orders'})}><Coins size={18} /><span>{t('orders')}</span><em>{t('count', {n: st.orders.length})}</em><ChevronRight size={16} /></div>
        <div className="list-row" onClick={() => ui.open({type: 'help'})}><LifeBuoy size={18} /><span>{t('help')}</span><ChevronRight size={16} /></div>
        <div className="list-row" onClick={() => ui.open({type: 'legal'})}><ShieldCheck size={18} /><span>{t('legal')}</span><ChevronRight size={16} /></div>
      </div>

      <div className="list">
        {acc && <div className="list-row" onClick={() => dispatch({type: 'signout'})}><UserRound size={18} /><span>{t('signOut')}</span><ChevronRight size={16} /></div>}
        <div className="list-row danger" onClick={() => ui.open({type: 'deleteAccount'})}><Trash2 size={18} /><span>{t('deleteAcc')}</span><ChevronRight size={16} /></div>
      </div>

      <div className="demo-tools">
        <div className="sub">{t('demoTools')}</div>
        <button onClick={() => ui.open({type: 'analytics'})}>{t('analytics')}</button>
        <button onClick={() => dispatch({type: 'grant', coins: 200})}>{t('addCoins')}</button>
        <button disabled={!st.sub} onClick={() => { const r = st.sub?.autoRenew; dispatch({type: 'renewTick'}); ui.toast(r ? t('renewedToast', {p: `$${st.sub.usd}`}) : t('lapsedToast')); }}>{t('renewDemo')}</button>
        <button onClick={() => { dispatch({type: 'reset'}); ui.home(); ui.setTab(null); ui.toast(t('resetDone')); }}>{t('resetAll')}</button>
      </div>
    </div>
  );
}


