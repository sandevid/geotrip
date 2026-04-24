# Requirements Document

## Introduction

GeoTrip adalah aplikasi WebGIS (Web Geographic Information System) berbasis Next.js 16+ untuk pariwisata Kota Semarang yang menampilkan dua destinasi utama: Umbul Sidomukti dan Sam Poo Kong. Aplikasi ini menyediakan peta interaktif dengan analisis fasilitas sekitar menggunakan filter radius, sistem autentikasi Google OAuth, manajemen konten admin, dan analisis zona ekonomi kawasan (ZNEK). Sistem ini dirancang untuk memberikan informasi komprehensif kepada wisatawan dan administrator dalam mengelola data destinasi wisata.

## Glossary

- **GeoTrip_System**: Aplikasi WebGIS pariwisata Semarang
- **User**: Pengguna umum yang mengakses aplikasi (authenticated atau anonymous)
- **Admin**: Pengguna dengan hak akses penuh untuk mengelola konten
- **Wisata**: Destinasi pariwisata (Umbul Sidomukti atau Sam Poo Kong)
- **Fasilitas**: Tempat atau layanan di sekitar destinasi (hotel, ATM, SPBU, dll)
- **ZNEK**: Zona Nilai Ekonomi Kawasan - analisis ekonomi destinasi wisata
- **Ulasan**: Review dan rating dari pengguna untuk destinasi wisata
- **Galeri**: Koleksi foto untuk setiap destinasi wisata
- **Penelitian**: Konten penelitian ekonomi (TCM, CVM, HPM) untuk destinasi
- **Haversine_Formula**: Formula matematika untuk menghitung jarak antara dua koordinat geografis
- **RLS**: Row Level Security - kebijakan keamanan database Supabase
- **Leaflet**: Library JavaScript untuk peta interaktif
- **Supabase**: Backend platform (database, auth, storage)
- **OAuth**: Protokol autentikasi menggunakan Google

## Requirements

### Requirement 1: Autentikasi Pengguna

**User Story:** As a User, I want to authenticate using my Google account, so that I can access personalized features and submit reviews.

#### Acceptance Criteria

1. WHEN a User clicks the login button, THE GeoTrip_System SHALL redirect to Google OAuth authentication page
2. WHEN Google OAuth returns successful authentication, THE GeoTrip_System SHALL create or update the User profile in the profiles table
3. WHEN authentication completes, THE GeoTrip_System SHALL store the User session using Supabase Auth
4. THE GeoTrip_System SHALL assign role "user" to new authenticated Users by default
5. WHEN a User logs out, THE GeoTrip_System SHALL clear the session and redirect to home page
6. THE GeoTrip_System SHALL persist authentication state across page refreshes
7. FOR ALL authenticated Users, THE GeoTrip_System SHALL display user profile information in the navigation bar

### Requirement 2: Role-Based Access Control

**User Story:** As an Admin, I want role-based access control, so that only authorized users can access administrative features.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL restrict access to admin routes to Users with role "admin"
2. WHEN a User without admin role attempts to access admin routes, THE GeoTrip_System SHALL redirect to home page with error message
3. THE GeoTrip_System SHALL apply RLS policies to ensure Users can only modify their own data
4. THE GeoTrip_System SHALL allow Admins to bypass RLS policies for content management
5. WHEN a User is not authenticated, THE GeoTrip_System SHALL allow read-only access to public pages

### Requirement 3: Home Page Display

