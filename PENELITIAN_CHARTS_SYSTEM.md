# Sistem Management Chart Penelitian

## ✅ Implementasi Lengkap

Sistem management chart penelitian yang fleksibel dan user-friendly untuk mengelola chart TCM, CVM, dan HPM per wisata.

---

## 🗄️ Database

### Tabel Baru: `wisata_penelitian_charts`

```sql
CREATE TABLE wisata_penelitian_charts (
  id UUID PRIMARY KEY,
  wisata_id UUID REFERENCES wisata(id) ON DELETE CASCADE,
  variabel_type TEXT CHECK (variabel_type IN ('TCM', 'CVM', 'HPM')),
  chart_title TEXT NOT NULL,
  chart_embed_url TEXT NOT NULL,
  chart_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Kolom:**
- `wisata_id`: ID wisata (foreign key)
- `variabel_type`: Jenis variabel (TCM/CVM/HPM)
- `chart_title`: Judul chart (contoh: "Jenis Kelamin")
- `chart_embed_url`: URL embed dari Google Sheets
- `chart_order`: Urutan tampilan chart

**RLS Policies:**
- ✅ Public read access
- ✅ Authenticated users can CRUD

---

## 🎨 Fitur Admin Panel

### Halaman: `/admin/penelitian-charts`

**Fitur Lengkap:**

1. **Pilih Wisata** - Dropdown untuk memilih wisata
2. **Tambah Chart** - Form untuk menambah chart baru
3. **Edit Chart** - Edit judul dan URL chart
4. **Hapus Chart** - Konfirmasi sebelum menghapus
5. **Reorder Chart** - Tombol ↑↓ untuk mengubah urutan
6. **Grouping by Variabel** - Chart dikelompokkan per TCM/CVM/HPM

**Form Input:**
- Variabel (dropdown: TCM/CVM/HPM)
- Judul Chart (text input)
- URL Embed Chart (text input dengan hint)

**Validasi:**
- Semua field wajib diisi
- URL harus valid

---

## 📊 Frontend Display

### Komponen: `WisataResearch.tsx`

**Perubahan:**
- ✅ Fetch chart dari database berdasarkan `wisata_id`
- ✅ Group chart per variabel (TCM/CVM/HPM)
- ✅ Loading state per chart
- ✅ Responsive grid 2 kolom
- ✅ Fallback jika belum ada chart

**Props Baru:**
```typescript
interface WisataResearchProps {
  penelitian: Tables<'wisata_penelitian'>[];
  wisataId: string; // ← BARU!
}
```

---

## 🚀 Cara Menggunakan

### 1. Admin: Tambah Chart untuk Wisata

1. Login ke admin panel
2. Klik menu **"Chart Penelitian"**
3. Pilih wisata dari dropdown
4. Klik **"Tambah Chart"**
5. Isi form:
   - **Variabel**: Pilih TCM/CVM/HPM
   - **Judul Chart**: Contoh "Jenis Kelamin"
   - **URL Embed**: Paste URL dari Google Sheets
6. Klik **"Simpan"**

### 2. Cara Mendapatkan URL Embed dari Google Sheets

1. Buka Google Sheets
2. Klik chart yang ingin di-publish
3. Klik titik tiga (⋮) di pojok kanan atas chart
4. Pilih **"Publish chart"**
5. Tab **"Link"**
6. Copy URL yang muncul
7. Paste ke form admin

**Format URL:**
```
https://docs.google.com/spreadsheets/d/e/SPREADSHEET_ID/pubchart?oid=CHART_ID&format=interactive
```

### 3. User: Lihat Chart di Detail Wisata

1. Buka halaman detail wisata (contoh: `/wisata/[id]`)
2. Scroll ke bawah ke section **"Analisis Nilai Ekonomi Wisata"**
3. Chart akan muncul di section:
   - **Variabel Travel Cost Method (TCM)**
   - **Variabel Contingent Valuation Method (CVM)**
   - **Variabel Hedonic Pricing Method (HPM)**

---

## 📁 File yang Dibuat/Diubah

### Baru:
1. `app/admin/(dashboard)/penelitian-charts/page.tsx` - Halaman admin
2. `components/admin/PenelitianChartsManager.tsx` - Komponen CRUD
3. Migration: `create_wisata_penelitian_charts` - Tabel database

### Diubah:
1. `components/wisata/WisataResearch.tsx` - Fetch dari database
2. `components/admin/AdminSidebar.tsx` - Tambah menu baru
3. `lib/types/database.ts` - Update TypeScript types
4. `app/wisata/[id]/page.tsx` - Pass `wisataId` prop

---

## 🎯 Keuntungan Sistem Ini

### ✅ Fleksibilitas
- Admin bisa tambah/edit/hapus chart kapan saja
- Tidak perlu coding untuk update chart
- Bisa tambah chart baru tanpa batas

### ✅ Per Wisata
- Setiap wisata punya chart sendiri
- Data tidak tercampur antar wisata
- Mudah manage chart per destinasi

### ✅ User Friendly
- Interface admin yang intuitif
- Drag & drop order (via tombol ↑↓)
- Konfirmasi sebelum hapus
- Loading state yang jelas

### ✅ Scalable
- Bisa tambah variabel baru (tinggal update enum)
- Bisa tambah field baru (contoh: deskripsi chart)
- Database terstruktur dengan baik

---

## 🔄 Next Steps (Opsional)

### Enhancement Ideas:

1. **Preview Chart** - Preview chart sebelum save
2. **Bulk Upload** - Upload multiple charts sekaligus
3. **Chart Analytics** - Track berapa kali chart dilihat
4. **Export Data** - Export chart data ke Excel/PDF
5. **Chart Templates** - Template chart untuk wisata baru
6. **Drag & Drop Reorder** - UI yang lebih smooth untuk reorder

---

## 🐛 Troubleshooting

### Chart tidak muncul?
- ✅ Pastikan chart sudah di-publish di Google Sheets
- ✅ Cek URL embed sudah benar
- ✅ Pastikan `wisata_id` sesuai

### Error saat save?
- ✅ Cek koneksi database
- ✅ Pastikan user sudah authenticated
- ✅ Cek RLS policies aktif

### Chart loading terus?
- ✅ Cek URL embed valid
- ✅ Cek Google Sheets tidak private
- ✅ Refresh browser

---

## 📝 Contoh Data

### Insert Chart untuk Umbul Sidomukti (TCM):

```sql
INSERT INTO wisata_penelitian_charts (wisata_id, variabel_type, chart_title, chart_embed_url, chart_order)
VALUES 
  ('WISATA_ID', 'TCM', 'Jenis Kelamin', 'https://docs.google.com/...oid=1724501648...', 0),
  ('WISATA_ID', 'TCM', 'Usia', 'https://docs.google.com/...oid=1761760546...', 1),
  ('WISATA_ID', 'TCM', 'Pendidikan', 'https://docs.google.com/...oid=1328985809...', 2);
```

---

## 🎉 Kesimpulan

Sistem ini memberikan **fleksibilitas penuh** kepada admin untuk mengelola chart penelitian tanpa perlu coding. Data tersimpan di database, terstruktur dengan baik, dan mudah di-maintain.

**Status: ✅ READY TO USE!**
