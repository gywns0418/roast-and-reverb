import {useEffect,useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {loadingController} from '../../utils/loadingController.js';
let count=0,overflow='',wasInert=false;
// The overlay is fixed to all four edges and centres its content with flex, so it
// always fills the screen exactly (no stale size from before the scrollbar went away).

export function LoadingOverlay({title='한 잔과 한 곡을 준비해요.',detail='잠시만 기다려 주세요.'}) {
 useEffect(()=>{const root=document.getElementById('root');if(count++===0){overflow=document.body.style.overflow;wasInert=root?.hasAttribute('inert')||false;document.body.style.overflow='hidden';root?.setAttribute('inert','');}return ()=>{if(--count===0){document.body.style.overflow=overflow;if(!wasInert)root?.removeAttribute('inert');}};},[]);
 const overlay=<section className="ritual-loading" role="status" aria-live="polite" aria-busy="true" aria-label={title}><div className="ritual-loading-content"><div className="ritual-loading-art" aria-hidden="true"><span className="loading-ripple"/><span className="loading-ripple"/><span className="loading-ripple"/><span className="loading-glow"/><span className="loading-orb"/></div><p className="eyebrow">ROAST &amp; REVERB</p><h2>{title}</h2><p>{detail}</p></div></section>;
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
