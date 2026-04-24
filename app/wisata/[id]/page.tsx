import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';
import { WisataHero } from '@/components/wisata/WisataHero';
import { WisataDescription } from '@/components/wisata/WisataDescription';
import { WisataSidebar } from '@/components/wisata/WisataSidebar';
import { WisataUlasanSection } from '@/components/wisata/WisataUlasanSection';
import { WisataResearch } from '@/components/wisata/WisataResearch';

type WisataWithRelations = Tables<'wisata'> & {
  wisata_galeri: Tables<'wisata_galeri'>[];
  wisata_penelitian: Tables<'wisata_penelitian'>[];
  ulasan: (Tables<'ulasan'> & {
    profiles: Tables<'profiles'> | null;
  })[];
};

async function getWisataData(id: string): Promise<WisataWithRelations | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisata')
    .select(`
      *,
      wisata_galeri(*),
      wisata_penelitian(*),
      ulasan(*, profiles(*))
    `)
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

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2 Column Layout: 75% - 25% */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - 75% (9 columns) */}
          <div className="lg:col-span-9 space-y-12 sm:space-y-16">
            {/* Hero Carousel */}
            <WisataHero images={wisata.wisata_galeri} />
            
            {/* Description */}
            <WisataDescription 
              wisata={wisata}
              averageRating={averageRating}
              totalReviews={wisata.ulasan.length}
            />
            
            {/* Total Nilai Ekonomi */}
            {(wisata.duv_value || wisata.ev_value || wisata.tev_value || wisata.hpm_min || wisata.hpm_max) && (
              <section>
                <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-primary mb-6 sm:mb-8">
                  Total Nilai Ekonomi
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* TCM - DUV */}
                  {wisata.duv_value && (
                    <div className="py-4 sm:py-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                            Travel Cost Method (TCM)
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Nilai Guna Langsung (DUV)</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-heading font-semibold text-gray-900">
                          Rp {wisata.duv_value.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CVM - EV */}
                  {wisata.ev_value && (
                    <div className="py-4 sm:py-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                            Contingent Valuation Method (CVM)
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Nilai Keberadaan (EV)</p>
                        </div>
                        <p className="text-xl sm:text-2xl font-heading font-semibold text-gray-900">
                          Rp {wisata.ev_value.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* HPM */}
                  {(wisata.hpm_min || wisata.hpm_max) && (
                    <div className="py-4 sm:py-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">
                            Hedonic Pricing Method (HPM)
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Interval Nilai</p>
                        </div>
                        <p className="text-lg sm:text-2xl font-heading font-semibold text-gray-900">
                          {wisata.hpm_min?.toLocaleString('id-ID') || '0'} - {wisata.hpm_max?.toLocaleString('id-ID') || '0'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total TEV */}
                  {wisata.tev_value && (
                    <div className="py-6 sm:py-8 mt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-base sm:text-lg text-gray-700 font-medium mb-1">
                            Total Economic Value (TEV)
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">DUV + EV</p>
                        </div>
                        <p className="text-2xl sm:text-4xl font-heading font-bold text-accent">
                          Rp {wisata.tev_value.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - 25% (3 columns) */}
          <div className="lg:col-span-3 space-y-8 sm:space-y-12">
            {/* Info Sidebar */}
            <WisataSidebar wisata={wisata} />
            
            {/* Ulasan Section */}
            <WisataUlasanSection 
              ulasan={wisata.ulasan}
              wisataId={wisata.id}
            />
          </div>
        </div>

        {/* Full Width Section - Research Data */}
        <div className="mt-12 sm:mt-20">
          <WisataResearch penelitian={wisata.wisata_penelitian} wisataId={wisata.id} />
        </div>
      </div>
    </div>
  );
}
