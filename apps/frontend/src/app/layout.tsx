import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Your one-stop shop for electronics and clothing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <QueryProvider>
          <ThemeProvider>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                  Empora
                </Link>
                <nav className="flex items-center gap-6">
                  <Link
                    href="/products"
                    className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Products
                  </Link>
                  <ThemeToggle />
                </nav>
              </div>
            </header>

            {/* Main Content */}
            <main>
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>

            {/* Footer */}
            <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <div className="container mx-auto px-4 py-8">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  © 2025 E-Commerce Store. All rights reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
