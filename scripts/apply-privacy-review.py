"""Apply the shared privacy UI to the authorized local Roast & Reverb versions.
Preserves each version's screens, storage format, and branch.
"""
from pathlib import Path
import re

SOURCE=Path(__file__).resolve().parents[1]
ROOT=SOURCE.parent
PROJECTS=sorted(p for p in ROOT.iterdir() if p.is_dir() and p.name.startswith('roast-') and (p/'frontend/src/App.jsx').exists())
COMMON=['components/auth/RegistrationConsent.jsx','components/common/PrivacyControls.jsx','utils/privacyPreferences.js','styles/privacy.css']
TITLES={'privacy':'개인정보처리방침','terms':'이용약관','refund':'환불정책','cookies':'쿠키정책','rights':'이미지·음악·글꼴 출처'}
STYLE='body{margin:0;background:#f7f8f4;color:#203429;font:16px/1.85 system-ui,sans-serif;word-break:keep-all}main{max-width:800px;margin:24px auto;padding:28px;background:white}h1{font-size:28px}h2{font-size:21px;margin-top:32px}a{color:#24513d;text-underline-offset:4px}a:focus-visible{outline:3px solid #17634b;outline-offset:4px}p,li{overflow-wrap:anywhere}nav{display:flex;gap:16px;flex-wrap:wrap}@media(max-width:600px){main{margin:12px;padding:20px}}'
CONTENTS={
'privacy':'''<p>운영 및 개인정보 문의: Roast &amp; Reverb 운영자 · <a href="mailto:gywns7967@gmail.com">gywns7967@gmail.com</a></p>
<h2>처리 항목·목적·보관</h2><ul><li>이메일 가입을 제공하는 서버 버전: 이메일·닉네임·비밀번호를 가입·인증·기록장 제공에 사용합니다. 비밀번호는 해시로 보관합니다. 계정 정보와 서버 기록은 이용 기간 동안 보관하고, 삭제 요청 시 본인 확인 후 처리합니다.</li><li>Google 로그인을 제공하는 버전: 사용자가 요청한 인증과 계정 연결을 위해 Google 고유 식별자·인증된 이메일·이름을 처리합니다. 이름은 닉네임 초기값입니다. Google 비밀번호·주소록·메일·Drive·청취 이력·Google 액세스/갱신 토큰은 계정 자료로 수집하지 않습니다.</li><li>직접 작성·가져온 커피·음악·페어링·컬렉션·취향·초안과 원두 사진은 저장·조회·수정·선택한 추천에 사용합니다. 실명·전화번호·주소·주민등록번호·생년월일은 요구하지 않습니다. 자유 입력에 타인의 정보와 민감정보를 넣지 마세요.</li><li>브라우저 체험에서는 회원가입 없이 기기에 기록을 저장합니다. 기기 자료는 직접 삭제하거나 브라우저 사이트 데이터를 지울 때까지 보관됩니다. 다운로드한 백업은 직접 삭제해야 합니다.</li></ul>
<h2>저장 위치·외부 처리</h2><p>체험과 서버 버전은 구분됩니다. 서버 버전의 계정·일지·Google 연결 정보는 Railway 미국 리전 서버에서 처리됩니다. 브라우저에는 서비스 인증 토큰·초안·기기 전용 자료·선택 설정이 남을 수 있습니다. 기기 자료는 로그인만으로 동기화되지 않습니다. Google 인증을 선택하면 최대 5분의 일회용 확인값과 임시 세션 쿠키를 사용합니다.</p><ul><li>Railway: 서버 호스팅과 데이터 보관. 계정 및 저장한 서버 기록을 서비스 이용 기간 처리합니다.</li><li>Google: 선택한 Google 인증을 처리합니다. YouTube는 외부 재생 허용 및 재생 조작 후 연결되며 IP·기기·재생 정보를 받을 수 있습니다.</li><li>MusicBrainz·YouTube: 사용자가 검색·링크 조회를 실행할 때 검색어·곡 식별자와 접속 정보를 전달할 수 있습니다.</li><li>Hugging Face: 사용자가 기기 내 의미 모델 추천을 실행할 때 모델 파일을 내려받습니다. 모델 다운로드 접속 정보가 전달될 수 있으나 기기 내 추론 입력 문장은 모델 서버로 보내지 않습니다.</li><li>외부 AI가 연결된 서버 버전: 사용자가 AI 분석·대화를 실행하면 입력 문장·대화 맥락·선택한 커피/음악 특징을 OpenAI 또는 Anthropic에 보냅니다. 비밀번호·로그인 토큰은 포함하지 않습니다. AI를 사용하지 않고 직접 기록할 수 있습니다.</li></ul><p>외부 서비스는 해외에서 처리할 수 있습니다. 외부 기능은 선택 사항이며 사용을 중단할 수 있습니다. 외부 사업자의 보관·재이전·국외이전 조건은 계약 및 해당 정책에 따라 달라집니다. 운영자는 실제 연결된 사업자의 이전 국가·시점·방법·보관 기간·법적 근거를 운영 설정과 대조해 관리해야 합니다. 현재 화면의 안내만으로 이 확인을 대신하지 않습니다.</p>
<h2>쿠키·동의와 아동</h2><p>광고·방문 통계 추적기는 사용하지 않습니다. <a href="cookies.html">쿠키정책</a>에서 저장 항목을 확인하세요. 선택적 외부 재생은 기본 차단이며 언제든 설정에서 철회할 수 있습니다. 신규 회원가입은 만 14세 이상 확인 후 진행합니다. 생년월일·신분증은 수집하지 않습니다. 만 14세 미만 아동의 가입은 제공하지 않으며 관련 정보가 발견되면 위 문의처로 삭제를 요청해 주세요.</p>
<h2>열람·정정·삭제·처리정지</h2><p>개별 기록은 각 화면에서 수정·삭제할 수 있습니다. 모든 화면 아래의 ‘쿠키 설정·개인정보 삭제 요청’에서 계정·서버 기록·Google 연결 정보의 삭제 또는 권리 행사를 요청하는 메일을 작성할 수 있습니다. 직접 발송해야 접수됩니다. 이메일을 이용할 수 없으면 기기 자료는 브라우저의 사이트 데이터 관리에서 지울 수 있습니다. 서비스 계정은 운영자 확인 후 처리하며 법령상 보관할 자료가 있다면 항목·근거·기간을 안내합니다. 파기 시 복구가 어렵도록 삭제합니다. 백업·호스팅 로그의 실제 보관 기간은 운영 점검 대상이며 즉시 완전 삭제를 보장하지 않습니다.</p><p>기기 자료 삭제는 서버 계정 삭제와 다릅니다. Google의 제3자 연결 철회도 서비스 기록 삭제와 별개입니다. 요청에 비밀번호·인증 토큰을 첨부하지 마세요. 요청자 확인에 필요한 최소 정보만 확인하며 처리 결과를 회신합니다.</p><h2>보호 조치·변경</h2><p>HTTPS·비밀번호 해시·인증 및 회원별 접근 제한을 사용합니다. 정보의 판매나 광고용 제공은 하지 않습니다. 중요한 변경은 시행일과 함께 안내합니다. 피해 상담은 <a href="https://privacy.kisa.or.kr/">개인정보침해 신고센터</a>를 이용할 수 있습니다.</p>''',
'terms':'''<p>Roast &amp; Reverb는 커피와 음악의 개인 기록장입니다. 운영 문의는 <a href="mailto:gywns7967@gmail.com">gywns7967@gmail.com</a>입니다.</p><h2>이용과 계정</h2><p>만 14세 이상이 가입할 수 있습니다. 본인 이메일을 사용하고 비밀번호를 안전하게 관리해 주세요. 타인의 개인정보·권리 침해 자료, 불법 콘텐츠를 올리거나 다른 회원의 기록에 접근하면 안 됩니다. 이용 제한이 필요한 경우 사유를 안내하며 문의처로 이의를 제기할 수 있습니다.</p><h2>체험·저장·서비스 범위</h2><p>브라우저 체험 자료는 해당 기기에 저장되며 서버 동기화가 아닙니다. 서버 버전은 로그인한 계정의 일지를 보관하며 일부 도구는 기기에만 저장됩니다. 사이트 데이터 삭제 전 백업하세요. 서비스 점검·외부 API 장애·변경 시 일부 기능이 중단될 수 있으며 가능한 경우 안내합니다.</p><h2>비용과 외부 연결</h2><p>현재 서비스에 유료 구독·자동 결제·결제 정보 입력 기능은 없습니다. 외부 원두 판매처·통신사·콘텐츠 서비스의 비용은 해당 서비스에서 확인하세요. 유료 기능을 도입할 때는 가격·갱신·해지·환불 조건을 먼저 알리고 별도로 동의를 받습니다.</p><h2>추천과 콘텐츠 권리</h2><p>추천·AI 응답은 입력 및 공개 설명에 따른 참고 후보입니다. 만족도·건강 효능·객관적 품질을 보장하지 않으며 사용자의 실제 추출·청취로 간주하지 않습니다. 사용자가 작성한 기록의 권리는 사용자에게 있으며 서비스 제공에 필요한 범위에서 처리합니다. 외부 음악·이미지의 권리는 각 권리자에게 있습니다.</p><h2>탈퇴·삭제·분쟁</h2><p>모든 화면의 개인정보 관리 또는 <a href="privacy.html">개인정보처리방침</a>의 문의처에서 삭제를 요청할 수 있습니다. 강행 법규에 따른 소비자 권리와 사업자의 책임을 배제하지 않습니다. 분쟁은 대한민국 관련 법령에 따라 해결합니다. 중요한 약관 변경은 내용·시행일을 사전에 알리고 필요한 동의를 다시 받습니다.</p>''',
'refund':'''<h2>현재 결제 여부</h2><p>Roast &amp; Reverb에는 현재 유료 구독·자동 갱신·결제 수단 등록·상품 판매 기능이 없습니다. 서비스 자체가 청구한 요금이 없어 환불할 결제도 없습니다.</p><h2>외부 구매</h2><p>월픽은 외부 판매처의 공개 정보를 보여줍니다. 실제 구매 가격·배송·취소·환불 조건은 판매처에서 확인하고 구매하세요. 외부 결제를 이 서비스의 결제로 표시하지 않습니다. 무료 음악 재생 중 외부 플랫폼 광고·멤버십·통신 데이터 비용이 발생할 수 있습니다.</p><h2>예상하지 못한 청구·향후 유료화</h2><p>Roast &amp; Reverb 명의의 알 수 없는 청구는 <a href="mailto:gywns7967@gmail.com">운영자</a>에게 문의하세요. 카드번호·비밀번호 전체를 보내지 마세요. 향후 유료화를 한다면 결제 전에 총가격·과금 주기·자동 갱신·해지·환불 조건을 명확히 안내하고 별도 동의를 받습니다. 법령에 따른 청약철회 등 권리를 제한하지 않습니다.</p>''',
'cookies':'''<h2>필수 저장</h2><p>로그인 토큰(roast-reverb-user), 체험 일지(roast-reverb-demo-v1), 기록 선택, 초안·원두·개인 취향(rr-discovery- 등), 관심 원두(rr-monthly-favorites-v1), 추천 선호(rr-pairing-preferences-v1), 쿠키 선택(rr-privacy-choice-v1)을 localStorage에 보관할 수 있습니다. 자료는 삭제하기 전까지 해당 기기에 남습니다. 버전에 따라 제공하지 않는 항목도 있습니다.</p><p>사용자가 연결한 원두 파일의 읽기 핸들은 IndexedDB(rr-private-bean-files)에 보관하며 원본 파일 자체를 업로드하지 않습니다. 의미 모델을 실행하면 모델 파일이 Cache Storage에 남을 수 있습니다. 브라우저의 사이트 데이터 관리에서 캐시까지 지울 수 있습니다. Google 인증을 실행할 때 임시 세션 쿠키와 최대 5분짜리 확인값을 사용합니다.</p><h2>선택적 외부 재생</h2><p>YouTube 외부 재생은 기본 차단합니다. ‘쿠키 설정’에서 허용하고 직접 재생해야 연결됩니다. youtube-nocookie.com을 사용해도 IP·기기 정보 전송이나 외부 저장이 전혀 없다는 뜻은 아닙니다. Google 로그인 SDK도 ‘Google 연결 준비’를 누른 뒤에 불러옵니다. 광고·방문 통계 SDK는 넣지 않았습니다. 외부 서비스의 처리는 <a href="https://policies.google.com/privacy?hl=ko">Google 개인정보처리방침</a>을 확인하세요.</p><h2>선택 변경과 삭제</h2><p>서비스 화면 아래 ‘쿠키 설정·개인정보 삭제 요청’에서 필수만 사용하거나 외부 재생 허용을 바꿀 수 있습니다. 거부해도 기록 기능을 이용할 수 있습니다. 필수 저장 차단은 브라우저 설정에서 할 수 있으나 기록 저장·로그인 유지가 제한됩니다. 브라우저 사이트 데이터 삭제는 서버 계정이나 외부 서비스에 이미 전달된 자료를 삭제하지 않습니다.</p>''',
'rights':'''<h2>브랜드 이미지·장식</h2><p>커피와 레코드의 브랜드 연출 이미지는 프로젝트 제작 기록에 따라 AI로 생성한 자체 연출 자산입니다. 실제 원두·앨범 사진이나 사용자 후기의 증거로 사용하지 않습니다. CSS 장식과 그래픽은 서비스 자체 제작입니다. 문맥상 장식인 이미지에는 빈 대체 텍스트를, 정보 이미지에는 설명을 제공합니다.</p><h2>글꼴·소프트웨어</h2><p>기본 글꼴은 기기의 시스템 글꼴입니다. Google Fonts 자동 호출은 제거했습니다. React·Lucide 등 라이브러리는 각 패키지의 라이선스에 따르며 모델 저작권 표시는 제공 버전의 third-party 폴더를 참고하세요. 실제 배포 자산별 제작 기록과 라이선스 점검은 저장소의 개인정보·접근성 점검 문서에 관리합니다.</p><h2>외부 상품·음악·사용자 업로드</h2><p>월픽 상품 설명·색상·가격은 판매처 공개 자료를 출처와 함께 표시하며 권리 소유를 주장하지 않습니다. 공개 열람 가능하다는 이유만으로 재이용 허락을 얻은 것으로 보지 않습니다. 권리 문의가 있으면 운영자에게 알려 주세요. 확인되지 않은 상품 사진을 자체 소유 이미지처럼 사용하지 않습니다.</p><p>음악은 공식 외부 링크·플레이어로 연결하며 음원을 복제·판매하지 않습니다. 재생 가능 여부는 외부 플랫폼에 따릅니다. 직접 올리는 원두 사진·자료는 이용 권한이 있는 것만 선택하고 타인의 개인정보를 포함하지 마세요. 권리 문의: <a href="mailto:gywns7967@gmail.com">gywns7967@gmail.com</a>.</p>'''
}

