# Admin User Seed - MCP Supabase Guide

## ✅ Helper Functions Sudah Dibuat

Saya sudah membuat 2 helper functions di database:

1. **`set_user_as_admin(user_id)`** - Set user sebagai admin
2. **`list_admin_users()`** - List semua admin users

---

## 🚀 Quick Start: Buat Admin User

### Step 1: Buat User di Supabase Dashboard

**Karena Supabase Auth tidak bisa dibuat via SQL**, Anda harus buat user dulu via Dashboard:

1. Buka: https://supabase.com/dashboard
2. Pilih project GeoTrip
3. **Authentication** → **Users** → **Add user**
4. Isi:
   - Email: `admin@geotrip.com`
   - Password: `Admin123!@#`
   - ✅ Auto Confirm User
5. **Copy User ID** yang muncul (format UUID)

### Step 2: Set User Sebagai Admin (via MCP)

Setelah user dibuat, jalankan function untuk set sebagai admin:

```sql
-- Ganti 'USER_ID_HERE' dengan UUID dari Step 1
SELECT * FROM set_user_as_admin('USER_ID_HERE');
```

**Contoh:**
```sql
SELECT * FROM set_user_as_admin('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
```

**Output:**
```
id                                   | email              | full_name              | role  | message
-------------------------------------|--------------------|-----------------------|-------|---------------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890 | admin@geotrip.com  | Administrator GeoTrip | admin | User successfully set as admin
```

### Step 3: Verifikasi Admin

```sql
-- List semua admin users
SELECT * FROM list_admin_users();
```

### Step 4: Login

Buka: http://localhost:3000/admin/login

Login dengan:
- **Email**: `admin@geotrip.com`
- **Password**: `Admin123!@#`

---

## 📋 Alternative: Set Existing User as Admin

Jika Anda sudah punya user yang login via Google OAuth, bisa dijadikan admin:

### 1. Cari User ID dari Email

```sql
-- Cari user berdasarkan email
SELECT id, email, raw_user_meta_data->>'full_name' as name
FROM auth.users
WHERE email = 'your-email@gmail.com';
```

### 2. Set Sebagai Admin

```sql
-- Ganti dengan user ID yang ditemukan
SELECT * FROM set_user_as_admin('USER_ID_HERE');
```

### 3. Verifikasi

```sql
SELECT * FROM list_admin_users();
```

---

## 🔍 Useful Queries

### Cek Semua Users

```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;
```

### Cek Profile Specific User

```sql
SELECT * FROM profiles 
WHERE email = 'admin@geotrip.com';
```

### Update Role Manual (jika function tidak work)

```sql
UPDATE profiles 
SET 
  role = 'admin',
  full_name = 'Administrator GeoTrip',
  updated_at = NOW()
WHERE email = 'admin@geotrip.com';
```

### Insert Profile Manual (jika belum ada)

```sql
-- Ganti USER_ID dengan ID dari auth.users
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  'USER_ID_HERE',
  'admin@geotrip.com',
  'Administrator GeoTrip',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  full_name = 'Administrator GeoTrip',
  updated_at = NOW();
```

---

## 🛠️ Troubleshooting

### Error: "User not found in auth.users"

User belum dibuat di Supabase Auth. Buat dulu via Dashboard (Step 1).

### Error: "Profile already exists"

Tidak masalah, function akan update existing profile dengan role admin.

### Error: "Cannot login"

Cek:
1. Email confirmed? 
   ```sql
   SELECT email, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'admin@geotrip.com';
   ```

2. Role sudah admin?
   ```sql
   SELECT email, role 
   FROM profiles 
   WHERE email = 'admin@geotrip.com';
   ```

3. Password benar? Reset via Dashboard jika lupa.

### Error: "Access denied to /admin"

Cek middleware di `proxy.ts` dan pastikan role check benar:

```sql
-- Verifikasi role
SELECT 
  p.id,
  p.email,
  p.role,
  u.email as auth_email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'admin@geotrip.com';
```

Pastikan `role = 'admin'` (case-sensitive).

---

## 🔐 Security Best Practices

1. **Ganti password default** setelah login pertama
2. **Jangan share** admin credentials
3. **Gunakan strong password** (min 12 karakter, mixed case, numbers, symbols)
4. **Limit admin users** - hanya buat yang benar-benar perlu
5. **Audit admin actions** - track siapa yang melakukan apa
6. **Backup admin account** - buat minimal 2 admin users

---

## 📊 Admin User Management

### Buat Admin Baru

```sql
-- 1. Buat user via Dashboard dulu
-- 2. Set sebagai admin
SELECT * FROM set_user_as_admin('NEW_USER_ID');
```

### Revoke Admin Access

```sql
UPDATE profiles 
SET role = 'user'
WHERE email = 'user@example.com';
```

### Delete Admin User

```sql
-- 1. Revoke admin role dulu
UPDATE profiles SET role = 'user' WHERE email = 'admin@geotrip.com';

-- 2. Delete via Dashboard: Authentication → Users → Delete
-- ATAU via SQL (hati-hati!):
DELETE FROM auth.users WHERE email = 'admin@geotrip.com';
```

---

## 📝 Summary

**Helper Functions:**
- ✅ `set_user_as_admin(user_id)` - Set user as admin
- ✅ `list_admin_users()` - List all admins

**Steps:**
1. Buat user via Supabase Dashboard
2. Copy user ID
3. Run: `SELECT * FROM set_user_as_admin('USER_ID');`
4. Verify: `SELECT * FROM list_admin_users();`
5. Login: http://localhost:3000/admin/login

**Default Credentials:**
- Email: `admin@geotrip.com`
- Password: `Admin123!@#`

⚠️ **Ganti password setelah login pertama!**

---

**Created**: 24 April 2026  
**Module**: 8 - Admin Panel  
**Migration**: `create_admin_helper_function`  
**Status**: ✅ Ready to use
