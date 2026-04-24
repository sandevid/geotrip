# Design Document: GeoTrip WebGIS Application

## Overview

GeoTrip is a full-stack WebGIS application built with Next.js 16+ App Router, providing interactive tourism information for Semarang city destinations (Umbul Sidomukti and Sam Poo Kong). The application combines modern web technologies with geographic information systems to deliver a responsive, secure, and performant user experience.

### Core Technologies

- **Frontend Framework**: Next.js 16.2.4 with App Router (React 19.2.4)
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Mapping Library**: Leaflet.js with React-Leaflet
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Language**: TypeScript 5
- **Authentication**: Google OAuth via Supabase Auth

### Key Features

1. **Interactive Mapping**: Client-side filtered facility markers with radius-based and category-based filtering
2. **Authentication System**: Google OAuth with role-based access control (user/admin)
3. **Content Management**: Full CRUD operations for destinations, facilities, reviews, galleries, and ZNEK content
4. **Review System**: Authenticated users can submit ratings and reviews
5. **Economic Analysis**: ZNEK (Zona Nilai Ekonomi Kawasan) information display
6. **Responsive Design**: Mobile-first approach supporting all device sizes

### Design Principles

- **Server-First Architecture**: Leverage Next.js Server Components for data fetching
- **Client-Side Interactivity**: Use Client Components only where necessary (maps, filters, forms)
- **Security by Default**: Row Level Security (RLS) policies on all database tables
- **Performance Optimization**: Client-side filtering, dynamic imports, image optimization
- **Accessibility**: WCAG-compliant UI components with proper semantic HTML

## Architecture

### Application Structure

```
app/
├── (public)/                    # Public route group
│   ├── page.tsx                # Home page (Server Component)
│   ├── wisata/
│   │   └── [id]/
│   │       └── page.tsx        # Destination detail (Server Component)
│   ├── znek/
│   │   └── page.tsx            # ZNEK information page
│   └── layout.tsx              # Public layout with navbar
├── (admin)/                     # Admin route group (protected)
│   └── admin/
│       ├── page.tsx            # Admin dashboard
│       ├── wisata/
│       │   └── page.tsx        # Destination management
│       ├── fasilitas/
│       │   └── page.tsx        # Facility management
│       ├── ulasan/
│       │   └── page.tsx        # Review moderation
│       ├── galeri/
│       │   └── page.tsx        # Gallery management
│       └── znek/
│           └── page.tsx        # ZNEK content management
├── auth/
│   └── callback/
│       └── route.ts            # OAuth callback handler
├── api/                         # API routes (if needed)
├── layout.tsx                   # Root layout
└── globals.css                  # Global styles

components/
├── layout/
│   ├── Navbar.tsx              # Navigation bar (Client Component)
│   └── Footer.tsx              # Footer (Server Component)
├── map/
│   ├── FasilitasMap.tsx        # Main map component (Client Component)
│   ├── FilterRadius.tsx        # Radius filter (Client Component)
│   ├── FilterKategori.tsx      # Category filter (Client Component)
│   └── LegendKategori.tsx      # Map legend (Client Component)
├── wisata/
│   ├── WisataCard.tsx          # Destination card (Server Component)
│   ├── WisataGallery.tsx       # Image gallery (Client Component)
│   ├── WisataPenelitian.tsx    # Research content (Server Component)
│   └── WisataUlasan.tsx        # Reviews display (Server Component)
├── ulasan/
│   ├── UlasanForm.tsx          # Review submission form (Client Component)
│   └── UlasanItem.tsx          # Single review display (Server Component)
├── admin/
│   ├── WisataForm.tsx          # Destination form (Client Component)
│   ├── FasilitasForm.tsx       # Facility form (Client Component)
│   ├── GaleriUpload.tsx        # Image upload (Client Component)
│   └── ZnekEditor.tsx          # ZNEK content editor (Client Component)
└── ui/
    ├── Button.tsx              # Reusable button (Client Component)
    ├── Card.tsx                # Reusable card (Server Component)
    ├── Modal.tsx               # Modal dialog (Client Component)
    ├── Input.tsx               # Form input (Client Component)
    ├── Select.tsx              # Dropdown select (Client Component)
    ├── Spinner.tsx             # Loading spinner (Server Component)
    └── Toast.tsx               # Toast notifications (Client Component)

lib/
├── supabase/
│   ├── client.ts               # Browser Supabase client
│   ├── server.ts               # Server Supabase client
│   └── middleware.ts           # Auth middleware
├── utils/
│   ├── haversine.ts            # Distance calculation
│   ├── formatters.ts           # Date/number formatters
│   └── validators.ts           # Form validation
└── types/
    └── database.ts             # TypeScript types for database

middleware.ts                    # Next.js middleware for auth
```

### Rendering Strategy

**Server Components (Default)**:
- All pages by default
- Data fetching from Supabase
- Static content rendering
- SEO-optimized content

