'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

interface WisataDescriptionProps {
  wisata: Tables<'wisata'>;
  averageRating: number;
  totalReviews: number;
}

export function WisataDescription({
  wisata,
  averageRating,
  totalReviews,
}: WisataDescriptionProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-accent text-accent" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-gray-300 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
        {wisata.nama}
      </h1>

      {/* Rating */}
      {totalReviews > 0 && (
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-1">
            {renderStars(averageRating)}
          </div>
          <span className="text-base text-gray-600">
            {averageRating.toFixed(1)} ({totalReviews} ulasan)
          </span>
        </div>
      )}

      {/* Elegant Divider */}
      <div className="mb-8">
        <div className="h-px w-16 bg-accent" />
      </div>

      {/* Description */}
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {wisata.deskripsi}
        </p>
      </div>
    </motion.article>
  );
}
