// Remembers when this browser last saved a backup file, so the app can remind
// the drinker before records that live only in this browser are lost.
export const LAST_BACKUP_KEY = "rr-last-backup-at-v1";
const DAY = 86_400_000;
export const BACKUP_REMIND_DAYS = 14;

export function lastBackupAt(storage) {
  try {
    const value = Number(storage?.getItem(LAST_BACKUP_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function markBackup(storage, now = Date.now()) {
  try {
    storage?.setItem(LAST_BACKUP_KEY, String(now));
  } catch {
    /* storage may be blocked; the backup file itself was still saved */
  }
}

// Due when there is something worth keeping (3+ cups) and either no backup
// was ever made here or the last one is older than two weeks.
export function backupDue({ total, last, now = Date.now() }) {
  if (!Number.isInteger(total) || total < 3) return false;
  return !last || now - last > BACKUP_REMIND_DAYS * DAY;
}

export function daysSince(last, now = Date.now()) {
  return last ? Math.max(0, Math.floor((now - last) / DAY)) : null;
}
