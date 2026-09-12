import { useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { authStore } from "../store/authStore.js";

export function useAuth() {
  const [user, setUserState] = useState(() => authStore.user);

  return useMemo(() => ({
    user,
    isLoggedIn: Boolean(user),
    async login(credentials) {
      const loggedIn = await authApi.login(credentials);
      authStore.setUser(loggedIn);
      setUserState(loggedIn);
      return loggedIn;
    },
    async join(payload) {
      const joined = await authApi.join(payload);
      authStore.setUser(joined);
      setUserState(joined);
      return joined;
    },
    async logout() {
      await authApi.logout();
      authStore.clear();
      setUserState(null);
    }
  }), [user]);
}
