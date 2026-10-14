const text = value => String(value || "").trim();
const hash = value => [...value].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0).toString(36);
export function beanStatus(value) {
  const s=text(value);
  if(/미확인|미정|보유 여부/.test(s)) return "unknown";
  if(/거의 소진|소진 임박|소진임박|소량|자투리/.test(s) && !/^소진(?:\s|\(|$)/.test(s)) return "held";
  if(/^소진(?:\s|\(|$)|^다 (?:먹|마셨)/.test(s)) return "exhausted";
  if(/배송 중|배송중|주문|도착 예정|미도착/.test(s)) return "pending";
  if(/보유|마시는 중|도착|배송 완료|배송완료|개봉/.test(s)) return "held";
  return "unknown";
}
export function parseBeansMarkdown(content) {
  if(typeof content!=="string" || content.length>1000000) throw new Error("1MB 이하의 원두 Markdown 파일을 선택해 주세요.");
  const records=[];let section="",current=null;
  function flush() {
    if(!current || /시음|추출 기록|로그 참조|마신 커피|재고 제외/.test(section)) return;
    const f=current.fields;
    if(!Object.keys(f).length) return;
    const get=(...keys)=>keys.map(key=>f[key]).find(Boolean)||"";
    const state=get("상태");const name=current.name;
    const roastery=get("로스터리"),roastDate=get("로스팅 날짜"),remaining=get("남은 양");
    records.push({id:`owned-${hash(`${name}|${roastery}|${roastDate}`)}`,name,roastery,origin:get("원산지","국가","산지"),variety:get("품종"),process:get("가공 방식","가공"),roast:get("로스팅 포인트","로스팅"),roastDate,
      flavors:get("컵노트","컵 노트","향미","컵노트(매장 표기)").split(/[,，]/).map(text).filter(Boolean),tasteNote:get("맛 메모","내가 느낀 맛"),remaining,remainingBasis:/실측/.test(remaining)?"measured":/추정|약|~|로그|기록 합산/.test(remaining)?"estimated":"unknown",
      state, status:beanStatus(state),category:/언스페셜티.*블렌드/.test(name)?"unspecialty blend":/블렌드/i.test(name)?"blend":/스페셜 싱글/.test(name)?"special single":"single origin",source:"owned",flavorSource:"vendor",section});
  }
  for(const line of content.replaceAll("\r","").split("\n")) {
    if(/^##\s/.test(line)){flush();current=null;section=line.replace(/^##\s+/,"");}
    else if(/^###\s/.test(line)){flush();current={name:line.replace(/^###\s+/,"").trim(),fields:{}};}
    else if(current){const m=line.match(/^[-*]\s+([^:：]+)[:：]\s*(.*)$/);if(m)current.fields[m[1].trim()]=m[2].trim();}
  }
  flush();
  const unique=new Map();for(const item of records) unique.set(item.id,item);
  if(!unique.size) throw new Error("### 원두명과 - 상태: 등의 항목을 찾지 못했습니다. 원본 형식을 확인해 주세요.");
  if(unique.size>500)throw new Error("원두 파일은 최대 500종입니다. 기존 원두는 유지합니다.");
  return [...unique.values()];
}
export function validateBeansFile(data) {
  if(data?.schemaVersion!==1 || !Array.isArray(data.beans) || data.beans.length>500) throw new Error("지원하지 않는 원두 백업 파일입니다.");
  return data.beans.map(bean=> {
    if(!bean || typeof bean.name!=="string" || !bean.name.trim())throw new Error("원두명이 없는 항목이 있습니다.");
    const fields=["id","name","roastery","origin","variety","process","roast","roastDate","remaining","state","tasteNote","section"];
    const item=Object.fromEntries(fields.map(key=>[key,text(bean[key]).slice(0,2000)]));
    item.id=item.id || `owned-${hash(`${item.name}|${item.roastery}|${item.roastDate}`)}`;
    return {...item,source:"owned",category:["unspecialty blend","blend","single origin","special single","easy"].includes(bean.category)?bean.category:"single origin",flavors:Array.isArray(bean.flavors)?bean.flavors.filter(x=>typeof x==="string").slice(0,20):[],flavorSource:"vendor",status:["held","exhausted","pending","unknown"].includes(bean.status)?bean.status:beanStatus(item.state),remainingBasis:["estimated","measured","unknown"].includes(bean.remainingBasis)?bean.remainingBasis:"unknown"};
  });
}
export function mergeBeans(previous, incoming) {
  const values=new Map(previous.map(item=>[item.id,item]));for(const item of incoming)values.set(item.id,item);return [...values.values()];
}
export const inventoryLabels={held:"보유 / 마시는 중",exhausted:"소진",pending:"배송 / 주문 중",unknown:"보유 미확인"};
