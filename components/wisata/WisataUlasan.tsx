import { Star, User } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

type UlasanWithProfile = Tables<'ulasan'> & {
  profiles: Tables<'profiles'> | null;
};

interface WisataUlasanProps {
  ulasan: UlasanWithProfile[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function UlasanItem({ ulasan }: { ulasan: UlasanWithProfile }) {
  return (
    <div className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {ulasan.profiles?.avatar_url ? (
            <img
              src={ulasan.profiles.avatar_url}
              alt={ulasan.profiles.full_name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-body-sm font-medium text-gray-900">
              {ulasan.profiles?.full_name || 'Pengguna'}
            </span>
            <span className="text-caption text-gray-500">
              {formatDate(ulasan.created_at)}
            </span>
          </div>

          <StarRating rating={ulasan.rating} />

          <p className="text-body text-gray-700 mt-2 leading-relaxed">
            {ulasan.komentar}
          </p>
        </div>
      </div>
    </div>
  );
}

export function WisataUlasan({ ulasan }: WisataUlasanProps) {
  // Sort by created_at DESC
  const sortedUlasan = [...ulasan].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-h3 font-heading mb-4">
        Ulasan ({ulasan.length})
      </h2>

      {sortedUlasan.length === 0 ? (
        <p className="text-body-sm text-gray-500">
          Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
        </p>
      ) : (
        <div className="space-y-4">
          {sortedUlasan.map((item) => (
            <UlasanItem key={item.id} ulasan={item} />
          ))}
        </div>
      )}
    </div>
  );
}
