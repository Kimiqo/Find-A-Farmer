"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin() {
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto">
      <h1 className="text-3xl md:text-4xl mb-6">Admin Login</h1>
      <div className="space-y-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Username input"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password input"
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={handleLogin}
        >
          Log In
        </Button>
      </div>
    </main>
  );
}