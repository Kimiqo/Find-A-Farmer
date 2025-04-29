"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  GlobeAltIcon,
  NoSymbolIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

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
    <main className="min-h-screen">
      {/* Hero Section with Farm Background */}
      <section
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{ backgroundImage: "url(/images/farm-hero1.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col items-center">
        <p className="text-5xl md:text-5xl font-bold text-center text-white mb-4">
          Fresh from Accra Farms
        </p>
        <p className="text-lg md:text-lg font-bold text-center text-white mb-8">
          Connect with local farmers around you for the freshest produce.
        </p>
        <Button
          onClick={handleShopNow}
          className="relative z-10 text-[#2f855a] hover:bg-[#2f855a]/90 hover:text-white bg-white rounded-lg px-8 py-5 text-lg"
        >
          Shop Now
        </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Benefits of Buying from Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center">
            <GlobeAltIcon className="h-12 w-12 text-gray-700 mb-4" />
            <p className="text-lg font-semibold">Lower Environmental Impact</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <NoSymbolIcon className="h-12 w-12 text-gray-700 mb-4" />
            <p className="text-lg font-semibold">Pesticide Free</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <UserGroupIcon className="h-12 w-12 text-gray-700 mb-4" />
            <p className="text-lg font-semibold">Local Farming</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ArchiveBoxIcon className="h-12 w-12 text-gray-700 mb-4" />
            <p className="text-lg font-semibold">Longer Shelf Life</p>
          </div>
        </div>
      </section>

      {/* Farmers Section */}
      <section className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Our Farmers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/farmer-1.jpg"
                alt="Moo Fresh Milk"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-semibold">Adom Farms</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/farmer-2.jpg"
                alt="Green Basket Farms"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-semibold">Nhyira Farms</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/farmer-3.jpg"
                alt="Harvest Valley Farms"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-semibold">Aseda Farms</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/farmer-4.jpg"
                alt="Agross Produce"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-semibold">Obaatanpa Farms</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/farmer-5.jpg"
                alt="Akoko Guy"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-center font-semibold">Sankofa Farms</p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleShopNow}
            className="bg-[#2f855a] hover:bg-[#2f855a]/90 text-white rounded-lg px-8 py-5 text-lg"
          >
            Shop Now
          </Button>
        </div>
      </section>
    </main>
  );
}