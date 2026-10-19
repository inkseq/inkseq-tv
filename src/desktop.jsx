import React, {useEffect} from 'react';
import {ChevronLeft, Coins, Crown, Flame, Heart, Smartphone} from 'lucide-react';
import {CREATORS, PRICE} from './data.js';
import {useStore, rankFor, subActive} from './store.jsx';
import {Avatar, Rating} from './media.jsx';
import {Brand, EpisodeGrid, GenreTabs, Home, LangSwitch, Me, MyList, Row, SeriesPage, useFollow} from './screens.jsx';
import {Player} from './player.jsx';
import {SheetHost} from './sheets.jsx';

// Website layout (≥1024px): same store, gates and sheets as the phone layout.
export function DesktopApp({onPhone, page, setPage}) {
  const {st, ui, t} = useStore();
  const top = ui.stack[ui.stack.length - 1];
  useEffect(() => { window.scrollTo(0, 0); }, [page, top?.type, top?.sid, ui.tab]);
  const toHome = () => { ui.home(); setPage('home'); };
  return (
    <div className="desk">
      <header className="d-nav">
        <span onClick={() => { toHome(); ui.setTab('foryou'); }} style={{cursor: 'pointer'}}><Brand /></span>
        <div className="d-genres" onClick={toHome}><GenreTabs /></div>
        <span className="grow" />
        <button className={page === 'list' && !top ? 'on' : ''} onClick={() => { ui.home(); setPage('list'); }}><Heart size={15} />{t('tabList')}</button>
        <button className="d-coins" onClick={() => ui.open({type: 'wallet'})}><Coins size={15} />{st.coins}</button>
        <button className={`d-vip ${subActive(st) ? 'on' : ''}`} onClick={() => ui.open({type: 'membership'})}><Crown size={15} />{t('membership')}</button>
        <LangSwitch />
        <button className="d-avatar" onClick={() => { ui.home(); setPage('me'); }}>{st.account ? st.account.handle[0].toUpperCase() : (st.lang === 'zh' ? '游' : 'G')}</button>
        <button className="d-phone" title={t('phonePreview')} onClick={onPhone}><Smartphone size={16} /></button>
      </header>
      <main className="d-main">
        {top?.type === 'player' ? <DeskPlayer {...top} />
          : top?.type === 'series' ? <div className="d-series"><SeriesPage sid={top.sid} /></div>
            : <div className={`d-body d-${page}`}>{page === 'list' ? <MyList /> : page === 'me' ? <Me /> : <Home />}</div>}
      </main>
      <footer className="d-foot">
        <span onClick={() => ui.open({type: 'help'})}>{t('help')}</span> · <span onClick={() => ui.open({type: 'legal'})}>{t('legal')}</span> · <span onClick={() => ui.toast(t('madeWithToast'))}>inkseq.com</span>
        <div className="muted">© Inkseq TV · [[Inkseq TV Pty Ltd]] · Statement: INKSEQ TV</div>
      </footer>
      <SheetHost />
      {ui.toastState && <div className="toast" key={ui.toastState.k}>{ui.toastState.m}</div>}
    </div>
  );
}

function DeskPlayer({sid, ep}) {
  const {st, ui, attempt, t, C} = useStore();
  const follow = useFollow();
  const s = C.byId[sid];
  const go = (n) => attempt(sid, n, () => ui.replaceTop({type: 'player', sid, ep: n}));
  const similar = rankFor({...st, genres: [s.genre]}, C.list).filter((x) => x.id !== sid).slice(0, 4);
  const fs = st.followsSeries.includes(sid), fc = st.followsCreators.includes(s.creator);
  return (
    <div className="d-player">
      <div className="d-video"><Player sid={sid} ep={ep} /></div>
      <aside className="d-side">
        <button className="back-link" onClick={ui.pop}><ChevronLeft size={16} />{s.title}</button>
        <h2>{s.title}</h2>
        <div className="sub"><Rating r={s.rating} /> {t('g_' + s.genre)} · <Flame size={13} />{t('watching', {n: s.heat})} · {t('score', {n: s.score})}</div>
        <div className="creator-row">
          <span onClick={() => ui.open({type: 'creator', cid: s.creator})}><Avatar name={C.creatorName(s.creator)} hue={CREATORS[s.creator].hue} size={28} /><b>{t('by', {c: C.creatorName(s.creator)})}</b></span>
          <button className={`btn-ghost sm ${fc ? 'on' : ''}`} onClick={() => follow.creator(s.creator)}>{fc ? t('following') : t('follow')}</button>
        </div>
        <p className="logline">{s.logline}</p>
        <div className="seg-note">{t('freeNote', {n: s.free, p: PRICE.ep})}</div>
        <EpisodeGrid s={s} current={ep} onPick={go} />
        <div className="d-side-actions">
          <button className={`btn-ghost ${fs ? 'on' : ''}`} onClick={() => follow.series(sid)}><Heart size={15} fill={fs ? 'currentColor' : 'none'} />{fs ? t('followingShow') : t('followShow')}</button>
          <button className="btn-ghost" onClick={() => ui.open({type: 'report', sid, ep})}>{t('report')}</button>
        </div>
        <Row title={t('moreLike')} list={similar} />
      </aside>
    </div>
  );
}
