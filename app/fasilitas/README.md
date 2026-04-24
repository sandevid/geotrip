# Halaman Fasilitas

Halaman fasilitas (`/fasilitas`) adalah halaman terpisah yang menampilkan peta interaktif dengan semua fasilitas di Semarang. Pengguna dapat memilih destinasi wisata tertentu untuk fokus pada fasilitas di sekitarnya.

## Fitur

### 1. Pemilihan Destinasi
- **Semua Fasilitas**: Menampilkan semua fasilitas tanpa fokus pada destinasi tertentu
- **Per Destinasi**: Fokus pada fasilitas di sekitar destinasi wisata yang dipilih

### 2. Peta Interaktif
- Peta Leaflet dengan marker fasilitas berwarna sesuai kategori
- Filter radius (250m - 3km)
- Filter kategori (Hotel, ATM, SPBU, dll)
- Popup dengan informasi fasilitas dan jarak

### 3. Statistik
- Total fasilitas
- Jumlah destinasi wisata
- Jumlah kategori
- Radius maksimal

### 4. Overview Kategori
- Daftar semua kategori fasilitas
- Jumlah fasilitas per kategori

## Struktur File

```
app/fasilitas/
├── page.tsx                           # Server Component utama
└── README.md                          # Dokumentasi

components/fasilitas/
└── FasilitasPageClient.tsx            # Client Component untuk interaksi
```

## Navigasi

Halaman ini dapat diakses melalui:
- Navbar: Link "Fasilitas" 
- URL: `/fasilitas`

## Data yang Dimuat

1. **Fasilitas**: Semua data dari tabel `fasilitas`
2. **Wisata**: Semua data dari tabel `wisata` untuk pilihan destinasi

## Responsive Design

- **Mobile**: Layout stacked, pilihan destinasi dalam grid 1 kolom
- **Tablet**: Grid 2 kolom untuk pilihan destinasi
- **Desktop**: Grid 3 kolom untuk pilihan destinasi

## Integrasi dengan Komponen Map

Halaman ini menggunakan `MapContainer` yang sama dengan halaman detail wisata, namun dengan kemampuan untuk mengubah titik pusat peta berdasarkan destinasi yang dipilih.

## State Management

- `selectedWisata`: Destinasi yang sedang dipilih (null = semua fasilitas)
- Koordinat peta berubah sesuai destinasi yang dipilih
- Default: Pusat kota Semarang (-6.9667, 110.4167)

## User Experience

1. User membuka `/fasilitas`
2. Melihat pilihan destinasi (Semua Fasilitas + destinasi individual)
3. Memilih destinasi → peta berpusat pada destinasi tersebut
4. Menggunakan filter radius dan kategori untuk menyaring fasilitas
5. Klik marker untuk melihat detail fasilitas dan jarak