"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch {
      setError("Failed to sign in");
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl mb-6 text-secondary">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Password"
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
          Sign In
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <a href="/auth/signup" className="text-primary hover:underline">
          Sign Up
        </a>
      </p>
    </main>
  );
}