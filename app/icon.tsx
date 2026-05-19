import { ImageResponse } from 'next/og';

// Image metadata
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/**
 * Icon utama JumpoZone untuk:
 *  - Tab browser (favicon)
 *  - Hasil pencarian Google (Google butuh ≥ 48x48; 512x512 aman)
 *  - PWA / android home screen (manifest mengacu ke /icon ini)
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #1f3a5f 0%, #2c5282 55%, #d69e2e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          fontSize: 360,
          letterSpacing: -16,
          // Slight inner shadow effect via gradient overlay container.
          position: 'relative',
        }}
      >
        {/* Subtle highlight ring */}
        <div
          style={{
            position: 'absolute',
            inset: 32,
            borderRadius: 999,
            border: '6px solid rgba(255,255,255,0.18)',
          }}
        />
        <span
          style={{
            display: 'flex',
            // Optical centering of the J glyph.
            transform: 'translate(-8px, -12px)',
            textShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          J
        </span>
      </div>
    ),
    { ...size },
  );
}
