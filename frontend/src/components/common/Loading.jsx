import {useEffect} from 'react';
import {createPortal} from 'react-dom';
let count=0,overflow='',wasInert=false;
export default function Loading({title='한 잔과 한 곡을 준비해요.',detail='잠시만 기다려 주세요.'}) {
 useEffect(()=>{const root=document.getElementById('root');if(count++===0){overflow=document.body.style.overflow;wasInert=root?.hasAttribute('inert')||false;document.body.style.overflow='hidden';root?.setAttribute('inert','');}return ()=>{if(--count===0){document.body.style.overflow=overflow;if(!wasInert)root?.removeAttribute('inert');}};},[]);
 const overlay=<section className="ritual-loading" role="status" aria-live="polite" aria-busy="true" aria-label={title}><div className="ritual-loading-content"><div className="ritual-loading-art" aria-hidden="true"><svg className="ritual-loading-bean" viewBox="0 0 80 100" fill="none"><ellipse cx="40" cy="50" rx="29" ry="42" transform="rotate(28 40 50)" fill="currentColor"/><path d="M57 14C26 35 53 62 23 86" stroke="#f5f2e8" strokeWidth="5" strokeLinecap="round"/></svg><span className="ritual-bean-shadow"/></div><p className="eyebrow">ROAST &amp; REVERB</p><h2>{title}</h2><p>{detail}</p></div></section>;
 return typeof document==='undefined'?overlay:createPortal(overlay,document.body);
}
