import { useEffect, useRef, useState } from "react";
import { request, jsonOptions } from "../../api/http.js";
let sdk;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!sdk) sdk = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client"; script.async = true;
    const timeout = setTimeout(() => { script.remove(); sdk = null; reject(new Error("Google 연결 시간이 초과됐습니다. 다시 시도해 주세요.")); }, 15000);
    script.onload = () => { clearTimeout(timeout); resolve(window.google); };
    script.onerror = () => { clearTimeout(timeout); script.remove(); sdk = null; reject(new Error("Google에 연결하지 못했어요. 이메일로 로그인하거나 다시 시도해 주세요.")); };
    document.head.append(script);
  });
  return sdk;
}
export default function GoogleSignIn({ link = false, onSuccess }) {
  const host = useRef(null); const success = useRef(onSuccess); success.current = onSuccess;
  const [linked, setLinked] = useState(false);
  const [enabled, setEnabled] = useState(false), [error, setError] = useState(""), [busy, setBusy] = useState(false), [attempt, retry] = useState(0);
  useEffect(() => {
    if (import.meta.env.VITE_USE_REAL_API !== "true") return;
    let disposed = false;
    async function setup() {
      try {
        const config = await request("/auth/google/config");
        if (disposed || !config.enabled) return;
        setEnabled(true); setError("");
        if (link) {
          const status = await request("/members/me/google/status");
          if (disposed) return;
          if (status.linked) { setLinked(true); return; }
        }
        const challenge = await request(link ? "/members/me/google/challenge" : "/auth/google/challenge", { ...jsonOptions("POST", {}), credentials: "same-origin", headers: { "X-RR-Social": "1" } });
        const google = await loadGoogle();
        if (disposed) return;
        google.accounts.id.initialize({ client_id: config.clientId, nonce: challenge.nonce, auto_select: false,
          callback: async ({ credential }) => {
            if (disposed) return;
            setBusy(true); setError("");
            try {
              const user = await request("/auth/google/complete", { ...jsonOptions("POST", { credential }), credentials: "same-origin", headers: { "X-RR-Social": "1" } });
              if (!disposed) success.current(user);
            } catch (err) { if (!disposed) setError(err.message || "Google 인증에 실패했습니다. 다시 시도해 주세요."); }
            finally { if (!disposed) setBusy(false); }
          }
        });
        host.current.replaceChildren();
        google.accounts.id.renderButton(host.current, { theme: "outline", size: "large", text: link ? "continue_with" : "signin_with", locale: "ko", width: Math.min(360, host.current.clientWidth || 280) });
      } catch (err) { if (!disposed) setError(err.message); }
    }
    setup();
    return () => { disposed = true; };
  }, [link, attempt]);
  if (!enabled && !error) return null;
  if (linked) return <section className="google-auth"><p>Google 계정 연결됨 · Google로 같은 기록장에 로그인할 수 있어요.</p></section>;
  return <section className="google-auth" aria-label={link ? "Google 계정 연결" : "Google 로그인"} aria-busy={busy}>
    <p>{link ? "기존 기록을 그대로 두고 Google로도 로그인할 수 있어요. 연결할 Google 계정을 선택해 주세요." : "Google 계정으로 간편하게 시작하세요."}</p>
    <p><a href={`${import.meta.env.BASE_URL}privacy.html`} target="_blank" rel="noreferrer">개인정보처리방침</a></p>
    <div className="google-auth-button" ref={host} style={busy ? { pointerEvents: "none", opacity: .6 } : undefined} />
    {busy && <p role="status">계정을 확인하고 있어요…</p>}
    {error && <><p role="alert">{error}</p><button className="ghost-button" type="button" onClick={() => retry(n => n + 1)}>다시 시도</button></>}
  </section>;
}
