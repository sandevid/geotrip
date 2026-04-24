'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MapIcon, TrendingUp, DollarSign, Home } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ChartCarousel } from './ChartCarousel';
import { WisataPetaCarousel } from './WisataPetaCarousel';
import type { Tables } from '@/lib/types/database';

interface WisataResearchProps {
  penelitian: Tables<'wisata_penelitian'>[];
  wisataId: string;
}

interface ChartData {
  id: string;
  chart_embed_url: string;
  chart_order: number;
  variabel_type: string;
}

interface PetaImage {
  id: string;
  image_url: string;
  image_order: number;
}

export function WisataResearch({ penelitian, wisataId }: WisataResearchProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [allCharts, setAllCharts] = useState<ChartData[]>([]);
  const [petaImages, setPetaImages] = useState<PetaImage[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch charts
      const { data: chartsData, error: chartsError } = await supabase
        .from('wisata_penelitian_charts')
        .select('id, chart_embed_url, chart_order, variabel_type')
        .eq('wisata_id', wisataId)
        .order('variabel_type')
        .order('chart_order');

      if (!chartsError && chartsData) {
        setAllCharts(chartsData);
      }

      // Fetch peta images
      const { data: petaData, error: petaError } = await supabase
        .from('wisata_peta_images')
        .select('id, image_url, image_order')
        .eq('wisata_id', wisataId)
        .order('image_order');

      if (!petaError && petaData) {
        setPetaImages(petaData);
      }

      setLoading(false);
    }

    fetchData();
  }, [wisataId]);

  // Group charts by variabel_type
  const groupedCharts = allCharts.reduce((acc, chart) => {
    if (!acc[chart.variabel_type]) {
      acc[chart.variabel_type] = [];
    }
    acc[chart.variabel_type].push(chart);
    return acc;
  }, {} as Record<string, ChartData[]>);

  // Get unique variabel types
  const variabelTypes = Object.keys(groupedCharts);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
          Analisis Nilai Ekonomi Wisata
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className="h-px w-12 sm:w-16 bg-accent" />
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4">
          Penelitian komprehensif menggunakan berbagai metode valuasi ekonomi untuk mengukur nilai wisata
        </p>
      </div>

      {/* 1. Peta */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          <h3 className="text-xl sm:text-2xl font-heading font-semibold text-primary">
            Peta Lokasi
          </h3>
        </div>
        <WisataPetaCarousel images={petaImages} />
      </motion.section>

      {/* Dynamic Chart Carousels */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-4">Memuat data chart...</p>
        </div>
      ) : variabelTypes.length > 0 ? (
        <>
          {/* TCM */}
          {groupedCharts['TCM'] && (
            <ChartCarousel
              charts={groupedCharts['TCM']}
              title="Variabel Travel Cost Method (TCM)"
              description="Berdasarkan 102 responden, berikut variasi jawaban yang diperoleh pada masing-masing variabel."
              icon={TrendingUp}
            />
          )}

          {/* CVM */}
          {groupedCharts['CVM'] && (
            <ChartCarousel
              charts={groupedCharts['CVM']}
              title="Variabel Contingent Valuation Method (CVM)"
              description="Berdasarkan 100 responden, berikut variasi jawaban yang diperoleh pada masing-masing variabel."
              icon={DollarSign}
            />
          )}

          {/* HPM */}
          {groupedCharts['HPM'] && (
            <ChartCarousel
              charts={groupedCharts['HPM']}
              title="Variabel Hedonic Pricing Method (HPM)"
              description="Berdasarkan 102 responden, berikut variasi jawaban yang diperoleh pada masing-masing variabel."
              icon={Home}
            />
          )}

          {/* Custom Variabels */}
          {variabelTypes
            .filter(type => !['TCM', 'CVM', 'HPM'].includes(type))
            .map((variabelType) => (
              <ChartCarousel
                key={variabelType}
                charts={groupedCharts[variabelType]}
                title={`Variabel ${variabelType}`}
                description={`Analisis data penelitian untuk variabel ${variabelType}.`}
                icon={TrendingUp}
              />
            ))}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Belum ada data chart penelitian</p>
        </div>
      )}
    </motion.div>
  );
}
