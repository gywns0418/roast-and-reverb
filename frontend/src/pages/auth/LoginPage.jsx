import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

export default function LoginPage() {
  return (
    <PageShell title="로그인" eyebrow="Roast & Reverb" subtitle="커피와 음악 취향 데이터를 이어서 기록합니다.">
      <section className="auth-panel">
        <Input type="email" placeholder="이메일" defaultValue="brewer@example.com" />
        <Input type="password" placeholder="비밀번호" defaultValue="password" />
        <Button>로그인</Button>
      </section>
    </PageShell>
  );
}
