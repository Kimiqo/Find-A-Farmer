"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "buyer" }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to sign up");
      }
      router.push("/auth/signin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl mb-6 text-secondary">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus:ring-2 focus:ring-primary rounded-lg"
          aria-label="Full name"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-2 focus:ring-primary rounded-lg"
          aria-label="Email"
        />
        <Input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:ring-2 focus:ring-primary rounded-lg"
          aria-label="Password"
        />
        {error && <p className="text-destructive">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
        >
          Sign Up
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/auth/signin" className="text-primary hover:underline">
          Sign In
        </a>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Farmer or admin access? Contact{" "}
        <a href="mailto:admin@example.com" className="text-primary hover:underline">
          admin@example.com
        </a>.
      </p>
    </main>
  );
}