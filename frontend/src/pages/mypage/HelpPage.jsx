import {Link} from 'react-router-dom';
import PageShell from '../../components/common/PageShell.jsx';
const answers=[
 ['처음에는 무엇부터 하면 좋을까요?','취향 여정의 첫 가이드를 열고 마음에 남는 질문 하나에만 답해보세요. 가지고 있는 커피와 좋아하는 한 곡이면 충분합니다. 원두 파일이나 자세한 추출 조건 없이 시작할 수 있어요.','/journey','첫 발견 시작하기'],
 ['추천과 새 연주 만들기는 어떻게 다른가요?','추천은 기록하거나 후보에 추가한 기존 음악을 골라줍니다. 한 잔의 사운드는 새로운 연주를 만들어 직접 듣고 내려받는 곳이에요. 기존 아티스트의 곡을 복제하거나 보컬을 만들지는 않습니다.','/studio','한 잔의 사운드 열기'],
 ['무엇을 저장하면 다음 추천이 달라지나요?','청음실에 직접 적은 취향 문장과, 실제로 마시고 들었다고 확인한 감상 평가를 참고합니다. 취향 여정의 마지막 문장은 원할 때 직접 청음실에 적용할 수 있어요. 그냥 페이지를 열었다는 이유로 좋아한다고 판단하지 않습니다.','/ritual','나의 청음실'],
 ['작성 중 다른 화면으로 가도 괜찮나요?','커피·음악·발견 노트는 입력할 때 이 기기에 초안을 남깁니다. 돌아오면 이어서 쓸 수 있어요. 저장 실패 안내가 보이면 화면을 닫기 전에 입력을 따로 보관해 주세요. 초안은 정식 일지가 아닙니다.','/coffee/write','작성하던 커피 이어쓰기'],
 ['다른 기기에서도 내 기록이 보이나요?','현재 체험 화면의 원두·취향·발견 노트·사운드는 이 브라우저에 저장됩니다. 다른 기기로 옮기려면 백업 파일을 내려받아 복구해 주세요. 실제 서버 계정으로 저장한 일지와 기기 자료의 저장 위치는 다릅니다.','/backup','나의 자료 백업·복구'],
 ['곡을 서비스 안에서 계속 들을 수 있나요?','기존 곡은 음악 서비스 링크를 열어 직접 재생합니다. 그 서비스의 로그인이나 이용 조건이 적용될 수 있어요. 이 서비스는 기존 곡의 음원을 판매하거나 스트리밍 이용권을 제공하지 않습니다. 직접 만든 연주는 사운드 화면에서 들을 수 있어요.','/recommend','곡을 찾아 후보에 추가'],
 ['AI 대화가 안 될 때도 쓸 수 있나요?','취향 여정, 기록, 기기에서 하는 추천과 연주 만들기는 AI 대화와 별개입니다. AI 대화는 연결된 서버와 사용 가능한 크레딧이 있어야 합니다. 오류가 있어도 작성한 일지나 음악 선반을 지우지 않습니다.','/connections','자료 연결 상태 확인'],
];
export default function HelpPage(){return <PageShell title="도움이 필요할 때" eyebrow="MAKE YOURSELF AT HOME" subtitle="처음의 작은 궁금함부터, 내 기록을 안전하게 옮기는 방법까지."><section className="help-start panel"><h2>정교한 기록보다, 나만의 한 문장부터.</h2><p>처음에는 취향 여정에서 한 가지 감각을 살펴보세요. 매일 작성하거나 모든 칸을 채울 필요는 없습니다.</p><Link className="primary-button" to="/journey">나의 첫 발견 시작하기 ↗</Link></section><div className="help-faq">{answers.map(([question,answer,to,label])=><details className="panel" key={question}><summary>{question}</summary><p>{answer}</p><Link to={to}>{label} ↗</Link></details>)}</div><section className="panel help-start"><h2>저장한 자료가 보이지 않나요?</h2><p>먼저 같은 브라우저와 같은 계정인지 확인해 주세요. 저장소를 지우거나 다시 가져오기 전에 현재 자료를 백업하면 복구할 여지를 남길 수 있습니다.</p><div className="action-row"><Link className="ghost-button" to="/backup">백업·복구</Link><Link className="ghost-button" to="/connections">연결 확인</Link></div></section></PageShell>;}
