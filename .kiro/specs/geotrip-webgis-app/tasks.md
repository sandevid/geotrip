# Implementation Plan: GeoTrip WebGIS Application

## Overview

Implementasi aplikasi WebGIS pariwisata Semarang menggunakan Next.js 16+ dengan App Router, Supabase backend, dan Leaflet untuk peta interaktif. Pendekatan modular memastikan setiap modul dapat divalidasi secara independen dengan `npm run build`.

## Tasks

- [x] 0. MODULE 0 — PROJECT SETUP
  - [x] 0.1 Inisialisasi project Next.js 16+ dengan TypeScript
    - Pastikan Next.js versi 16.2.4 atau lebih tinggi
    - Konfigurasi TypeScript dengan strict mode
    - _Requirements: 21.1, 21.2, 21.3_
  
  - [x] 0.2 Install dependencies utama
    - Install: @supabase/ssr, @supabase/supabase-js
    - Install: react-leaflet, leaflet, @types/leaflet
    - Install: framer-motion, lucide-react
    - Install: recharts (untuk dashboard admin)
    - Install: @tailwindcss/typography
    - _Requirements: 21.3_
  
  - [x] 0.3 Setup Tailwind CSS v4
    - Konfigurasi tailwind.config.ts dengan custom breakpoints
    - Setup postcss.config.mjs
    - Konfigurasi CSS variables di globals.css
    - _Requirements: 19.1, 19.2, 19.3, 20.5_
  
  - [x] 0.4 Setup design system (colors, fonts, animations)
    - Implementasi CSS variables untuk color palette (primary: #1D4ED8)
    - Setup Geist font untuk headings
    - Setup Plus Jakarta Sans untuk body text
    - Konfigurasi Framer Motion dengan max duration 300ms
    - Maksimal border-radius 8px
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8_
  
  - [x] 0.5 Setup Supabase clients (browser + server)
    - Buat lib/supabase/client.ts untuk browser client
    - Buat lib/supabase/server.ts untuk server client
    - Konfigurasi environment variables (.env.local)
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 0.6 Setup middleware untuk authentication
    - Buat middleware.ts untuk session refresh
    - Implementasi route protection untuk /admin
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 0.7 Konfigurasi next.config.ts
    - Setup untuk Leaflet (ssr: false untuk dynamic import)
    - Konfigurasi image domains untuk Supabase Storage
    - Setup optimizePackageImports
    - _Requirements: 5.2, 24.1, 24.2_
  
  - [ ]* 0.8 Validasi MODULE 0
    - Run `npm run build` dan pastikan tidak ada error
    - Verifikasi semua dependencies terinstall
    - _Requirements: 21.1, 21.2_

- [-] 1. MODULE 1 — DATABASE & SEED GUNAKAN MCP Supabase
  - [x] 1.1 Buat dan jalankan SQL schema di Supabase
    - Buat tabel: profiles, wisata, wisata_galeri, wisata_penelitian
    - Buat tabel: ulasan, fasilitas, konten_znek
    - Setup foreign keys dan indexes
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9_
  
  - [x] 1.2 Implementasi Row Level Security (RLS) policies
    - Enable RLS pada semua tabel
    - Public read access untuk wisata, fasilitas, konten_znek
    - User ownership policies untuk ulasan
    - Admin full access policies
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7_
  
  - [x] 1.3 Jalankan seed data untuk wisata
    - Insert data Umbul Sidomukti (koordinat, deskripsi)
    - Insert data Sam Poo Kong (koordinat, deskripsi)
    - Data dalam Bahasa Indonesia
    - _Requirements: 30.1, 30.2, 30.3_
  
  - [x] 1.4 Jalankan seed data untuk fasilitas
    - Insert sample fasilitas di sekitar Umbul Sidomukti
    - Insert sample fasilitas di sekitar Sam Poo Kong
    - Kategori: Hotel, Niaga, Kesehatan, Pendidikan, Peribadatan, Pemerintah, ATM, SPBU, Bengkel, Lapangan, Hiburan
    - _Requirements: 30.4_
  
  - [x] 1.5 Jalankan seed data untuk ZNEK dan admin user
    - Insert sample konten ZNEK
    - Buat minimal 1 admin user account
    - _Requirements: 30.5, 30.6_
  
  - [x] 1.6 Generate TypeScript types dari database schema
    - Buat lib/types/database.ts dengan Supabase CLI atau manual
    - Export types: Wisata, Fasilitas, Ulasan, Profile, dll
    - _Requirements: 21.4_
  
  - [x] 1.7 Setup Supabase Storage bucket untuk wisata images
    - Buat bucket 'wisata-images' dengan public access
    - Setup storage policies (public read, authenticated upload, admin delete)
    - _Requirements: 24.1, 24.2, 24.6_
  
  - [x] 1.8 Validasi MODULE 1
    - Verifikasi semua tabel dan policies di Supabase dashboard
    - Test query data wisata dan fasilitas
    - _Requirements: 17.1, 18.1_

- [x] 2. MODULE 2 — LAYOUT & NAVBAR
  - [x] 2.1 Buat root layout (app/layout.tsx)
    - Setup fonts (Geist + Plus Jakarta Sans)
    - Import globals.css
    - Setup HTML lang="id"
    - _Requirements: 19.4, 19.5, 19.9_
  
  - [x] 2.2 Buat Navbar component (Client Component)
    - Logo dan nama aplikasi "GeoTrip"
    - Navigation links: Home, ZNEK
    - Authentication state (Login button / User profile menu)
    - Admin Dashboard link (conditional untuk admin role)
    - _Requirements: 25.1, 25.2, 25.3, 25.4_
  
  - [x] 2.3 Implementasi mobile responsive navbar
    - Hamburger menu untuk mobile
    - Responsive breakpoints (sm, md, lg)
    - Touch-friendly interface elements
    - _Requirements: 20.1, 20.6_
  
  - [x] 2.4 Implementasi active state indicators
    - Highlight active page di navigation
    - _Requirements: 25.4_
  
  - [x] 2.5 Buat Footer component (Server Component)
    - Copyright information
    - Links ke social media (optional)
    - _Requirements: 19.9_
  
  - [x] 2.6 Validasi MODULE 2
    - Run `npm run build` dan pastikan tidak ada error
    - Test responsive design di berbagai viewport
    - _Requirements: 21.1, 20.1, 20.2, 20.3_

- [x] 3. MODULE 3 — HOME PAGE
  - [x] 3.1 Buat home page (app/page.tsx) sebagai Server Component
    - Fetch data wisata dari Supabase
    - Fetch average rating dan review count untuk setiap wisata
    - _Requirements: 3.1, 3.2_
  
  - [x] 3.2 Implementasi Hero section
    - Judul aplikasi dan deskripsi dalam Bahasa Indonesia
    - Background image atau solid color
    - Call-to-action button
    - _Requirements: 3.1, 19.1, 19.2_
  
  - [x] 3.3 Implementasi About section
    - Deskripsi singkat tentang GeoTrip
    - Informasi tentang destinasi wisata Semarang
    - _Requirements: 3.1_
  
  - [x] 3.4 Buat WisataCard component (Server Component)
    - Display thumbnail image dengan next/image
    - Nama wisata dan deskripsi singkat
    - Average rating display (stars)
    - Link ke detail page
    - _Requirements: 3.2, 3.3, 3.4, 27.2_
  
  - [x] 3.5 Implementasi destination cards section
    - Grid layout untuk cards (responsive)
    - Display cards untuk Umbul Sidomukti dan Sam Poo Kong
    - Hover effects dengan Framer Motion
    - _Requirements: 3.2, 3.3, 19.7_
  
  - [x] 3.6 Implementasi responsive design untuk home page
    - Mobile: single column
    - Tablet: 2 columns
    - Desktop: 2-3 columns
    - _Requirements: 3.5, 20.1, 20.2, 20.3_
  
  - [x] 3.7 Validasi MODULE 3
    - Run `npm run build` dan pastikan tidak ada error
    - Test responsive layout di berbagai device sizes
    - Verifikasi data wisata tampil dengan benar
    - _Requirements: 21.1, 20.1_

- [x] 4. MODULE 4 — HALAMAN ZNEK
  - [x] 4.1 Buat ZNEK page (app/znek/page.tsx) sebagai Server Component
    - Fetch konten_znek dari Supabase
    - Display dalam single column layout
    - _Requirements: 10.1, 10.2_
  
  - [x] 4.2 Implementasi content formatting
    - Proper headings dan structure
    - Typography dengan @tailwindcss/typography
    - Bahasa Indonesia
    - _Requirements: 10.3, 10.5_
  
  - [x] 4.3 Implementasi responsive design untuk ZNEK page
    - Padding dan margins yang sesuai
    - Readable line length
    - _Requirements: 10.4, 20.1, 20.2, 20.3_
  
  - [x] 4.4 Validasi MODULE 4
    - Run `npm run build` dan pastikan tidak ada error
    - Verifikasi konten ZNEK tampil dengan formatting yang benar
    - _Requirements: 21.1, 10.2_

- [x] 5. MODULE 5 — HALAMAN DETAIL WISATA
  - [x] 5.1 Buat dynamic route (app/wisata/[id]/page.tsx)
    - Setup dynamic params dengan TypeScript
    - Fetch wisata data dengan joins (galeri, penelitian, ulasan)
    - Implement 404 handling untuk wisata tidak ditemukan
    - _Requirements: 4.1, 4.6_
  
  - [x] 5.2 Implementasi info card dengan detail wisata
    - Display nama, deskripsi, alamat
    - Display koordinat
    - Average rating dan total review count
    - _Requirements: 4.2, 27.3_
  
  - [x] 5.3 Buat WisataGallery component (Client Component)
    - Photo carousel dengan multiple images
    - Framer Motion animations
    - next/image optimization
    - _Requirements: 4.3, 19.7, 20.7_
  
  - [x] 5.4 Buat WisataPenelitian component (Server Component)
    - Display penelitian content (TCM, CVM, HPM)
    - Collapsible sections untuk readability
    - Proper formatting
    - _Requirements: 4.4, 26.1, 26.2, 26.3, 26.4, 26.5_
  
  - [x] 5.5 Buat WisataUlasan component (Server Component)
    - Display all ulasan dengan ratings
    - User information (nama, avatar)
    - Sorted by created_at DESC
    - _Requirements: 4.5_
  
  - [x] 5.6 Implementasi responsive design untuk detail page
    - Mobile: stacked layout
    - Desktop: sidebar layout
    - _Requirements: 4.7, 20.1, 20.2, 20.3_
  
  - [x] 5.7 Validasi MODULE 5
    - Run `npm run build` dan pastikan tidak ada error
    - Test dynamic routing dengan berbagai wisata IDs
    - Verifikasi 404 page untuk invalid IDs
    - _Requirements: 21.1, 4.6_

- [x] 6. MODULE 6 — HALAMAN FASILITAS (MAP)
  - [x] 6.1 Buat utility function untuk Haversine distance calculation
    - Implementasi di lib/utils/haversine.ts
    - Input: lat1, lon1, lat2, lon2 (decimal degrees)
    - Output: distance in meters
    - Handle edge cases (same coordinates, antipodal points)
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_
  
  - [x] 6.2 Write unit tests untuk Haversine function
    - Test same coordinates (distance = 0)
    - Test known coordinate pairs dengan expected distances
    - Test accuracy within 0.5% tolerance
    - _Requirements: 22.5_
  
  - [x] 6.3 Buat filtering utility function
    - Implementasi di lib/utils/filters.ts
    - Filter by radius menggunakan Haversine
    - Filter by category (multiple selections)
    - Combined radius + category filtering
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 6.4 Buat FasilitasMap component (Client Component)
    - Dynamic import dengan ssr: false
    - Setup Leaflet map dengan react-leaflet
    - Center map pada wisata coordinates
    - Display wisata marker
    - _Requirements: 5.1, 5.2, 5.3, 5.8, 29.5_
  
  - [x] 6.5 Implementasi fasilitas markers dengan color-coding
    - Buat KATEGORI_COLORS mapping di lib/utils/colors.ts
    - Render markers dengan category colors
    - Popup dengan facility name, category, dan calculated distance
    - _Requirements: 5.5, 5.6, 8.1, 8.2, 8.4_
  
  - [x] 6.6 Buat LegendKategori component (Client Component)
    - Display category names dan colors
    - Consistent color mapping
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [x] 6.7 Implementasi client-side filtering state management
    - useState untuk selectedRadius dan selectedKategori
    - useMemo untuk filtered results
    - Update map markers immediately on filter change
    - _Requirements: 6.3, 6.4, 7.4, 7.6, 23.1, 23.2, 23.3, 23.4_
  
  - [x] 6.8 Buat FilterRadius component (Client Component)
    - Radio buttons untuk radius options: 250m, 500m, 750m, 1km, 1.5km, 2km, 2.5km, 3km, Semua
    - Display facility count untuk selected radius
    - onRadiusChange callback
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [x] 6.9 Buat FilterKategori component (Client Component)
    - Checkboxes untuk semua kategori
    - Multiple selections allowed
    - onKategoriChange callback
    - _Requirements: 7.1, 7.2, 7.3, 7.7_
  
  - [x] 6.10 Implementasi map interaction controls
    - Pan dengan dragging
    - Zoom dengan mouse wheel / touch gestures
    - Zoom control buttons
    - Map attribution untuk OpenStreetMap
    - Popup behavior (close previous on new marker click)
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.6, 29.7_
  
  - [x] 6.11 Implementasi responsive map design
    - Adjust map size untuk mobile, tablet, desktop
    - Touch-friendly controls
    - _Requirements: 5.9, 20.1, 20.2, 20.3, 20.4, 20.6_
  
  - [ ]* 6.12 Validasi MODULE 6
    - Run `npm run build` dan pastikan tidak ada error
    - Test filtering performance dengan large dataset
    - Verifikasi map rendering di berbagai devices
    - _Requirements: 21.1, 23.5_

- [x] 7. MODULE 7 — AUTENTIKASI GOOGLE
  - [x] 7.1 Konfigurasi Google OAuth di Supabase dashboard
    - Setup Google OAuth credentials
    - Configure redirect URLs
    - _Requirements: 1.1, 1.2_
  
  - [x] 7.2 Buat auth callback route (app/auth/callback/route.ts)
    - Exchange code for session
    - Store session in cookies
    - Redirect to original page
    - _Requirements: 1.2, 1.3_
  
  - [x] 7.3 Buat database trigger untuk new users
    - Auto-create profile entry on auth.users insert
    - Set default role to 'user'
    - _Requirements: 1.2, 1.4_
  
  - [x] 7.4 Implementasi login functionality di Navbar
    - Login button redirects to Google OAuth
    - Display user profile menu when authenticated
    - Show avatar dan full_name
    - _Requirements: 1.1, 1.7_
  
  - [x] 7.5 Implementasi logout functionality
    - Logout button clears session
    - Redirect to home page
    - _Requirements: 1.5_
  
  - [x] 7.6 Implementasi session persistence
    - Session persists across page refreshes
    - Middleware refreshes session if needed
    - _Requirements: 1.6_
  
  - [ ]* 7.7 Validasi MODULE 7
    - Test login flow end-to-end
    - Verifikasi profile creation di database
    - Test logout functionality
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 8. MODULE 8 — ADMIN PANEL
  - [x] 8.1 Buat admin layout (app/admin/layout.tsx)
    - Sidebar dengan navigation links
    - Protected route (check admin role)
    - Responsive sidebar (collapsible on mobile)
    - _Requirements: 2.1, 2.2, 11.1, 11.4_
  
  - [x] 8.2 Buat admin dashboard page (app/admin/page.tsx)
    - Display stats: total wisata, fasilitas, ulasan
    - Display recent ulasan
    - Links ke management sections
    - _Requirements: 11.2, 11.3_
  
  - [x] 8.3 Buat reusable UI components
    - Button component dengan variants
    - Input component dengan validation display
    - Select component untuk dropdowns
    - Modal component untuk confirmations
    - Toast component untuk notifications
    - Spinner component untuk loading states
    - _Requirements: 28.1, 28.2, 28.3, 28.4_
  
  - [x] 8.4 Buat wisata management page (app/admin/wisata/page.tsx)
    - List all wisata entries
    - Add, Edit, Delete buttons
    - _Requirements: 12.1_
  
  - [x] 8.5 Buat WisataForm component (Client Component)
    - Form fields: nama, deskripsi, alamat, latitude, longitude
    - Validation dengan lib/utils/validators.ts
    - Create dan Update modes
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [x] 8.6 Implementasi wisata CRUD operations
    - Create: insert new wisata
    - Update: save changes to existing wisata
    - Delete: prompt confirmation, cascade delete related data
    - Success/error toast notifications
    - _Requirements: 12.4, 12.6, 12.7, 12.8, 28.3, 28.4_
  
  - [x] 8.7 Buat fasilitas management page (app/admin/fasilitas/page.tsx)
    - List all fasilitas entries
    - Add, Edit, Delete buttons
    - _Requirements: 13.1_
  
  - [x] 8.8 Buat FasilitasForm component (Client Component)
    - Form fields: nama, kategori, latitude, longitude
    - Dropdown dengan valid categories
    - Validation dengan lib/utils/validators.ts
    - Create dan Update modes
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 8.9 Implementasi fasilitas CRUD operations
    - Create: insert new fasilitas
    - Update: save changes to existing fasilitas
    - Delete: prompt confirmation, remove from database
    - Success/error toast notifications
    - _Requirements: 13.5, 13.7, 13.8, 13.9, 28.3, 28.4_
  
  - [x] 8.10 Buat ulasan moderation page (app/admin/ulasan/page.tsx)
    - List all ulasan entries
    - Display: review text, rating, user info, destination
    - Sorted by created_at DESC
    - Delete button untuk each ulasan
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [x] 8.11 Implementasi ulasan delete operation
    - Prompt confirmation before deletion
    - Remove from database
    - Success/error toast notifications
    - _Requirements: 14.3, 14.4, 28.3, 28.4_
  
  - [x] 8.12 Buat galeri management page (app/admin/galeri/page.tsx)
    - Display all galeri entries grouped by wisata
    - Thumbnail previews
    - Add Photo button
    - Delete button untuk each image
    - _Requirements: 15.1, 15.5_
  
  - [x] 8.13 Buat GaleriUpload component (Client Component)
    - File upload input
    - Image preview before upload
    - Validation: file type (JPEG, PNG, WebP), size (max 5MB)
    - Upload to Supabase Storage
    - Create galeri entry dengan storage URL
    - _Requirements: 15.2, 15.3, 15.4, 24.3, 24.4_
  
  - [x] 8.14 Implementasi galeri delete operation
    - Prompt confirmation before deletion
    - Remove image from Supabase Storage
    - Delete galeri entry from database
    - Success/error toast notifications
    - _Requirements: 15.6, 15.7, 24.5, 28.3, 28.4_
  
  - [x] 8.15 Buat ZNEK content management page (app/admin/znek/page.tsx)
    - Display all konten_znek entries
    - Edit button untuk each entry
    - _Requirements: 16.1_
  
  - [x] 8.16 Buat ZnekEditor component (Client Component)
    - Rich text editor untuk ZNEK content
    - Form fields: judul, konten
    - Update operation
    - _Requirements: 16.2, 16.3, 16.4_
  
  - [x] 8.17 Implementasi ZNEK update operation
    - Save changes to konten_znek table
    - Success/error toast notifications
    - _Requirements: 16.4, 28.3, 28.4_
  
  - [x] 8.18 Implementasi responsive design untuk admin panel
    - Sidebar collapsible pada mobile
    - Tables responsive dengan horizontal scroll
    - Forms responsive
    - _Requirements: 11.5, 20.1, 20.2, 20.3_
  
  - [ ]* 8.19 Validasi MODULE 8
    - Run `npm run build` dan pastikan tidak ada error
    - Test semua CRUD operations
    - Verifikasi role-based access control
    - _Requirements: 21.1, 2.1, 2.2_

- [ ] 9. MODULE 9 — REVIEW SUBMISSION
  - [ ] 9.1 Buat UlasanForm component (Client Component)
    - Form fields: rating (1-5 stars), komentar
    - Validation: rating required, komentar not empty, max 1000 chars
    - Submit button dengan loading state
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [ ] 9.2 Implementasi authentication check
    - Show form only untuk authenticated users
    - Show login prompt untuk unauthenticated users
    - _Requirements: 9.4_
  
  - [ ] 9.3 Implementasi review submission
    - Insert ulasan ke database dengan user_id dan wisata_id
    - Optimistic update (display new review immediately)
    - Success toast notification
    - Error handling dengan error messages
    - _Requirements: 9.3, 9.6, 9.7, 28.3, 28.4_
  
  - [ ] 9.4 Implementasi rating aggregation
    - Calculate average rating dari all ulasan
    - Display pada destination cards dan detail pages
    - Update immediately after new submission
    - Display "Belum ada ulasan" jika no reviews
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6_
  
  - [ ] 9.5 Buat UlasanItem component (Server Component)
    - Display single review dengan rating stars
    - User information (nama, avatar)
    - Review text dan timestamp
    - _Requirements: 4.5_
  
  - [ ]* 9.6 Validasi MODULE 9
    - Run `npm run build` dan pastikan tidak ada error
    - Test review submission flow
    - Verifikasi RLS policies (user can only insert own reviews)
    - _Requirements: 21.1, 18.3_

- [ ] 10. MODULE 10 — OPTIMASI & FINAL
  - [ ] 10.1 Implementasi metadata per page
    - Setup metadata untuk home page
    - Setup metadata untuk wisata detail pages
    - Setup metadata untuk ZNEK page
    - Setup metadata untuk admin pages
    - _Requirements: 25.5_
  
  - [ ] 10.2 Implementasi loading states
    - Loading spinners untuk data fetching
    - Skeleton screens untuk cards dan lists
    - Loading states untuk form submissions
    - _Requirements: 21.6, 28.1, 28.2_
  
  - [ ] 10.3 Implementasi error states
    - Error boundaries untuk runtime errors
    - 404 page untuk invalid routes
    - Error messages dalam Bahasa Indonesia
    - User-friendly error displays
    - _Requirements: 21.7, 25.6, 28.4, 28.5_
  
  - [ ] 10.4 Implementasi toast notifications
    - Success messages (auto-dismiss after 3 seconds)
    - Error messages (manual dismiss)
    - Bahasa Indonesia
    - _Requirements: 28.3, 28.4, 28.5, 28.6_
  
  - [ ] 10.5 Verifikasi middleware protection
    - Test /admin routes protection
    - Test role-based access control
    - Test session refresh
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 10.6 Implementasi image optimization
    - Verify next/image usage di semua images
    - Setup proper sizes prop
    - Lazy loading untuk galleries
    - _Requirements: 20.7, 24.7_
  
  - [ ] 10.7 Implementasi performance optimizations
    - Memoize filtered results di FasilitasMap
    - Cache server component data
    - Dynamic imports untuk heavy components
    - Tree shaking verification
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_
  
  - [ ] 10.8 Responsive design final check
    - Test all pages pada mobile (320px - 767px)
    - Test all pages pada tablet (768px - 1023px)
    - Test all pages pada desktop (1024px+)
    - Verify touch-friendly elements
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.6_
  
  - [ ] 10.9 Accessibility improvements
    - Semantic HTML elements
    - ARIA labels untuk interactive elements
    - Keyboard navigation support
    - Color contrast verification
    - _Requirements: 19.8_
  
  - [ ] 10.10 Final build validation
    - Run `npm run build` dan pastikan tidak ada errors
    - Run `npm run lint` dan fix semua issues
    - Verify TypeScript types untuk all Supabase queries
    - Test all async operations dengan proper error handling
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [ ] 10.11 Deployment preparation
    - Setup environment variables untuk production
    - Verify Supabase production configuration
    - Test production build locally
    - _Requirements: 21.1_
  
  - [ ]* 10.12 Final end-to-end testing
    - Test complete user flow: browse → view detail → submit review
    - Test complete admin flow: login → CRUD operations
    - Test authentication flow: login → logout
    - Test map interaction: filters → markers → popups
    - _Requirements: 1.1, 9.3, 12.4, 13.5, 5.1, 6.1, 7.1_

## Notes

- Tasks marked with `*` are validation checkpoints dan dapat di-skip untuk faster MVP
- Setiap task reference specific requirements untuk traceability
- Checkpoints dengan `npm run build` memastikan incremental validation
- Semua text content harus dalam Bahasa Indonesia
- Maximum border-radius: 8px, maximum animation duration: 300ms
- Solid colors only, no gradients, no emojis
- TypeScript strict mode untuk all code
- Server Components by default, Client Components hanya untuk interactivity

## Implementation Order

Modules harus diimplementasikan secara sequential (0 → 1 → 2 → ... → 10) untuk memastikan dependencies terpenuhi. Setiap module dapat divalidasi secara independen dengan `npm run build`.
