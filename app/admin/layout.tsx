import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — JumpoZone',
  description: 'Admin panel untuk mengelola JumpoZone',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin layout - fonts akan di-override di dashboard layout
  return children;
}