**Client Components (Explicit "use client")**:
- Interactive map (Leaflet requires browser APIs)
- Filter controls (state management)
- Forms with validation
- Authentication UI (session state)
- Modals and toasts
- Animations with Framer Motion

### Data Flow

1. **Server-Side Data Fetching**:
   - Server Components fetch data directly from Supabase
   - No API routes needed for simple queries
   - Automatic request deduplication by Next.js

2. **Client-Side Filtering**:
   - Facilities data fetched once on page load
   - All filtering (radius, category) happens in browser
   - No server round-trips for filter changes

3. **Mutations**:
   - Forms submit via Server Actions or API routes
   - Optimistic updates for better UX
   - Revalidation triggers after mutations

### Authentication Flow

```
User clicks "Login with Google"
    ↓
Redirect to Supabase Auth (Google OAuth)
    ↓
Google authentication
    ↓
Redirect to /auth/callback
    ↓
Exchange code for session
    ↓
Create/update profile in profiles table
    ↓
Redirect to original page
    ↓
Session stored in cookies (@supabase/ssr)
```

### Middleware Protection

```typescript
// middleware.ts checks authentication
export async function middleware(request: NextRequest) {
  // Refresh session if needed
  // Protect /admin routes (check role)
  // Allow public routes
}
```

## Components and Interfaces

### Core Components

#### 1. FasilitasMap (Client Component)

**Purpose**: Display interactive Leaflet map with facility markers

**Props**:
```typescript
interface FasilitasMapProps {
  wisataLat: number;
  wisataLng: number;
  wisataNama: string;
  fasilitasData: Fasilitas[];
}
```

**State**:
```typescript
{
  selectedRadius: number | null;  // null = "Semua"
  selectedKategori: string[];     // empty = all categories
  filteredFasilitas: Fasilitas[];
}
```

**Key Features**:
- Dynamic import with `ssr: false`
- Client-side filtering using Haversine formula
- Color-coded markers by category
- Popup with facility details and distance
- Radius circle visualization

**Implementation Notes**:
- Use `react-leaflet` for React integration
- Load Leaflet CSS in component
- Handle map initialization in useEffect
- Memoize filtered results for performance

#### 2. FilterRadius (Client Component)

**Purpose**: Radius filter control

**Props**:
```typescript
interface FilterRadiusProps {
  selectedRadius: number | null;
  onRadiusChange: (radius: number | null) => void;
  facilityCount: number;
}
```

**Options**: 250m, 500m, 750m, 1km, 1.5km, 2km, 2.5km, 3km, Semua

#### 3. FilterKategori (Client Component)

**Purpose**: Category filter with checkboxes

**Props**:
```typescript
interface FilterKategoriProps {
  selectedKategori: string[];
  onKategoriChange: (kategori: string[]) => void;
  availableKategori: string[];
}
```

**Categories**: Hotel, Niaga, Kesehatan, Pendidikan, Peribadatan, Pemerintah, ATM, SPBU, Bengkel, Lapangan, Hiburan

#### 4. Navbar (Client Component)

**Purpose**: Main navigation with authentication state

**Features**:
- Logo and app name
- Navigation links (Home, ZNEK)
- Authentication button/profile menu
- Admin dashboard link (if admin role)
- Responsive mobile menu

**State**:
```typescript
{
  user: User | null;
  isAdmin: boolean;
  mobileMenuOpen: boolean;
}
```

#### 5. UlasanForm (Client Component)

**Purpose**: Review submission form

**Props**:
```typescript
interface UlasanFormProps {
  wisataId: string;
  userId: string;
  onSuccess: () => void;
}
```

**State**:
```typescript
{
  rating: number;        // 1-5
  komentar: string;
  isSubmitting: boolean;
  error: string | null;
}
```

**Validation**:
- Rating required (1-5)
- Komentar not empty
- Max length 1000 characters

#### 6. WisataCard (Server Component)

**Purpose**: Display destination card on home page

**Props**:
```typescript
interface WisataCardProps {
  wisata: Wisata;
  averageRating: number;
  reviewCount: number;
  thumbnailUrl: string;
}
```

**Features**:
- Thumbnail image with next/image
- Destination name and brief description
- Average rating display
- Link to detail page

#### 7. Admin Forms (Client Components)

**WisataForm**:
```typescript
interface WisataFormProps {
  wisata?: Wisata;  // undefined for create, defined for edit
  onSuccess: () => void;
}
```

**FasilitasForm**:
```typescript
interface FasilitasFormProps {
  fasilitas?: Fasilitas;
  onSuccess: () => void;
}
```

**GaleriUpload**:
```typescript
interface GaleriUploadProps {
  wisataId: string;
  onSuccess: () => void;
}
```

### Utility Functions

#### Haversine Distance Calculation

