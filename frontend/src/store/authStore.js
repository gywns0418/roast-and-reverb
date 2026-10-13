const STORAGE_KEY = "roast-reverb-user";

export const authStore = {
  get user() {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  get token() {
    return this.user?.token || null;
  },
  setUser(user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};
