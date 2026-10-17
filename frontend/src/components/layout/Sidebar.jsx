import {useEffect,useRef} from 'react';
import { Link, NavLink,useLocation } from "react-router-dom";
import { BarChart3, Coffee, Disc3, Headphones, Home, Library, ShoppingBasket, Sparkles, UserRound, Menu, X, Plus } from "lucide-react";
import { authStore } from "../../store/authStore.js";

const links = [
  ["/dashboard", Home, "대시보드", "neutral"],
  ["/journey", Sparkles, "나의 취향 여정", "blend"],
  ["/ritual", Disc3, "나의 청음실", "blend"],
  ["/studio", Headphones, "한 잔의 사운드", "music"],
  ["/memories", Library, "감각의 기억", "neutral"],
  ["/beans", ShoppingBasket, "내 원두", "coffee"],
  ["/coffee", Coffee, "커피와 감상", "coffee"],
  ["/music", Headphones, "음악 보관함", "music"],
  ["/pairing", Sparkles, "AI 페어링", "blend"],
  ["/report/monthly", BarChart3, "취향 리포트", "neutral"],
  ["/recommend", Disc3, "추천", "blend"],
  ["/monthly-pick", ShoppingBasket, "이달의 픽", "blend"],
  ["/collection", Library, "컬렉션", "blend"],
  ["/mypage", UserRound, "마이페이지", "neutral"],
  ["/connections", Sparkles, "자료 연결 상태", "neutral"]
];

export default function Sidebar() {
  const location=useLocation(),navigation=useRef(null),mobileMenu=useRef(null);
  useEffect(()=>{mobileMenu.current?.close();},[location.pathname]);
  useEffect(()=>{const resize=()=>{if(window.innerWidth>760)mobileMenu.current?.close();};window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  useEffect(()=>{if(!window.matchMedia("(max-width:760px)").matches)return;const nav=navigation.current,active=nav?.querySelector(".nav-link.active");if(active)nav.scrollTo({left:Math.max(0,active.offsetLeft-nav.offsetLeft-(nav.clientWidth-active.clientWidth)/2),behavior:"auto"});},[location.pathname]);
  const primary=links.filter(([to])=>["/dashboard","/journey","/ritual","/recommend","/coffee","/music"].includes(to));
  const more=links.filter(row=>!primary.includes(row)&&!["/mypage","/connections"].includes(row[0]));
  const activeMore=more.some(([to])=>location.pathname.startsWith(to));
  const render=([to,Icon,label,tone])=><NavLink key={to} to={to} className={({isActive})=>isActive?`nav-link ${tone} active`:`nav-link ${tone}`}><Icon size={18}/><span>{label}</span></NavLink>;
  const isDemo = authStore.user?.demo;

  return (
    <><aside className="sidebar">
      <NavLink className="brand" to="/dashboard" aria-label="Roast & Reverb 대시보드">
        <span>Roast &amp; Reverb</span>
        <small>coffee × music log</small>
        {isDemo && <em className="demo-badge smcp" title="체험 기록은 이 브라우저에 저장됩니다.">Demo</em>}
      </NavLink>
      <nav ref={navigation} aria-label="주요 메뉴">
        <p className="nav-caption">MY DAILY RITUAL</p>
        {primary.map(render)}
        <details className="nav-more" open={activeMore||undefined}><summary>기록과 발견 더 보기</summary><div className="nav-more-links">{more.map(render)}</div></details>
        <div className="nav-support">{render(["/mypage",UserRound,"나의 기록장","neutral"])}{render(["/help",Library,"도움말","neutral"])}</div>
      </nav>
      <div className="sidebar-session"><div className="mini-vinyl" aria-hidden="true"><i>r&amp;r</i></div><p>좋은 커피와<br/>오래 듣는 음악.</p><Link to="/ritual">나의 시간 시작하기 ↗</Link></div>
      <div className="sidebar-foot">BREW. LISTEN. REMEMBER.</div>
    </aside>
    <nav className="mobile-tabbar" aria-label="모바일 빠른 메뉴">
      <NavLink to="/dashboard"><Home size={21}/><span>홈</span></NavLink>
      <NavLink to="/coffee" end><Library size={21}/><span>커피 기록</span></NavLink>
      <NavLink to="/coffee/write" className="mobile-record"><Plus size={23}/><span>한 잔 기록</span></NavLink>
      <NavLink to="/ritual"><Disc3 size={21}/><span>청음실</span></NavLink>
      <button type="button" aria-haspopup="dialog" onClick={()=>mobileMenu.current?.showModal()}><Menu size={21}/><span>전체 메뉴</span></button>
    </nav>
    <dialog ref={mobileMenu} className="mobile-menu-sheet" aria-labelledby="mobile-menu-title" onClick={event=>{if(event.target===event.currentTarget)mobileMenu.current.close();}}>
      <div className="mobile-menu-heading"><h2 id="mobile-menu-title">어디로 갈까요?</h2><button type="button" aria-label="전체 메뉴 닫기" onClick={()=>mobileMenu.current.close()}><X size={24}/></button></div>
      <nav aria-label="모바일 전체 메뉴" onClick={event=>{if(event.target.closest("a"))mobileMenu.current.close();}}>{links.map(([to,Icon,label])=><NavLink key={to} to={to}><Icon size={20}/>{label}</NavLink>)}<Link to="/help"><Library size={20}/>도움말</Link></nav>
    </dialog></>
  );
}
