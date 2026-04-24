'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type HeroSection = Tables<'hero_section'>;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HeroImageUpload } from './HeroImageUpload';
import { toast } from 'sonner';

interface HeroFormProps {
  hero: HeroSection | null;
  onSuccess: () => void;
}

export function HeroForm({ hero, onSuccess }: HeroFormProps) {
  const [title, setTitle] = useState(hero?.title || '');
  const [subtitle, setSubtitle] = useState(hero?.subtitle || '');
  const [description, setDescription] = useState(hero?.description || '');
  const [images, setImages] = useState<string[]>(hero?.images || []);
  const [displayOrder, setDisplayOrder] = useState(hero?.display_order || 0);
  const [isActive, setIsActive] = useState(hero?.is_active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!title.trim() || !subtitle.trim() || !description.trim()) {
        throw new Error('Semua field wajib diisi');
      }

      if (images.length === 0) {
        throw new Error('Minimal 1 gambar harus diupload');
      }

      const supabase = createClient();

      const data = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        images,
        display_order: displayOrder,
        is_active: isActive,
      };

      if (hero) {
        // Update existing hero
        const { error } = await supabase
          .from('hero_section')
          .update(data)
          .eq('id', hero.id);

        if (error) throw error;
        toast.success('Hero section berhasil diperbarui');
      } else {
        // Create new hero
        const { error } = await supabase.from('hero_section').insert(data);

        if (error) throw error;
        toast.success('Hero section berhasil ditambahkan');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving hero:', error);
      toast.error(error.message || 'Gagal menyimpan hero section');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Judul *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="JELAJAHI"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayOrder">Urutan Tampil *</Label>
          <Input
            id="displayOrder"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            placeholder="0"
            required
          />
          <p className="text-xs text-muted-foreground">
            Angka lebih kecil = prioritas lebih tinggi
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle *</Label>
        <Input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="UMBUL SIDOMUKTI & SAM POO KONG"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Temukan destinasi wisata terbaik..."
          rows={3}
          required
        />
      </div>

      <HeroImageUpload images={images} onImagesChange={setImages} />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Aktifkan hero section ini
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : hero ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
