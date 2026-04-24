'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

interface WisataHeroProps {
  images: Tables<'wisata_galeri'>[];
}

export function WisataHero({ images }: WisataHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <p className="text-gray-400">Tidak ada gambar tersedia</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.05,
            }}
            transition={{
              opacity: { duration: 1, ease: 'easeInOut' },
              scale: { duration: 5, ease: 'linear' },
            }}
            className="absolute inset-0"
            style={{ zIndex: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={image.image_url}
              alt={image.caption || `Foto ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 75vw"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </>
      )}

      {/* Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-accent w-8'
                  : 'bg-white/60 w-2 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Caption */}
      {images[currentIndex].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-10">
          <p className="text-white text-sm">{images[currentIndex].caption}</p>
        </div>
      )}
    </div>
  );
}
