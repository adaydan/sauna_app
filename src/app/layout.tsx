import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ЖАР / ZHAR — Banya goods for body & soul",
  description: "Thoughtful essentials inspired by Russian banya culture. Discover wool hats, jadeite sauna stones, birch veniks, and traditional wooden bathing goods.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
