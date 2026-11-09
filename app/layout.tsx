import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Aplikasi Kantin Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-50 min-h-screen flex flex-col text-slate-800">
        <Suspense fallback={<div>Memuat...</div>}>
          <Navbar />
        </Suspense>
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
