# Cara Input Chart - Troubleshooting

## Masalah: Chart Tidak Muncul / Error "Halaman Tidak Ditemukan"

### Kemungkinan Penyebab:

1. **Belum ada data chart di database**
2. **URL embed salah format**
3. **Chart belum di-publish di Google Sheets**

---

## ✅ Solusi 1: Input Data Chart via Admin

### Langkah-langkah:

1. **Login ke admin panel**
   ```
   http://localhost:3000/admin/login
   ```

2. **Buka halaman Chart Penelitian**
   ```
   http://localhost:3000/admin/penelitian-charts
   ```

3. **Pilih wisata** dari dropdown (contoh: Umbul Sidomukti)

4. **Klik "Tambah Chart"**

5. **Pilih variabel: TCM**

6. **Input URL embed chart** (8 URL untuk TCM):
   
   **URL 1 (Jenis Kelamin):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1724501648&format=interactive
   ```

   **URL 2 (Usia):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1761760546&format=interactive
   ```

   **URL 3 (Pendidikan):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1328985809&format=interactive
   ```

   **URL 4 (Pekerjaan):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1713072256&format=interactive
   ```

   **URL 5 (Pendapatan):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1132357029&format=interactive
   ```

   **URL 6 (Asal Daerah):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=841277995&format=interactive
   ```

   **URL 7 (Tujuan Kunjungan):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=257089746&format=interactive
   ```

   **URL 8 (Frekuensi Kunjungan):**
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1633450956&format=interactive
   ```

7. **Klik "+ Tambah URL"** untuk setiap URL tambahan

8. **Klik "Simpan Semua"**

9. **Refresh halaman detail wisata** untuk melihat chart

---

## ✅ Solusi 2: Cek Format URL

### Format URL yang BENAR:

```
https://docs.google.com/spreadsheets/d/e/SPREADSHEET_ID/pubchart?oid=CHART_ID&format=interactive
```

**Contoh:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1724501648&format=interactive
```

### Format URL yang SALAH:

❌ URL spreadsheet biasa:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

❌ URL tanpa `/pubchart`:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID
```

❌ URL iframe HTML:
```
<iframe src="..."></iframe>
```

### Cara Mendapatkan URL yang Benar:

1. Buka Google Sheets
2. Klik chart yang ingin di-publish
3. Klik titik tiga (⋮) di pojok kanan atas chart
4. Pilih **"Publish chart"**
5. Tab **"Link"** (bukan "Embed")
6. Copy URL yang muncul
7. Pastikan URL mengandung `/pubchart?oid=`

---

## ✅ Solusi 3: Pastikan Chart Sudah Published

### Langkah-langkah:

1. Buka Google Sheets
2. Klik chart
3. Klik titik tiga (⋮)
4. Pilih **"Publish chart"**
5. Klik **"Publish"**
6. ✅ Chart sekarang public dan bisa di-embed

**PENTING:** Chart harus di-publish agar bisa ditampilkan di website!

---

## 🐛 Debug: Cek Data di Database

### Via Supabase Dashboard:

1. Buka Supabase Dashboard
2. Pilih project
3. Klik **"Table Editor"**
4. Pilih tabel **`wisata_penelitian_charts`**
5. Cek apakah ada data untuk `wisata_id` yang sesuai

### Via SQL:

```sql
SELECT * FROM wisata_penelitian_charts 
WHERE wisata_id = 'WISATA_ID_UMBUL_SIDOMUKTI';
```

Jika **tidak ada data**, berarti belum input chart via admin.

---

## 📝 Checklist Troubleshooting

- [ ] Sudah login ke admin panel
- [ ] Sudah pilih wisata yang benar
- [ ] Sudah input minimal 1 URL chart
- [ ] URL format benar (mengandung `/pubchart?oid=`)
- [ ] Chart sudah di-publish di Google Sheets
- [ ] Sudah refresh halaman detail wisata
- [ ] Cek console browser untuk error (F12)

---

## 🎯 Quick Test

### Test 1: Cek apakah iframe bisa load

Buka browser console (F12) dan paste:

```javascript
const testUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT27bTO0sKHiiBbwctD32olFkacIViCxSwrmU8zMXvc6KPyPi3Gt05-aJaEBIMf0aN2rf5aebGtLwPx/pubchart?oid=1724501648&format=interactive";

fetch(testUrl)
  .then(res => console.log('✅ URL accessible:', res.status))
  .catch(err => console.error('❌ URL error:', err));
```

### Test 2: Buka URL langsung di browser

Copy URL chart dan paste di address bar. Jika muncul chart, berarti URL benar.

---

## 💡 Tips

1. **Gunakan fitur bulk insert** - Input semua 8 URL sekaligus
2. **Copy-paste URL** - Jangan ketik manual
3. **Test 1 chart dulu** - Sebelum input semua, test 1 chart dulu
4. **Cek preview** - Buka URL di tab baru untuk memastikan chart muncul

---

## 🆘 Masih Error?

Jika masih error setelah semua langkah di atas:

1. **Screenshot error** di browser console (F12)
2. **Screenshot admin panel** saat input chart
3. **Copy URL** yang digunakan
4. **Cek network tab** di browser untuk melihat request yang gagal

Kemungkinan besar masalahnya adalah:
- ❌ Belum ada data di database
- ❌ URL format salah
- ❌ Chart belum di-publish
