import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #1f3a5f 0%, #2c5282 50%, #d69e2e 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            J
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Jelajah Wisata Semarang
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              opacity: 0.92,
              maxWidth: 1000,
            }}
          >
            Umbul Sidomukti · Sam Poo Kong · Peta Fasilitas Interaktif
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <span>{SITE_URL.replace(/^https?:\/\//, '')}</span>
          <span>WebGIS Pariwisata</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
