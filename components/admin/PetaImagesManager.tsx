'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, GripVertical, Upload, X } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

interface PetaImagesManagerProps {
  wisataId: string;
}

export function PetaImagesManager({ wisataId }: PetaImagesManagerProps) {
  const [images, setImages] = useState<Tables<'wisata_peta_images'>[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchImages();
  }, [wisataId]);

  async function fetchImages() {
    const { data, error } = await supabase
      .from('wisata_peta_images')
      .select('*')
      .eq('wisata_id', wisataId)
      .order('image_order');

    if (!error && data) {
      setImages(data);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        toast.error(`${file.name} bukan file gambar`);
      }
      return isValid;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      toast.error('Pilih file gambar terlebih dahulu');
      return;
    }

    setUploading(true);
    const maxOrder = images.length > 0 ? Math.max(...images.map(img => img.image_order)) : -1;
    let successCount = 0;

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${wisataId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log('Uploading file:', fileName, 'Size:', file.size);

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('wisata-images')
          .upload(`peta/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Gagal upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        console.log('Upload success:', uploadData);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('wisata-images')
          .getPublicUrl(`peta/${fileName}`);

        console.log('Public URL:', publicUrl);

        // Save to database
        const { error: dbError } = await supabase
          .from('wisata_peta_images')
          .insert({
            wisata_id: wisataId,
            image_url: publicUrl,
            image_order: maxOrder + i + 1,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast.error(`Gagal menyimpan ${file.name}: ${dbError.message}`);
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} gambar berhasil diupload`);
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchImages();
      } else {
        toast.error('Tidak ada gambar yang berhasil diupload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Terjadi kesalahan saat upload');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm('Hapus gambar ini?')) return;

    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/wisata-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        
        // Delete from storage
        await supabase.storage
          .from('wisata-images')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('wisata_peta_images')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Gagal menghapus gambar');
      } else {
        toast.success('Gambar berhasil dihapus');
        fetchImages();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  }

  async function handleReorder(id: string, direction: 'up' | 'down') {
    const currentIndex = images.findIndex(img => img.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [newImages[newIndex], newImages[currentIndex]];

    // Update order in database
    const updates = newImages.map((img, index) => ({
      id: img.id,
      image_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('wisata_peta_images')
        .update({ image_order: update.image_order })
        .eq('id', update.id);
    }

    fetchImages();
    toast.success('Urutan berhasil diubah');
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-semibold mb-4">Gambar Peta Lokasi</h3>
        
        {/* Upload Files */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="peta-files">Upload Gambar Peta</Label>
            <div className="flex gap-2 mt-2">
              <Input
                ref={fileInputRef}
                id="peta-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="flex-1"
              />
              <Button 
                onClick={handleUpload} 
                disabled={uploading || selectedFiles.length === 0}
                className="flex-shrink-0"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pilih satu atau beberapa gambar (JPG, PNG, WebP)
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>File yang dipilih ({selectedFiles.length})</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSelectedFile(index)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Images List */}
        <div className="space-y-3">
          {images.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Belum ada gambar peta
            </p>
          ) : (
            images.map((image, index) => (
              <div
                key={image.id}
                className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-shrink-0">
                  <img
                    src={image.image_url}
                    alt={`Peta ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Gambar {index + 1}</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{image.image_url}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(image.id, 'up')}
                    disabled={index === 0}
                    title="Pindah ke atas"
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(image.id, 'down')}
                    disabled={index === images.length - 1}
                    title="Pindah ke bawah"
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id, image.image_url)}
                    title="Hapus gambar"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
