'use client';

import { motion } from 'framer-motion';

export function ZnekContent() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Article - No Card */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-16"
      >
        {/* Article Header */}
        <header className="pb-12 border-b-2 border-gray-200">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6 leading-tight">
            Zona Nilai Ekonomi Kawasan (ZNEK) Pariwisata Semarang
          </h1>
          <div className="h-1 w-24 bg-accent mb-6" />
          <p className="text-xl text-gray-600 leading-relaxed">
            Analisis komprehensif mengenai dampak ekonomi dari sektor pariwisata terhadap kawasan sekitar destinasi wisata di Kota Semarang
          </p>
        </header>

        {/* Pendahuluan */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-primary mb-6">
            Pendahuluan
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Zona Nilai Ekonomi Kawasan (ZNEK) adalah analisis komprehensif mengenai dampak ekonomi dari sektor pariwisata terhadap kawasan sekitar destinasi wisata. Dalam konteks Kota Semarang, analisis ZNEK fokus pada dua destinasi utama: <strong className="text-primary">Umbul Sidomukti</strong> dan <strong className="text-primary">Sam Poo Kong</strong>.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Metodologi */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-primary mb-8">
            Metodologi Penelitian
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            Analisis ZNEK menggunakan tiga pendekatan utama:
          </p>

          <div className="space-y-12">
            {/* TCM */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-primary mb-3">
                    Travel Cost Method (TCM)
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Metode ini menghitung nilai ekonomi destinasi wisata berdasarkan biaya perjalanan yang dikeluarkan pengunjung, termasuk transportasi, akomodasi, konsumsi, dan biaya lainnya.
                  </p>
                </div>
              </div>
            </div>

            {/* CVM */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-primary mb-3">
                    Contingent Valuation Method (CVM)
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Metode ini mengukur kesediaan pengunjung untuk membayar (Willingness to Pay/WTP) terhadap pelestarian dan pengembangan destinasi wisata.
                  </p>
                </div>
              </div>
            </div>

            {/* HPM */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <span className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="text-2xl font-heading font-semibold text-primary mb-3">
                    Hedonic Pricing Method (HPM)
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Metode ini menganalisis pengaruh keberadaan destinasi wisata terhadap nilai properti dan harga tanah di sekitar kawasan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Dampak Ekonomi */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-primary mb-10">
            Dampak Ekonomi Pariwisata
          </h2>

          {/* Umbul Sidomukti */}
          <div className="mb-12">
            <h3 className="text-2xl font-heading font-semibold text-primary mb-6">
              Umbul Sidomukti
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Destinasi wisata alam ini memberikan dampak ekonomi signifikan bagi masyarakat sekitar melalui:
            </p>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Peningkatan pendapatan masyarakat dari sektor jasa (homestay, warung makan, guide)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Penyerapan tenaga kerja lokal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Peningkatan nilai properti di kawasan Bandungan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Multiplier effect pada sektor perdagangan dan jasa</span>
              </li>
            </ul>
          </div>

          {/* Sam Poo Kong */}
          <div>
            <h3 className="text-2xl font-heading font-semibold text-primary mb-6">
              Sam Poo Kong
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Sebagai destinasi wisata budaya dan sejarah, Sam Poo Kong berkontribusi pada:
            </p>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Peningkatan kunjungan wisatawan domestik dan mancanegara</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Pengembangan ekonomi kreatif (kerajinan, kuliner)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Revitalisasi kawasan Kota Lama Semarang</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent text-2xl leading-none mt-1">•</span>
                <span>Peningkatan kesadaran pelestarian warisan budaya</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Rekomendasi */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-primary mb-10">
            Rekomendasi Pengembangan
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <h4 className="text-xl font-semibold text-primary mb-2">
                  Infrastruktur
                </h4>
                <p className="text-lg text-gray-700">
                  Peningkatan aksesibilitas dan fasilitas pendukung pariwisata
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <h4 className="text-xl font-semibold text-primary mb-2">
                  Promosi
                </h4>
                <p className="text-lg text-gray-700">
                  Strategi pemasaran digital dan kolaborasi dengan travel agent
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <h4 className="text-xl font-semibold text-primary mb-2">
                  Pemberdayaan Masyarakat
                </h4>
                <p className="text-lg text-gray-700">
                  Pelatihan SDM lokal dalam bidang pariwisata
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <div>
                <h4 className="text-xl font-semibold text-primary mb-2">
                  Keberlanjutan
                </h4>
                <p className="text-lg text-gray-700">
                  Pengelolaan lingkungan dan pelestarian budaya yang berkelanjutan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Kesimpulan */}
        <section className="pb-16">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6">
            Kesimpulan
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sektor pariwisata di Semarang, khususnya <strong className="text-primary">Umbul Sidomukti</strong> dan <strong className="text-primary">Sam Poo Kong</strong>, memiliki potensi besar dalam meningkatkan nilai ekonomi kawasan. Dengan pengelolaan yang tepat dan partisipasi aktif stakeholder, destinasi wisata ini dapat menjadi motor penggerak ekonomi lokal yang berkelanjutan.
          </p>
        </section>
      </motion.article>

      {/* Call to Action - No Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-20 pt-16 border-t-2 border-gray-200 text-center"
      >
        <h3 className="text-3xl font-heading font-bold text-primary mb-4">
          Jelajahi Destinasi Wisata Semarang
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Lihat bagaimana metode ZNEK diterapkan untuk mengukur nilai ekonomi kawasan wisata
        </p>
        <a
          href="/"
          className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-10 py-4 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Lihat Destinasi Wisata
        </a>
      </motion.div>
    </div>
  );
}
