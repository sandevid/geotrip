# 🚀 Admin Quick Start Guide

## ✅ Admin User Sudah Ada!

Saat ini sudah ada **1 admin user** di database:

**Email**: `backupwhatsapps099@gmail.com`  
**Name**: Backup WhatsApp  
**Role**: admin  
**Last Login**: 24 April 2026

---

## 🔑 Login Sekarang

1. Buka: **http://localhost:3000/admin/login**
2. Login dengan email: `backupwhatsapps099@gmail.com`
3. Masukkan password Anda

---

## ➕ Tambah Admin Baru

### Option 1: Via Supabase Dashboard (Recommended)

1. **Buat User Baru**
   - Buka: https://supabase.com/dashboard
   - Authentication → Users → Add user
   - Email: `admin@geotrip.com`
   - Password: `Admin123!@#`
   - ✅ Auto Confirm User
   - Copy **User ID**

2. **Set Sebagai Admin**
   
   Jalankan SQL ini (ganti `USER_ID`):
   ```sql
   SELECT * FROM set_user_as_admin('USER_ID_HERE');
   ```

3. **Verifikasi**
   ```sql
   SELECT * FROM list_admin_users();
   ```

### Option 2: Promote Existing User

Jika user sudah ada (misalnya login via Google):

```sql
-- 1. Cari user ID
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- 2. Set sebagai admin (ganti USER_ID)
SELECT * FROM set_user_as_admin('USER_ID_HERE');

-- 3. Verifikasi
SELECT * FROM list_admin_users();
```

---

## 📋 Useful Commands

### List All Admin Users
```sql
SELECT * FROM list_admin_users();
```

### Check Specific User
```sql
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'admin@geotrip.com';
```

### Revoke Admin Access
```sql
UPDATE profiles 
SET role = 'user' 
WHERE email = 'user@example.com';
```

### Manual Role Update
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

---

## 🎯 Admin Panel Features

Setelah login, Anda bisa akses:

- **Dashboard** (`/admin`) - Stats & recent reviews
- **Kelola Wisata** (`/admin/wisata`) - CRUD destinations
- **Kelola Fasilitas** (`/admin/fasilitas`) - CRUD facilities
- **Moderasi Ulasan** (`/admin/ulasan`) - Delete reviews
- **Kelola Galeri** (`/admin/galeri`) - Upload/delete images
- **Kelola ZNEK** (`/admin/znek`) - Edit ZNEK content

---

## 🔧 Helper Functions Available

Saya sudah membuat 2 helper functions:

1. **`set_user_as_admin(user_id UUID)`**
   - Set user sebagai admin
   - Auto-create/update profile
   - Returns: user details + success message

2. **`list_admin_users()`**
   - List semua admin users
   - Returns: id, email, name, role, created_at, last_sign_in

---

## 📚 Full Documentation

- **ADMIN_SEED_MCP.md** - Detailed MCP Supabase guide
- **ADMIN_SEED.md** - Multiple methods (Dashboard, CLI, Script)
- **ADMIN_ACCESS.md** - Authentication flow & structure
- **MODULE_8_COMPLETION.md** - Complete implementation details

---

## ⚠️ Important Notes

1. **User harus dibuat via Supabase Auth** (Dashboard/CLI/API)
2. **SQL hanya untuk set role**, bukan create user
3. **Ganti password default** setelah login pertama
4. **Minimal 2 admin users** untuk backup
5. **Test login** sebelum deploy production

---

## 🆘 Troubleshooting

**Cannot login?**
```sql
-- Check user exists and confirmed
SELECT email, email_confirmed_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'admin@geotrip.com';

-- Check role is admin
SELECT email, role 
FROM profiles 
WHERE email = 'admin@geotrip.com';
```

**Access denied?**
- Pastikan `role = 'admin'` (case-sensitive)
- Check `proxy.ts` middleware
- Clear browser cache & cookies

**Profile not found?**
```sql
-- Create profile manually
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Admin User', 'admin'
FROM auth.users
WHERE email = 'admin@geotrip.com';
```

---

**Current Admin**: backupwhatsapps099@gmail.com  
**Status**: ✅ Ready to use  
**Login URL**: http://localhost:3000/admin/login
