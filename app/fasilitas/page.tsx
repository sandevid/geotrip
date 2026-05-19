import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';
import FasilitasMapWithSidebar from '@/components/fasilitas/FasilitasMapWithSidebar';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

export const revalidate = 1800; // 30 menit

export const metadata: Metadata = {
  title: 'Peta Fasilitas Wisata Semarang',
  description:
    'Peta interaktif fasilitas di sekitar destinasi wisata Semarang: ATM, restoran, SPBU, parkir, dan layanan publik di sekitar Umbul Sidomukti dan Sam Poo Kong.',
  keywords: [
    'peta fasilitas Semarang',
    'fasilitas wisata Semarang',
    'fasilitas Umbul Sidomukti',
    'fasilitas Sam Poo Kong',
    'peta wisata interaktif',
    'WebGIS Semarang',
    SITE_NAME,
  ],
  alternates: { canonical: '/fasilitas' },
  openGraph: {
    title: `Peta Fasilitas Wisata Semarang — ${SITE_NAME}`,
    description:
      'Jelajahi fasilitas di sekitar destinasi wisata Semarang dengan peta interaktif JumpoZone.',
    url: absoluteUrl('/fasilitas'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'id_ID',
  },
};

async function getFasilitasData(): Promise<Tables<'fasilitas'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('fasilitas')
    .select('*')
    .order('nama');

  if (error) {
    console.error('Error fetching fasilitas:', error);
    return [];
  }
  return data || [];
}

async function getWisataData(): Promise<Tables<'wisata'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('wisata')
    .select('*')
    .order('nama');

  if (error) {
    console.error('Error fetching wisata:', error);
    return [];
  }
  return data || [];
}

export default async function FasilitasPage() {
  const [fasilitasData, wisataData] = await Promise.all([
    getFasilitasData(),
    getWisataData(),
  ]);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Peta Fasilitas',
        item: absoluteUrl('/fasilitas'),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="pt-20">
        <h1 className="sr-only">
          Peta Fasilitas Wisata Semarang — Umbul Sidomukti & Sam Poo Kong
        </h1>
        <FasilitasMapWithSidebar
          fasilitasData={fasilitasData}
          wisataData={wisataData}
        />
      </div>
    </>
  );
}
