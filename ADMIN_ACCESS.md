# Admin Panel Access Guide

## Cara Akses Admin Panel

### URL Login
```
http://localhost:3000/admin/login
```

### Kredensial
Admin menggunakan **email dan password** (bukan Google OAuth seperti user publik).

### Flow Authentication

1. **Akses halaman login**: `/admin/login`
2. **Masukkan kredensial**:
   - Email admin
   - Password admin
3. **Sistem akan memverifikasi**:
   - Autentikasi dengan Supabase
   - Cek role user di tabel `profiles`
   - Hanya user dengan `role = 'admin'` yang bisa akses
4. **Redirect ke dashboard**: `/admin` (dashboard admin)

### Protected Routes

Semua route di bawah `/admin/*` dilindungi kecuali `/admin/login`:

- ✅ `/admin/login` - Publik (untuk login)
- 🔒 `/admin` - Dashboard (protected)
- 🔒 `/admin/wisata` - Kelola Wisata (protected)
- 🔒 `/admin/fasilitas` - Kelola Fasilitas (protected)
- 🔒 `/admin/ulasan` - Moderasi Ulasan (protected)
- 🔒 `/admin/galeri` - Kelola Galeri (protected)
- 🔒 `/admin/znek` - Kelola Konten ZNEK (protected)

### Middleware Protection

File `proxy.ts` menghandle authentication:
- Jika belum login → redirect ke `/admin/login`
- Jika login tapi bukan admin → redirect ke `/admin/login`
- Jika sudah login sebagai admin di `/admin/login` → redirect ke `/admin`

### UI/UX

Admin panel menggunakan:
- **Font**: Geist Sans & Geist Mono (bukan Playfair Display + Inter seperti public site)
- **Components**: 100% shadcn/ui
- **Layout**: Sidebar + Header (berbeda dari public layout)
- **Theme**: Shadcn default theme

### Admin User yang Sudah Ada

✅ **Admin sudah tersedia:**
- Email: `backupwhatsapps099@gmail.com`
- Role: admin
- Status: Active

### Membuat Admin User Baru

**Option 1: Via Helper Function (Recommended)**

1. Buat user via Supabase Dashboard
2. Jalankan SQL:
```sql
SELECT * FROM set_user_as_admin('USER_ID_HERE');
```

**Option 2: Manual SQL**

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

📚 **Lihat dokumentasi lengkap**: `ADMIN_QUICK_START.md`

## Struktur File

```
app/admin/
├── layout.tsx                    # Root layout dengan Geist fonts
├── login/
│   ├── layout.tsx               # Minimal layout untuk login
│   └── page.tsx                 # Login form
└── (dashboard)/                 # Route group untuk protected pages
    ├── layout.tsx               # Dashboard layout dengan sidebar
    ├── page.tsx                 # Dashboard
    ├── wisata/page.tsx
    ├── fasilitas/page.tsx
    ├── ulasan/page.tsx
    ├── galeri/page.tsx
    └── znek/page.tsx
```

## Catatan Penting

- Admin **TIDAK** menggunakan Google OAuth
- Admin **HARUS** login dengan email/password
- Role `admin` di tabel `profiles` wajib ada
- UI admin sepenuhnya terpisah dari public site
