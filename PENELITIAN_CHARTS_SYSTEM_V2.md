# Sistem Management Chart Penelitian V2

## ✅ Update Terbaru

### Perubahan Major:

1. **❌ Hapus `chart_title`** - Tidak perlu judul per chart lagi
2. **✅ Multiple URL Input** - Bisa input banyak URL sekaligus
3. **✅ Custom Variabel** - Bisa tambah variabel baru selain TCM/CVM/HPM

---

## 🗄️ Database Schema

### Tabel: `wisata_penelitian_charts`

```sql
CREATE TABLE wisata_penelitian_charts (
  id UUID PRIMARY KEY,
  wisata_id UUID REFERENCES wisata(id) ON DELETE CASCADE,
  variabel_type TEXT NOT NULL,  -- ✅ Tidak ada constraint, bisa custom!
  chart_embed_url TEXT NOT NULL,
  chart_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Kolom:**
- `wisata_id`: ID wisata (foreign key)
- `variabel_type`: Jenis variabel (TCM/CVM/HPM atau custom)
- `chart_embed_url`: URL embed dari Google Sheets
- `chart_order`: Urutan tampilan chart
- ~~`chart_title`~~ ← **DIHAPUS!**

---

## 🎨 Fitur Admin Panel (Updated)

### Halaman: `/admin/penelitian-charts`

**Fitur Baru:**

#### 1. Multiple URL Input ✨
- Bisa tambah banyak URL sekaligus
- Tombol **"+ Tambah URL"** untuk menambah field
- Tombol **X** untuk hapus field
- Semua URL disimpan dalam 1 kali submit

**Contoh:**
```
URL Chart 1: https://docs.google.com/...oid=123...
URL Chart 2: https://docs.google.com/...oid=456...
URL Chart 3: https://docs.google.com/...oid=789...
```
Klik "Simpan Semua" → 3 chart langsung masuk!

#### 2. Custom Variabel ✨
- Dropdown variabel menampilkan: TCM, CVM, HPM, + semua variabel custom yang pernah dibuat
- Pilih **"+ Variabel Baru"** untuk buat variabel custom
- Input nama variabel baru (contoh: "ZNEK", "SWOT", "Analisis Pasar")
- Variabel custom otomatis muncul di dropdown untuk wisata lain

**Contoh Custom Variabel:**
- ZNEK
- SWOT Analysis
- Market Research
- Visitor Survey
- dll.

#### 3. Simplified Table
- Tidak ada kolom "Judul Chart" lagi
- Hanya: # | URL Embed | Aksi
- Lebih clean dan simple

---

## 📊 Frontend Display (Updated)

### Komponen: `WisataResearch.tsx`

**Perubahan:**
- ✅ Tidak ada judul per chart
- ✅ Chart langsung ditampilkan dalam grid
- ✅ Support custom variabel (dinamis)

**Tampilan:**
```
Variabel Travel Cost Method (TCM)
Berdasarkan 102 responden...

[Chart 1] [Chart 2]
[Chart 3] [Chart 4]
```

Tidak ada judul "Jenis Kelamin", "Usia", dll. Chart langsung tampil.

---

## 🚀 Cara Menggunakan (Updated)

### 1. Tambah Chart dengan Multiple URLs

1. Login admin → **Chart Penelitian**
2. Pilih wisata
3. Klik **"Tambah Chart"**
4. Pilih variabel (TCM/CVM/HPM atau custom)
5. **Input URL pertama**
6. Klik **"+ Tambah URL"** untuk tambah URL lagi
7. **Input URL kedua, ketiga, dst.**
8. Klik **"Simpan Semua"**

✅ Semua chart langsung masuk sekaligus!

### 2. Buat Variabel Custom

1. Login admin → **Chart Penelitian**
2. Pilih wisata
3. Klik **"Tambah Chart"**
4. Di dropdown variabel, pilih **"+ Variabel Baru"**
5. Input nama variabel (contoh: "ZNEK")
6. Input URL chart
7. Klik **"Simpan Semua"**

✅ Variabel "ZNEK" sekarang tersedia untuk semua wisata!

### 3. Bulk Insert Chart

**Skenario:** Anda punya 8 chart TCM untuk Umbul Sidomukti

**Cara Lama (Ribet):**
- Tambah chart 1 → Save
- Tambah chart 2 → Save
- Tambah chart 3 → Save
- ... (8x klik)

**Cara Baru (Cepat):**
1. Klik "Tambah Chart"
2. Pilih variabel: TCM
3. Paste URL 1
4. Klik "+ Tambah URL"
5. Paste URL 2
6. Klik "+ Tambah URL"
7. Paste URL 3-8
8. Klik "Simpan Semua"

✅ 8 chart masuk dalam 1x klik!

---

## 🎯 Keuntungan Update Ini

### ✅ Lebih Cepat
- Bulk insert multiple URLs sekaligus
- Tidak perlu input judul per chart
- Hemat waktu setup

### ✅ Lebih Fleksibel
- Bisa buat variabel custom tanpa batas
- Tidak terbatas TCM/CVM/HPM saja
- Cocok untuk research method baru

### ✅ Lebih Simple
- Tidak perlu mikirin judul chart
- Chart langsung tampil
- UI lebih clean

---

## 📝 Contoh Use Case

### Use Case 1: Wisata dengan 4 Variabel

**Umbul Sidomukti:**
- TCM: 8 charts
- CVM: 5 charts
- HPM: 3 charts
- ZNEK: 4 charts ← Custom!

**Total: 20 charts**

### Use Case 2: Research Baru

Client mau tambah research method baru: **"Visitor Satisfaction Survey"**

**Cara:**
1. Buat variabel baru: "Visitor Satisfaction"
2. Upload 10 chart survey
3. Done!

Tidak perlu coding, tidak perlu update database schema!

---

## 🔄 Migration dari V1 ke V2

Jika Anda sudah punya data di V1 (dengan `chart_title`):

**Data lama tetap aman!** Kolom `chart_title` sudah dihapus dari database, tapi data chart (URL) tetap ada.

**Tidak perlu migration manual.**

---

## 🐛 Troubleshooting

### Multiple URL tidak ke-save semua?
- ✅ Pastikan semua URL field terisi (yang kosong akan di-skip)
- ✅ Cek koneksi database

### Custom variabel tidak muncul di dropdown?
- ✅ Refresh halaman
- ✅ Pastikan sudah save minimal 1 chart dengan variabel tersebut

### Chart tidak tampil di frontend?
- ✅ Pastikan `wisata_id` benar
- ✅ Cek URL embed valid
- ✅ Pastikan chart sudah di-publish di Google Sheets

---

## 📊 Perbandingan V1 vs V2

| Fitur | V1 | V2 |
|-------|----|----|
| Input URL | 1 per kali | Multiple sekaligus ✨ |
| Judul Chart | Wajib | Tidak ada (dihapus) ✨ |
| Variabel | TCM/CVM/HPM only | Custom unlimited ✨ |
| Bulk Insert | Tidak | Ya ✨ |
| Fleksibilitas | Terbatas | Sangat fleksibel ✨ |

---

## 🎉 Kesimpulan

**V2 jauh lebih powerful dan fleksibel!**

✅ Bulk insert untuk efisiensi
✅ Custom variabel untuk research baru
✅ Simplified UI tanpa judul chart

**Status: ✅ READY TO USE!**
