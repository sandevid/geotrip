'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import WisataCard from '@/components/wisata/WisataCard';
import { ZnekSection } from '@/components/znek/ZnekSection';
import type { Tables } from '@/lib/types/database';

type Wisata = Tables<'wisata'>;
type HeroSection = Tables<'hero_section'>;
type AboutSection = Tables<'about_section'>;

export interface WisataWithRating {
  wisata: Wisata;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string | null;
}

interface HomeClientProps {
  initialHero: HeroSection | null;
  initialAbout: AboutSection | null;
  initialWisata: WisataWithRating[];
}

export function HomeClient({
  initialHero,
  initialAbout,
  initialWisata,
}: HomeClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const aboutRef = useRef(null);
  const destinasiRef = useRef(null);
  const destinasiInView = useInView(destinasiRef, {
    once: true,
    margin: '-100px',
  });

  const heroImages = initialHero?.images ?? [];

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      {initialHero && heroImages.length > 0 && (
        <section
          className="relative h-screen w-full overflow-hidden"
          aria-label="Hero JumpoZone"
        >
          <div className="absolute inset-0">
            {heroImages.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.05,
                }}
                transition={{
                  opacity: { duration: 2, ease: 'easeInOut' },
                  scale: { duration: 8, ease: 'linear' },
                }}
                className="absolute inset-0"
                style={{ zIndex: index === currentImageIndex ? 1 : 0 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  role="img"
                  aria-label={`${initialHero.title} ${initialHero.subtitle}`}
                />
              </motion.div>
            ))}
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>

          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
                  <span className="block">{initialHero.title}</span>
                  <span className="block text-accent">
                    {initialHero.subtitle}
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                {initialHero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link
                  href="#destinasi"
                  className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-medium hover:bg-secondary transition-all duration-300 hover:scale-105"
                >
                  Jelajahi Destinasi
                </Link>
              </motion.div>
            </div>
          </div>

          {heroImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index === currentImageIndex
                      ? 'bg-accent w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* About Section */}
      {initialAbout && (
        <section ref={aboutRef} className="py-24 bg-white" id="tentang">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-4">
                {initialAbout.title}
              </h2>
              <div className="flex items-center justify-center mb-8">
                <div className="h-px w-16 bg-accent" />
              </div>
              <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {initialAbout.content}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Destination Cards Section */}
      <section
        id="destinasi"
        ref={destinasiRef}
        className="py-24 bg-gray-50"
        aria-label="Destinasi wisata Semarang"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              destinasiInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-4">
              Destinasi Wisata
            </h2>
            <p className="sr-only">
              Daftar destinasi wisata Semarang termasuk Umbul Sidomukti dan Sam
              Poo Kong dengan informasi tiket, jam buka, ulasan, dan lokasi.
            </p>
            <div className="flex items-center justify-center">
              <div className="h-px w-16 bg-accent" />
            </div>
          </motion.div>

          {initialWisata.length > 0 ? (
            <div
              className={`grid gap-8 ${
                initialWisata.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : initialWisata.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {initialWisata.map((data, index) => (
                <motion.div
                  key={data.wisata.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    destinasiInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <WisataCard
                    wisata={data.wisata}
                    averageRating={data.averageRating}
                    reviewCount={data.reviewCount}
                    thumbnailUrl={data.thumbnailUrl}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-12">
              <p>Belum ada destinasi wisata tersedia.</p>
            </div>
          )}
        </div>
      </section>

      {/* ZNEK Section */}
      <ZnekSection />
    </div>
  );
}
