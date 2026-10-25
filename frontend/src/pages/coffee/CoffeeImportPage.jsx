import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import { coffeeApi } from "../../api/coffeeApi.js";
import { parseCoffeeMarkdown } from "../../utils/coffeeMarkdown.js";
import { readBrewDetails, brewSummary } from "../../utils/brewDetails.js";

export default function CoffeeImportPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function selectFiles(event) {
    setMessage("");
    setLoading(true);
    const files = Array.from(event.target.files || []);
    try {
      if (files.length > 100)
        throw new Error("한 번에 100개 이하의 기록을 선택해 주세요.");
      const existing = await coffeeApi.list({ limit: 1000 });
      const fingerprints = new Set(
        existing
          .map(
            (item) =>
              readBrewDetails(item.brewDetails || item.brew_details)
                .sourceFingerprint,
          )
          .filter(Boolean),
      );
      const next = [];
      const seen = new Set(fingerprints);
      for (const file of files) {
        if (file.size > 200000) {
          next.push({
            filename: file.name,
            errors: ["파일 크기가 너무 큽니다."],
            checked: false,
          });
          continue;
        }
        const text = await file.text();
        const bytes = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(text),
        );
        const fingerprint = Array.from(new Uint8Array(bytes), (byte) =>
          byte.toString(16).padStart(2, "0"),
        ).join("");
        const parsed = parseCoffeeMarkdown(text, file.name);
        const duplicate = seen.has(fingerprint);
        seen.add(fingerprint);
        parsed.coffee.brewDetails.sourceFingerprint = fingerprint;
        next.push({
          ...parsed,
          filename: file.name,
          duplicate,
          checked: !duplicate && !parsed.errors.length,
        });
      }
      setRows(next);
    } catch (error) {
      setMessage(error.message || "파일을 확인하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }
  async function save() {
    setLoading(true);
    setMessage("");
    let count = 0;
    try {
      for (const row of rows) {
        if (!row.checked || row.saved) continue;
        await coffeeApi.create(row.coffee);
        row.saved = true;
        count++;
        setRows((prev) =>
          prev.map((item) =>
            item === row ? { ...row, checked: false } : item,
          ),
        );
      }
      navigate("/coffee");
    } catch (error) {
      setMessage(
        `${count}건 저장했습니다. 나머지 기록은 다시 시도해 주세요. ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  }
  const selected = rows.filter((row) => row.checked && !row.saved).length;
  return (
    <PageShell
      title="커피 기록 가져오기"
      eyebrow="Bring your coffee notes"
      subtitle="기존 Markdown 추출 기록을 확인한 뒤 내 기록장에 추가합니다."
    >
      <section className="panel coffee-import-panel">
        <label className="brew-field">
          <span>날짜별 추출 기록 (.md)</span>
          <input
            className="input"
            aria-describedby="coffee-import-file-help"
            type="file"
            accept=".md,text/markdown"
            multiple
            onChange={selectFiles}
            disabled={loading}
          />
        </label>
        <p className="brew-hint" id="coffee-import-file-help">
          여러 Markdown 파일을 함께 선택할 수 있습니다. 기록에 있는 정보만 가져옵니다. 원본 파일은 바꾸지 않으며, 음악은
          나중에 직접 연결할 수 있습니다.
        </p>
        <p className="brew-hint">
          실제 계정 모드에서는 저장 버튼을 누른 기록만 서버로 전송됩니다. 체험
          모드에서는 이 브라우저에 저장됩니다.
        </p>
        {message && (
          <p role="alert" className="resource-error">
            {message}
          </p>
        )}
        <div className="import-records">
          {rows.map((row, index) => {
            const summary = row.coffee
              ? brewSummary(row.coffee.brewDetails)
              : {};
            return (
              <article key={`${row.filename}-${index}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={row.checked}
                    disabled={
                      loading ||
                      row.saved ||
                      row.duplicate ||
                      row.errors.length > 0
                    }
                    onChange={(event) =>
                      setRows((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, checked: event.target.checked }
                            : item,
                        ),
                      )
                    }
                  />
                  <strong>{row.coffee?.beanName || row.filename}</strong>
                </label>
                <p>
                  {row.coffee?.drinkDate} · {row.filename}{" "}
                  {summary.ratio && `· ${summary.ratio}`}
                </p>
                <p>
                  {row.saved
                    ? "저장됨"
                    : row.duplicate
                      ? "이미 가져온 기록"
                      : row.errors.join(" ") || "가져올 수 있습니다"}
                </p>
              </article>
            );
          })}
        </div>
        <div className="action-row">
          <Button
            onClick={save}
            disabled={loading || !selected}
            loading={loading}
          >
            {loading ? "처리 중" : selected ? `${selected}건 가져오기` : rows.length ? "선택한 기록 없음" : "파일 선택 후 가져오기"}
          </Button>
          <Link className="ghost-button" to="/coffee">
            커피 기록으로
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
