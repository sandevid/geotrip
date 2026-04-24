import { ZnekHero } from '@/components/znek/ZnekHero';
import { ZnekContent } from '@/components/znek/ZnekContent';

export default function ZnekPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <ZnekHero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <ZnekContent />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Zona Nilai Ekonomi Kawasan (ZNEK) - GeoTrip',
  description: 'Memahami nilai ekonomi destinasi wisata melalui metode Travel Cost Method (TCM), Contingent Valuation Method (CVM), dan Hedonic Pricing Method (HPM).',
};
