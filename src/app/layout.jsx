import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FarmFind",
  description: "Connect with local farmers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
        <nav className="p-4 bg-gray-100">
            <Link href="/" className="mr-4">
              Home
            </Link>
            <Link href="/cart" className="mr-4">
              Cart
            </Link>
            <Link href="/delivery" className="mr-4">
              Delivery
            </Link>
            <Link href="/admin">Admin</Link>
          </nav>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
