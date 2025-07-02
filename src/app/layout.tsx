import "./globals.css";
import type { Metadata } from "next";

import { poppins } from "@/lib/fonts";
import Navbar from "@/components/ui/layout/Navbar";

export const metadata: Metadata = {
  title: "Study Abroad Website",
  description: "Study abroad platform for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <Navbar></Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
