'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type Fasilitas = Tables<'fasilitas'>;
import { validateFasilitas, VALID_KATEGORI } from '@/lib/utils/validators';
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
import { toast } from 'sonner';

interface FasilitasFormProps {
  fasilitas?: Fasilitas | null;
  onSuccess: () => void;
}

export function FasilitasForm({ fasilitas, onSuccess }: FasilitasFormProps) {
  const [formData, setFormData] = useState({
    nama: fasilitas?.nama || '',
    kategori: fasilitas?.kategori || VALID_KATEGORI[0],
    latitude: fasilitas?.latitude?.toString() || '',
    longitude: fasilitas?.longitude?.toString() || '',
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

    const validation = validateFasilitas({
      nama: formData.nama,
      kategori: formData.kategori,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const data = {
        nama: formData.nama.trim(),
        kategori: formData.kategori,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      if (fasilitas) {
        const { error } = await supabase
          .from('fasilitas')
          .update(data)
          .eq('id', fasilitas.id);

        if (error) throw error;
        toast.success('Fasilitas berhasil diperbarui');
      } else {
        const { error } = await supabase.from('fasilitas').insert(data);

        if (error) throw error;
        toast.success('Fasilitas berhasil ditambahkan');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving fasilitas:', error);
      toast.error('Gagal menyimpan fasilitas');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Fasilitas</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          placeholder="Contoh: Hotel Santika"
          required
        />
        {errors.nama && (
          <p className="text-sm text-destructive">{errors.nama}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori</Label>
        <Select
          value={formData.kategori}
          onValueChange={(value) => handleChange('kategori', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {VALID_KATEGORI.map((kategori) => (
              <SelectItem key={kategori} value={kategori}>
                {kategori}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kategori && (
          <p className="text-sm text-destructive">{errors.kategori}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => handleChange('latitude', e.target.value)}
            placeholder="-7.0000"
            required
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">{errors.latitude}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => handleChange('longitude', e.target.value)}
            placeholder="110.0000"
            required
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">{errors.longitude}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : fasilitas ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
