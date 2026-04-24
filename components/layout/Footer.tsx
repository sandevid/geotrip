'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-primary text-white mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold">ZNEK WebGIS</h3>
            <p className="text-white/80 leading-relaxed text-sm">
              Layanan informasi Zona Nilai Ekonomi Kawasan berbasis WebGIS pada Kawasan Wisata Umbul Sidomukti dan Sam Poo Kong. Website ini menyediakan informasi wisata, nilai ekonomi, peta interaktif, dan variabel yang memengaruhi kawasan wisata.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Navigasi</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Home
              </Link>
              <Link
                href="/znek"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                ZNEK
              </Link>
              <Link
                href="/wisata/d4d3f22b-6a42-421a-a9b1-9c0b025845ae"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Umbul Sidomukti
              </Link>
              <Link
                href="/wisata/e0430c98-0fce-4597-a593-077f723658a4"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Sam Poo Kong
              </Link>
              <Link
                href="/fasilitas"
                className="text-white/80 hover:text-white transition-colors duration-300 text-sm"
              >
                Fasilitas
              </Link>
            </nav>
          </div>

          {/* Kolom 3: Kontak & Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold">Kontak</h4>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Jl. Prof Soedarto, Tembalang, Semarang</p>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:tameinadaundip@gmail.com"
                  className="hover:text-white transition-colors duration-300"
                >
                  tameinadaundip@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-center text-sm text-white/60">
            &copy; {currentYear} ZNEK WebGIS. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
