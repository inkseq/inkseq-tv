import {useEffect} from 'react';
import {GENRES, SERIES_EN} from './data.js';
import {useStore} from './store.jsx';

// URLs: /<genre> (landing page), /s/<show>, /s/<show>/<ep>. ?ref=<channel> tags the source.
export function parseLocation() {
  const parts = location.pathname.split('/').filter(Boolean);
  const q = new URLSearchParams(location.search);
  const ref = q.get('ref') || (document.referrer && !document.referrer.includes(location.host) ? 'referral' : null);
  const lang = q.get('lang');
  if (parts[0] === 's' && SERIES_EN.some((s) => s.id === parts[1])) {
    return {kind: 'series', sid: parts[1], ep: parts[2] ? Number(parts[2]) : null, genre: SERIES_EN.find((s) => s.id === parts[1]).genre, ref, lang};
  }
  if (GENRES.some((g) => g.id === parts[0])) return {kind: 'genre', genre: parts[0], ref, lang};
  return {kind: 'home', ref, lang};
}

export const pathFor = (view, tab) =>
  view?.type === 'series' ? `/s/${view.sid}`
    : view?.type === 'player' ? `/s/${view.sid}/${view.ep}`
      : tab && tab !== 'foryou' ? `/${tab}` : '/';

// Applies the landing URL once, then keeps the address bar in step with what's on screen (shareable, SEO-friendly).
export function Router() {
  const {st, dispatch, ui, track} = useStore();
  useEffect(() => {
    const loc = parseLocation();
    if (loc.lang === 'en' || loc.lang === 'zh') dispatch({type: 'lang', lang: loc.lang});
    let landed = false;
    try { landed = !!sessionStorage.getItem('landed'); sessionStorage.setItem('landed', '1'); } catch { /* private mode */ }
    if (loc.kind !== 'home') {
      dispatch({type: 'entry', genre: loc.genre, ref: loc.ref});   // first entry genre sticks
      ui.setTab(loc.genre);
    }
    if (!landed) track('landing', {genre: loc.genre || st.entry?.genre || null, ref: loc.ref || 'direct', kind: loc.kind});
    if (loc.kind === 'series') {
      dispatch({type: 'onboarded'});
      ui.push({type: 'series', sid: loc.sid});
      if (loc.ep) ui.push({type: 'player', sid: loc.sid, ep: loc.ep});
    }
  }, []);
  const top = ui.stack[ui.stack.length - 1];
  useEffect(() => {
    const p = pathFor(top, ui.tab);
    if (p !== location.pathname) history.replaceState(null, '', p);
  }, [top?.type, top?.sid, top?.ep, ui.tab]);
  return null;
}
