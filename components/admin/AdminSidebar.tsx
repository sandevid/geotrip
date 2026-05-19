'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  Building2,
  MessageSquare,
  Image as ImageIcon,
  Home,
  Info,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero Section', icon: Home },
  { href: '/admin/about', label: 'About Section', icon: Info },
  { href: '/admin/wisata', label: 'Wisata', icon: MapPin },
  { href: '/admin/penelitian-charts', label: 'Chart Penelitian', icon: BarChart3 },
  { href: '/admin/fasilitas', label: 'Fasilitas', icon: Building2 },
  { href: '/admin/ulasan', label: 'Ulasan', icon: MessageSquare },
  { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon },
  { href: '/admin/znek-content', label: 'Konten ZNEK', icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">JumpoZone Admin</h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* Back to Site */}
        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            Kembali ke Situs
          </Link>
        </div>
      </div>
    </aside>
  );
}
