# Admin User Seed Guide

## Cara 1: Menggunakan Supabase Dashboard (Recommended)

### Step 1: Buat User di Authentication
1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project GeoTrip
3. Klik **Authentication** → **Users**
4. Klik **Add user** → **Create new user**
5. Isi form:
   - **Email**: `admin@geotrip.com`
   - **Password**: `Admin123!@#` (atau password pilihan Anda)
   - **Auto Confirm User**: ✅ Centang (agar langsung aktif)
6. Klik **Create user**
7. Copy **User ID** yang muncul (format: UUID)

### Step 2: Set Role Admin di Database
1. Klik **SQL Editor** di sidebar
2. Jalankan query berikut (ganti `USER_ID` dengan ID dari step 1):

```sql
-- Update profile dengan role admin
UPDATE profiles 
SET 
  role = 'admin',
  full_name = 'Administrator GeoTrip',
  updated_at = NOW()
WHERE id = 'USER_ID';

-- Jika profile belum ada, insert manual:
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  'USER_ID',
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

3. Klik **Run** atau tekan `Ctrl+Enter`

### Step 3: Verifikasi
```sql
-- Cek apakah admin sudah terbuat
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE role = 'admin';
```

### Step 4: Login
1. Buka: http://localhost:3000/admin/login
2. Login dengan:
   - **Email**: `admin@geotrip.com`
   - **Password**: Password yang Anda set di Step 1

---

## Cara 2: Menggunakan SQL + Manual Auth Setup

Jika Anda sudah punya user di Supabase Auth, tinggal update role-nya:

```sql
-- Cari user ID dari email
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@geotrip.com';

-- Update profile dengan role admin (ganti USER_ID)
UPDATE profiles 
SET role = 'admin'
WHERE id = 'USER_ID';
```

---

## Cara 3: Menggunakan Supabase CLI (Advanced)

### Prerequisites
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### Create Admin User
```bash
# Create user via CLI
supabase auth users create admin@geotrip.com --password Admin123!@#

# Get user ID
supabase auth users list | grep admin@geotrip.com

# Update profile (via SQL)
supabase db execute "UPDATE profiles SET role = 'admin' WHERE email = 'admin@geotrip.com';"
```

---

## Cara 4: Menggunakan Script TypeScript

Jika Anda punya **Service Role Key** (secret key dengan full access):

### Setup
1. Tambahkan ke `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Install dependencies:
```bash
npm install -D ts-node
```

3. Run script:
```bash
npx ts-node scripts/seed-admin.ts
```

Script akan:
- ✅ Create user di Supabase Auth
- ✅ Auto-confirm email
- ✅ Create/update profile dengan role admin
- ✅ Verify setup

---

## Default Admin Credentials

**Email**: `admin@geotrip.com`  
**Password**: `Admin123!@#`

⚠️ **PENTING**: Ganti password setelah login pertama kali!

---

## Troubleshooting

### Error: "User already exists"
User sudah ada di auth, tinggal update role:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@geotrip.com';
```

### Error: "Profile not found"
Profile belum dibuat, insert manual:
```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Administrator GeoTrip', 'admin'
FROM auth.users
WHERE email = 'admin@geotrip.com';
```

### Error: "Cannot access /admin"
Cek role di database:
```sql
SELECT p.id, p.email, p.role, u.email as auth_email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'admin@geotrip.com';
```

Pastikan `role = 'admin'` (bukan NULL atau 'user').

---

## Verifikasi Admin Setup

```sql
-- Cek admin user
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';
```

Expected output:
- ✅ `role = 'admin'`
- ✅ `email_confirmed_at` tidak NULL
- ✅ Email match di profiles dan auth.users

---

## Security Notes

1. **Ganti password default** setelah login pertama
2. **Jangan commit** credentials ke git
3. **Service Role Key** hanya untuk development/seeding
4. **Production**: Gunakan Supabase Dashboard untuk manage admin users
5. **Enable 2FA** untuk admin accounts (jika tersedia)

---

## Next Steps

Setelah admin user dibuat:

1. ✅ Login di `/admin/login`
2. ✅ Ganti password
3. ✅ Test semua fitur admin panel
4. ✅ Buat admin users lain jika diperlukan
5. ✅ Setup backup admin account

---

**Created**: 24 April 2026  
**Module**: 8 - Admin Panel  
**Status**: Ready to use
