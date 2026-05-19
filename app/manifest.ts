import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION_SHORT, SITE_NAME, SITE_TAGLINE } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION_SHORT,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f3a5f',
    lang: 'id-ID',
    categories: ['travel', 'lifestyle', 'navigation'],
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
