'use client';

import { useState, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface HeroImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function HeroImageUpload({ images, onImagesChange }: HeroImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} bukan file gambar`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} terlalu besar (max 5MB)`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `hero/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('hero-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Gagal upload ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('hero-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} gambar berhasil diupload`);
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error('Gagal upload gambar');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  }

  async function handleRemoveImage(index: number, imageUrl: string) {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('hero-images') + 1).join('/');

      if (filePath && filePath.startsWith('hero/')) {
        const supabase = createClient();
        const { error } = await supabase.storage
          .from('hero-images')
          .remove([filePath]);

        if (error) {
          console.error('Delete error:', error);
          // Continue anyway to remove from list
        }
      }

      // Remove from list
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.success('Gambar berhasil dihapus');
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from list even if storage delete fails
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      toast.warning('Gambar dihapus dari list (mungkin gagal hapus dari storage)');
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Gambar Hero *</Label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            className="text-white"
          >
            <Upload className="h-4 w-4 mr-2 text-white" />
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Format: JPEG, PNG, WebP. Max 5MB per file. Bisa upload multiple.
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <Label>Gambar yang Diupload ({images.length}):</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-video rounded-lg overflow-hidden border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index, img)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/60 text-white text-xs px-2 py-1 rounded truncate">
                    Gambar {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Belum ada gambar. Upload minimal 1 gambar.
          </p>
        </div>
      )}
    </div>
  );
}
