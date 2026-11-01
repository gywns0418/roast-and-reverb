import { beanIllustration } from "../../utils/beanIllustration.js";
import "../../styles/bean-illustrations.css";

export default function BeanArtwork({ item={}, compact=false, decorative=false }) {
  const illustration=beanIllustration(item);
  const summary=[item.name||'이름 미기록 원두',item.origin?`산지 ${item.origin}`:'산지 미기록',item.variety?`품종 ${item.variety}`:'',item.process?`가공 ${item.process}`:'',Array.isArray(item.flavors)&&item.flavors.length?`향미 ${item.flavors.slice(0,6).join(', ')}`:''].filter(Boolean).join('. ');
  const colors=(item.flavorColors || []).filter(color=>/^#[0-9a-f]{6}$/i.test(color));
  const explanation=illustration.kind==='flavor' ? '판매처 컵노트를 참고한 향미 일러스트이며, 해당 식재료가 들어 있다는 뜻은 아닙니다.' : '커피 원두를 표현한 연출 일러스트입니다. 컵노트를 추측한 그림이 아닙니다.';
  return <div className={`bean-still ${compact?"compact":""}`} role={decorative?undefined:"img"} aria-hidden={decorative?true:undefined} aria-label={decorative?undefined:`${summary}. ${explanation} 실제 상품 사진은 아닙니다.`}>
    <span className="bean-origin-type">{item.origin || "COFFEE BEANS"}</span>
    <img className="bean-flavor-illustration" src={`${import.meta.env.BASE_URL}images/${illustration.file}`} alt="" aria-hidden="true" loading="lazy" decoding="async" width="360" height="480" />
    <b className="bean-number">{(item.name||'').match(/^#\d+/)?.[0] || "BEANS"}</b><small>{item.variety || item.process || "ORIGIN & FLAVOR"}</small>
    <div className="bean-palette-band">{colors.length?colors.map((color,index)=><i key={index} style={{backgroundColor:color}}/>):<i style={{backgroundColor:"var(--group-color, #7d6950)"}}/>}</div>
  </div>;
}
