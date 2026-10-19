import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Compass, Heart, House, User} from 'lucide-react';
import {StoreProvider, subActive, useStore} from './store.jsx';
import {Brand, Discover, GenreTabs, Home, LangSwitch, Me, MyList, SeriesPage} from './screens.jsx';
import {Player} from './player.jsx';
import {SheetHost} from './sheets.jsx';
import {DesktopApp} from './desktop.jsx';
import {Router} from './router.jsx';
import './styles.css';

const TABS = [
  {id: 'home', label: 'tabHome', Icon: House},
  {id: 'discover', label: 'tabDiscover', Icon: Compass},
  {id: 'list', label: 'tabList', Icon: Heart},
  {id: 'me', label: 'tabMe', Icon: User},
];

function useWide() {
  const q = '(min-width: 1024px)';
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const on = () => setWide(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return wide;
}

function Root() {
  const {st, ui} = useStore();
  const wide = useWide();
  const [phone, setPhone] = useState(false);
  const [page, setPage] = useState('home');
  // The entry genre opens by default on later visits.
  useEffect(() => { if (!ui.tab && st.entry) ui.setTab(st.entry.genre); }, []);
  // First visit: pick interests (skipped when a link opened a show directly).
  useEffect(() => {
    const x = setTimeout(() => { if (!st.onboarded && !ui.sheet && !ui.stack.length) ui.open({type: 'onboard', first: true}); }, 150);
    return () => clearTimeout(x);
  }, [st.onboarded]);
  // Browser back closes a sheet / pops a screen instead of leaving the site.
  useEffect(() => {
    const onPop = () => { if (ui.sheet) ui.close(); else if (ui.stack.length) ui.pop(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  });
  useEffect(() => { if (ui.stack.length || ui.sheet) history.pushState(history.state, '', location.href); }, [ui.stack.length, !!ui.sheet]);
  return <>
    <Router />
    {wide && !phone ? <DesktopApp onPhone={() => setPhone(true)} page={page} setPage={setPage} />
      : <PhoneApp onDesk={wide ? () => setPhone(false) : null} page={page} setPage={setPage} />}
  </>;
}

function PhoneApp({onDesk, page, setPage}) {
  const {st, ui, t} = useStore();
  const top = ui.stack[ui.stack.length - 1];
  const body = {home: <div className="page home-page"><div className="m-head"><Brand /><span className="grow" /><LangSwitch compact /></div><GenreTabs /><Home /></div>,
    discover: <Discover />, list: <MyList />, me: <Me />}[page];
  return (
    <div className="stage">
      <div className="phone">
        <div className="screen">
          <div className={`tabview ${top ? 'hidden' : ''}`}>{body}</div>
          {ui.stack.map((v, i) => (
            <div key={i} className={`overlay ${i === ui.stack.length - 1 ? '' : 'hidden'}`}>
              {v.type === 'series' && <SeriesPage sid={v.sid} />}
              {v.type === 'player' && <Player sid={v.sid} ep={v.ep} />}
            </div>
          ))}
          {!top && (
            <nav className={`tabbar ${page === 'discover' ? 'dark' : ''}`}>
              {TABS.map(({id, label, Icon}) => <button key={id} className={page === id ? 'on' : ''} onClick={() => setPage(id)}><Icon size={22} /><span>{t(label)}</span></button>)}
            </nav>
          )}
          <SheetHost />
          {ui.toastState && <div className="toast" key={ui.toastState.k}>{ui.toastState.m}</div>}
        </div>
      </div>
      <aside className="notes">
        <h2>{t('notesTitle')}</h2>
        {onDesk && <button className="btn-ghost to-desk" onClick={onDesk}>{t('toDesk')}</button>}
        <LangSwitch />
        <p>{t('notesIntro')}</p>
        <h3>{t('notesTry')}</h3>
        <ol>{t('notesList').map((x) => <li key={x}>{x}</li>)}</ol>
        <ul className="state">
          <li>entry: {st.entry ? `${st.entry.genre} · ${st.entry.ref}` : '—'}</li>
          <li>interests: {st.genres.join(', ') || '—'}</li>
          <li>16+: {st.showMature ? 'on' : 'off'} · coins: {st.coins} · member: {subActive(st) ? 'yes' : 'no'}</li>
        </ul>
      </aside>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<StoreProvider><Root /></StoreProvider>);
