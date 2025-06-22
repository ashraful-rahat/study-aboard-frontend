import Navbar from "@/components/ui/layout/Navbar";
import "./globals.css";
// later
import type { Metadata } from "next";

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
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
