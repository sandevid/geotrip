'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import WisataCard from '@/components/wisata/WisataCard';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import type { Tables } from '@/lib/types/database';

type Wisata = Tables<'wisata'>;
type HeroSection = Tables<'hero_section'>;
type AboutSection = Tables<'about_section'>;

interface WisataWithRating {
  wisata: Wisata;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string | null;
}

export default function Home() {
  const [wisataWithRatings, setWisataWithRatings] = useState<WisataWithRating[]>([]);
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const aboutRef = useRef(null);
  const destinasiRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: '-100px' });
  const destinasiInView = useInView(destinasiRef, { once: true, margin: '-100px' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (heroSections.length > 0 && heroSections[0].images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroSections[0].images.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [heroSections]);

  async function fetchData() {
    const supabase = createClient();

    // Fetch hero sections
    const { data: heroData, error: heroError } = await supabase
      .from('hero_section')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1);

    if (heroError) {
      console.error('Error fetching hero section:', heroError);
    } else if (heroData && heroData.length > 0) {
      console.log('Hero data loaded:', heroData);
      setHeroSections(heroData);
    } else {
      console.log('No hero data found');
    }

    // Fetch about section
    const { data: aboutData, error: aboutError } = await supabase
      .from('about_section')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (aboutError) {
      console.error('Error fetching about section:', aboutError);
    } else if (aboutData) {
      console.log('About data loaded:', aboutData);
      setAboutSection(aboutData);
    } else {
      console.log('No about data found');
    }

    // Fetch wisata data
    const { data: wisataList, error: wisataError } = await supabase
      .from('wisata')
      .select('*')
      .order('nama');

    if (wisataError) {
      console.error('Error fetching wisata:', wisataError);
      setIsLoading(false);
      return;
    }

    const wisataData = await Promise.all(
      (wisataList || []).map(async (wisata) => {
        const { data: reviews } = await supabase
          .from('ulasan')
          .select('rating')
          .eq('wisata_id', wisata.id);

        const reviewCount = reviews?.length || 0;
        const averageRating =
          reviewCount > 0
            ? reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;

        const { data: gallery } = await supabase
          .from('wisata_galeri')
          .select('image_url')
          .eq('wisata_id', wisata.id)
          .limit(1)
          .maybeSingle();

        return {
          wisata,
          averageRating,
          reviewCount,
          thumbnailUrl: gallery?.image_url || null,
        };
      })
    );

    setWisataWithRatings(wisataData);
    setIsLoading(false);
  }

  const activeHero = heroSections[0];
  const heroImages = activeHero?.images || [];

  // Debug logs
  console.log('About section state:', aboutSection);
  console.log('Hero sections state:', heroSections);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      {activeHero && heroImages.length > 0 && (
        <section className="relative h-screen w-full overflow-hidden">
          {/* Carousel Images */}
          <div className="absolute inset-0">
            {heroImages.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentImageIndex ? 1 : 0,
                  scale: index === currentImageIndex ? 1 : 1.05
                }}
                transition={{ 
                  opacity: { duration: 2, ease: "easeInOut" },
                  scale: { duration: 8, ease: "linear" }
                }}
                className="absolute inset-0"
                style={{ zIndex: index === currentImageIndex ? 1 : 0 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                  }}
                />
              </motion.div>
            ))}
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
                  <span className="block">{activeHero.title}</span>
                  <span className="block text-accent">{activeHero.subtitle}</span>
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                {activeHero.description}
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

          {/* Carousel Indicators */}
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
      {aboutSection && (
        <section ref={aboutRef} className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-4">
                {aboutSection.title}
              </h2>
              {/* Elegant Divider */}
              <div className="flex items-center justify-center mb-8">
                <div className="h-px w-16 bg-accent" />
              </div>
              <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                {aboutSection.content}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Destination Cards Section */}
      <section id="destinasi" ref={destinasiRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={destinasiInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-4">
              Destinasi Wisata
            </h2>
            <div className="flex items-center justify-center">
              <div className="h-px w-16 bg-accent" />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="text-center text-gray-600 py-12">
              <p>Memuat destinasi...</p>
            </div>
          ) : wisataWithRatings.length > 0 ? (
            <div className={`grid gap-8 ${
              wisataWithRatings.length === 1 
                ? 'grid-cols-1 max-w-md mx-auto'
                : wisataWithRatings.length === 2 
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {wisataWithRatings.map((data, index) => (
                <motion.div
                  key={data.wisata.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    destinasiInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
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
    </div>
  );
}
