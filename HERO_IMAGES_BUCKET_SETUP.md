# Hero Images Bucket Setup Guide

## Setup Supabase Storage Bucket untuk Hero Images

Hero section sekarang menggunakan Supabase Storage untuk menyimpan gambar, bukan hardcoded URL.

### Step 1: Buat Bucket via Supabase Dashboard

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project GeoTrip
3. Klik **Storage** di sidebar
4. Klik **New bucket**
5. Isi form:
   - **Name**: `hero-images`
   - **Public bucket**: ✅ Centang (agar gambar bisa diakses publik)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`
6. Klik **Create bucket**

### Step 2: Setup RLS Policies

Setelah bucket dibuat, setup policies:

#### Policy 1: Public Read
```sql
-- Allow public to view images
CREATE POLICY "Public can view hero images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-images');
```

#### Policy 2: Admin Upload
```sql
-- Allow admin to upload images
CREATE POLICY "Admin can upload hero images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### Policy 3: Admin Update
```sql
-- Allow admin to update images
CREATE POLICY "Admin can update hero images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### Policy 4: Admin Delete
```sql
-- Allow admin to delete images
CREATE POLICY "Admin can delete hero images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Step 3: Migrate Existing Data (Optional)

Jika sudah ada hero section dengan URL hardcoded, perlu upload manual:

1. Download gambar dari URL lama
2. Login sebagai admin
3. Buka `/admin/hero`
4. Edit hero section
5. Upload gambar baru via form
6. Hapus gambar lama (jika ada)
7. Save

### Step 4: Verify Setup

Test upload gambar:

1. Login sebagai admin
2. Buka `/admin/hero`
3. Klik **Tambah Hero** atau **Edit** existing hero
4. Upload gambar via file input
5. Pastikan gambar muncul di preview
6. Save dan cek di homepage

### Struktur Folder di Bucket

```
hero-images/
└── hero/
    ├── 1234567890-abc123.jpg
    ├── 1234567891-def456.webp
    └── 1234567892-ghi789.png
```

Semua gambar hero disimpan di folder `hero/` dengan nama file unique (timestamp + random string).

### Features

✅ **Upload Multiple**: Bisa upload banyak gambar sekaligus
✅ **Preview**: Preview gambar sebelum save
✅ **Delete**: Hapus gambar dari storage dan database
✅ **Validation**: 
  - File type: JPEG, PNG, WebP
  - File size: Max 5MB
✅ **Auto-cleanup**: Gambar dihapus dari storage saat dihapus dari list

### Troubleshooting

#### Error: "Bucket not found"
- Pastikan bucket `hero-images` sudah dibuat
- Cek nama bucket (case-sensitive)

#### Error: "Permission denied"
- Pastikan RLS policies sudah dibuat
- Cek role user adalah `admin`
- Cek policies menggunakan `auth.uid()` dengan benar

#### Error: "File too large"
- Max file size: 5MB
- Compress gambar sebelum upload
- Gunakan format WebP untuk ukuran lebih kecil

#### Gambar tidak muncul di homepage
- Cek bucket adalah **public**
- Cek URL gambar di database
- Cek browser console untuk error CORS

### Migration dari URL Hardcoded

Jika data lama menggunakan URL hardcoded (contoh: `/images/gambar1.webp`):

**Option 1: Manual Upload**
1. Download gambar dari `/public/images/`
2. Upload via admin panel
3. Update hero section

**Option 2: Bulk Upload via Script**
```typescript
// Script untuk migrate gambar lama
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(URL, KEY);

async function migrateImages() {
  const publicDir = './public/images';
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    
    const { data, error } = await supabase.storage
      .from('hero-images')
      .upload(`hero/${file}`, fileBuffer);
    
    if (error) {
      console.error(`Failed to upload ${file}:`, error);
    } else {
      console.log(`Uploaded ${file}`);
    }
  }
}

migrateImages();
```

### Best Practices

1. **Optimize Images**: Compress sebelum upload
2. **Use WebP**: Format modern dengan ukuran lebih kecil
3. **Consistent Naming**: Gunakan auto-generated names
4. **Regular Cleanup**: Hapus gambar yang tidak digunakan
5. **Backup**: Backup bucket secara berkala

---

**Status**: ✅ Ready to use
**Bucket Name**: `hero-images`
**Max File Size**: 5MB
**Allowed Types**: JPEG, PNG, WebP
