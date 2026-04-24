'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type Wisata = Tables<'wisata'>;
import { validateWisata } from '@/lib/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface WisataFormProps {
  wisata?: Wisata | null;
  onSuccess: () => void;
}

export function WisataForm({ wisata, onSuccess }: WisataFormProps) {
  const [formData, setFormData] = useState({
    nama: wisata?.nama || '',
    deskripsi: wisata?.deskripsi || '',
    alamat: wisata?.alamat || '',
    latitude: wisata?.latitude?.toString() || '',
    longitude: wisata?.longitude?.toString() || '',
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

    const validation = validateWisata({
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
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
        deskripsi: formData.deskripsi.trim(),
        alamat: formData.alamat.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      if (wisata) {
        const { error } = await supabase
          .from('wisata')
          .update(data)
          .eq('id', wisata.id);

        if (error) throw error;
        toast.success('Wisata berhasil diperbarui');
      } else {
        const { error } = await supabase.from('wisata').insert(data);

        if (error) throw error;
        toast.success('Wisata berhasil ditambahkan');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving wisata:', error);
      toast.error('Gagal menyimpan wisata');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Wisata</Label>
        <Input
          id="nama"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          placeholder="Contoh: Umbul Sidomukti"
          required
        />
        {errors.nama && (
          <p className="text-sm text-destructive">{errors.nama}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          value={formData.deskripsi}
          onChange={(e) => handleChange('deskripsi', e.target.value)}
          placeholder="Deskripsi lengkap tentang destinasi wisata..."
          rows={4}
          required
        />
        {errors.deskripsi && (
          <p className="text-sm text-destructive">{errors.deskripsi}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamat">Alamat</Label>
        <Input
          id="alamat"
          value={formData.alamat}
          onChange={(e) => handleChange('alamat', e.target.value)}
          placeholder="Alamat lengkap..."
          required
        />
        {errors.alamat && (
          <p className="text-sm text-destructive">{errors.alamat}</p>
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
          {isSubmitting ? 'Menyimpan...' : wisata ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
