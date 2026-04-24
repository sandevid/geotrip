'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type AboutSection = Tables<'about_section'>;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AboutFormProps {
  about: AboutSection;
  onSuccess: () => void;
}

export function AboutForm({ about, onSuccess }: AboutFormProps) {
  const [title, setTitle] = useState(about.title);
  const [content, setContent] = useState(about.content);
  const [isActive, setIsActive] = useState(about.is_active ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!title.trim() || !content.trim()) {
        throw new Error('Semua field wajib diisi');
      }

      const supabase = createClient();

      const { error } = await supabase
        .from('about_section')
        .update({
          title: title.trim(),
          content: content.trim(),
          is_active: isActive,
        })
        .eq('id', about.id);

      if (error) throw error;

      toast.success('About section berhasil diperbarui');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving about:', error);
      toast.error(error.message || 'Gagal menyimpan about section');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tentang GeoTrip"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Konten *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis konten about section..."
          rows={10}
          required
        />
        <p className="text-xs text-muted-foreground">
          Gunakan enter untuk membuat paragraf baru
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Aktifkan about section ini
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Perbarui'}
        </Button>
      </div>
    </form>
  );
}
