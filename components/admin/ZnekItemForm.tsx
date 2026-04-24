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

interface ZnekItem {
  id: string;
  section_id: string;
  item_type: string;
  title: string;
  description: string;
  icon_number: number | null;
  display_order: number;
  is_active: boolean;
}

interface ZnekItemFormProps {
  item?: ZnekItem | null;
  sectionId: string;
  onSuccess: () => void;
}

const ITEM_TYPES = [
  { value: 'methodology', label: 'Metodologi' },
  { value: 'impact_point', label: 'Poin Dampak' },
  { value: 'recommendation', label: 'Rekomendasi' },
];

export function ZnekItemForm({ item, sectionId, onSuccess }: ZnekItemFormProps) {
  const [formData, setFormData] = useState({
    item_type: item?.item_type || 'methodology',
    title: item?.title || '',
    description: item?.description || '',
    icon_number: item?.icon_number?.toString() || '',
    display_order: item?.display_order?.toString() || '1',
    is_active: item?.is_active ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title dan description wajib diisi');
      }

      const supabase = createClient();
      const data = {
        section_id: sectionId,
        item_type: formData.item_type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon_number: formData.icon_number ? parseInt(formData.icon_number) : null,
        display_order: parseInt(formData.display_order) || 1,
        is_active: formData.is_active,
      };

      if (item) {
        const { error } = await supabase
          .from('znek_items')
          .update(data)
          .eq('id', item.id);

        if (error) throw error;
        toast.success('Item berhasil diperbarui');
      } else {
        const { error } = await supabase.from('znek_items').insert(data);

        if (error) throw error;
        toast.success('Item berhasil ditambahkan');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving item:', error);
      toast.error(error.message || 'Gagal menyimpan item');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item_type">Tipe Item *</Label>
        <Select
          value={formData.item_type}
          onValueChange={(value) => handleChange('item_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe item" />
          </SelectTrigger>
          <SelectContent>
            {ITEM_TYPES.map((type) => (
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
          placeholder="Judul item"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Deskripsi item"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon_number">Icon Number</Label>
          <Input
            id="icon_number"
            type="number"
            value={formData.icon_number}
            onChange={(e) => handleChange('icon_number', e.target.value)}
            placeholder="1, 2, 3..."
          />
          <p className="text-xs text-muted-foreground">
            Untuk item bernomor
          </p>
        </div>

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
          {isSubmitting ? 'Menyimpan...' : item ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
