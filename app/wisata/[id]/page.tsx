import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';
import { WisataHero } from '@/components/wisata/WisataHero';
import { WisataDescription } from '@/components/wisata/WisataDescription';
import { WisataSidebar } from '@/components/wisata/WisataSidebar';
import { WisataUlasanSection } from '@/components/wisata/WisataUlasanSection';
import { WisataResearch } from '@/components/wisata/WisataResearch';
import {
  SITE_LOCATION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from '@/lib/site';

type WisataWithRelations = Tables<'wisata'> & {
  wisata_galeri: Tables<'wisata_galeri'>[];
  wisata_penelitian: Tables<'wisata_penelitian'>[];
  ulasan: (Tables<'ulasan'> & {
    profiles: Tables<'profiles'> | null;
  })[];
};

// Revalidate detail pages periodically so DB edits propagate to static cache.
export const revalidate = 600;

async function getWisataData(id: string): Promise<WisataWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('wisata')
    .select(
      `
      *,
      wisata_galeri(*),
      wisata_penelitian(*),
      ulasan(*, profiles(*))
    `,
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching wisata:', error);
    return null;
  }

  return data as WisataWithRelations;
}

function calculateAverageRating(ulasan: Tables<'ulasan'>[]): number {
  if (ulasan.length === 0) return 0;
  const sum = ulasan.reduce((acc, u) => acc + u.rating, 0);
  return sum / ulasan.length;
}

function buildDescription(wisata: WisataWithRelations): string {
  const base = wisata.deskripsi?.trim() || '';
  // Browser & Google: target ~150–160 char, klausa lengkap.
  const trimmed = base.replace(/\s+/g, ' ');
  if (trimmed.length <= 155) return trimmed;
  return `${trimmed.slice(0, 152).replace(/[\s,;.]+$/, '')}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const wisata = await getWisataData(id);

  if (!wisata) {
    return {
      title: 'Destinasi tidak ditemukan',
      robots: { index: false, follow: false },
    };
  }

  const description = buildDescription(wisata);
  const title = `${wisata.nama} — Tiket, Jam Buka & Ulasan`;
  const canonical = `/wisata/${wisata.id}`;
  const heroImage =
    wisata.wisata_galeri?.[0]?.image_url ?? absoluteUrl('/opengraph-image');

  return {
    title,
    description,
    alternates: { canonical },
    keywords: [
      wisata.nama,
      `wisata ${wisata.nama}`,
      `tiket ${wisata.nama}`,
      `jam buka ${wisata.nama}`,
      `${wisata.nama} Semarang`,
      'wisata Semarang',
      SITE_NAME,
    ],
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      type: 'article',
      siteName: SITE_NAME,
      locale: 'id_ID',
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: wisata.nama,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImage],
    },
  };
}

export default async function WisataDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wisata = await getWisataData(id);

  if (!wisata) {
    notFound();
  }

  const averageRating = calculateAverageRating(wisata.ulasan);
  const totalReviews = wisata.ulasan.length;
  const photos = wisata.wisata_galeri.map((g) => g.image_url);
  const canonicalUrl = absoluteUrl(`/wisata/${wisata.id}`);

  // JSON-LD: TouristAttraction with optional AggregateRating + Reviews.
  const attractionJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': canonicalUrl,
    name: wisata.nama,
    description: wisata.deskripsi,
    url: canonicalUrl,
    image: photos.length > 0 ? photos : [absoluteUrl('/opengraph-image')],
    address: {
      '@type': 'PostalAddress',
      streetAddress: wisata.alamat,
      ...SITE_LOCATION,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: wisata.latitude,
      longitude: wisata.longitude,
    },
    ...(wisata.jam_buka ? { openingHours: wisata.jam_buka } : {}),
  };

  if (totalReviews > 0) {
    attractionJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(averageRating.toFixed(2)),
      reviewCount: totalReviews,
      bestRating: 5,
      worstRating: 1,
    };

    attractionJsonLd.review = wisata.ulasan.slice(0, 5).map((u) => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: u.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: u.profiles?.full_name || 'Pengunjung',
      },
      reviewBody: u.komentar,
      datePublished: u.created_at,
    }));
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Destinasi',
        item: absoluteUrl('/#destinasi'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: wisata.nama,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(attractionJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <article className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* SR-only H1 to make sure the page has a clear primary heading for SEO,
              even when the visible header lives inside WisataHero/Description. */}
          <h1 className="sr-only">
            {wisata.nama} — {wisata.alamat}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-9 space-y-12 sm:space-y-16">
              <WisataHero images={wisata.wisata_galeri} />

              <WisataDescription
                wisata={wisata}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />

              {(wisata.duv_value ||
                wisata.ev_value ||
                wisata.tev_value ||
                wisata.hpm_min ||
                wisata.hpm_max) && (
                <section>
                  <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-primary mb-6 sm:mb-8">
                    Total Nilai Ekonomi
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {wisata.duv_value && (
                      <div className="py-4 sm:py-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                              Travel Cost Method (TCM)
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Nilai Guna Langsung (DUV)
                            </p>
                          </div>
                          <p className="text-xl sm:text-2xl font-heading font-semibold text-gray-900">
                            Rp {wisata.duv_value.toLocaleString('id-ID')}
                          </p>
                        </div>
                        {wisata.tcm_penjelasan && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {wisata.tcm_penjelasan}
                          </p>
                        )}
                      </div>
                    )}

                    {wisata.ev_value && (
                      <div className="py-4 sm:py-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                              Contingent Valuation Method (CVM)
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Nilai Keberadaan (EV)
                            </p>
                          </div>
                          <p className="text-xl sm:text-2xl font-heading font-semibold text-gray-900">
                            Rp {wisata.ev_value.toLocaleString('id-ID')}
                          </p>
                        </div>
                        {wisata.cvm_penjelasan && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {wisata.cvm_penjelasan}
                          </p>
                        )}
                      </div>
                    )}

                    {(wisata.hpm_min || wisata.hpm_max) && (
                      <div className="py-4 sm:py-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                              Hedonic Pricing Method (HPM)
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Interval Nilai
                            </p>
                          </div>
                          <p className="text-lg sm:text-2xl font-heading font-semibold text-gray-900">
                            {wisata.hpm_min?.toLocaleString('id-ID') || '0'} -{' '}
                            {wisata.hpm_max?.toLocaleString('id-ID') || '0'}
                          </p>
                        </div>
                        {wisata.hpm_penjelasan && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {wisata.hpm_penjelasan}
                          </p>
                        )}
                      </div>
                    )}

                    {wisata.tev_value && (
                      <div className="py-6 sm:py-8 mt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-base sm:text-lg text-gray-700 font-medium mb-1">
                              Total Economic Value (TEV)
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              DUV + EV
                            </p>
                          </div>
                          <p className="text-2xl sm:text-4xl font-heading font-bold text-accent">
                            Rp {wisata.tev_value.toLocaleString('id-ID')}
                          </p>
                        </div>
                        {wisata.tev_penjelasan && (
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                            {wisata.tev_penjelasan}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="lg:col-span-3 space-y-8 sm:space-y-12">
              <WisataSidebar wisata={wisata} />

              <WisataUlasanSection
                ulasan={wisata.ulasan}
                wisataId={wisata.id}
              />
            </div>
          </div>

          <div className="mt-12 sm:mt-20">
            <WisataResearch
              penelitian={wisata.wisata_penelitian}
              wisataId={wisata.id}
            />
          </div>
        </div>
      </article>
    </>
  );
}