**User Story:** As a User, I want to see an attractive home page with destination information, so that I can discover tourism destinations in Semarang.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display a hero section with application title and description in Bahasa Indonesia
2. THE GeoTrip_System SHALL display cards for both Wisata destinations (Umbul Sidomukti and Sam Poo Kong)
3. WHEN a User clicks a destination card, THE GeoTrip_System SHALL navigate to the destination detail page
4. THE GeoTrip_System SHALL display destination cards with thumbnail image, name, and brief description
5. THE GeoTrip_System SHALL render the home page with responsive design for mobile, tablet, and desktop viewports
6. THE GeoTrip_System SHALL use solid colors from the design system (primary: #1D4ED8)
7. THE GeoTrip_System SHALL apply maximum border-radius of 8px to all UI elements

### Requirement 4: Destination Detail Pages

**User Story:** As a User, I want to view detailed information about a tourism destination, so that I can learn about facilities, reviews, and research data.

#### Acceptance Criteria

1. WHEN a User navigates to /wisata/[id], THE GeoTrip_System SHALL fetch and display the Wisata details from the database
2. THE GeoTrip_System SHALL display destination name, description, address, and coordinates
3. THE GeoTrip_System SHALL display a photo Galeri with multiple images for the Wisata
4. THE GeoTrip_System SHALL display Penelitian content (TCM, CVM, HPM) for the Wisata
5. THE GeoTrip_System SHALL display all Ulasan with ratings and user information
6. WHEN a Wisata does not exist, THE GeoTrip_System SHALL display a 404 error page
7. THE GeoTrip_System SHALL render destination detail pages with responsive design

### Requirement 5: Interactive Facilities Map

**User Story:** As a User, I want to see an interactive map showing facilities around a destination, so that I can plan my visit and find nearby services.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display an interactive Leaflet map on each destination detail page
2. THE GeoTrip_System SHALL load the Leaflet library using dynamic import with SSR disabled
3. THE GeoTrip_System SHALL display the Wisata location as a marker on the map
4. THE GeoTrip_System SHALL fetch all Fasilitas data once on page load and filter client-side
5. THE GeoTrip_System SHALL display Fasilitas markers with color-coding based on category
6. WHEN a User clicks a Fasilitas marker, THE GeoTrip_System SHALL display a popup with facility name, category, and calculated distance
7. THE GeoTrip_System SHALL calculate distance between Wisata and Fasilitas using Haversine_Formula
8. THE GeoTrip_System SHALL center the map on the Wisata coordinates with appropriate zoom level
9. THE GeoTrip_System SHALL render the map responsively across all device sizes

### Requirement 6: Facilities Radius Filtering

**User Story:** As a User, I want to filter facilities by distance radius, so that I can see only nearby facilities within my preferred range.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL provide radius filter options: 250m, 500m, 750m, 1km, 1.5km, 2km, 2.5km, 3km, and "Semua" (all)
2. WHEN a User selects a radius filter, THE GeoTrip_System SHALL display only Fasilitas within the selected distance from the Wisata
3. THE GeoTrip_System SHALL perform filtering in the browser without additional server requests
4. THE GeoTrip_System SHALL update the map markers immediately when filter changes
5. THE GeoTrip_System SHALL display the count of visible Fasilitas for the selected radius
6. WHEN "Semua" is selected, THE GeoTrip_System SHALL display all Fasilitas regardless of distance

### Requirement 7: Facilities Category Filtering

**User Story:** As a User, I want to filter facilities by category, so that I can find specific types of services I need.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL provide category filter options: Hotel, Niaga, Kesehatan, Pendidikan, Peribadatan, Pemerintah, ATM, SPBU, Bengkel, Lapangan, Hiburan
2. WHEN a User selects one or more categories, THE GeoTrip_System SHALL display only Fasilitas matching the selected categories
3. THE GeoTrip_System SHALL allow multiple category selections simultaneously
4. THE GeoTrip_System SHALL perform category filtering in the browser without additional server requests
5. THE GeoTrip_System SHALL combine radius and category filters when both are active
6. THE GeoTrip_System SHALL update the map markers immediately when category filter changes
7. WHEN no categories are selected, THE GeoTrip_System SHALL display all Fasilitas (subject to radius filter)

### Requirement 8: Facility Marker Color Coding

**User Story:** As a User, I want facilities to be color-coded by category on the map, so that I can quickly identify different types of facilities visually.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL assign unique colors to each Fasilitas category
2. THE GeoTrip_System SHALL render Fasilitas markers using the color assigned to their category
3. THE GeoTrip_System SHALL display a legend showing category names and their corresponding colors
4. THE GeoTrip_System SHALL maintain consistent color mapping across all map views
5. THE GeoTrip_System SHALL use colors that provide sufficient contrast against the map background

### Requirement 9: Review Submission

**User Story:** As an authenticated User, I want to submit reviews and ratings for destinations, so that I can share my experience with other visitors.

#### Acceptance Criteria

1. WHEN a User is authenticated, THE GeoTrip_System SHALL display a review submission form on destination detail pages
2. THE GeoTrip_System SHALL require rating (1-5 stars) and review text for submission
3. WHEN a User submits a review, THE GeoTrip_System SHALL save the Ulasan to the database with user_id and wisata_id
4. WHEN a User is not authenticated, THE GeoTrip_System SHALL hide the review submission form and display a login prompt
5. THE GeoTrip_System SHALL validate that review text is not empty before submission
6. WHEN review submission succeeds, THE GeoTrip_System SHALL display the new review immediately without page refresh
7. IF review submission fails, THEN THE GeoTrip_System SHALL display an error message to the User

### Requirement 10: ZNEK Information Page

**User Story:** As a User, I want to view economic zone analysis information, so that I can understand the economic impact of tourism destinations.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL provide a dedicated ZNEK page accessible from the main navigation
2. THE GeoTrip_System SHALL fetch and display konten_znek data from the database
3. THE GeoTrip_System SHALL display ZNEK content in Bahasa Indonesia with proper formatting
4. THE GeoTrip_System SHALL render the ZNEK page with responsive design
5. THE GeoTrip_System SHALL display ZNEK content sections with clear headings and structure

### Requirement 11: Admin Dashboard Access

**User Story:** As an Admin, I want to access an admin dashboard, so that I can manage all application content from a centralized interface.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL provide an admin dashboard accessible at /admin route
2. WHEN an Admin accesses /admin, THE GeoTrip_System SHALL display navigation to all management sections
3. THE GeoTrip_System SHALL display management sections for: Wisata, Fasilitas, Ulasan, Galeri, and ZNEK
4. THE GeoTrip_System SHALL apply role-based access control to restrict dashboard to Admins only
5. THE GeoTrip_System SHALL render the admin dashboard with responsive design

### Requirement 12: Destination Management (Admin)

**User Story:** As an Admin, I want to create, read, update, and delete tourism destinations, so that I can maintain accurate destination information.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display a list of all Wisata entries in the admin panel
2. WHEN an Admin clicks "Add Destination", THE GeoTrip_System SHALL display a form to create a new Wisata
3. THE GeoTrip_System SHALL require name, description, address, latitude, and longitude for Wisata creation
4. WHEN an Admin submits a new Wisata, THE GeoTrip_System SHALL save it to the wisata table
5. WHEN an Admin clicks "Edit" on a Wisata, THE GeoTrip_System SHALL display a form pre-filled with existing data
6. WHEN an Admin updates a Wisata, THE GeoTrip_System SHALL save changes to the database
7. WHEN an Admin clicks "Delete" on a Wisata, THE GeoTrip_System SHALL prompt for confirmation before deletion
8. WHEN an Admin confirms deletion, THE GeoTrip_System SHALL remove the Wisata and all related data (Galeri, Penelitian, Ulasan)

### Requirement 13: Facility Management (Admin)

**User Story:** As an Admin, I want to create, read, update, and delete facilities, so that I can maintain accurate facility information on the map.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display a list of all Fasilitas entries in the admin panel
2. WHEN an Admin clicks "Add Facility", THE GeoTrip_System SHALL display a form to create a new Fasilitas
3. THE GeoTrip_System SHALL require name, category, latitude, and longitude for Fasilitas creation
4. THE GeoTrip_System SHALL provide a dropdown with all valid categories for Fasilitas
5. WHEN an Admin submits a new Fasilitas, THE GeoTrip_System SHALL save it to the fasilitas table
6. WHEN an Admin clicks "Edit" on a Fasilitas, THE GeoTrip_System SHALL display a form pre-filled with existing data
7. WHEN an Admin updates a Fasilitas, THE GeoTrip_System SHALL save changes to the database
8. WHEN an Admin clicks "Delete" on a Fasilitas, THE GeoTrip_System SHALL prompt for confirmation before deletion
9. WHEN an Admin confirms deletion, THE GeoTrip_System SHALL remove the Fasilitas from the database

### Requirement 14: Review Moderation (Admin)

**User Story:** As an Admin, I want to moderate user reviews, so that I can remove inappropriate content and maintain quality standards.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display a list of all Ulasan entries in the admin panel
2. THE GeoTrip_System SHALL display review text, rating, user information, and destination for each Ulasan
3. WHEN an Admin clicks "Delete" on an Ulasan, THE GeoTrip_System SHALL prompt for confirmation before deletion
4. WHEN an Admin confirms deletion, THE GeoTrip_System SHALL remove the Ulasan from the database
5. THE GeoTrip_System SHALL display Ulasan sorted by creation date (newest first)

### Requirement 15: Gallery Management (Admin)

**User Story:** As an Admin, I want to manage photo galleries for destinations, so that I can showcase destination images to visitors.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display all Galeri entries grouped by Wisata in the admin panel
2. WHEN an Admin clicks "Add Photo", THE GeoTrip_System SHALL display a form to upload a new image
3. THE GeoTrip_System SHALL upload images to Supabase Storage
4. WHEN an Admin uploads an image, THE GeoTrip_System SHALL create a Galeri entry with the storage URL and wisata_id
5. THE GeoTrip_System SHALL display thumbnail previews of all Galeri images
6. WHEN an Admin clicks "Delete" on a Galeri entry, THE GeoTrip_System SHALL prompt for confirmation
7. WHEN an Admin confirms deletion, THE GeoTrip_System SHALL remove the image from Supabase Storage and delete the Galeri entry

### Requirement 16: ZNEK Content Management (Admin)

**User Story:** As an Admin, I want to manage ZNEK content, so that I can update economic zone analysis information.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display all konten_znek entries in the admin panel
2. WHEN an Admin clicks "Edit ZNEK Content", THE GeoTrip_System SHALL display a form with the current content
3. THE GeoTrip_System SHALL provide a rich text editor for ZNEK content editing
4. WHEN an Admin updates ZNEK content, THE GeoTrip_System SHALL save changes to the konten_znek table
5. THE GeoTrip_System SHALL support multiple ZNEK content sections

### Requirement 17: Database Schema Implementation

**User Story:** As a developer, I want a properly structured database schema, so that the application can store and retrieve data efficiently and securely.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL create a profiles table extending auth.users with columns: id, email, full_name, avatar_url, role, created_at, updated_at
2. THE GeoTrip_System SHALL create a wisata table with columns: id, nama, deskripsi, alamat, latitude, longitude, created_at, updated_at
3. THE GeoTrip_System SHALL create a wisata_galeri table with columns: id, wisata_id, image_url, caption, created_at
4. THE GeoTrip_System SHALL create a wisata_penelitian table with columns: id, wisata_id, jenis_penelitian, konten, created_at, updated_at
5. THE GeoTrip_System SHALL create an ulasan table with columns: id, wisata_id, user_id, rating, komentar, created_at, updated_at
6. THE GeoTrip_System SHALL create a fasilitas table with columns: id, nama, kategori, latitude, longitude, created_at, updated_at
7. THE GeoTrip_System SHALL create a konten_znek table with columns: id, judul, konten, created_at, updated_at
8. THE GeoTrip_System SHALL define foreign key relationships between tables
9. THE GeoTrip_System SHALL create indexes on frequently queried columns (wisata_id, user_id, kategori)

### Requirement 18: Row Level Security Policies

**User Story:** As a developer, I want RLS policies implemented, so that data access is properly secured based on user roles and ownership.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL enable RLS on all tables except public read-only tables
2. THE GeoTrip_System SHALL allow public read access to wisata, wisata_galeri, wisata_penelitian, fasilitas, and konten_znek tables
3. THE GeoTrip_System SHALL allow authenticated Users to insert their own Ulasan
4. THE GeoTrip_System SHALL allow Users to update and delete only their own Ulasan
5. THE GeoTrip_System SHALL allow Admins to perform all operations on all tables
6. THE GeoTrip_System SHALL restrict profiles table access to the authenticated User's own profile
7. THE GeoTrip_System SHALL allow Admins to read all profiles

### Requirement 19: Design System Compliance

**User Story:** As a designer, I want the application to follow a consistent design system, so that the user interface is professional and cohesive.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL use primary color #1D4ED8 for primary actions and branding
2. THE GeoTrip_System SHALL use solid colors only without gradients
3. THE GeoTrip_System SHALL apply maximum border-radius of 8px to all rounded elements
4. THE GeoTrip_System SHALL use Geist font for headings
5. THE GeoTrip_System SHALL use Plus Jakarta Sans font for body text
6. THE GeoTrip_System SHALL apply animations with maximum duration of 300ms
7. THE GeoTrip_System SHALL use Framer Motion for animations
8. THE GeoTrip_System SHALL avoid using emojis in the user interface
9. THE GeoTrip_System SHALL implement all text content in Bahasa Indonesia

### Requirement 20: Responsive Design Implementation

**User Story:** As a User, I want the application to work seamlessly on all devices, so that I can access it from mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL render all pages responsively for mobile viewports (320px - 767px)
2. THE GeoTrip_System SHALL render all pages responsively for tablet viewports (768px - 1023px)
3. THE GeoTrip_System SHALL render all pages responsively for desktop viewports (1024px and above)
4. THE GeoTrip_System SHALL adjust map size and controls for different screen sizes
5. THE GeoTrip_System SHALL use Tailwind CSS v4 for responsive styling
6. THE GeoTrip_System SHALL ensure touch-friendly interface elements on mobile devices
7. THE GeoTrip_System SHALL optimize image loading for different viewport sizes

### Requirement 21: Build and Deployment Readiness

**User Story:** As a developer, I want the application to build without errors, so that it can be deployed to production successfully.

#### Acceptance Criteria

1. WHEN the build command is executed, THE GeoTrip_System SHALL complete without TypeScript errors
2. WHEN the build command is executed, THE GeoTrip_System SHALL complete without ESLint errors
3. THE GeoTrip_System SHALL use TypeScript for all application code
4. THE GeoTrip_System SHALL properly type all Supabase database queries
5. THE GeoTrip_System SHALL handle all async operations with proper error handling
6. THE GeoTrip_System SHALL implement proper loading states for all data fetching operations
7. IF a runtime error occurs, THEN THE GeoTrip_System SHALL display user-friendly error messages in Bahasa Indonesia

### Requirement 22: Haversine Distance Calculation

**User Story:** As a developer, I want accurate distance calculations between coordinates, so that facility filtering by radius works correctly.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL implement Haversine_Formula for calculating distances between geographic coordinates
2. WHEN calculating distance, THE GeoTrip_System SHALL accept latitude and longitude in decimal degrees
3. THE GeoTrip_System SHALL return distance in meters
4. THE GeoTrip_System SHALL handle edge cases (same coordinates, antipodal points)
5. FOR ALL valid coordinate pairs, THE GeoTrip_System SHALL calculate distance with accuracy within 0.5% of actual distance

### Requirement 23: Client-Side Data Filtering Performance

**User Story:** As a User, I want facility filtering to be instant, so that I can explore different radius and category combinations without delays.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL load all Fasilitas data once on destination page load
2. WHEN a User changes filter settings, THE GeoTrip_System SHALL update the map within 100ms
3. THE GeoTrip_System SHALL perform all filtering operations in the browser without server requests
4. THE GeoTrip_System SHALL cache Fasilitas data in component state
5. THE GeoTrip_System SHALL optimize filtering algorithms for datasets up to 1000 Fasilitas entries

### Requirement 24: Image Storage and Delivery

**User Story:** As an Admin, I want to upload and manage images efficiently, so that destination galleries load quickly for users.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL store all uploaded images in Supabase Storage
2. THE GeoTrip_System SHALL generate public URLs for stored images
3. THE GeoTrip_System SHALL validate image file types (JPEG, PNG, WebP) before upload
4. THE GeoTrip_System SHALL limit image file size to 5MB per upload
5. WHEN an image is deleted from Galeri, THE GeoTrip_System SHALL remove the file from Supabase Storage
6. THE GeoTrip_System SHALL organize images in storage buckets by wisata_id
7. THE GeoTrip_System SHALL serve images with appropriate caching headers

### Requirement 25: Navigation and Routing

**User Story:** As a User, I want intuitive navigation throughout the application, so that I can easily access different sections.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display a navigation bar on all pages with links to: Home, ZNEK, and Login/Profile
2. WHEN a User is authenticated, THE GeoTrip_System SHALL display user profile menu in navigation
3. WHEN a User is an Admin, THE GeoTrip_System SHALL display Admin Dashboard link in navigation
4. THE GeoTrip_System SHALL highlight the active page in the navigation bar
5. THE GeoTrip_System SHALL use Next.js App Router for all routing
6. THE GeoTrip_System SHALL implement proper 404 pages for invalid routes
7. THE GeoTrip_System SHALL support browser back/forward navigation correctly

### Requirement 26: Research Content Display

**User Story:** As a User, I want to view research data for destinations, so that I can understand the economic analysis (TCM, CVM, HPM) of tourism sites.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL display Penelitian content on destination detail pages
2. THE GeoTrip_System SHALL organize Penelitian by jenis_penelitian (TCM, CVM, HPM)
3. THE GeoTrip_System SHALL render Penelitian content with proper formatting and structure
4. WHEN no Penelitian exists for a Wisata, THE GeoTrip_System SHALL display a message indicating no research data available
5. THE GeoTrip_System SHALL display Penelitian in collapsible sections for better readability

### Requirement 27: Rating Aggregation and Display

**User Story:** As a User, I want to see average ratings for destinations, so that I can quickly assess destination quality based on visitor feedback.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL calculate average rating from all Ulasan for each Wisata
2. THE GeoTrip_System SHALL display average rating on destination cards on the home page
3. THE GeoTrip_System SHALL display average rating and total review count on destination detail pages
4. THE GeoTrip_System SHALL display ratings using star visualization (1-5 stars)
5. WHEN a Wisata has no Ulasan, THE GeoTrip_System SHALL display "Belum ada ulasan" (No reviews yet)
6. THE GeoTrip_System SHALL update average rating immediately after new Ulasan submission

### Requirement 28: Loading States and User Feedback

**User Story:** As a User, I want to see loading indicators during data operations, so that I know the application is processing my request.

#### Acceptance Criteria

1. WHEN data is being fetched, THE GeoTrip_System SHALL display a loading spinner or skeleton screen
2. WHEN a form is being submitted, THE GeoTrip_System SHALL disable the submit button and show loading state
3. WHEN an operation succeeds, THE GeoTrip_System SHALL display a success message in Bahasa Indonesia
4. IF an operation fails, THEN THE GeoTrip_System SHALL display an error message in Bahasa Indonesia
5. THE GeoTrip_System SHALL automatically dismiss success messages after 3 seconds
6. THE GeoTrip_System SHALL allow Users to manually dismiss error messages

### Requirement 29: Map Interaction and Controls

**User Story:** As a User, I want to interact with the map naturally, so that I can explore the area around tourism destinations.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL allow Users to pan the map by dragging
2. THE GeoTrip_System SHALL allow Users to zoom using mouse wheel or touch gestures
3. THE GeoTrip_System SHALL provide zoom control buttons on the map
4. THE GeoTrip_System SHALL display map attribution for OpenStreetMap
5. THE GeoTrip_System SHALL center the map on the Wisata location on initial load
6. WHEN a User clicks a marker, THE GeoTrip_System SHALL open a popup without changing map center
7. THE GeoTrip_System SHALL close previous popup when a new marker is clicked

### Requirement 30: Data Seeding for Initial Deployment

**User Story:** As a developer, I want initial data for Umbul Sidomukti and Sam Poo Kong, so that the application has content immediately after deployment.

#### Acceptance Criteria

1. THE GeoTrip_System SHALL include migration scripts to seed initial Wisata data for Umbul Sidomukti and Sam Poo Kong
2. THE GeoTrip_System SHALL include accurate coordinates for both destinations
3. THE GeoTrip_System SHALL include descriptive content in Bahasa Indonesia for both destinations
4. THE GeoTrip_System SHALL include sample Fasilitas data around both destinations
5. THE GeoTrip_System SHALL include sample ZNEK content
6. THE GeoTrip_System SHALL create at least one admin user account in the seed data
