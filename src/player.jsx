import React, {useEffect, useRef, useState} from 'react';
import {ChevronLeft, Flag, Heart, ListVideo, Lock, Pause, Play, Share2} from 'lucide-react';
import {epHook, epLines} from './data.js';
import {useStore, blocker, rankFor} from './store.jsx';
import {FakeVideo, Poster, Rating} from './media.jsx';
import {useFollow} from './screens.jsx';

const LEN = 14000; // demo episode length (ms)

export function Player({sid, ep}) {
  const {st, dispatch, ui, attempt, track, t, C} = useStore();
  const follow = useFollow();
  const s = C.byId[sid];
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const [count, setCount] = useState(null);
  const last = useRef(performance.now());
  const held = !!ui.sheet; // any sheet pauses playback and the countdown
  const lines = epLines(s, ep, 6);
  const next = ep < s.eps ? ep + 1 : null;
  const nextBlock = next && blocker(st, sid, next);
  const similar = rankFor({...st, genres: [s.genre]}, C.list).filter((x) => x.id !== sid).slice(0, 3);

  useEffect(() => {
    setPos(0); setEnded(false); setPlaying(true); setCount(null);
    dispatch({type: 'progress', sid, ep});
    track('play_start', {sid, ep, genre: s.genre});
  }, [sid, ep]);
  useEffect(() => { if (ended) track('play_complete', {sid, ep, genre: s.genre}); }, [ended]);

  useEffect(() => {
    if (!playing || ended || held) return;
    last.current = performance.now();
    let raf;
    const step = (now) => {
      const dt = now - last.current; last.current = now;
      setPos((x) => { const n = Math.min(1, x + dt / LEN); if (n >= 1) setEnded(true); return n; });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, ended, held]);

  const go = (n) => attempt(sid, n, () => ui.replaceTop({type: 'player', sid, ep: n}));
  // End of episode: an open next episode counts down; a locked one asks on the cliffhanger.
  useEffect(() => {
    if (!ended || !next) return;
    if (!nextBlock) { setCount(5); return; }
    const x = setTimeout(() => go(next), 900);
    return () => clearTimeout(x);
  }, [ended]);
  useEffect(() => {
    if (count == null || held) return;
    if (count === 0) { go(next); return; }
    const x = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(x);
  }, [count, held]);

  const fav = st.followsSeries.includes(sid);
  const openEps = () => ui.open({type: 'eps', sid, ep, onPick: (n) => { ui.close(); go(n); }});
  return (
    <div className="player">
      <FakeVideo s={s} playing={playing && !ended && !held} line={ended ? null : lines[Math.min(lines.length - 1, Math.floor(pos * lines.length))]}>
        <div className="tap" onClick={() => !ended && setPlaying((p) => !p)} />
        {!playing && !ended && <div className="paused"><Play size={54} fill="currentColor" /></div>}
      </FakeVideo>

      <div className="player-top">
        <button className="icon-btn" onClick={ui.pop}><ChevronLeft size={24} /></button>
        <div className="pt"><b>{s.title}</b><span>{C.epTitle(s, ep)}</span></div>
        <Rating r={s.rating} />
      </div>

      <div className="player-rail">
        <button className={fav ? 'on' : ''} onClick={() => follow.series(sid)}><Heart size={26} fill={fav ? 'currentColor' : 'none'} /><span>{fav ? t('followingShow') : t('followShow')}</span></button>
        <button onClick={openEps}><ListVideo size={26} /><span>{t('episodes')}</span></button>
        <button onClick={() => ui.toast(t('shareCopied'))}><Share2 size={22} /><span>{t('share')}</span></button>
        <button onClick={() => { setPlaying(false); ui.open({type: 'report', sid, ep}); }}><Flag size={22} /><span>{t('report')}</span></button>
      </div>

      <div className="player-bottom">
        <div className="bar seek" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width); setEnded(false); }}>
          <i style={{width: `${pos * 100}%`}} />
        </div>
        <div className="pb-row">
          <button className="icon-btn sm" onClick={() => setPlaying((p) => !p)}>{playing && !ended ? <Pause size={16} /> : <Play size={16} />}</button>
          <span>{t('demoLen', {s: Math.floor(pos * 14)})}</span>
          <span className="grow" />
          <span className="ep-pill" onClick={openEps}>{t('epProgress', {n: ep, m: s.eps})}</span>
        </div>
      </div>

      {ended && (
        <div className="endcard">
          {next ? <>
            <div className="sub">{t('nextUp')}</div>
            <div className="hook">“{epHook(s, next)}”</div>
            {count != null
              ? <button className="btn-primary" onClick={() => go(next)}>{t('playIn', {n: next, s: count})}</button>
              : <button className="btn-primary" onClick={() => go(next)}><Lock size={15} />{t('unlockEp', {n: next})}</button>}
            <button className="btn-text" onClick={() => { setPos(0); setEnded(false); setCount(null); }}>{t('replay')}</button>
          </> : <div className="hook">{t('theEnd')}</div>}
          <div className="end-more">
            <div className="sub">{t('moreLike')}</div>
            <div className="end-picks">
              {similar.map((x) => (
                <div key={x.id} onClick={() => { setCount(null); ui.replaceTop({type: 'series', sid: x.id}); }}>
                  <Poster s={x} size="sm" /><span>{x.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
