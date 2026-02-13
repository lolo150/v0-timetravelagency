import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import "./globals.css";

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TimeTravel Agency - Your Journey Through Time Begins Here",
  description:
    "Experience the extraordinary with TimeTravel Agency. Luxury time travel to history's most iconic moments. Paris 1889, the Cretaceous Period, Renaissance Florence and more.",
};

export const viewport = {
  themeColor: "#0A0E1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_playfair.variable} ${_inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
