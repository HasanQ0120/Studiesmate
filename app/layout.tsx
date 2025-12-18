import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StudiesMate",
  description: "Learn smart. Simple. Bilingual.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}
