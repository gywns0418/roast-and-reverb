import { verdicts } from "../../utils/tasteProfile.js";
import "../../styles/verdict.css";

// Optional three-way judgement. Pressing the chosen one again clears it.
export default function VerdictPicker({ value = "", onChange, disabled = false, compact = false, legend = "이 한 잔, 다시 마시고 싶나요?" }) {
  return (
    <fieldset className={"verdict-picker" + (compact ? " verdict-picker-compact" : "")} disabled={disabled}>
      <legend>{legend}</legend>
      <div>
        {verdicts.map((v) => (
          <button
            key={v.key}
            type="button"
            data-verdict={v.key}
            aria-pressed={value === v.key}
            onClick={() => onChange(value === v.key ? "" : v.key)}
          >
            {compact ? v.short : v.label}
          </button>
        ))}
      </div>
      {!compact && <small>선택하지 않아도 저장돼요. 고른 판단만 "나의 취향"에 쓰여요.</small>}
    </fieldset>
  );
}
