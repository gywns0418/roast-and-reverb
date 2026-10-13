import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { adminApi } from "../../api/adminApi.js";
import { formatDate } from "../../api/adapters.js";
import { useApiResource } from "../../hooks/useApiResource.js";

const fallbackMembers = [
  { member_id: 1, nickname: "slow brew", email: "slow@example.com", status: "ACTIVE", updated_at: "2026-07-09" },
  { member_id: 2, nickname: "night cup", email: "night@example.com", status: "ACTIVE", updated_at: "2026-07-08" }
];

function statusVariant(status) {
  return status === "SUSPENDED" || status === "INACTIVE" ? "warm" : "cool";
}

export default function AdminMemberPage() {
  const { data: members } = useApiResource(
    () => adminApi.members({ limit: 30 }),
    fallbackMembers,
    []
  );

  return (
    <PageShell title="회원 관리" eyebrow="Admin" subtitle="회원 상태와 기록 활동을 확인합니다.">
      <div className="ledger">
        <div className="ledger-head">
          <span className="book smcp">Members</span>
          <span className="vol oldnum">{members.length} · Admin</span>
        </div>
        <div className="table-row table-head"><span>닉네임</span><span>상태</span><span>최근 변경</span></div>
        {members.length === 0
          ? <EmptyState>아직 등록된 회원이 없어요.</EmptyState>
          : members.map((member) => (
            <div className="table-row" key={member.member_id || member.memberId || member.email}>
              <span>{member.nickname || member.email}</span>
              <Tag variant={statusVariant(member.status)}>{member.status || "ACTIVE"}</Tag>
              <span className="oldnum">{formatDate(member.updated_at || member.updatedAt || member.created_at || member.createdAt)}</span>
            </div>
          ))}
      </div>
    </PageShell>
  );
}
