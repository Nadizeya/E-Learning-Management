import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("auth.admin");
    const rawToken = localStorage.getItem("auth.token");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAdmin(parsed);
        if (rawToken) {
          setToken(rawToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${rawToken}`;
        }
      } catch {
        localStorage.removeItem("auth.admin");
        localStorage.removeItem("auth.token");
      }
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = (adminResponse, jwtToken) => {
    setAdmin(adminResponse);
    setToken(jwtToken);
    localStorage.setItem("auth.admin", JSON.stringify(adminResponse));
    localStorage.setItem("auth.token", jwtToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
  };

  const logout = () => {
    setAdmin(null);
    setToken("");
    localStorage.removeItem("auth.admin");
    localStorage.removeItem("auth.token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = useMemo(
    () => ({ admin, token, login, logout }),
    [admin, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