def put(path,text):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(text,encoding='utf-8',newline='\n')

for project in PROJECTS:
    src=project/'frontend/src'
    for name in COMMON:
        text=(SOURCE/'frontend/src'/name).read_text(encoding='utf-8')
        if name.endswith('PrivacyControls.jsx'):
            text=text.replace("import {authStore} from '../../store/authStore.js';\n",'')
            if not (src/'utils/deviceBackup.js').exists():
                text=text.replace("import {backupKeys} from '../../utils/deviceBackup.js';", "const backupKeys=scope=>Object.fromEntries(Object.keys(localStorage).filter(key=>key==='roast-reverb-demo-v1'||key==='rr-monthly-favorites-v1'||key==='rr-pairing-preferences-v1'||key.startsWith('rr-discovery-')&&key.endsWith('-'+encodeURIComponent(scope))).map(key=>[key,key]));")
            if not (src/'store/beanFileStore.js').exists():
                text=text.replace("import {disconnectBeanFile} from '../../store/beanFileStore.js';",'const disconnectBeanFile=async()=>{};')
        put(src/name,text)
    app=src/'App.jsx'; text=app.read_text(encoding='utf-8')
    if 'PrivacyControls' not in text:
        text='import PrivacyControls from "./components/common/PrivacyControls.jsx";\n'+text
        text=text.replace('<AppRouter />','<AppRouter />\n      <PrivacyControls />')
        text+='\nimport "./styles/privacy.css";\n'
    put(app,text)
    for filename,key in [('pages/auth/JoinPage.jsx','join'),('components/auth/AuthModal.jsx','modal')]:
        path=src/filename
        if not path.exists():continue
        text=path.read_text(encoding='utf-8')
        if 'RegistrationConsent' not in text:
            rel='../../components/auth/RegistrationConsent.jsx' if key=='join' else './RegistrationConsent.jsx'
            text=f'import RegistrationConsent from "{rel}";\n'+text
            text=text.replace('const [form, setForm]', 'const [consent,setConsent]=useState({age:false,terms:false,privacy:false});\n  const [form, setForm]',1)
            guard='if (!consent.age || !consent.terms || !consent.privacy) { '+('setError' if key=='join' else 'setMessage')+'("나이 확인과 필수 동의 항목을 확인해 주세요."); return; }'
            if key=='join':
                text=text.replace('async function handleJoin() {','async function handleJoin() {\n    '+guard)
                text=text.replace('<Button','<RegistrationConsent value={consent} onChange={setConsent}/>\n          <Button',1)
            else:
                text=text.replace('async function handleSubmit() {','async function handleSubmit() {\n    if (isJoin) { '+guard+' }')
                text=text.replace('<Button','{isJoin&&<RegistrationConsent value={consent} onChange={setConsent}/>}\n          <Button',1)
        text=text.replace('authApi.join(form)', 'authApi.join({...form,policyVersion:"2026-11-01",ageConfirmed:consent.age,termsAccepted:consent.terms,privacyAccepted:consent.privacy})')
        put(path,text)
    google=src/'components/auth/GoogleSignIn.jsx'
    if google.exists():
        text=google.read_text(encoding='utf-8')
        if 'requested' not in text:
            text='import RegistrationConsent from "./RegistrationConsent.jsx";\n'+text
            text=text.replace('const host = useRef(null);','const [requested,setRequested]=useState(false);\n  const [consent,setConsent]=useState({age:false,terms:false,privacy:false});\n  const host = useRef(null);')
            text=text.replace('if (import.meta.env.VITE_USE_REAL_API !== "true") return;','if (import.meta.env.VITE_USE_REAL_API !== "true" || !requested) return;')
            text=text.replace('}, [link, attempt]);','}, [link, attempt, requested]);')
            text=text.replace('if (!enabled && !error) return null;','if (import.meta.env.VITE_USE_REAL_API !== "true") return null;\n  if (!requested) return <section className="google-auth"><p>Google 연결을 준비하면 Google 인증 SDK가 로드되어 IP·브라우저 정보가 전달될 수 있습니다. 이메일로도 로그인할 수 있습니다. 새 계정이 만들어질 수 있어 아래 항목을 확인해 주세요. Google 인증 시 이메일·이름·고유 식별자를 처리합니다.</p><RegistrationConsent value={consent} onChange={setConsent}/><button type="button" className="ghost-button" disabled={!consent.age||!consent.terms||!consent.privacy} onClick={()=>setRequested(true)}>Google 연결 준비</button></section>;')
        text=text.replace('jsonOptions("POST", { credential })','jsonOptions("POST", { credential,policyVersion:"2026-11-01",ageConfirmed:String(consent.age),termsAccepted:String(consent.terms),privacyAccepted:String(consent.privacy) })')
        text=text.replace('<RegistrationConsent value={consent}', '<RegistrationConsent google value={consent}')
        text=text.replace('if (disposed || !config.enabled) return;', 'if (disposed) return;\n        if (!config.enabled) { setError("Google 로그인이 연결되지 않았습니다. 이메일로 이용해 주세요."); return; }')
        put(google,text)
    player=src/'components/music/BrewPlaylist.jsx'
    if player.exists():
        text=player.read_text(encoding='utf-8')
        if 'readPrivacy' not in text:
            text="import {readPrivacy,openPrivacy} from '../../utils/privacyPreferences.js';\n"+text
            text=text.replace(" const defaults=tracks===undefined;", " const [externalAllowed,setExternalAllowed]=useState(()=>readPrivacy()?.externalMedia===true);\n useEffect(()=>{const update=()=>setExternalAllowed(readPrivacy()?.externalMedia===true);window.addEventListener('rr-privacy-changed',update);window.addEventListener('storage',update);return()=>{window.removeEventListener('rr-privacy-changed',update);window.removeEventListener('storage',update);};},[]);\n useEffect(()=>{if(!externalAllowed)setRunning(false);},[externalAllowed]);\n const defaults=tracks===undefined;")
            text=text.replace('running&&src?', 'running&&src&&externalAllowed?')
            text=text.replace('  {error&&', '  {!externalAllowed&&<p className="rr-media-blocked">YouTube 연결은 꺼져 있어요. 곡 선택과 기록은 계속할 수 있습니다. <button type="button" onClick={openPrivacy}>외부 재생 설정 열기</button></p>}\n  {error&&')
        if 'function startPlayback()' not in text:
            text=text.replace('setRunning(true)','startPlayback()')
            text=text.replace(' const defaults=tracks===undefined;', ' function startPlayback(){if(!externalAllowed){openPrivacy();return;}setRunning(true);}\n const defaults=tracks===undefined;')
        put(player,text)
    index=project/'frontend/index.html'
    text=index.read_text(encoding='utf-8')
    text=re.sub(r'\s*<link[^>]+href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>','',text)
    put(index,text)
    # All policies must be public in authenticated server deployments too.
    security=project/'backend/src/main/java/com/roastreverb/global/config/SecurityConfig.java'
    if security.exists():
        text=security.read_text(encoding='utf-8')
        if '"/terms.html"' not in text:
            text=text.replace('"/privacy.html",','"/privacy.html", "/terms.html", "/refund.html", "/cookies.html", "/rights.html",')
            if '"/privacy.html"' not in text:text=text.replace('"/index.html",','"/index.html", "/privacy.html", "/terms.html", "/refund.html", "/cookies.html", "/rights.html",')
        if '"/third-party/frontend-notices.txt"' not in text:
            text=text.replace('"/rights.html",','"/rights.html", "/third-party/frontend-notices.txt",')
        put(security,text)
    java=project/'backend/src/main/java/com/roastreverb/domain/member'
    if java.exists():
        for name in ['mapper/PolicyConsentMapper.java','service/PolicyConsent.java']:
            put(java/name,(SOURCE/'backend/src/main/java/com/roastreverb/domain/member'/name).read_text(encoding='utf-8'))
        service=java/'service/MemberService.java'
        text=service.read_text(encoding='utf-8')
        if 'PolicyConsent.require' not in text:
            text=text.replace('private final PasswordEncoder passwordEncoder;', 'private final PasswordEncoder passwordEncoder;\n    private final com.roastreverb.domain.member.mapper.PolicyConsentMapper policyConsents;')
            text=text.replace('PasswordEncoder passwordEncoder) {','PasswordEncoder passwordEncoder, com.roastreverb.domain.member.mapper.PolicyConsentMapper policyConsents) {\n        this.policyConsents=policyConsents;')
            text=text.replace('public Map<String, Object> join(Map<String, Object> member) {','@org.springframework.transaction.annotation.Transactional\n    public Map<String, Object> join(Map<String, Object> member) {\n        PolicyConsent.require(member);')
            text=text.replace('memberMapper.insert(member);','memberMapper.insert(member);\n        policyConsents.record(((Number)member.get("memberId")).longValue(),PolicyConsent.VERSION);')
        put(service,text)
        social=java/'social/GoogleAccountService.java'
        if social.exists():
            text=social.read_text(encoding='utf-8')
            if 'policyConsents' not in text:
                text=text.replace('private final MemberMapper members;', 'private final PolicyConsentMapper policyConsents;\n private final MemberMapper members;')
                text=text.replace('JwtProvider tokens) {','JwtProvider tokens,PolicyConsentMapper policyConsents) {\n  this.policyConsents=policyConsents;')
                text=text.replace('finish(Jwt identity, Long linkMember)', 'finish(Jwt identity, Long linkMember, boolean consentAccepted)')
                text=text.replace('} else if(memberId==null) {','} else if(memberId==null) {\n   if(!consentAccepted)throw new CustomException(HttpStatus.BAD_REQUEST,"新規 가입에는 만 14세 이상 확인과 현재 약관·개인정보 동의가 필요합니다.");')
                text=text.replace('新規 가입','신규 가입')
                text=text.replace('memberId=((Number)member.get("memberId")).longValue();','memberId=((Number)member.get("memberId")).longValue();\n   policyConsents.record(memberId,com.roastreverb.domain.member.service.PolicyConsent.VERSION);')
            put(social,text)
            controller=java/'social/GoogleLoginController.java';text=controller.read_text(encoding='utf-8')
            text=text.replace('accounts.finish(identity,challenge.linkMember())','accounts.finish(identity,challenge.linkMember(),"2026-11-01".equals(body.get("policyVersion"))&&"true".equals(body.get("ageConfirmed"))&&"true".equals(body.get("termsAccepted"))&&"true".equals(body.get("privacyAccepted")))')
            put(controller,text)
        schema=project/'backend/src/main/resources/schema.sql';text=schema.read_text(encoding='utf-8')
        if 'CREATE TABLE IF NOT EXISTS member_policy_consent' not in text:
            text+='\nCREATE TABLE IF NOT EXISTS member_policy_consent (\n member_id BIGINT NOT NULL,\n policy_version VARCHAR(20) NOT NULL,\n age_confirmed BOOLEAN NOT NULL,\n accepted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n PRIMARY KEY(member_id,policy_version),\n FOREIGN KEY(member_id) REFERENCES member(member_id) ON DELETE CASCADE\n);\n'
        text=text.replace('FOREIGN KEY(member_id) REFERENCES member(member_id)\n);','FOREIGN KEY(member_id) REFERENCES member(member_id) ON DELETE CASCADE\n);')
        put(schema,text)
        for test in (project/'backend/src/test').rglob('*.java'):
            if test.name in ['PrivacyRegistrationTest.java','PolicyConsentTest.java']:continue
            text=test.read_text(encoding='utf-8')
            # Existing fixtures must explicitly accept the new signup contract.
            text=text.replace(r'{\"email\":',r'{\"policyVersion\":\"2026-11-01\",\"ageConfirmed\":true,\"termsAccepted\":true,\"privacyAccepted\":true,\"email\":')
            text=text.replace('Map.of("email",','Map.of("policyVersion","2026-11-01","ageConfirmed",true,"termsAccepted",true,"privacyAccepted",true,"email",')
            text=text.replace(r'{\"credential\":\"',r'{\"policyVersion\":\"2026-11-01\",\"ageConfirmed\":\"true\",\"termsAccepted\":\"true\",\"privacyAccepted\":\"true\",\"credential\":\"')
            put(test,text)
        put(project/'backend/src/test/java/com/roastreverb/PolicyConsentTest.java',(SOURCE/'backend/src/test/java/com/roastreverb/PolicyConsentTest.java').read_text(encoding='utf-8'))
        registration=(SOURCE/'backend/src/test/java/com/roastreverb/PrivacyRegistrationTest.java').read_text(encoding='utf-8')
        sample=(project/'backend/src/test/java/com/roastreverb/CoffeeBrewDetailsTest.java').read_text(encoding='utf-8')
        if 'org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc' in sample:
            registration=registration.replace('org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc','org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc')
        put(project/'backend/src/test/java/com/roastreverb/PrivacyRegistrationTest.java',registration)
        verifier=project/'backend/scripts/verify-production.mjs'
        if verifier.exists():
            text=verifier.read_text(encoding='utf-8')
            text=text.replace('api("/auth/join", "POST", {','api("/auth/join", "POST", {policyVersion:"2026-11-01",ageConfirmed:true,termsAccepted:true,privacyAccepted:true,') if 'policyVersion' not in text else text
            put(verifier,text)
    put(project/'frontend/tests/privacy.test.mjs',(SOURCE/'frontend/tests/privacy.test.mjs').read_text(encoding='utf-8'))
    mock=src/'api/mockApi.js';text=mock.read_text(encoding='utf-8')
    if '/* A damaged local copy does not prevent opening the diary. */' in text:
        text=text.replace('const tables = { coffeeLogs, musicLogs, pairings, collections, monthlyPicks };','const tables = { coffeeLogs, musicLogs, pairings, collections, monthlyPicks };\nlet storageError=null;\nfor(const items of Object.values(tables))items.splice(0);')
        text=text.replace('} catch { /* A damaged local copy does not prevent opening the diary. */ }','} catch { storageError=new Error("저장 자료를 읽지 못했습니다. 기존 자료를 보존한 뒤 브라우저 사이트 설정에서 확인해 주세요."); }')
        text=text.replace('export async function mockRequest(path, options={}) {','export async function mockRequest(path, options={}) {\n if(storageError)throw storageError;')
        text=text.replace('avgAcidity: 4, avgSweetness: 3.5, avgBitterness: 1.5, avgBody: 3.5, avgAroma: 4', '**PLACEHOLDER**')
        text=text.replace('**PLACEHOLDER**', ', '.join('avg'+field[0].upper()+field[1:]+': (()=>{const values=coffeeLogs.map(x=>x.'+field+').filter(Number.isFinite);return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;})()' for field in ['acidity','sweetness','bitterness','body','aroma']))
        put(mock,text)
    for name,title in TITLES.items():
        nav=''.join(f'<a href="{other}.html">{label}</a>' for other,label in TITLES.items() if other!=name)
        content=CONTENTS[name]
        if name=='rights':content+='<p><a href="third-party/frontend-notices.txt">오픈소스 저작권·라이선스 전문</a></p>'
        if name=='privacy':content=content.replace('<h2>저장 위치·외부 처리</h2>','<p>신규 회원의 필수 동의 여부·정책 버전·동의 시각·만 14세 이상 확인을 계정과 함께 보관합니다. 생년월일과 신분증은 보관하지 않습니다.</p><h2>저장 위치·외부 처리</h2>')
        html=f'<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} · Roast &amp; Reverb</title><style>{STYLE}</style></head><body><main><a href="./">서비스로 돌아가기</a><h1>{title}</h1><p>시행일: 2026년 11월 1일</p>{content}<nav aria-label="다른 정책">{nav}</nav></main></body></html>\n'
        put(project/f'frontend/public/{name}.html',html)
    print(project.name)
