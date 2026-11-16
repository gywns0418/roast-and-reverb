import {useEffect,useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {loadingController} from '../../utils/loadingController.js';
let count=0,overflow='',wasInert=false;
function viewportSnapshot(){if(typeof window==='undefined')return '';const view=window.visualViewport;return [view?.offsetLeft||0,view?.offsetTop||0,view?.width||window.innerWidth,view?.height||window.innerHeight].join(',');}
function subscribeViewport(changed){const view=window.visualViewport;window.addEventListener('resize',changed);view?.addEventListener('resize',changed);view?.addEventListener('scroll',changed);return()=>{window.removeEventListener('resize',changed);view?.removeEventListener('resize',changed);view?.removeEventListener('scroll',changed);};}

export function LoadingOverlay({title='한 잔과 한 곡을 준비해요.',detail='잠시만 기다려 주세요.'}) {
 const frame=useSyncExternalStore(subscribeViewport,viewportSnapshot,()=>''),[left,top,width,height]=frame.split(',').map(Number);
 useEffect(()=>{const root=document.getElementById('root');if(count++===0){overflow=document.body.style.overflow;wasInert=root?.hasAttribute('inert')||false;document.body.style.overflow='hidden';root?.setAttribute('inert','');}return ()=>{if(--count===0){document.body.style.overflow=overflow;if(!wasInert)root?.removeAttribute('inert');}};},[]);
 const overlay=<section className="ritual-loading" style={frame?{left,top,width,height,right:'auto',bottom:'auto'}:undefined} role="status" aria-live="polite" aria-busy="true" aria-label={title}><div className="ritual-loading-content"><div className="ritual-loading-art" aria-hidden="true"><span className="loading-ripple"/><span className="loading-ripple"/><span className="loading-ripple"/><span className="loading-glow"/><svg className="ritual-loading-bean" viewBox="0 0 80 100" fill="none"><defs><linearGradient id="rr-bean-v3" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#E2A57A"/><stop offset=".5" stopColor="#B25A38"/><stop offset="1" stopColor="#5B2E1F"/></linearGradient><linearGradient id="rr-bean-rim" x1="0" y1="0" x2="1" y2="1"><stop offset=".45" style={{stopColor:'var(--rs-sound)',stopOpacity:0}}/><stop offset="1" style={{stopColor:'var(--rs-sound)',stopOpacity:.9}}/></linearGradient><radialGradient id="rr-bean-sheen" cx=".32" cy=".26" r=".55"><stop offset="0" stopColor="#fff" stopOpacity=".42"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient></defs><g transform="rotate(24 40 50)"><path d="M40 5C61 5 73 26 72 50C71 76 57 95 39 95C19 95 8 74 8 50C8 25 19 5 40 5Z" fill="url(#rr-bean-v3)"/><path d="M40 5C61 5 73 26 72 50C71 76 57 95 39 95C19 95 8 74 8 50C8 25 19 5 40 5Z" fill="url(#rr-bean-sheen)"/><path d="M40 5C61 5 73 26 72 50C71 76 57 95 39 95C19 95 8 74 8 50C8 25 19 5 40 5Z" stroke="url(#rr-bean-rim)" strokeWidth="2.5"/><path className="bean-crease" d="M41 13C47 22 35 29 41 38S47 54 40 62S33 77 40 87" stroke="var(--rs-bg)" strokeWidth="4.5" strokeLinecap="round"/><path className="bean-crease-pulse" d="M41 13C47 22 35 29 41 38S47 54 40 62S33 77 40 87" stroke="#fff" strokeWidth="2" strokeLinecap="round" pathLength="100"/></g></svg><span className="ritual-bean-shadow"/></div><p className="eyebrow">ROAST &amp; REVERB</p><h2>{title}</h2><p>{detail}</p></div></section>;
 return typeof document==='undefined'?overlay:createPortal(overlay,document.body);
}
export function LoadingHost(){
 const state=useSyncExternalStore(loadingController.subscribe,loadingController.getSnapshot,loadingController.getSnapshot);
 return state.visible?<LoadingOverlay title={state.title} detail={state.detail}/>:null;
}
export default function Loading({title='한 잔과 한 곡을 준비해요.',detail='잠시만 기다려 주세요.'}){
 useEffect(()=>loadingController.acquire({title,detail}),[title,detail]);
 return typeof document==='undefined'?<LoadingOverlay title={title} detail={detail}/>:null;
}
