"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function Nav() {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="p-4 bg-primary text-white flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/search" className="hover:underline">
          Search
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
      </div>
      <Link href="/cart" className="relative hover:underline">
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}