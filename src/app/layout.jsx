import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientWrapper from "@/components/ClientWrapper";

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
      <body className="bg-[#f7fafc]">
        <ClientWrapper>
          <Header />
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
