import {useEffect,useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {loadingController} from '../../utils/loadingController.js';
let count=0,overflow='',wasInert=false;
function viewportSnapshot(){if(typeof window==='undefined')return '';const view=window.visualViewport;return [view?.offsetLeft||0,view?.offsetTop||0,view?.width||window.innerWidth,view?.height||window.innerHeight].join(',');}
function subscribeViewport(changed){const view=window.visualViewport;window.addEventListener('resize',changed);view?.addEventListener('resize',changed);view?.addEventListener('scroll',changed);return()=>{window.removeEventListener('resize',changed);view?.removeEventListener('resize',changed);view?.removeEventListener('scroll',changed);};}

export function LoadingOverlay({title='한 잔과 한 곡을 준비해요.',detail='잠시만 기다려 주세요.'}) {
 const frame=useSyncExternalStore(subscribeViewport,viewportSnapshot,()=>''),[left,top,width,height]=frame.split(',').map(Number);
 useEffect(()=>{const root=document.getElementById('root');if(count++===0){overflow=document.body.style.overflow;wasInert=root?.hasAttribute('inert')||false;document.body.style.overflow='hidden';root?.setAttribute('inert','');}return ()=>{if(--count===0){document.body.style.overflow=overflow;if(!wasInert)root?.removeAttribute('inert');}};},[]);
 const overlay=<section className="ritual-loading" style={frame?{left,top,width,height,right:'auto',bottom:'auto'}:undefined} role="status" aria-live="polite" aria-busy="true" aria-label={title}><div className="ritual-loading-content"><div className="ritual-loading-art" aria-hidden="true"><svg className="ritual-loading-bean" viewBox="0 0 80 100" fill="none"><ellipse cx="40" cy="50" rx="29" ry="42" transform="rotate(28 40 50)" fill="currentColor"/><path d="M57 14C26 35 53 62 23 86" stroke="#f5f2e8" strokeWidth="5" strokeLinecap="round"/></svg><span className="ritual-bean-shadow"/></div><p className="eyebrow">ROAST &amp; REVERB</p><h2>{title}</h2><p>{detail}</p></div></section>;
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
