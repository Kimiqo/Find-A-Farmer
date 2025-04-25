"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { HomeIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-[#f4a261] text-primary-foreground shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/farm-hero.jpg" alt="Logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-xl font-bold">Accra Farmers</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/search" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors relative">
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f7fafc] text-primary rounded-full px-2 py-1 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                {session.user.role === "farmer-admin" && (
                  <Link href="/farmer/dashboard" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                    <CogIcon className="h-5 w-5" />
                    <span>Farmer Dashboard</span>
                  </Link>
                )}
                {session.user.role === "admin-admin" && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                    <CogIcon className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link href="/auth/signout" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-2 hover:text-[#f7fafc] transition-colors">
                  <UserIcon className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-foreground hover:text-[#f7fafc]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary/90">
          <nav className="flex flex-col items-center gap-4 py-4">
            <Link href="/" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/search" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#f7fafc] relative" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCartIcon className="h-5 w-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 left-12 bg-[#f7fafc] text-primary rounded-full px-2 py-1 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                {session.user.role === "farmer-admin" && (
                  <Link href="/farmer/dashboard" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                    <CogIcon className="h-5 w-5" />
                    <span>Farmer Dashboard</span>
                  </Link>
                )}
                {session.user.role === "admin-admin" && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                    <CogIcon className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link href="/auth/signout" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-2 hover:text-[#f7fafc]" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-5 w-5" />
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