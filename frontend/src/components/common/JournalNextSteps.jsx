import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, PackageOpen, FolderDown } from "lucide-react";

const steps = [
  { to: "/dashboard", Icon: BookOpen, title: "한 잔 남기기", text: "맛을 잘 몰라도, 오늘 기억나는 느낌부터." },
  { to: "/monthly-pick", Icon: PackageOpen, title: "다음 원두 찾기", text: "좋아했던 맛을 컵노트로 검색하고, 용량별 가격을 비교해보세요." },
  { to: "/backup", Icon: FolderDown, title: "기록 안전하게 보관하기", text: "기기를 옮기기 전 백업 파일로 챙겨두세요." },
];

export default function JournalNextSteps({ omit }) {
  return <nav className="journal-next-steps" aria-label="기록장 이어서 사용하기">
    {steps.filter(step => step.to !== omit).map(({ to, Icon, title, text }) =>
      <Link key={to} to={to}>
        <Icon size={21} aria-hidden="true" />
        <div><strong>{title}</strong><p>{text}</p></div>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    )}
  </nav>;
}
