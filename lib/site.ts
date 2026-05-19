/**
 * Konstanta global situs JumpoZone — dipakai oleh metadata, sitemap, robots,
 * manifest, dan komponen JSON-LD. Single source of truth untuk SEO.
 */

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://jumpozone.my.id';

// Pastikan tanpa trailing slash & selalu dengan protokol https
function normalizeUrl(url: string): string {
  let u = url.trim();
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`;
  }
  return u.replace(/\/+$/, '');
}

export const SITE_URL = normalizeUrl(RAW_SITE_URL);

export const SITE_NAME = 'JumpoZone';
export const SITE_TAGLINE =
  'Jelajah Wisata Semarang: Umbul Sidomukti & Sam Poo Kong';
export const SITE_TITLE_DEFAULT = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const SITE_DESCRIPTION =
  'JumpoZone adalah platform WebGIS pariwisata Kota Semarang. Temukan informasi lengkap, peta interaktif, ulasan, harga tiket, jam buka, dan analisis nilai ekonomi destinasi unggulan seperti Umbul Sidomukti dan Sam Poo Kong.';

export const SITE_DESCRIPTION_SHORT =
  'WebGIS pariwisata Semarang: Umbul Sidomukti, Sam Poo Kong, peta fasilitas, harga tiket, dan ulasan wisatawan.';

export const SITE_KEYWORDS: string[] = [
  // Brand
  'JumpoZone',
  'Jumpo Zone',
  'jumpozone.my.id',
  // Destinasi utama
  'Umbul Sidomukti',
  'wisata Umbul Sidomukti',
  'Umbul Sidomukti Semarang',
  'tiket Umbul Sidomukti',
  'jam buka Umbul Sidomukti',
  'kolam renang Umbul Sidomukti',
  'Sam Poo Kong',
  'Klenteng Sam Poo Kong',
  'wisata Sam Poo Kong',
  'tiket Sam Poo Kong',
  'jam buka Sam Poo Kong',
  'sejarah Sam Poo Kong',
  // Kota & region
  'wisata Semarang',
  'pariwisata Semarang',
  'tempat wisata Semarang',
  'destinasi wisata Semarang',
  'liburan Semarang',
  'wisata Jawa Tengah',
  'wisata Kabupaten Semarang',
  // Generic
  'WebGIS pariwisata',
  'peta wisata Semarang',
  'fasilitas wisata Semarang',
  'rekomendasi wisata Semarang',
  'wisata keluarga Semarang',
];

/** Lokasi default untuk JSON-LD Organization / Place. */
export const SITE_LOCATION = {
  addressLocality: 'Semarang',
  addressRegion: 'Jawa Tengah',
  addressCountry: 'ID',
};

/** Helper kecil untuk membuat URL absolut dari path relatif. */
export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
