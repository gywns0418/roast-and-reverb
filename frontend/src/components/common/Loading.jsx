import { Coffee, Music2 } from "lucide-react";
export default function Loading({ title = "한 잔과 한 곡을 준비해요.", detail = "잠시만 기다려 주세요." }) {
  return <section className="ritual-loading" role="status" aria-live="polite" aria-busy="true">
    <div className="ritual-loading-art" aria-hidden="true"><Coffee size={32} /><div className="ritual-wave">{Array.from({length: 16}, (_, i) => <i key={i} style={{"--beat": i}} />)}</div><Music2 size={32} /></div>
    <p className="eyebrow">BREW · LISTEN · REPEAT</p><h2>{title}</h2><p>{detail}</p>
    <div className="ritual-loading-track" aria-hidden="true"><span /></div>
  </section>;
}
