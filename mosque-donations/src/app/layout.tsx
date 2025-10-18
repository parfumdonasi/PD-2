import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import CookieConsent from "./(legal)/cookie-consent";

const cairo = Cairo({ subsets: ["latin"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Donasi Parfum Masjid",
  description: "Kemudahan donasi parfum untuk masjid - QRIS, e-wallet, VA",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session for header CTA
  await auth();
  return (
    <html lang="en">
      <body className={`${cairo.variable} antialiased bg-white text-neutral-900`}>
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
          <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-green-800">WangiMasjid</Link>
            <div className="flex items-center gap-3">
              <Link href="/donate" className="rounded bg-green-800 text-white px-4 py-2">Donasi Sekarang</Link>
              <Link href="/dashboard" className="rounded border px-3 py-2">Dashboard</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 min-h-[70vh]">{children}</main>
        <CookieConsent />
        <footer className="border-t py-6 text-center text-sm text-neutral-600">
          © {new Date().getFullYear()} WangiMasjid • <Link className="underline" href="/terms">S&K</Link> • <Link className="underline" href="/privacy">Privasi</Link>
        </footer>
      </body>
    </html>
  );
}
