'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ZnekSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  display_order: number;
  is_active: boolean;
}

interface ZnekSectionFormProps {
  section?: ZnekSection | null;
  onSuccess: () => void;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'introduction', label: 'Pendahuluan' },
  { value: 'methodology', label: 'Metodologi' },
  { value: 'impact', label: 'Dampak Ekonomi' },
  { value: 'recommendation', label: 'Rekomendasi' },
  { value: 'conclusion', label: 'Kesimpulan' },
  { value: 'cta', label: 'Call to Action' },
];

export function ZnekSectionForm({ section, onSuccess }: ZnekSectionFormProps) {
  const [formData, setFormData] = useState({
    section_type: section?.section_type || 'introduction',
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    content: section?.content || '',
    display_order: section?.display_order?.toString() || '1',
    is_active: section?.is_active ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Title wajib diisi');
      }

      const supabase = createClient();
      const data = {
        section_type: formData.section_type,
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        content: formData.content.trim() || null,
        display_order: parseInt(formData.display_order) || 1,
        is_active: formData.is_active,
      };

      if (section) {
        const { error } = await supabase
          .from('znek_sections')
          .update(data)
          .eq('id', section.id);

        if (error) throw error;
        toast.success('Section berhasil diperbarui');
      } else {
        const { error } = await supabase.from('znek_sections').insert(data);

        if (error) throw error;
        toast.success('Section berhasil ditambahkan');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving section:', error);
      toast.error(error.message || 'Gagal menyimpan section');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="section_type">Tipe Section *</Label>
        <Select
          value={formData.section_type}
          onValueChange={(value) => handleChange('section_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe section" />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Judul section"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Subtitle (opsional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Konten section"
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="display_order">Display Order *</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => handleChange('display_order', e.target.value)}
            placeholder="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_active">Status</Label>
          <Select
            value={formData.is_active.toString()}
            onValueChange={(value) => handleChange('is_active', value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Aktif</SelectItem>
              <SelectItem value="false">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : section ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
