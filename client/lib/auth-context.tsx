"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (clientcode: string, password: string) => void;
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

  const login = async (clientcode: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientcode, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem("auth_token", data.token);
        router.push("/dashboard"); // Redirect to dashboard or desired authenticated page
      } else {
        console.error("Login failed:", data.message);
        // Optionally, show error message to user
      }
    } catch (error) {
      console.error("Error during login process:", error);
      // Optionally, show error message to user
    }
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
