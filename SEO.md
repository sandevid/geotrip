# SEO & Deploy Playbook — JumpoZone

Dokumen ini menjelaskan **apa yang sudah dipasang** di codebase dan **langkah‑langkah deployment** sehingga `https://jumpozone.my.id` muncul di Google dengan kata kunci target dalam ±1 hari.

> Catatan realistis: Google **tidak** menjamin indexing dalam jam tertentu, tapi dengan _Search Console URL Inspection_ + sitemap segar + konten unik, halaman utama biasanya ter-index 1–24 jam. Ranking di kata kunci kompetitif (mis. “Sam Poo Kong”) butuh waktu lebih lama; targetkan dulu kata kunci brand (“JumpoZone”) dan long-tail.

---

## 1. Apa yang sudah dipasang di kode

### 1.1 Konstanta SEO terpusat

`lib/site.ts` — single source of truth untuk:

- `SITE_URL` (otomatis baca `NEXT_PUBLIC_SITE_URL`, default `https://jumpozone.my.id`)
- `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_KEYWORDS`
- helper `absoluteUrl(path)`

### 1.2 Metadata global (`app/layout.tsx`)

- `metadataBase` → URL absolut otomatis untuk semua OG/canonical
- `title.default` + `title.template` (`"<Halaman> — JumpoZone"`)
- `keywords` (40+ kata kunci, lihat §3)
- `openGraph` + `twitter` (card `summary_large_image`)
- `robots.googleBot` dengan `max-image-preview: large`, `max-snippet: -1`
- `alternates.canonical: '/'`
- `manifest`, `icons`, `themeColor`
- Slot `verification.google` aktif jika `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` di-set

### 1.3 File konvensi Next.js (App Router)

| File | Tujuan |
|---|---|
| `app/sitemap.ts` | Sitemap dinamis (homepage + `/fasilitas` + setiap `/wisata/[id]` dari Supabase). Statis dengan revalidate 1 jam. |
| `app/robots.ts` | Allow `/`, disallow `/admin`, `/auth`, `/api`. Daftarkan sitemap. |
| `app/manifest.ts` | PWA manifest minimal (nama, theme color, icons). |
| `app/opengraph-image.tsx` | OG image 1200×630 di-generate via `next/og` (tidak butuh asset PNG). |
| `app/twitter-image.tsx` | Re-export dari OG image. |
| `lib/supabase/public.ts` | Klien Supabase read-only untuk sitemap (tanpa `cookies()` → tetap statis). |

### 1.4 Halaman utama (`app/page.tsx`)

- Diubah jadi **Server Component** → konten ter-render di HTML awal (penting untuk crawler).
- Fetch hero/about/wisata dari Supabase saat build/revalidate (`revalidate = 600`s).
- UI interaktif (carousel, animasi) dipindah ke `components/home/HomeClient.tsx`.
- Inject 3 JSON-LD: **WebSite**, **Organization**, **ItemList** destinasi.

### 1.5 Halaman detail wisata (`app/wisata/[id]/page.tsx`)

- `generateMetadata` per destinasi: title `"<Nama> — Tiket, Jam Buka & Ulasan"`, deskripsi dari `wisata.deskripsi` (dipotong ~155 char), keyword spesifik, OG image dari galeri, canonical absolut.
- JSON-LD **TouristAttraction** lengkap: address, geo, opening hours, image gallery, `aggregateRating` + 5 ulasan terbaru sebagai `Review`.
- JSON-LD **BreadcrumbList**.
- Tag `<article>` + `<h1>` (sr-only) memastikan struktur heading valid.

### 1.6 Halaman fasilitas (`app/fasilitas/page.tsx`)

- Title, description, keyword khusus peta fasilitas.
- Canonical `/fasilitas`, OG, BreadcrumbList JSON-LD.
- `<h1 className="sr-only">` untuk struktur heading.

### 1.7 Area privat tidak ter-index

- `app/admin/layout.tsx`, `app/admin/login/layout.tsx`, `app/not-found.tsx` semua punya `robots: { index: false, follow: false }`.
- `app/robots.ts` juga melarang `/admin`, `/auth`, `/api`.

### 1.8 Performa (sinyal SEO)

- `next.config.ts` sudah memakai `images.formats: ['image/avif', 'image/webp']`.
- Server Components mengurangi JS yang dikirim ke client.
- Sitemap & OG image **statis** (terlihat di build log: `○ /sitemap.xml`, `○ /opengraph-image`).

---

## 2. Langkah Deployment di Vercel + Domain `jumpozone.my.id`

Estimasi waktu total: **30–60 menit** untuk live, lalu tunggu propagasi DNS & indexing.

### Langkah 1 — Push ke GitHub

