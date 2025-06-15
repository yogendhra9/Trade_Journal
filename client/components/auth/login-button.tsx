"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Button
      onClick={isAuthenticated ? logout : login}
      variant={isAuthenticated ? "destructive" : "default"}
    >
      {isAuthenticated ? "Logout" : "Login with Angel One"}
    </Button>
  );
}