```typescript
/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1 (decimal degrees)
 * @param lon1 Longitude of point 1 (decimal degrees)
 * @param lat2 Latitude of point 2 (decimal degrees)
 * @param lon2 Longitude of point 2 (decimal degrees)
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

#### Client-Side Filtering Algorithm

```typescript
/**
 * Filter facilities by radius and category
 */
export function filterFasilitas(
  fasilitas: Fasilitas[],
  wisataLat: number,
  wisataLng: number,
  radiusMeters: number | null,
  selectedKategori: string[]
): Fasilitas[] {
  return fasilitas.filter((f) => {
    // Category filter
    const categoryMatch =
      selectedKategori.length === 0 || selectedKategori.includes(f.kategori);
    
    if (!categoryMatch) return false;

    // Radius filter
    if (radiusMeters === null) return true; // "Semua"
    
    const distance = calculateDistance(
      wisataLat,
      wisataLng,
      f.latitude,
      f.longitude
    );
    
    return distance <= radiusMeters;
  });
}
```

### Supabase Client Configuration

#### Browser Client

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### Server Client

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/lib/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

## Data Models

### Database Schema

#### 1. profiles

Extends Supabase auth.users with application-specific data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
```

#### 2. wisata

Tourism destinations (Umbul Sidomukti, Sam Poo Kong).

```sql
CREATE TABLE wisata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  alamat TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wisata_coordinates ON wisata(latitude, longitude);
```

#### 3. wisata_galeri

Photo gallery for destinations.

```sql
CREATE TABLE wisata_galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wisata_id UUID NOT NULL REFERENCES wisata(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wisata_galeri_wisata_id ON wisata_galeri(wisata_id);
```

#### 4. wisata_penelitian

Research content (TCM, CVM, HPM) for destinations.

```sql
CREATE TABLE wisata_penelitian (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wisata_id UUID NOT NULL REFERENCES wisata(id) ON DELETE CASCADE,
  jenis_penelitian TEXT NOT NULL CHECK (jenis_penelitian IN ('TCM', 'CVM', 'HPM')),
  konten TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wisata_penelitian_wisata_id ON wisata_penelitian(wisata_id);
CREATE INDEX idx_wisata_penelitian_jenis ON wisata_penelitian(jenis_penelitian);
```

#### 5. ulasan

User reviews and ratings for destinations.

```sql
CREATE TABLE ulasan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wisata_id UUID NOT NULL REFERENCES wisata(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  komentar TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ulasan_wisata_id ON ulasan(wisata_id);
CREATE INDEX idx_ulasan_user_id ON ulasan(user_id);
CREATE INDEX idx_ulasan_created_at ON ulasan(created_at DESC);
```

#### 6. fasilitas

Facilities around destinations (hotels, ATMs, gas stations, etc.).

```sql
CREATE TABLE fasilitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN (
    'Hotel', 'Niaga', 'Kesehatan', 'Pendidikan', 'Peribadatan',
    'Pemerintah', 'ATM', 'SPBU', 'Bengkel', 'Lapangan', 'Hiburan'
  )),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fasilitas_kategori ON fasilitas(kategori);
CREATE INDEX idx_fasilitas_coordinates ON fasilitas(latitude, longitude);
```

#### 7. konten_znek

ZNEK (Economic Zone Value) content.

```sql
CREATE TABLE konten_znek (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  konten TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Row Level Security Policies

#### profiles

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### wisata, wisata_galeri, wisata_penelitian, fasilitas, konten_znek

```sql
-- Public read access
ALTER TABLE wisata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON wisata FOR SELECT USING (true);

ALTER TABLE wisata_galeri ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON wisata_galeri FOR SELECT USING (true);

ALTER TABLE wisata_penelitian ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON wisata_penelitian FOR SELECT USING (true);

ALTER TABLE fasilitas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON fasilitas FOR SELECT USING (true);

ALTER TABLE konten_znek ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON konten_znek FOR SELECT USING (true);

-- Admin full access (applies to all tables)
CREATE POLICY "Admins have full access" ON wisata FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Repeat for other tables...
```

#### ulasan

```sql
ALTER TABLE ulasan ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON ulasan FOR SELECT USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON ulasan FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON ulasan FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON ulasan FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can delete any review
CREATE POLICY "Admins can delete any review"
  ON ulasan FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### TypeScript Types

```typescript
// lib/types/database.ts
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      wisata: {
        Row: {
          id: string;
          nama: string;
          deskripsi: string;
          alamat: string;
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          deskripsi: string;
          alamat: string;
          latitude: number;
          longitude: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          deskripsi?: string;
          alamat?: string;
          latitude?: number;
          longitude?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... other tables
    };
  };
}

export type Wisata = Database['public']['Tables']['wisata']['Row'];
export type Fasilitas = Database['public']['Tables']['fasilitas']['Row'];
export type Ulasan = Database['public']['Tables']['ulasan']['Row'];
// ... other types
```

### Category Color Mapping

