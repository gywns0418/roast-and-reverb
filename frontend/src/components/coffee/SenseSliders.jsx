import { senseAxes } from "../../utils/senses.js";

// Four optional sliders. An axis stays "미기록" until the drinker moves it,
// and can be cleared again, so nothing untouched is saved as a score.
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
        감각 남기기 <small>선택 · 움직인 항목만 저장돼요</small>
      </legend>
      {senseAxes.map(({ key, label }) => {
        const set_ = Number.isInteger(value[key]);
        const id = `sense-${key}`;
        return (
          <div className={"sense-row" + (set_ ? " is-set" : "")} key={key}>
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              type="range"
              min="0"
              max="5"
              step="1"
              value={set_ ? value[key] : 0}
              disabled={disabled}
              aria-valuetext={set_ ? `${label} ${value[key]}점, 5점 만점` : `${label} 미기록`}
              style={{ "--p": `${set_ ? value[key] * 20 : 0}%` }}
              onChange={(e) => set(key, Number(e.target.value))}
              onPointerDown={(e) => !set_ && set(key, Number(e.currentTarget.value))}
              onKeyDown={(e) => !set_ && ["Home", "ArrowLeft", "ArrowDown", " "].includes(e.key) && set(key, 0)}
            />
            <output htmlFor={id} className="num">{set_ ? `${value[key]} / 5` : "미기록"}</output>
            {set_ && (
              <button type="button" className="sense-clear" disabled={disabled} onClick={() => clear(key)} aria-label={`${label} 기록 지우기`}>
                지우기
              </button>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
