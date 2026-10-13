import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
const port = await new Promise((resolve) => {
  const server = net.createServer();
  server.listen(0, "127.0.0.1", () => {
    const port = server.address().port;
    server.close(() => resolve(port));
  });
});
const base = `http://127.0.0.1:${port}/api`;
const java = process.env.JAVA_HOME
  ? path.join(
      process.env.JAVA_HOME,
      "bin",
      process.platform === "win32" ? "java.exe" : "java",
    )
  : "java";
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rr-production-"));
let child;
let logs = "";
const env = {
  ...process.env,
  JWT_SECRET: randomBytes(48).toString("base64"),
  SPRING_PROFILES_ACTIVE: "production",
};
async function start() {
  logs = "";
  child = spawn(
    java,
    [
      "-jar",
      "backend/target/roast-and-reverb-backend-0.1.0.jar",
      `--server.port=${port}`,
      `--spring.datasource.url=jdbc:h2:file:${dir.replaceAll("\\", "/")}/diary;MODE=MySQL;DATABASE_TO_LOWER=TRUE;NON_KEYWORDS=MEMBER,BODY;WRITE_DELAY=0`,
    ],
    { env, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  child.stdout.on("data", (b) => (logs += b));
  child.stderr.on("data", (b) => (logs += b));
  for (let i = 0; i < 100; i++) {
    try {
      let r = await fetch(base + "/coffee");
      if (r.status === 401) return;
    } catch {}
    if (child.exitCode !== null)
      throw Error("Server startup failed: " + logs.slice(-1500));
    await new Promise((r) => setTimeout(r, 200));
  }
  throw Error("Startup timeout");
}
async function stop() {
  if (child && child.exitCode === null) {
    const done = new Promise((r) => child.once("exit", r));
    child.kill();
    await done;
  }
}
async function api(route, method = "GET", body, token) {
  const r = await fetch(base + route, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  return { status: r.status, data: data.data };
}
try {
  await start();
  let r = await api("/auth/join", "POST", {
    email: "durable@example.com",
    password: "persistent-test-123",
    nickname: "Durable",
  });
  if (r.status !== 200) throw Error("Production signup failed " + r.status);
  const token = r.data.token;
  r = await api(
    "/coffee",
    "POST",
    {
      beanName: "Survives restart",
      brewMethod: "drip",
      drinkDate: "2026-10-13",
    },
    token,
  );
  if (r.status !== 200) throw Error("Create failed " + r.status);
  await stop();
  await start();
  r = await api("/auth/login", "POST", {
    email: "durable@example.com",
    password: "persistent-test-123",
  });
  if (r.status !== 200) throw Error("Login after restart failed");
  r = await api("/coffee", "GET", null, r.data.token);
  if (!r.data.some((x) => x.bean_name === "Survives restart"))
    throw Error("Record lost on restart");
  console.log(
    "PASS: production signup, authenticated save, restart, login and durable record retrieval",
  );
} finally {
  await stop();
}
