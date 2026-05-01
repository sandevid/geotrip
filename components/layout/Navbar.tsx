'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  role: 'user' | 'admin';
  full_name: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
  }

  async function handleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setProfileMenuOpen(false);
  }

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/wisata/d4d3f22b-6a42-421a-a9b1-9c0b025845ae', label: 'Umbul Sidomukti' },
    { href: '/wisata/e0430c98-0fce-4597-a593-077f723658a4', label: 'Sam Poo Kong' },
    { href: '/fasilitas', label: 'Fasilitas' },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: scrolled || !isHomePage ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
        boxShadow: scrolled || !isHomePage ? '0 2px 8px 0 rgb(0 0 0 / 0.06)' : '0 0 0 0 rgb(0 0 0 / 0)',
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={false}
          animate={{
            height: scrolled ? '64px' : '80px',
          }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span
              className={`text-2xl font-heading font-bold transition-colors duration-300 ${
                scrolled || !isHomePage ? 'text-primary' : 'text-white'
              }`}
            >
              GeoTrip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-300 group ${
                  isActive(link.href)
                    ? scrolled || !isHomePage
                      ? 'text-primary'
                      : 'text-white'
                    : scrolled || !isHomePage
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    isActive(link.href) 
                      ? 'w-full bg-accent' 
                      : 'w-0 group-hover:w-full'
                  } ${
                    scrolled || !isHomePage ? 'bg-primary group-hover:bg-accent' : 'bg-white'
                  }`}
                />
              </Link>
            ))}

            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className={`relative text-sm font-medium transition-colors duration-300 group ${
                  pathname.startsWith('/admin')
                    ? scrolled || !isHomePage
                      ? 'text-primary'
                      : 'text-white'
                    : scrolled || !isHomePage
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Admin
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrolled || !isHomePage ? 'bg-primary' : 'bg-white'
                  }`}
                />
              </Link>
            )}

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    scrolled || !isHomePage
                      ? 'hover:bg-gray-100'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <User
                    className={`w-5 h-5 transition-colors duration-300 ${
                      scrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      scrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignIn}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  scrolled || !isHomePage
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Login</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled || !isHomePage
                ? 'hover:bg-gray-100'
                : 'hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? (
              <X
                className={`w-6 h-6 transition-colors duration-300 ${
                  scrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 transition-colors duration-300 ${
                  scrolled || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              />
            )}
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-primary/5 text-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Admin
                </Link>
              )}

              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-4 py-2 text-sm text-gray-600">
                      {profile?.full_name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-base font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
