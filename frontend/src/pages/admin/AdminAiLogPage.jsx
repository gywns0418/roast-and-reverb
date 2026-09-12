import PageShell from "../../components/common/PageShell.jsx";
import Tag from "../../components/common/Tag.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { adminApi } from "../../api/adminApi.js";
import { useApiResource } from "../../hooks/useApiResource.js";

const fallbackLogs = [
  { api_log_id: 1, request_summary: "PAIRING_ANALYSIS", provider: "Claude", success: true },
  { api_log_id: 2, request_summary: "NATURAL_LOG_PARSE", provider: "Claude", success: true }
];

export default function AdminAiLogPage() {
  const { data: logs } = useApiResource(
    () => adminApi.apiLogs({ limit: 50 }),
    fallbackLogs,
    []
  );

  return (
    <PageShell title="AI 호출 로그" eyebrow="Claude API" subtitle="자연어 파싱, 무드 추론, 페어링 생성 요청을 추적합니다.">
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
    </PageShell>
  );
}
