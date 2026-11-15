import { SENSE_MAX, senseAxes } from "../../utils/senses.js";

// Four optional 0–100 sliders. An axis stays "미기록" until the drinker moves
// it and can be cleared again, so nothing untouched is saved as a score.
const words = (v) => (v < 20 ? "아주 약하게" : v < 40 ? "약하게" : v < 60 ? "보통" : v < 80 ? "또렷하게" : "아주 또렷하게");

export default function SenseSliders({ value = {}, onChange, disabled }) {
  const set = (key, v) => onChange({ ...value, [key]: v });
  const clear = (key) => {
    const next = { ...value };
    delete next[key];
    onChange(next);
  };
  return (
    <fieldset className="sense-sliders">
      <legend>
        감각 남기기 <small>선택 · 0–100 · 움직인 항목만 저장돼요</small>
      </legend>
      {senseAxes.map(({ key, label }) => {
        const has = Number.isInteger(value[key]);
        const v = has ? value[key] : 0;
        const id = `sense-${key}`;
        return (
          <div className={"sense-row" + (has ? " is-set" : "")} key={key} style={{ "--p": `${(v / SENSE_MAX) * 100}%` }}>
            <label htmlFor={id}>{label}</label>
            <div className="sense-track">
              <input
                id={id}
                type="range"
                min="0"
                max={SENSE_MAX}
                step="1"
                value={v}
                disabled={disabled}
                aria-valuetext={has ? `${label} ${v}점, 100점 만점, ${words(v)}` : `${label} 미기록`}
                onChange={(e) => set(key, Number(e.target.value))}
                onPointerDown={(e) => !has && set(key, Number(e.currentTarget.value))}
                onKeyDown={(e) => !has && ["Home", "ArrowLeft", "ArrowDown", " "].includes(e.key) && set(key, 0)}
              />
              <span className="sense-ticks" aria-hidden="true">
                <i /><i /><i /><i /><i />
              </span>
            </div>
            <output htmlFor={id} className="num">
              {has ? (
                <>
                  <b>{v}</b>
                  <small>{words(v)}</small>
                </>
              ) : (
                "미기록"
              )}
            </output>
            <button type="button" className="sense-clear" disabled={disabled || !has} onClick={() => clear(key)} aria-label={`${label} 기록 지우기`}>
              지우기
            </button>
          </div>
        );
      })}
    </fieldset>
  );
}
