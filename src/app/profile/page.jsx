"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-4 text-gray-500 text-center">Loading...</div>;
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-sm text-gray-500">
                Manage your account details below
              </p>
            </div>
          </div>
          
        </div>

        {/* User Details Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              User Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Name</p>
                <p className="text-sm text-gray-600">{session.user.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Email</p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Phone</p>
                <p className="text-sm text-gray-600">{session.user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Role</p>
                <p className="text-sm text-gray-600 capitalize">{session.user.role}</p>
              </div>
              {session.user.role === "farmer-admin" && (
                <div>
                  <p className="text-sm font-semibold text-gray-700">Farmer ID</p>
                  <p className="text-sm text-gray-600">{session.user.farmerId}</p>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-200">
            <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white rounded-lg px-6 py-2 transition-transform transform hover:scale-105"
          >
            Sign Out
          </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}