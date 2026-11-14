import { deviceScope } from "../store/discoveryStore.js";
import { collectDeviceBackup } from "./deviceBackup.js";
import { markBackup } from "./backupReminder.js";

export function downloadFile(content, name, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Saves everything this browser keeps into one JSON file and remembers when.
export function downloadDeviceBackup() {
  const local = import.meta.env.VITE_USE_REAL_API !== "true";
  const value = collectDeviceBackup(localStorage, deviceScope(), local);
  if (!Object.keys(value.sections).length) throw new Error("이 브라우저에 저장한 자료가 없습니다.");
  const day = new Date().toISOString().slice(0, 10);
  downloadFile(JSON.stringify(value, null, 2), `roast-reverb-${day}.json`);
  markBackup(localStorage);
}