```bash
git status                          # pastikan tidak ada secret di working tree
git checkout -b seo-launch
git add .
git commit -m "feat(seo): JumpoZone metadata, sitemap, robots, JSON-LD"
git push -u origin seo-launch       # atau langsung ke main jika kamu mau
```

### Langkah 2 — Buat project di Vercel

1. Login ke <https://vercel.com/new>.
2. **Import** repo `geotrip` dari GitHub.
3. Framework auto-detect: **Next.js**. Build command & output directory biarkan default.
4. **Environment Variables** (Production + Preview):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | _URL project Supabase kamu_ |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | _anon key Supabase_ |
   | `NEXT_PUBLIC_SITE_URL` | `https://jumpozone.my.id` |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | _kosongkan dulu, isi di Langkah 4_ |

5. Klik **Deploy**. Tunggu sampai status _Ready_ (±1–3 menit).

### Langkah 3 — Hubungkan domain `jumpozone.my.id`

1. Di dashboard project Vercel → **Settings → Domains → Add**.
2. Masukkan `jumpozone.my.id` dan `www.jumpozone.my.id`.
3. Vercel akan menampilkan record DNS. Buka panel registrar `.my.id` (mis. PANDI/Niagahoster/IDwebhost) dan tambahkan:

   - **A record** untuk `@` → `76.76.21.21`
   - **CNAME** untuk `www` → `cname.vercel-dns.com`

   _(Vercel akan menampilkan nilai persis, ikuti saja — kadang nilai A berbeda.)_

4. Set salah satu sebagai **Primary Domain**. Saya sarankan `jumpozone.my.id` (apex), `www` redirect ke apex.
5. Tunggu DNS propagasi (5–60 menit). Cek dengan `dig jumpozone.my.id +short` atau <https://dnschecker.org>.
6. Setelah hijau, sertifikat HTTPS auto-issued oleh Vercel.

### Langkah 4 — Daftar Google Search Console (paling penting!)

Ini yang membuat indexing cepat dalam 24 jam.

1. Buka <https://search.google.com/search-console>.
2. **Add property → URL prefix** → masukkan `https://jumpozone.my.id`.
3. Pilih metode verifikasi **HTML tag**. Salin atribut `content="..."`.
4. Buka Vercel → Settings → Environment Variables → ubah `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` ke nilai tadi → **Redeploy**.
5. Kembali ke Search Console → **Verify**. ✅
6. Sidebar kiri → **Sitemaps** → tambahkan `sitemap.xml` → Submit.
7. Sidebar kiri → **URL Inspection** → tempel `https://jumpozone.my.id/` → **Request Indexing**.
8. Ulangi step 7 untuk:
   - `https://jumpozone.my.id/fasilitas`
   - `https://jumpozone.my.id/wisata/<id-Umbul-Sidomukti>`
   - `https://jumpozone.my.id/wisata/<id-Sam-Poo-Kong>`

   _Quota: 10 URL/hari per property — cukup untuk situs kecil._

### Langkah 5 — Daftar Bing Webmaster Tools (bonus, butuh ±5 menit)

1. <https://www.bing.com/webmasters> → **Import from GSC** (paling cepat).
2. Submit sitemap `https://jumpozone.my.id/sitemap.xml`.

### Langkah 6 — Verifikasi metadata live

Lakukan setelah deploy hijau:

```bash
curl -sI https://jumpozone.my.id/robots.txt
curl -s  https://jumpozone.my.id/robots.txt
curl -s  https://jumpozone.my.id/sitemap.xml | head -40
```

Test rich result & social preview:

- Schema → <https://search.google.com/test/rich-results?url=https%3A%2F%2Fjumpozone.my.id>
- OG → <https://www.opengraph.xyz/url/https%3A%2F%2Fjumpozone.my.id>
- Twitter → login + <https://cards-dev.twitter.com/validator>
- Mobile Friendly → <https://search.google.com/test/mobile-friendly?url=https%3A%2F%2Fjumpozone.my.id>
- PageSpeed → <https://pagespeed.web.dev/?url=https%3A%2F%2Fjumpozone.my.id>

Ekspektasi: Rich Results Test mendeteksi **WebSite**, **Organization**, **ItemList**, dan untuk URL detail: **TouristAttraction** + **BreadcrumbList**.

### Langkah 7 — Backlink awal supaya crawler datang lebih cepat

Sebar URL di properti yang sudah sering dirayapi Google:

