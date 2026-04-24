'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Admin routes: no navbar/footer, use Geist font
    return (
      <div className="font-[family-name:var(--font-geist-sans)] min-h-screen">
        {children}
      </div>
    );
  }

  // Public routes: with navbar/footer, use Playfair + Inter
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
