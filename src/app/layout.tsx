// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/ui/layout/Navbar";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Study Abroad Website",
  description: "Study abroad platform for students",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Navbar />
        {/*
          IMPORTANT FIX:
          Add padding-top (pt-X) to the <main> element
          to push its content down, clearing the fixed Navbar.
          Adjust the value (e.g., pt-16, pt-20, pt-24) based on your Navbar's height.
          I'm using pt-20 as a good starting point based on previous Navbar height discussions.
        */}
        <main className="pt-20">
          {" "}
          {/* <--- এইখানে পরিবর্তন করা হয়েছে */}
          {children}
        </main>
      </body>
    </html>
  );
}
