'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, User, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UlasanForm } from './UlasanForm';
import type { Tables } from '@/lib/types/database';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type UlasanWithProfile = Tables<'ulasan'> & {
  profiles: Tables<'profiles'> | null;
};

interface WisataUlasanSectionProps {
  ulasan: UlasanWithProfile[];
  wisataId: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function WisataUlasanSection({ ulasan, wisataId }: WisataUlasanSectionProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  function handleSuccess() {
    setShowForm(false);
    // Refresh page to show new review
    window.location.reload();
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

  const sortedUlasan = [...ulasan]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-heading font-semibold text-primary">
          Ulasan ({ulasan.length})
        </h2>
      </div>

      {/* Reviews List */}
      {sortedUlasan.length > 0 ? (
        <div className="space-y-6 mb-6">
          {sortedUlasan.map((item) => (
            <div key={item.id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex items-start gap-3 mb-2">
                {item.profiles?.avatar_url ? (
                  <img
                    src={item.profiles.avatar_url}
                    alt={item.profiles.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.profiles?.full_name || 'Pengguna'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.rating
                              ? 'fill-accent text-accent'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.komentar}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-6">Belum ada ulasan</p>
      )}

      {/* Review Form or Button */}
      {!isLoading && (
        <div className="pt-6 border-t border-gray-200">
          {user ? (
            showForm ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <UlasanForm
                  wisataId={wisataId}
                  onSuccess={handleSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-primary text-white py-3 text-sm font-medium hover:bg-secondary transition-all duration-300 hover:scale-105"
              >
                Tulis Ulasan
              </button>
            )
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-primary text-primary py-3 text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300"
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
              Login untuk Ulasan
            </button>
          )}
        </div>
      )}
    </motion.section>
  );
}
