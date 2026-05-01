'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Ticket } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

type Wisata = Tables<'wisata'>;

interface WisataCardProps {
  wisata: Wisata;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string | null;
}

export default function WisataCard({
  wisata,
  averageRating,
  reviewCount,
  thumbnailUrl,
}: WisataCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-accent">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-accent">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <Link href={`/wisata/${wisata.id}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
      >
        {/* Image Container */}
        <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
          {thumbnailUrl ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="relative w-full h-full"
            >
              <Image
                src={thumbnailUrl}
                alt={wisata.nama}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-sm">Tidak ada gambar</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-heading font-semibold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
            {wisata.nama}
          </h3>

          <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">
            {wisata.deskripsi}
          </p>

          {/* Operational Info */}
          <div className="space-y-2 mb-4">
            {wisata.jam_buka && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-accent" />
                <span>{wisata.jam_buka}</span>
              </div>
            )}
            {wisata.harga_tiket && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Ticket className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{wisata.harga_tiket}</span>
              </div>
            )}
          </div>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-lg">
                {renderStars(averageRating)}
              </div>
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} ({reviewCount} ulasan)
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
