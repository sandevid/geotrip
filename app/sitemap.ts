import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { absoluteUrl } from '@/lib/site';

// Sitemap di-revalidate setiap 1 jam supaya tetap statis & cepat,
// tapi tetap mengikuti perubahan data di Supabase.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/fasilitas'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  let wisataEntries: MetadataRoute.Sitemap = [];

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('wisata')
      .select('id, updated_at, nama')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[sitemap] gagal fetch wisata:', error.message);
    } else if (data) {
      wisataEntries = data.map((row) => ({
        url: absoluteUrl(`/wisata/${row.id}`),
        lastModified: row.updated_at ? new Date(row.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
  } catch (err) {
    // Sitemap tidak boleh blow up build hanya karena Supabase down.
    console.error('[sitemap] error:', err);
  }

  return [...staticEntries, ...wisataEntries];
}
