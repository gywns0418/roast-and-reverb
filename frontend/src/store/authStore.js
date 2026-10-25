const STORAGE_KEY = "roast-reverb-user";

export const authStore = {
  get user() {
    try {const raw=window.localStorage.getItem(STORAGE_KEY);const user=raw?JSON.parse(raw):null;return user&&typeof user==='object'&&!Array.isArray(user)?user:null;} catch { return null; }
  },
  get token() {
    return this.user?.token || null;
  },
  setUser(user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent?.(new Event('rr-auth-changed'));
  },
  expire() {
    const user=this.user;
    if(user)this.setUser({...user,token:null});
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent?.(new Event('rr-auth-changed'));
  }
};
