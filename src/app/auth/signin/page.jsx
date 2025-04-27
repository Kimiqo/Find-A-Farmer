"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "farmer-admin") {
        router.push("/farmer/dashboard");
      } else if (session.user.role === "admin-admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      if (result.error === "Your farmer account is pending approval") {
        setError("Your farmer account is pending approval. Please wait for admin approval.");
      } else {
        setError(result.error || "Invalid email or password");
      }
    }
  }

  if (status === "loading") {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-[#2f855a] hover:bg-[#2f855a]/90 text-white"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}