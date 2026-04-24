'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface GaleriUploadProps {
  wisataList: { id: string; nama: string }[];
  onSuccess: () => void;
}

export function GaleriUpload({ wisataList, onSuccess }: GaleriUploadProps) {
  const [wisataId, setWisataId] = useState(wisataList[0]?.id || '');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    setError('');

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format file harus JPEG, PNG, atau WebP');
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      setError('Pilih file gambar terlebih dahulu');
      return;
    }

    if (!wisataId) {
      setError('Pilih wisata terlebih dahulu');
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();

      const fileExt = file.name.split('.').pop();
      const fileName = `${wisataId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('wisata-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('wisata-images').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('wisata_galeri').insert({
        wisata_id: wisataId,
        image_url: publicUrl,
        caption: caption.trim() || null,
      });

      if (dbError) throw dbError;

      toast.success('Gambar berhasil diunggah');
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wisata">Wisata</Label>
        <Select value={wisataId} onValueChange={setWisataId}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih wisata" />
          </SelectTrigger>
          <SelectContent>
            {wisataList.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Gambar</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="cursor-pointer"
            required
          />
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Format: JPEG, PNG, WebP. Maksimal 5MB.
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {preview && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="caption">Caption (Opsional)</Label>
        <Input
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Deskripsi gambar..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isUploading || !file}>
          {isUploading ? 'Mengunggah...' : 'Upload'}
        </Button>
      </div>
    </form>
  );
}
