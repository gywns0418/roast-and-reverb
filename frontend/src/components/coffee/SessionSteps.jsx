// Session progress drawn like an equaliser: each step is a group of bars that
// lights up when that part of the record actually has something in it.
const steps = [
  ["note", "느낌"],
  ["senses", "감각"],
  ["music", "음악"],
  ["verdict", "판단"],
];
const heights = [10, 18, 13, 22, 15];
export default function SessionSteps({ done = {}, current = -1, onSelect }) {
  const count = steps.filter(([k]) => done[k]).length;
  return (
    <div className="session-steps" role="group" aria-label={`오늘 세션 ${count} / 4단계 채움`}>
      {steps.map(([key, label], i) => (
        <div className={"session-step" + (done[key] ? " is-done" : "") + (current === i ? " is-current" : "")} key={key}>
          <span className="session-bars" aria-hidden="true">
            {heights.map((h, j) => (
              <i key={j} style={{ height: `${(h + i * 3 + j) % 24 + 8}px` }} />
            ))}
          </span>
          {onSelect ? (
            <button type="button" className="session-step-label" aria-current={current === i ? "step" : undefined} onClick={() => onSelect(i)}>
              <b className="num">{i + 1}</b> {label}
              <span className="sr-only">{done[key] ? " 채움" : " 비어 있음"}</span>
            </button>
          ) : (
            <span className="session-step-label">
              <b className="num">{i + 1}</b> {label}
              <span className="sr-only">{done[key] ? " 채움" : " 비어 있음"}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
