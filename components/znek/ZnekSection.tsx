'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, useInView } from 'framer-motion';
import type { Tables } from '@/lib/types/database';

type ZnekSection = Tables<'znek_sections'>;
type ZnekItem = Tables<'znek_items'>;

interface ZnekSectionWithItems extends ZnekSection {
  items: ZnekItem[];
}

export function ZnekSection() {
  const [sections, setSections] = useState<ZnekSectionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const znekRef = useRef(null);
  const znekInView = useInView(znekRef, { once: true, margin: '-100px' });

  console.log('ZnekSection render - loading:', loading, 'sections count:', sections.length, 'error:', error);

  useEffect(() => {
    fetchZnekData();
  }, []);

  async function fetchZnekData() {
    try {
      const supabase = createClient();

      // Fetch active sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('znek_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (sectionsError) {
        console.error('Error fetching ZNEK sections:', sectionsError);
        setLoading(false);
        return;
      }

      console.log('ZNEK sections fetched:', sectionsData);
      console.log('ZNEK sections count:', sectionsData?.length);

      // If no sections, don't fetch items
      if (!sectionsData || sectionsData.length === 0) {
        console.log('No ZNEK sections found');
        setLoading(false);
        return;
      }

      // Fetch active items for each section
      const { data: itemsData, error: itemsError } = await supabase
        .from('znek_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (itemsError) {
        console.error('Error fetching ZNEK items:', itemsError);
      }

      console.log('ZNEK items fetched:', itemsData);

      // Group items by section_id
      const sectionsWithItems: ZnekSectionWithItems[] = sectionsData.map((section) => ({
        ...section,
        items: (itemsData || []).filter((item) => item.section_id === section.id),
      }));

      console.log('ZNEK sections with items:', sectionsWithItems);
      console.log('Setting sections state with:', sectionsWithItems.length, 'sections');
      setSections(sectionsWithItems);
      setError(null);
    } catch (error) {
      console.error('Error fetching ZNEK data:', error);
      setError('Failed to load ZNEK data');
    } finally {
      console.log('ZNEK: Setting loading to false');
      setLoading(false);
    }
  }

  // Always render something for debugging
  return (
    <section ref={znekRef} id="znek" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {loading && (
          <div className="text-center">
            <p className="text-gray-600">Memuat konten ZNEK...</p>
          </div>
        )}

        {!loading && sections.length === 0 && (
          <div className="text-center">
            <p className="text-gray-600">Konten ZNEK belum tersedia.</p>
          </div>
        )}

        {!loading && sections.length > 0 && (
          <>
            {/* Hero/Title Section */}
            {(() => {
              const heroSection = sections.find((s) => s.section_type === 'hero');
              if (!heroSection) return null;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={znekInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-20"
                >
                  <div className="inline-block bg-accent/10 rounded-full px-6 py-2 mb-6">
                    <span className="text-accent font-semibold text-sm tracking-wider uppercase">
                      {heroSection.subtitle || 'Analisis Ekonomi Wisata'}
                    </span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-6">
                    {heroSection.title}
                  </h2>
                  {/* Premium Divider */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
                  </div>
                  {heroSection.content && (
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      {heroSection.content}
                    </p>
                  )}
                </motion.div>
              );
            })()}

            {/* Content Sections */}
            <div className="space-y-24">
              {sections
                .filter((section) => section.section_type !== 'hero')
                .map((section, sectionIndex) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={znekInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  >
                    {renderSection(section)}
                  </motion.div>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function renderSection(section: ZnekSectionWithItems) {
  const { section_type, title, subtitle, content, items } = section;

  switch (section_type) {
    case 'introduction':
    case 'conclusion':
      return (
        <div>
          {/* Section Header */}
          <div className="mb-8">
            <h3 className="text-4xl font-heading font-bold text-primary mb-4">
              {title}
            </h3>
            {/* Premium Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-primary rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            {subtitle && (
              <p className="text-xl text-gray-600 italic mb-4">{subtitle}</p>
            )}
          </div>
          
          {/* Content */}
          {content && (
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      );

    case 'methodology':
      return (
        <div>
          {/* Section Header */}
          <div className="mb-12">
            <h3 className="text-4xl font-heading font-bold text-primary mb-4">
              {title}
            </h3>
            {/* Premium Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-primary rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            {content && (
              <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
            )}
          </div>
          
          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-10">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-6 group">
                  {/* Number Badge */}
                  {item.icon_number && (
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <span className="text-white text-xl font-bold">
                            {item.icon_number}
                          </span>
                        </div>
                        {/* Decorative ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-accent/20 scale-110" />
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h4 className="text-2xl font-heading font-semibold text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'impact':
      return (
        <div>
          {/* Section Header */}
          <div className="mb-12">
            <h3 className="text-4xl font-heading font-bold text-primary mb-4">
              {title}
            </h3>
            {/* Premium Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-primary rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            {content && (
              <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
            )}
          </div>
          
          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-12">
              {items.map((item, index) => (
                <div key={item.id}>
                  {/* Subsection Title */}
                  <h4 className="text-2xl font-heading font-semibold text-primary mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {item.title}
                  </h4>
                  
                  {/* Content with HTML support */}
                  <div
                    className="text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none
                      prose-headings:text-primary prose-headings:font-heading
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-ul:text-gray-700 prose-li:text-gray-700
                      prose-strong:text-primary prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                  
                  {/* Separator between items (except last) */}
                  {index < items.length - 1 && (
                    <div className="mt-10 flex items-center gap-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'recommendation':
      return (
        <div>
          {/* Section Header */}
          <div className="mb-12">
            <h3 className="text-4xl font-heading font-bold text-primary mb-4">
              {title}
            </h3>
            {/* Premium Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-primary rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            {content && (
              <p className="text-lg text-gray-700 leading-relaxed">{content}</p>
            )}
          </div>
          
          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-6 group">
                  {/* Number Badge */}
                  {item.icon_number && (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <span className="text-white text-lg font-bold">
                          {item.icon_number}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h4 className="text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'cta':
      return (
        <div className="text-center py-16">
          {/* Decorative top border */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-accent" />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-accent" />
          </div>
          
          <h3 className="text-4xl font-heading font-bold text-primary mb-6">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {content && (
            <a
              href="#destinasi"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white font-semibold px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {content}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          )}
          
          {/* Decorative bottom border */}
          <div className="flex items-center justify-center gap-3 mt-12">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-accent" />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-accent" />
          </div>
        </div>
      );

    default:
      return (
        <div>
          <div className="mb-8">
            <h3 className="text-4xl font-heading font-bold text-primary mb-4">
              {title}
            </h3>
            {/* Premium Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-primary rounded-full" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            {subtitle && <p className="text-xl text-gray-600 mb-4">{subtitle}</p>}
          </div>
          
          {content && (
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      );
  }
}
