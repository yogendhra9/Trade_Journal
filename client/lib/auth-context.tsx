"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("auth_token");

    if (authToken) {
      setToken(authToken);
      setIsAuthenticated(true);
      localStorage.setItem("auth_token", authToken);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check localStorage for existing token
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        verifyToken(storedToken);
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (response.ok) {
        setToken(tokenToVerify);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  };

  const login = () => {
    window.location.href = "http://localhost:5000/auth/angel-one";
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
