import { ImageResponse } from 'next/og';

// Apple touch icon size (Safari/iOS home screen).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          fontSize: 130,
          letterSpacing: -6,
        }}
      >
        <span
          style={{
            display: 'flex',
            transform: 'translate(-3px, -4px)',
            textShadow: '0 4px 10px rgba(0,0,0,0.35)',
          }}
        >
          J
        </span>
      </div>
    ),
    { ...size },
  );
}