- Google Business Profile (jika ada toko/kantor) → tautkan website.
- Bio Instagram / TikTok / Twitter / LinkedIn dengan link `https://jumpozone.my.id`.
- Posting di forum/komunitas wisata (Kaskus, Reddit r/indonesia, Quora) — natural, jangan spam.
- Daftarkan ke direktori lokal: <https://www.semaranghebat.com>, dll (opsional).
- Buat 1 artikel di Medium/dev.to yang menyebut & link ke domain.

### Langkah 8 — Monitor (24 jam pertama)

- GSC → **Pages → Indexed** harus naik dari 0.
- GSC → **Performance** mulai menampilkan impresi 24–72 jam kemudian.
- GSC → **Core Web Vitals**: cek setelah ±3 hari (butuh data lapangan).
- Cek `site:jumpozone.my.id` di Google. Sekitar 6–24 jam setelah submit, hasilnya muncul.

---

## 3. Daftar Kata Kunci Target (sudah dipasang di metadata)

### Tier 1 — Brand & easy win (rangking dalam 1–7 hari)

- `JumpoZone`
- `Jumpo Zone`
- `jumpozone.my.id`

### Tier 2 — Destinasi spesifik (target utama)

**Umbul Sidomukti**
- `Umbul Sidomukti`
- `wisata Umbul Sidomukti`
- `Umbul Sidomukti Semarang`
- `tiket Umbul Sidomukti`
- `harga tiket Umbul Sidomukti 2026`
- `jam buka Umbul Sidomukti`
- `kolam renang Umbul Sidomukti`
- `lokasi Umbul Sidomukti`

**Sam Poo Kong**
- `Sam Poo Kong`
- `Klenteng Sam Poo Kong`
- `wisata Sam Poo Kong`
- `tiket Sam Poo Kong`
- `jam buka Sam Poo Kong`
- `sejarah Sam Poo Kong`

### Tier 3 — Kota & generic (kompetitif, butuh waktu)

- `wisata Semarang`, `pariwisata Semarang`, `tempat wisata Semarang`
- `destinasi wisata Semarang`, `liburan Semarang`
- `wisata Jawa Tengah`, `wisata Kabupaten Semarang`

### Tier 4 — Niche/teknikal (low competition, win cepat)

- `WebGIS pariwisata`, `peta wisata Semarang`, `peta fasilitas Semarang`
- `fasilitas Umbul Sidomukti`, `fasilitas Sam Poo Kong`
- `rekomendasi wisata Semarang`, `wisata keluarga Semarang`

> **Tips ranking lebih cepat untuk tier 2 & 3**:
> 1. Pastikan setiap destinasi punya **deskripsi 300+ kata** unik yang membahas kata kunci secara natural (bukan keyword stuffing).
> 2. Update `harga_tiket` & `jam_buka` di admin panel → karena `revalidate=600`, perubahan otomatis terbit dalam 10 menit.
> 3. Upload **3+ foto galeri** per destinasi (gambar = sinyal kuat untuk SEO travel).
> 4. Ajak pengunjung kasih ulasan di tiap halaman wisata → `aggregateRating` naik → CTR di hasil pencarian naik (bintang muncul di SERP).

---

## 4. Checklist Final (sebelum buka publik)

- [ ] `npm run build` di lokal sukses tanpa error
- [ ] Semua env var di Vercel sudah di-set (production + preview)
- [ ] Domain `jumpozone.my.id` aktif dengan HTTPS
- [ ] `https://jumpozone.my.id/robots.txt` mengarah ke sitemap dengan host yang benar
- [ ] `https://jumpozone.my.id/sitemap.xml` berisi homepage + fasilitas + semua wisata
- [ ] Google Search Console verified, sitemap submitted, 4 URL utama _Request Indexing_
- [ ] Rich Results Test tidak menampilkan error pada `/` dan `/wisata/<id>`
- [ ] Lighthouse SEO score ≥ 95 (cek via Chrome DevTools atau PageSpeed)
- [ ] Konten Umbul Sidomukti & Sam Poo Kong sudah final di admin (deskripsi panjang, foto, jam, tiket)
- [ ] Backlink awal disebar (medsos / Medium / komunitas)

---

## 5. Maintenance (setelah live)

- Tambah destinasi baru via admin → otomatis masuk sitemap dalam 1 jam.
- Edit harga/jam buka → halaman otomatis update dalam 10 menit (`revalidate`).
- Setiap menambah halaman baru, jalankan kembali _URL Inspection → Request Indexing_ di GSC.
- Pantau **GSC → Performance** mingguan. Klik query yang sudah ada impresi tapi posisi >10 → optimasi konten halaman terkait.
- Setelah 30 hari, evaluasi: tambahkan blog `/blog/...` (artikel "10 wisata Semarang", "panduan ke Sam Poo Kong") untuk meningkatkan otoritas topik.

Selamat launching JumpoZone. 🚀
