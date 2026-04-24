import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - GeoTrip',
  description: 'Admin panel untuk mengelola GeoTrip',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin layout - fonts akan di-override di dashboard layout
  return children;
}
