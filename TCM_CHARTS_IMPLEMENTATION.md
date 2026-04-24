# Implementasi TCM Charts - Desa Umbul Sidomukti

## ✅ Yang Sudah Dikerjakan

### 1. Komponen Baru: `WisataTCMCharts.tsx`
Lokasi: `components/wisata/WisataTCMCharts.tsx`

**Fitur:**
- Menampilkan 8 chart TCM dalam grid 2 kolom (responsive)
- Loading state untuk setiap chart
- Hover effect pada card
- Judul untuk setiap chart:
  1. Jenis Kelamin
  2. Usia
  3. Pendidikan
  4. Pekerjaan
  5. Pendapatan
  6. Asal Daerah
  7. Tujuan Kunjungan
  8. Frekuensi Kunjungan

### 2. Integrasi ke Halaman Detail Wisata
File: `app/wisata/[id]/page.tsx`

**Perubahan:**
- Import komponen `WisataTCMCharts`
- Menambahkan section baru di bawah "Total Nilai Ekonomi"
- Chart ditampilkan sebelum section "Research Data"

## 📊 Struktur Data

Saat ini chart **hardcoded untuk Desa Umbul Sidomukti**.

### URL Spreadsheet:
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/
```

## 🎯 Cara Menggunakan

1. **Buka halaman detail wisata** (contoh: `/wisata/[id]`)
2. **Scroll ke bawah** setelah section "Total Nilai Ekonomi"
3. **Lihat 8 chart TCM** dalam grid 2 kolom

## 🔄 Next Steps (Untuk Wisata Lain)

Untuk menambahkan chart ke wisata lain, ada 2 opsi:

### Opsi A: Hardcode per Wisata (Cepat)
1. Buat komponen baru: `WisataTCMCharts_[NamaWisata].tsx`
2. Copy struktur dari `WisataTCMCharts.tsx`
3. Ganti URL chart sesuai wisata
4. Conditional render di `page.tsx` berdasarkan `wisata.id`

### Opsi B: Dynamic dari Database (Recommended)
1. Buat tabel baru di Supabase: `wisata_tcm_charts`
   ```sql
   CREATE TABLE wisata_tcm_charts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     wisata_id UUID REFERENCES wisata(id),
     chart_title TEXT,
     chart_embed_url TEXT,
     chart_order INT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
2. Admin bisa input URL chart via admin panel
3. Fetch data chart berdasarkan `wisata_id`
4. Render dynamic

## 🎨 Styling

- Grid responsive: 1 kolom (mobile), 2 kolom (desktop)
- Card dengan border dan shadow
- Loading spinner saat chart loading
- Hover effect untuk interaktivitas

## 📝 Catatan

- Chart di-embed langsung dari Google Sheets (published)
- Setiap perubahan di spreadsheet akan otomatis update di web
- Tidak perlu re-deploy untuk update data chart
