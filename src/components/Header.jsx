"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { HomeIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#2f855a] to-[#8b4513] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/farm-hero.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => (e.target.src = "/images/placeholder.jpg")} // Fallback image
            />
            <span className="text-xl font-bold">E-Farms</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
              <HomeIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
              <span>Home</span>
            </Link>
            <Link href="/search" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
              <span>Search</span>
            </Link>
            {session?.user.role === "buyer" && (
              <Link href="/cart" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors relative">
                <ShoppingCartIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f4a261] text-[#2f855a] rounded-full px-2 py-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Profile</span>
                </Link>
                {session.user.role === "farmer-admin" && (
                  <Link href="/farmer/dashboard" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
                    <CogIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                    <span>Farmer Dashboard</span>
                  </Link>
                )}
                {session.user.role === "admin-admin" && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
                    <CogIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 hover:text-[#f4a261] transition-colors p-0"
                >
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors">
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#f4a261] p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-[#2f855a] px-4 py-4">
          <nav className="flex flex-col items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
              <HomeIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
              <span>Home</span>
            </Link>
            <Link href="/search" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
              <MagnifyingGlassIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
              <span>Search</span>
            </Link>
            {session?.user.role === "buyer" && (
              <Link href="/cart" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors relative" onClick={() => setIsMenuOpen(false)}>
                <ShoppingCartIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 left-12 bg-[#f4a261] text-[#2f855a] rounded-full px-2 py-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Profile</span>
                </Link>
                {session.user.role === "farmer-admin" && (
                  <Link href="/farmer/dashboard" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <CogIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                    <span>Farmer Dashboard</span>
                  </Link>
                )}
                {session.user.role === "admin-admin" && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors temptations" onClick={() => setIsMenuOpen(false)}>
                    <CogIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-[#f4a261] transition-colors p-0"
                >
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-2 hover:text-[#f4a261] transition-colors" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}