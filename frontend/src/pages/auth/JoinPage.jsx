import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function JoinPage() {
  return (
    <PageShell title="회원가입" eyebrow="Roast & Reverb" subtitle="나만의 커피와 음악 페어링 기록장을 만듭니다.">
      <section className="auth-panel">
        <Input placeholder="닉네임" defaultValue="slow brew" />
        <Input type="email" placeholder="이메일" />
        <Input type="password" placeholder="비밀번호" />
        <Button>계정 만들기</Button>
      </section>
    </PageShell>
  );
}