```typescript
// lib/utils/colors.ts
export const KATEGORI_COLORS: Record<string, string> = {
  Hotel: '#EF4444',        // Red
  Niaga: '#F59E0B',        // Amber
  Kesehatan: '#10B981',    // Green
  Pendidikan: '#3B82F6',   // Blue
  Peribadatan: '#8B5CF6',  // Purple
  Pemerintah: '#6366F1',   // Indigo
  ATM: '#EC4899',          // Pink
  SPBU: '#F97316',         // Orange
  Bengkel: '#84CC16',      // Lime
  Lapangan: '#06B6D4',     // Cyan
  Hiburan: '#A855F7',      // Violet
};
```


## Error Handling

### Error Handling Strategy

#### 1. Server-Side Errors

**Database Query Errors**:
```typescript
// Server Component
async function getWisataData(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('wisata')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error('Gagal memuat data wisata');
  }

  if (!data) {
    notFound(); // Triggers 404 page
  }

  return data;
}
```

**Authentication Errors**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = await updateSession(request);
    const { data: { user } } = await supabase.auth.getUser();

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

#### 2. Client-Side Errors

**Form Submission Errors**:
```typescript
// Client Component
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('ulasan')
      .insert({
        wisata_id: wisataId,
        user_id: userId,
        rating,
        komentar,
      });

    if (error) throw error;

    toast.success('Ulasan berhasil dikirim');
    onSuccess();
  } catch (error) {
    console.error('Submit error:', error);
    setError('Gagal mengirim ulasan. Silakan coba lagi.');
  } finally {
    setIsSubmitting(false);
  }
}
```

**Map Loading Errors**:
```typescript
// FasilitasMap.tsx
const [mapError, setMapError] = useState<string | null>(null);

useEffect(() => {
  try {
    // Initialize map
    const map = L.map('map').setView([lat, lng], 13);
    // ... map setup
  } catch (error) {
    console.error('Map initialization error:', error);
    setMapError('Gagal memuat peta. Silakan refresh halaman.');
  }
}, []);

if (mapError) {
  return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
      {mapError}
    </div>
  );
}
```

#### 3. Error Pages

**404 Not Found**:
```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
```

**Error Boundary**:
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-4">
          Maaf, terjadi kesalahan saat memuat halaman.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
