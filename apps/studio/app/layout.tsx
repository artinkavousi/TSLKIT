import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TSL Studio',
  description: 'WebGPU + TSL engine-first playground'
};

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/lab', label: 'Lab' },
  { href: '/admin', label: 'Admin' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-slate-100`}>
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.45em] text-slate-500">TSL Studio</span>
                <span className="text-lg font-semibold text-accent">Engine Operations Console</span>
              </div>
              <nav className="flex gap-4 text-sm">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
            Phase 4 Complete · Engine + Site ready for release operations
          </footer>
        </div>
      </body>
    </html>
  );
}
