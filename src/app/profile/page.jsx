"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-4 text-muted-foreground">Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <h1 className="text-3xl md:text-4xl mb-6 text-secondary">Your Profile</h1>
      <div className="space-y-4">
        <p className="text-lg"><strong>Name:</strong> {session.user.name}</p>
        <p className="text-lg"><strong>Email:</strong> {session.user.email}</p>
        <p className="text-lg"><strong>Role:</strong> {session.user.role}</p>
        {session.user.role === "farmer-admin" && (
          <p className="text-lg"><strong>Farmer ID:</strong> {session.user.farmerId}</p>
        )}
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg animate-pulse"
        >
          Sign Out
        </Button>
      </div>
    </main>
  );
}