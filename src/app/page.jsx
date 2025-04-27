"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleShopNow() {
    if (session) {
      router.push("/search");
    } else {
      router.push("/auth/signup");
    }
  }

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-gradient-to-br from-[#f7fafc] to-[#e5e7eb] rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl text-secondary mb-4">Fresh from Accra Farms</h1>
          <p className="text-muted-foreground mb-6">
            Connect with local farmers in Haatso, GIMPA, and Dzorwulu for the freshest produce.
          </p>
          <Button
            onClick={handleShopNow}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg animate-pulse"
          >
            Shop Now
          </Button>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/images/farm-hero.jpg"
            alt="Farm Hero"
            width={600}
            height={400}
            className="rounded-lg object-cover animate-slide-up"
          />
        </div>
      </div>
    </main>
  );
}