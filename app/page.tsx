import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  HomeClient,
  type WisataWithRating,
} from '@/components/home/HomeClient';
import {
  SITE_DESCRIPTION,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE_DEFAULT,
  SITE_URL,
  absoluteUrl,
} from '@/lib/site';
import type { Tables } from '@/lib/types/database';

// Revalidate the home page periodically so admin updates show up without a redeploy.
export const revalidate = 600; // 10 menit

export const metadata: Metadata = {
  title: SITE_TITLE_DEFAULT,
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'id_ID',
  },
};

type HeroSection = Tables<'hero_section'>;
type AboutSection = Tables<'about_section'>;

interface HomeData {
  hero: HeroSection | null;
  about: AboutSection | null;
  wisata: WisataWithRating[];
}

async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient();

  const [{ data: heroData }, { data: aboutData }, { data: wisataList }] =
    await Promise.all([
      supabase
        .from('hero_section')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(1),
      supabase
        .from('about_section')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle(),
      supabase.from('wisata').select('*').order('nama'),
    ]);

  const wisata: WisataWithRating[] = await Promise.all(
    (wisataList ?? []).map(async (w) => {
      const [{ data: reviews }, { data: gallery }] = await Promise.all([
        supabase.from('ulasan').select('rating').eq('wisata_id', w.id),
        supabase
          .from('wisata_galeri')
          .select('image_url')
          .eq('wisata_id', w.id)
          .limit(1)
          .maybeSingle(),
      ]);

      const reviewCount = reviews?.length ?? 0;
      const averageRating =
        reviewCount > 0
          ? reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      return {
        wisata: w,
        averageRating,
        reviewCount,
        thumbnailUrl: gallery?.image_url ?? null,
      };
    }),
  );

  return {
    hero: heroData?.[0] ?? null,
    about: aboutData ?? null,
    wisata,
  };
}

export default async function Home() {
  const { hero, about, wisata } = await getHomeData();

  // Structured data: WebSite (search action) + Organization + ItemList of attractions.
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    inLanguage: 'id-ID',
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/opengraph-image'),
    address: {
      '@type': 'PostalAddress',
      ...SITE_LOCATION,
    },
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Destinasi Wisata Semarang',
    description:
      'Daftar destinasi wisata di Semarang yang dipublikasikan di JumpoZone, termasuk Umbul Sidomukti dan Sam Poo Kong.',
    itemListElement: wisata.map((data, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: absoluteUrl(`/wisata/${data.wisata.id}`),
      name: data.wisata.nama,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {wisata.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <HomeClient
        initialHero={hero}
        initialAbout={about}
        initialWisata={wisata}
      />
    </>
  );
}
