// src/auth/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";

const API_BASE_URL = "http://localhost:8080";

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    role: null,
    loading: true, // 🔑 critical
  });

  const login = (role) => {
     
    setAuth({
      isAuthenticated: true,
      role,
      loading: false,
    });
  };

  const logout = () => {
    console.log("LOGOUT called");
    setAuth({
      isAuthenticated: false,
      role: null,
      loading: false,
    });
  };

  // 🔥 AUTH BOOTSTRAP (NO REDIRECTS HERE)
  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;

        if (data) {
          login(data.role.replace("ROLE_", ""));
        } else {
          logout();
        }
      })
      .catch(() => {
        if (isMounted) logout();
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
