import { Link, useLocation } from "react-router-dom";
import RecordArtwork from "./RecordArtwork.jsx";

const guides = {
  coffee: ["한 잔을 더 선명하게", "원두와 물의 양, 분쇄도와 추출 시간을 남겨보세요. 식은 뒤의 맛도 다음 한 잔의 단서가 됩니다.", "/coffee/import", "기존 추출 기록 가져오기"],
  music: ["다시 듣고 싶은 순간", "곡과 아티스트를 적고, 그때의 기분을 짧게 남겨보세요. 장르보다 당신의 감상이 먼저입니다.", "/music/write", "음악 한 곡 기록하기"],
  pairing: ["두 취향이 만나는 지점", "마신 커피와 실제로 들은 음악을 골라 연결하세요. 산미, 질감, 리듬 사이의 닮은 감각을 찾아봅니다.", "/pairing/write", "새 조합 연결하기"],
  collection: ["꺼내 듣는 즐거움", "좋아하는 LP와 CD를 모아두세요. 소장한 음반의 기억에 한 잔의 커피를 더해보세요.", "/collection/write", "소장 음반 추가하기"],
  default: ["매일 조금씩, 나의 취향", "한 잔과 한 곡을 기록하며 반복되는 취향을 발견하세요. 짧은 감상 하나로도 충분합니다.", "/coffee/write", "오늘의 한 잔 기록하기"]
};
export default function PageShell({ eyebrow, title, subtitle, children }) {
  const { pathname } = useLocation();
  const section = pathname.split("/")[1];
  const kind = section === "coffee" ? "coffee" : section === "music" || section === "collection" ? "music" : "blend";
  const guide = guides[section] || guides.default;
  const withRail = /\/(write|import|search|\d+)(\/edit)?$/.test(pathname) || section === "mypage";
  return <section className={`page page-${section}`}>
    {withRail && section !== "mypage" && <Link className="workspace-back" to={`/${section}`}>← {section === "coffee" ? "커피 기록" : section === "music" ? "음악 기록" : section === "pairing" ? "페어링" : "컬렉션"} 목록</Link>}
    <header className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subtitle">{subtitle}</p></div><div className="heading-signature" aria-hidden="true"><span>{kind === "coffee" ? "SIDE A" : kind === "music" ? "SIDE B" : "A + B"}</span><b>r&amp;r</b><small>YOUR DAILY RITUAL</small></div></header>
    <div className={withRail ? "page-workspace" : "page-content"}><div className="workspace-content">{children}</div>
      {withRail && <aside className="workspace-rail"><RecordArtwork kind={kind} seed={section} /><div className="ritual-guide"><p className="eyebrow">A LITTLE RITUAL</p><h3>{guide[0]}</h3><p>{guide[1]}</p><Link to={guide[2]}>{guide[3]} ↗</Link></div><div className="rail-index"><span>01 / BREW</span><span>02 / LISTEN</span><span>03 / REMEMBER</span></div></aside>}
    </div><footer className="page-footer"><span>ROAST & REVERB</span><span>한 잔의 취향. 한 곡의 여운.</span><Link to="/">서비스 소개 ↗</Link><a href={`${import.meta.env.BASE_URL}privacy.html`}>개인정보처리방침</a></footer>
  </section>;
}
