"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginButton() {
  const { isAuthenticated, login, logout } = useAuth();
  const [clientcode, setClientcode] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginFields, setShowLoginFields] = useState(false);

  const handleLogin = async () => {
    await login(clientcode, password);
    if (isAuthenticated) {
      // Check if login was successful before hiding fields
      setShowLoginFields(false);
      setClientcode("");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return (
      <Button variant="destructive" onClick={logout}>
        Logout
      </Button>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {!showLoginFields && (
        <Button onClick={() => setShowLoginFields(true)}>
          Login with Angel One
        </Button>
      )}

      {showLoginFields && (
        <div className="flex flex-col space-y-2 p-4 border rounded-md bg-card">
          <Input
            type="text"
            placeholder="Client Code"
            value={clientcode}
            onChange={(e) => setClientcode(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="API Secret (Password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleLogin}>Login</Button>
          <Button variant="outline" onClick={() => setShowLoginFields(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
