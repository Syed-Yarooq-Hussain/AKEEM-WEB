import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';

const labels = {
 en: ['Previous projects', 'Next projects', 'Welfare projects'],
 de: ['Vorherige Projekte', 'Weitere Projekte', 'Hilfsprojekte'],
 fr: ['Projets précédents', 'Projets suivants', 'Projets solidaires'],
 es: ['Proyectos anteriores', 'Proyectos siguientes', 'Proyectos solidarios'],
};

export function WelfareSlider({children, lang}) {
 const track = useRef(null);
 const [position, setPosition] = useState({first:1,last:2,start:true,end:true});
 const count = React.Children.count(children);
 const text = labels[lang] || labels.en;
 useEffect(() => {
  const el = track.current;
  if (!el) return;
  const update = () => {
   const cards = [...el.children];
   const bounds = el.getBoundingClientRect();
   const visible = cards.map((card,i) => {
    const rect = card.getBoundingClientRect();
    return rect.right > bounds.left + 5 && rect.left < bounds.right - 5 ? i + 1 : null;
   }).filter(Boolean);
   setPosition({first:visible[0] || 1,last:visible.at(-1) || count,start:el.scrollLeft < 2,end:el.scrollLeft + el.clientWidth >= el.scrollWidth - 2});
  };
  update();
  const observer = new ResizeObserver(update);
  observer.observe(el);
  el.addEventListener('scroll',update,{passive:true});
  return () => {observer.disconnect();el.removeEventListener('scroll',update);};
 }, [count]);
 const move = direction => {
  const el = track.current;
  const card = el?.firstElementChild;
  if (!card) return;
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
  el.scrollBy({left:direction * (card.getBoundingClientRect().width + gap),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 if (!count) return null;
 return <div className="aid-slider" role="region" aria-label={text[2]}>
  <div className="aid-grid aid-track" id="welfare-project-track" ref={track} tabIndex={0} aria-label={text[2]} onKeyDown={event => {
   if (event.target !== event.currentTarget) return;
   if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);}
  }}>{children}</div>
  {!(position.start && position.end) && <div className="aid-slider-controls">
   <span className="aid-slider-count" aria-live="polite" aria-atomic="true">{position.first === position.last ? position.first : `${position.first}–${position.last}`} / {count}</span>
   <div><button type="button" aria-label={text[0]} aria-controls="welfare-project-track" disabled={position.start} onClick={() => move(-1)}><ArrowLeft size={19}/></button><button type="button" aria-label={text[1]} aria-controls="welfare-project-track" disabled={position.end} onClick={() => move(1)}><ArrowRight size={19}/></button></div>
  </div>}
 </div>;
}
