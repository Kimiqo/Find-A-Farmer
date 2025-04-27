"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Sign Out
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Name: {session.user.name}</p>
          <p className="text-sm text-gray-600">Email: {session.user.email}</p>
          <p className="text-sm text-gray-600">Phone: {session.user.phone}</p>
          <p className="text-sm text-gray-600">Role: {session.user.role}</p>
          {session.user.role === "farmer-admin" && (
            <p className="text-sm text-gray-600">
              Farmer ID: {session.user.farmerId}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}