'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type KontenZnek = Tables<'konten_znek'>;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ZnekEditorProps {
  znek: KontenZnek;
  onSuccess: () => void;
}

export function ZnekEditor({ znek, onSuccess }: ZnekEditorProps) {
  const [formData, setFormData] = useState({
    judul: znek.judul,
    konten: znek.konten,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul tidak boleh kosong';
    }

    if (!formData.konten.trim()) {
      newErrors.konten = 'Konten tidak boleh kosong';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('konten_znek')
        .update({
          judul: formData.judul.trim(),
          konten: formData.konten.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', znek.id);

      if (error) throw error;

      toast.success('Konten ZNEK berhasil diperbarui');
      onSuccess();
    } catch (error) {
      console.error('Error updating ZNEK:', error);
      toast.error('Gagal memperbarui konten ZNEK');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="judul">Judul</Label>
        <Input
          id="judul"
          value={formData.judul}
          onChange={(e) => handleChange('judul', e.target.value)}
          placeholder="Judul konten ZNEK..."
          required
        />
        {errors.judul && (
          <p className="text-sm text-destructive">{errors.judul}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="konten">Konten</Label>
        <Textarea
          id="konten"
          value={formData.konten}
          onChange={(e) => handleChange('konten', e.target.value)}
          rows={15}
          className="font-mono text-sm"
          placeholder="Masukkan konten ZNEK dalam format HTML atau teks biasa..."
          required
        />
        {errors.konten && (
          <p className="text-sm text-destructive">{errors.konten}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Anda dapat menggunakan HTML untuk formatting (paragraf, heading, list, dll)
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Preview:</h3>
        <div
          className="prose prose-sm max-w-none p-4 bg-muted rounded-lg"
          dangerouslySetInnerHTML={{ __html: formData.konten }}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Perbarui'}
        </Button>
      </div>
    </form>
  );
}
