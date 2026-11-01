export default function RegistrationConsent({value,onChange,google=false}) {
  return <fieldset className="rr-consents"><legend>가입 전 확인</legend>
    <label><input type="checkbox" required checked={value.age} onChange={e=>onChange({...value,age:e.target.checked})}/> 만 14세 이상입니다. 생년월일은 수집하지 않습니다.</label>
    <label><input type="checkbox" required checked={value.terms} onChange={e=>onChange({...value,terms:e.target.checked})}/> <span><a href={`${import.meta.env.BASE_URL}terms.html`} target="_blank" rel="noreferrer">이용약관</a>에 동의합니다. (필수)</span></label>
    <label><input type="checkbox" required checked={value.privacy} onChange={e=>onChange({...value,privacy:e.target.checked})}/> <span>계정 제공을 위한 {google?'Google 식별자·이메일·이름':'이메일·닉네임·비밀번호'} 처리에 동의합니다. (필수) <a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noreferrer">목적·보관·삭제 방법</a></span></label>
    <p>거부하면 회원가입이 제한됩니다. 광고 수신 동의는 받지 않으며, 민감정보·주소·전화번호를 입력하지 마세요.</p>
  </fieldset>;
}
