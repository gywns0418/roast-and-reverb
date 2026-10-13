import { useState } from "react";
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

const fallbackLogs = [
  { api_log_id: 1, request_summary: "PAIRING_ANALYSIS", provider: "Claude", success: true },
  { api_log_id: 2, request_summary: "NATURAL_LOG_PARSE", provider: "Claude", success: true }
];

const fallbackStats = [
  { stat_date: "2026-07-09", coffee_count: 2, music_count: 2, pairing_count: 1 },
  { stat_date: "2026-07-08", coffee_count: 1, music_count: 1, pairing_count: 1 }
];

function range() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 14);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10)
  };
}

function statusVariant(status) {
  return status === "SUSPENDED" || status === "INACTIVE" ? "warm" : "cool";
}

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("members");
  const { data: members } = useApiResource(
    () => adminApi.members({ limit: 30 }),
    fallbackMembers,
    []
  );
  const { data: logs } = useApiResource(
    () => adminApi.apiLogs({ limit: 50 }),
    fallbackLogs,
    []
  );
  const { data: stats } = useApiResource(
    () => adminApi.dailyStatistics(range()),
    fallbackStats,
    []
  );
  const totals = stats.reduce((acc, item) => ({
    coffee: acc.coffee + Number(item.coffee_count || item.coffeeCount || 0),
    music: acc.music + Number(item.music_count || item.musicCount || 0),
    pairing: acc.pairing + Number(item.pairing_count || item.pairingCount || 0)
  }), { coffee: 0, music: 0, pairing: 0 });

  return (
    <PageShell title="관리자 대시보드" eyebrow="Admin" subtitle="서비스 사용량과 AI 분석 상태를 확인합니다.">
      <div className="tabs">
        <button type="button" className={tab === "members" ? "tab active" : "tab"} onClick={() => setTab("members")}>회원 관리</button>
        <button type="button" className={tab === "ai" ? "tab active" : "tab"} onClick={() => setTab("ai")}>AI 로그</button>
        <button type="button" className={tab === "stats" ? "tab active" : "tab"} onClick={() => setTab("stats")}>운영 통계</button>
      </div>

      {tab === "members" && (
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
      )}

      {tab === "ai" && (
        <div className="ledger">
          <div className="ledger-head">
            <span className="book smcp">AI Calls</span>
            <span className="vol oldnum">{logs.length} · Admin</span>
          </div>
          <div className="table-row table-head"><span>요청</span><span>모델</span><span>상태</span></div>
          {logs.length === 0
            ? <EmptyState>아직 기록된 AI 호출이 없어요.</EmptyState>
            : logs.map((log) => (
              <div className="table-row" key={log.api_log_id || log.apiLogId || log.created_at}>
                <span>{log.request_summary || log.requestSummary || log.endpoint}</span>
                <span>{log.provider || "Claude"}</span>
                <Tag variant={log.success === false ? "warm" : "cool"}>{log.success === false ? "FAIL" : "SUCCESS"}</Tag>
              </div>
            ))}
        </div>
      )}

      {tab === "stats" && (
        <div className="dashboard-layout">
          <div className="ledger">
            <div className="ledger-head">
              <span className="book smcp">Daily Stats</span>
              <span className="vol oldnum">최근 14일</span>
            </div>
            {stats.length === 0
              ? <EmptyState>이 기간에는 기록된 통계가 없어요.</EmptyState>
              : stats.map((item, i) => (
                <div className={`ledger-line ${i < 3 ? "fresh" : "aged"}`} key={item.stat_date || item.statDate}>
                  <time className="oldnum">{formatDate(item.stat_date || item.statDate).slice(5)}.</time>
                  <span className="entry">
                    <span className="type-dot coffee" /> 커피 {item.coffee_count || item.coffeeCount || 0}
                    <span className="type-dot music" style={{ marginLeft: 10 }} /> 음악 {item.music_count || item.musicCount || 0}
                  </span>
                  <span className="no oldnum">페어링 {item.pairing_count || item.pairingCount || 0}</span>
                </div>
              ))}
          </div>
          <aside className="margin-panel">
            <div>
              <h4>Period Total</h4>
              <div className="margin-stat"><span>커피</span><strong className="oldnum">{totals.coffee}</strong></div>
              <div className="margin-stat"><span>음악</span><strong className="oldnum">{totals.music}</strong></div>
              <div className="margin-stat"><span>페어링</span><strong className="oldnum">{totals.pairing}</strong></div>
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
