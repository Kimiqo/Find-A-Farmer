"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }) {
  const router = useRouter();

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Authentication Error</h1>
      <p className="text-red-500 mb-4">
        {error?.message || "An unexpected error occurred during authentication."}
      </p>
      <div className="space-x-4">
        <Button
          onClick={() => router.push("/auth/signin")}
          className="bg-[#2f855a] hover:bg-[#2f855a]/90 text-white"
        >
          Try Again
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          Home
        </Button>
      </div>
    </main>
  );
}