```

#### 4. Validation Errors

**Form Validation**:
```typescript
// lib/utils/validators.ts
export function validateUlasan(data: {
  rating: number;
  komentar: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating harus antara 1-5';
  }

  if (!data.komentar.trim()) {
    errors.komentar = 'Komentar tidak boleh kosong';
  }

  if (data.komentar.length > 1000) {
    errors.komentar = 'Komentar maksimal 1000 karakter';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateWisata(data: {
  nama: string;
  deskripsi: string;
  alamat: string;
  latitude: number;
  longitude: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.nama.trim()) {
    errors.nama = 'Nama wisata tidak boleh kosong';
  }

  if (!data.deskripsi.trim()) {
    errors.deskripsi = 'Deskripsi tidak boleh kosong';
  }

  if (!data.alamat.trim()) {
    errors.alamat = 'Alamat tidak boleh kosong';
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }

  if (data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFasilitas(data: {
  nama: string;
  kategori: string;
  latitude: number;
  longitude: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const validKategori = [
    'Hotel', 'Niaga', 'Kesehatan', 'Pendidikan', 'Peribadatan',
    'Pemerintah', 'ATM', 'SPBU', 'Bengkel', 'Lapangan', 'Hiburan'
  ];

  if (!data.nama.trim()) {
    errors.nama = 'Nama fasilitas tidak boleh kosong';
  }

  if (!validKategori.includes(data.kategori)) {
    errors.kategori = 'Kategori tidak valid';
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }

  if (data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
```

#### 5. Image Upload Errors

```typescript
// components/admin/GaleriUpload.tsx
async function handleImageUpload(file: File) {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    setError('Format file harus JPEG, PNG, atau WebP');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('Ukuran file maksimal 5MB');
    return;
  }

  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${wisataId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('wisata-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('wisata-images')
      .getPublicUrl(fileName);

    // Save to database
    const { error: dbError } = await supabase
      .from('wisata_galeri')
      .insert({
        wisata_id: wisataId,
        image_url: publicUrl,
      });

    if (dbError) throw dbError;

    toast.success('Gambar berhasil diunggah');
    onSuccess();
  } catch (error) {
    console.error('Upload error:', error);
    setError('Gagal mengunggah gambar. Silakan coba lagi.');
  }
}
```

### Error Messages (Bahasa Indonesia)

```typescript
// lib/utils/errorMessages.ts
export const ERROR_MESSAGES = {
  // Authentication
  AUTH_REQUIRED: 'Anda harus login terlebih dahulu',
  AUTH_FAILED: 'Autentikasi gagal. Silakan coba lagi',
  UNAUTHORIZED: 'Anda tidak memiliki akses ke halaman ini',
  
  // Database
  DB_FETCH_FAILED: 'Gagal memuat data',
  DB_INSERT_FAILED: 'Gagal menyimpan data',
  DB_UPDATE_FAILED: 'Gagal memperbarui data',
  DB_DELETE_FAILED: 'Gagal menghapus data',
  
  // Validation
  REQUIRED_FIELD: 'Field ini wajib diisi',
  INVALID_EMAIL: 'Format email tidak valid',
  INVALID_COORDINATES: 'Koordinat tidak valid',
  INVALID_RATING: 'Rating harus antara 1-5',
  
  // Upload
  UPLOAD_FAILED: 'Gagal mengunggah file',
  INVALID_FILE_TYPE: 'Tipe file tidak didukung',
  FILE_TOO_LARGE: 'Ukuran file terlalu besar',
  
  // Map
  MAP_LOAD_FAILED: 'Gagal memuat peta',
  LOCATION_NOT_FOUND: 'Lokasi tidak ditemukan',
  
  // General
  NETWORK_ERROR: 'Terjadi kesalahan jaringan',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui',
};
```

## Testing Strategy

### Testing Approach

This application is **NOT suitable for property-based testing** because:

1. **Infrastructure Integration**: Heavy reliance on Supabase (database, auth, storage) - external services
2. **UI-Heavy Features**: Map rendering, form interactions, image galleries - visual components
3. **Configuration and Setup**: OAuth flow, RLS policies, middleware - one-time setup checks
4. **CRUD Operations**: Simple database reads/writes with no complex transformation logic

Instead, we will use:
- **Unit tests** for pure utility functions (Haversine, validators, formatters)
- **Integration tests** for database operations and API routes
- **Component tests** for React components with user interactions
- **E2E tests** for critical user flows (authentication, review submission, admin operations)

### Unit Testing

**Test Framework**: Jest with React Testing Library

**Coverage Areas**:

1. **Haversine Distance Calculation** (`lib/utils/haversine.ts`):
   - Test with known coordinate pairs and expected distances
   - Test edge cases: same coordinates (distance = 0), antipodal points
   - Test accuracy within 0.5% tolerance

2. **Validation Functions** (`lib/utils/validators.ts`):
   - Test valid inputs return `{ valid: true, errors: {} }`
   - Test invalid inputs return appropriate error messages
   - Test boundary conditions (rating 0, 6; coordinates -91, 91, etc.)

3. **Filtering Logic** (`lib/utils/filters.ts`):
   - Test radius filtering with various distances
   - Test category filtering with single and multiple selections
   - Test combined radius + category filtering
   - Test empty results

4. **Formatters** (`lib/utils/formatters.ts`):
   - Test date formatting (Indonesian locale)
   - Test distance formatting (meters to km conversion)
   - Test rating display (stars, decimal)

**Example Unit Test**:
```typescript
// __tests__/utils/haversine.test.ts
import { calculateDistance } from '@/lib/utils/haversine';

describe('calculateDistance', () => {
  it('should return 0 for same coordinates', () => {
    const distance = calculateDistance(0, 0, 0, 0);
    expect(distance).toBe(0);
  });

  it('should calculate distance between Semarang and Jakarta', () => {
    // Semarang: -6.9667, 110.4167
    // Jakarta: -6.2088, 106.8456
    const distance = calculateDistance(-6.9667, 110.4167, -6.2088, 106.8456);
    const expectedDistance = 443000; // ~443 km
    const tolerance = expectedDistance * 0.005; // 0.5%
    expect(distance).toBeGreaterThan(expectedDistance - tolerance);
    expect(distance).toBeLessThan(expectedDistance + tolerance);
  });

  it('should handle negative coordinates', () => {
    const distance = calculateDistance(-10, -20, -11, -21);
    expect(distance).toBeGreaterThan(0);
  });
});
```

### Integration Testing

**Test Framework**: Jest with Supabase test client

**Coverage Areas**:

1. **Database Queries**:
   - Test fetching wisata data
   - Test fetching fasilitas with filters
   - Test fetching ulasan with user joins
   - Test average rating calculation

2. **RLS Policies**:
   - Test public read access to wisata, fasilitas
   - Test authenticated user can insert own ulasan
   - Test user cannot modify other users' ulasan
   - Test admin can access all data

3. **Authentication Flow**:
   - Test OAuth callback handler
   - Test session creation and storage
   - Test profile creation on first login
   - Test role assignment

4. **Image Upload**:
   - Test file upload to Supabase Storage
   - Test public URL generation
   - Test database entry creation
   - Test file deletion

**Example Integration Test**:
```typescript
// __tests__/integration/ulasan.test.ts
import { createClient } from '@/lib/supabase/server';

describe('Ulasan Integration', () => {
  let supabase: any;
  let testUserId: string;
  let testWisataId: string;

  beforeAll(async () => {
    supabase = await createClient();
    // Setup test data
  });

  it('should allow authenticated user to insert review', async () => {
    const { data, error } = await supabase
      .from('ulasan')
      .insert({
        wisata_id: testWisataId,
        user_id: testUserId,
        rating: 5,
        komentar: 'Test review',
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.rating).toBe(5);
  });

  it('should calculate average rating correctly', async () => {
    const { data } = await supabase
      .from('ulasan')
      .select('rating')
      .eq('wisata_id', testWisataId);

    const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
    expect(avgRating).toBeGreaterThan(0);
    expect(avgRating).toBeLessThanOrEqual(5);
  });
});
```

### Component Testing

**Test Framework**: React Testing Library

**Coverage Areas**:

1. **FilterRadius Component**:
   - Test all radius options render
   - Test clicking option calls onRadiusChange
   - Test facility count displays correctly

2. **FilterKategori Component**:
   - Test all categories render
   - Test checkbox selection/deselection
   - Test multiple selections

3. **UlasanForm Component**:
   - Test form renders for authenticated users
   - Test login prompt for unauthenticated users
   - Test validation errors display
   - Test successful submission

4. **WisataCard Component**:
   - Test destination data renders
   - Test rating display
   - Test link navigation

**Example Component Test**:
```typescript
// __tests__/components/FilterRadius.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FilterRadius from '@/components/map/FilterRadius';

describe('FilterRadius', () => {
  const mockOnRadiusChange = jest.fn();

  it('should render all radius options', () => {
    render(
      <FilterRadius
        selectedRadius={null}
        onRadiusChange={mockOnRadiusChange}
        facilityCount={10}
      />
    );

    expect(screen.getByText('250m')).toBeInTheDocument();
    expect(screen.getByText('500m')).toBeInTheDocument();
    expect(screen.getByText('Semua')).toBeInTheDocument();
  });

  it('should call onRadiusChange when option clicked', () => {
    render(
      <FilterRadius
        selectedRadius={null}
        onRadiusChange={mockOnRadiusChange}
        facilityCount={10}
      />
    );

    fireEvent.click(screen.getByText('500m'));
    expect(mockOnRadiusChange).toHaveBeenCalledWith(500);
  });

  it('should display facility count', () => {
    render(
      <FilterRadius
        selectedRadius={500}
        onRadiusChange={mockOnRadiusChange}
        facilityCount={15}
      />
    );

    expect(screen.getByText(/15 fasilitas/i)).toBeInTheDocument();
  });
});
```

### End-to-End Testing

**Test Framework**: Playwright

**Coverage Areas**:

1. **Authentication Flow**:
   - User clicks login button
   - Redirects to Google OAuth
   - Returns to app with session
   - Profile displays in navbar

2. **Review Submission**:
   - Navigate to destination detail
   - Fill review form
   - Submit review
   - Review appears in list

3. **Map Interaction**:
   - Map loads on destination page
   - Markers display
   - Click marker shows popup
   - Filter by radius updates markers
   - Filter by category updates markers

4. **Admin Operations**:
   - Admin logs in
   - Accesses admin dashboard
   - Creates new facility
   - Edits facility
   - Deletes facility

**Example E2E Test**:
```typescript
// e2e/review-submission.spec.ts
import { test, expect } from '@playwright/test';

test('authenticated user can submit review', async ({ page }) => {
  // Login (assuming test user exists)
  await page.goto('/');
  await page.click('text=Login');
  // ... OAuth flow simulation

  // Navigate to destination
  await page.goto('/wisata/umbul-sidomukti');

  // Fill review form
  await page.click('[data-testid="rating-5"]');
  await page.fill('[data-testid="review-text"]', 'Tempat yang sangat indah!');
  await page.click('text=Kirim Ulasan');

  // Verify success
  await expect(page.locator('text=Ulasan berhasil dikirim')).toBeVisible();
  await expect(page.locator('text=Tempat yang sangat indah!')).toBeVisible();
});
```

### Performance Testing

**Coverage Areas**:

1. **Client-Side Filtering Performance**:
   - Measure filter update time with 1000 facilities
   - Target: < 100ms for filter changes

2. **Map Rendering**:
   - Measure initial map load time
   - Measure marker rendering with 500+ markers

3. **Image Loading**:
   - Test gallery with 20+ images
   - Verify lazy loading works
   - Check next/image optimization

**Example Performance Test**:
```typescript
// __tests__/performance/filtering.test.ts
import { filterFasilitas } from '@/lib/utils/filters';
import { generateMockFasilitas } from '@/lib/test-utils';

describe('Filtering Performance', () => {
  it('should filter 1000 facilities in under 100ms', () => {
    const facilities = generateMockFasilitas(1000);
    const wisataLat = -7.2575;
    const wisataLng = 110.4083;

    const startTime = performance.now();
    const filtered = filterFasilitas(
      facilities,
      wisataLat,
      wisataLng,
      1000, // 1km radius
      ['Hotel', 'ATM']
    );
    const endTime = performance.now();

    const duration = endTime - startTime;
    expect(duration).toBeLessThan(100);
    expect(filtered.length).toBeGreaterThan(0);
  });
});
```

### Test Data Management

**Seed Data for Testing**:
```typescript
// lib/test-utils/seed.ts
export const TEST_WISATA = {
  id: 'test-wisata-1',
  nama: 'Test Destination',
  deskripsi: 'Test description',
  alamat: 'Test address',
  latitude: -7.2575,
  longitude: 110.4083,
};

export const TEST_FASILITAS = [
  {
    id: 'test-fasilitas-1',
    nama: 'Test Hotel',
    kategori: 'Hotel',
    latitude: -7.2580,
    longitude: 110.4090,
  },
  // ... more test facilities
];

export function generateMockFasilitas(count: number): Fasilitas[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    nama: `Facility ${i}`,
    kategori: ['Hotel', 'ATM', 'SPBU'][i % 3],
    latitude: -7.2575 + (Math.random() - 0.5) * 0.1,
    longitude: 110.4083 + (Math.random() - 0.5) * 0.1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}
```

### Continuous Integration

**GitHub Actions Workflow**:
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utility functions
- **Integration Tests**: All database operations and RLS policies
- **Component Tests**: All interactive components
- **E2E Tests**: Critical user flows (auth, review, admin CRUD)


## Design System Implementation

### Color Palette

```typescript
// app/globals.css
:root {
  /* Primary Colors */
  --color-primary: #1D4ED8;        /* Blue 700 */
  --color-primary-hover: #1E40AF;  /* Blue 800 */
  --color-primary-light: #3B82F6;  /* Blue 600 */
  
  /* Neutral Colors */
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;        /* Gray 50 */
  --color-border: #E5E7EB;         /* Gray 200 */
  
  /* Text Colors */
  --color-text-primary: #111827;   /* Gray 900 */
  --color-text-secondary: #6B7280; /* Gray 500 */
  --color-text-tertiary: #9CA3AF;  /* Gray 400 */
  
  /* Semantic Colors */
  --color-success: #10B981;        /* Green 500 */
  --color-error: #EF4444;          /* Red 500 */
  --color-warning: #F59E0B;        /* Amber 500 */
  --color-info: #3B82F6;           /* Blue 500 */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;  /* Maximum allowed */
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;  /* Maximum allowed */
}
```

### Typography

```typescript
// app/layout.tsx
import { Geist, Plus_Jakarta_Sans } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${plusJakartaSans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

```css
/* app/globals.css */
.font-heading {
  font-family: var(--font-geist), sans-serif;
}

.font-sans {
  font-family: var(--font-plus-jakarta), sans-serif;
}

/* Typography Scale */
.text-display {
  font-size: 3rem;      /* 48px */
  line-height: 1.2;
  font-weight: 700;
}

.text-h1 {
  font-size: 2.25rem;   /* 36px */
  line-height: 1.25;
  font-weight: 700;
}

.text-h2 {
  font-size: 1.875rem;  /* 30px */
  line-height: 1.3;
  font-weight: 600;
}

.text-h3 {
  font-size: 1.5rem;    /* 24px */
  line-height: 1.35;
  font-weight: 600;
}

.text-body-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.6;
}

.text-body {
  font-size: 1rem;      /* 16px */
  line-height: 1.5;
}

.text-body-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.5;
}

.text-caption {
  font-size: 0.75rem;   /* 12px */
  line-height: 1.4;
}
```

### Component Styling Rules

**Buttons**:
```typescript
// components/ui/Button.tsx
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-lg';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Spinner size="sm" /> : children}
      </motion.button>
    );
  }
);
```

**Cards**:
```typescript
// components/ui/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6
        ${hover ? 'transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
```

**Inputs**:
```typescript
// components/ui/Input.tsx
'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
```

### Animation Guidelines

**Framer Motion Configuration**:
```typescript
// lib/utils/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

**Usage Example**:
```typescript
// components/wisata/WisataGallery.tsx
'use client';

import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/utils/animations';

export function WisataGallery({ images }: { images: string[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      {images.map((url, index) => (
        <motion.div key={index} variants={fadeIn}>
          <Image
            src={url}
            alt={`Gallery ${index + 1}`}
            width={400}
            height={300}
            className="rounded-lg object-cover"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Responsive Design Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
  },
};
```

**Responsive Patterns**:
```typescript
// Example: Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Example: Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  GeoTrip
</h1>

// Example: Responsive padding
<div className="px-4 md:px-6 lg:px-8">
  {/* Content */}
</div>

// Example: Hide on mobile
<div className="hidden md:block">
  {/* Desktop only */}
</div>

// Example: Show on mobile only
<div className="block md:hidden">
  {/* Mobile only */}
</div>
```

## Performance Optimization

### Image Optimization

**Next.js Image Component**:
```typescript
// components/wisata/WisataCard.tsx
import Image from 'next/image';

export function WisataCard({ wisata, thumbnailUrl }: WisataCardProps) {
  return (
    <Card hover>
      <div className="relative h-48 w-full mb-4">
        <Image
          src={thumbnailUrl}
          alt={wisata.nama}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover rounded-lg"
          priority={false}
        />
      </div>
      {/* ... rest of card */}
    </Card>
  );
}
```

**Supabase Storage Configuration**:
```typescript
// lib/supabase/storage.ts
export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const supabase = createClient();
  
  // Upload original
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}
```

### Dynamic Imports

**Leaflet Map Loading**:
```typescript
// app/wisata/[id]/page.tsx
import dynamic from 'next/dynamic';

const FasilitasMap = dynamic(
  () => import('@/components/map/FasilitasMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <Spinner />
      </div>
    ),
  }
);

export default async function WisataDetailPage({ params }: { params: { id: string } }) {
  const wisata = await getWisataData(params.id);
  const fasilitas = await getFasilitasData();

  return (
    <div>
      {/* ... other content */}
      <FasilitasMap
        wisataLat={wisata.latitude}
        wisataLng={wisata.longitude}
        wisataNama={wisata.nama}
        fasilitasData={fasilitas}
      />
    </div>
  );
}
```

### Data Fetching Optimization

**Server Component Caching**:
```typescript
// app/wisata/[id]/page.tsx
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

// Cache for the duration of the request
const getWisataData = cache(async (id: string) => {
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

  if (error) throw error;
  return data;
});

// Revalidate every hour
export const revalidate = 3600;
```

**Client-Side Caching**:
```typescript
// components/map/FasilitasMap.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';

export function FasilitasMap({ fasilitasData, ...props }: FasilitasMapProps) {
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);

  // Memoize filtered results
  const filteredFasilitas = useMemo(() => {
    return filterFasilitas(
      fasilitasData,
      props.wisataLat,
      props.wisataLng,
      selectedRadius,
      selectedKategori
    );
  }, [fasilitasData, selectedRadius, selectedKategori, props.wisataLat, props.wisataLng]);

  // ... rest of component
}
```

### Bundle Size Optimization

**Tree Shaking**:
```typescript
// Import only what you need
import { motion } from 'framer-motion';  // ✓ Good
// import * as Framer from 'framer-motion';  // ✗ Bad

// Use named imports
import { calculateDistance } from '@/lib/utils/haversine';  // ✓ Good
// import * as Utils from '@/lib/utils';  // ✗ Bad
```

**Code Splitting**:
```typescript
// Split admin components into separate chunks
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'));
const WisataForm = dynamic(() => import('@/components/admin/WisataForm'));
const FasilitasForm = dynamic(() => import('@/components/admin/FasilitasForm'));
```

## Security Considerations

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
```

**Security Rules**:
- Never expose service role key to client
- Use `NEXT_PUBLIC_` prefix only for client-safe variables
- Store sensitive keys in environment variables, not in code
- Use different keys for development and production

### Content Security Policy

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

### Input Sanitization

```typescript
// lib/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000); // Limit length
}
```

### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new Response('Too Many Requests', { status: 429 });
    }
  }

  // ... rest of middleware
}
```

## Deployment Configuration

### Vercel Deployment

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### Supabase Configuration

**Database Migrations**:
```sql
-- supabase/migrations/001_initial_schema.sql
-- Create tables in order (profiles, wisata, wisata_galeri, etc.)
-- Apply RLS policies
-- Create indexes
-- Seed initial data
```

**Storage Buckets**:
```sql
-- Create storage bucket for wisata images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wisata-images', 'wisata-images', true);

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wisata-images');

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wisata-images' AND
  auth.role() = 'authenticated'
);

-- Allow admins to delete
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wisata-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Build Optimization

**next.config.ts**:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'leaflet', 'react-leaflet'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- Set up Next.js project structure
- Configure Supabase connection
- Implement database schema and RLS policies
- Set up authentication flow
- Create basic layout components (Navbar, Footer)

### Phase 2: Core Features (Week 2-3)
- Implement home page with destination cards
- Create destination detail pages
- Integrate Leaflet map with facility markers
- Implement client-side filtering (radius, category)
- Add review submission functionality

### Phase 3: Admin Panel (Week 4)
- Create admin dashboard
- Implement CRUD for destinations
- Implement CRUD for facilities
- Add review moderation
- Implement gallery management

### Phase 4: Polish & Testing (Week 5)
- Add loading states and error handling
- Implement responsive design refinements
- Write unit and integration tests
- Performance optimization
- Accessibility improvements

### Phase 5: Deployment (Week 6)
- Set up Vercel deployment
- Configure production Supabase instance
- Seed production data
- Final testing and bug fixes
- Launch

