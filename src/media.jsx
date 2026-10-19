import React from 'react';
import {useStore} from './store.jsx';

// Stand-ins for posters and video: gradients from each show's hues. No real media in the demo.

export function Rating({r}) {
  return <span className={`rating r-${r === '16+' ? 'm' : r === 'PG-13' ? 'p13' : 'g'}`}>{r}</span>;
}

export function Poster({s, size = 'md'}) {
  const {t} = useStore();
  const [a, b] = s.hue;
  return (
    <div className={`poster poster-${size}`}
      style={{background: `radial-gradient(120% 80% at 70% 15%, hsl(${a} 70% 55% / .9), transparent 60%),
        radial-gradient(90% 70% at 20% 90%, hsl(${b} 65% 45% / .95), transparent 70%), hsl(${b} 40% 12%)`}}>
      <div className="poster-figure" style={{background: `radial-gradient(closest-side, hsl(${a} 60% 80% / .35), transparent)`}} />
      <div className="poster-title">{s.title}</div>
      {s.rating === '16+' && <span className="poster-rating"><Rating r={s.rating} /></span>}
      <span className="poster-eps">{t('eps', {n: s.eps})}</span>
    </div>
  );
}

export function FakeVideo({s, playing, line, children}) {
  const [a, b] = s.hue;
  return (
    <div className={`fakevideo ${playing ? 'is-playing' : ''}`} style={{'--ha': a, '--hb': b}}>
      <div className="fv-blob fv-a" />
      <div className="fv-blob fv-b" />
      <div className="fv-blob fv-c" />
      <div className="fv-grain" />
      {line && <div className="fv-sub" key={line}>{line}</div>}
      {children}
    </div>
  );
}

export function Avatar({name, hue, size = 34}) {
  return <span className="c-avatar" style={{'--h': hue, width: size, height: size, fontSize: size * 0.42}}>{name[0]}</span>;
}
