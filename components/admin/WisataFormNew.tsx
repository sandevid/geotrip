'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type WisataExtended = Tables<'wisata'>;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MapPin, Clock, DollarSign, TrendingUp, Image } from 'lucide-react';
import { PetaImagesManager } from './PetaImagesManager';

interface WisataFormNewProps {
  wisata?: WisataExtended | null;
  onSuccess: () => void;
}

// Helper function to format number with thousand separator
function formatNumber(value: string): string {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';
  
  // Add thousand separator
  return parseInt(numbers).toLocaleString('id-ID');
}

// Helper function to parse formatted number back to number
function parseFormattedNumber(value: string): string {
  return value.replace(/\./g, '');
}

export function WisataFormNew({ wisata, onSuccess }: WisataFormNewProps) {
  const [formData, setFormData] = useState({
    // Basic Info
    nama: wisata?.nama || '',
    deskripsi: wisata?.deskripsi || '',
    alamat: wisata?.alamat || '',
    latitude: wisata?.latitude?.toString() || '',
    longitude: wisata?.longitude?.toString() || '',
    
    // Operational Info
    jam_buka: wisata?.jam_buka || '',
    harga_tiket: wisata?.harga_tiket || '',
    
    // Economic Values - stored as formatted strings for display
    duv_value: wisata?.duv_value ? wisata.duv_value.toLocaleString('id-ID') : '',
    ev_value: wisata?.ev_value ? wisata.ev_value.toLocaleString('id-ID') : '',
    tev_value: wisata?.tev_value ? wisata.tev_value.toLocaleString('id-ID') : '',
    hpm_min: wisata?.hpm_min ? wisata.hpm_min.toLocaleString('id-ID') : '',
    hpm_max: wisata?.hpm_max ? wisata.hpm_max.toLocaleString('id-ID') : '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNumberChange(field: string, value: string) {
    const formatted = formatNumber(value);
    setFormData((prev) => ({ ...prev, [field]: formatted }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.nama.trim() || !formData.deskripsi.trim() || !formData.alamat.trim()) {
        throw new Error('Nama, deskripsi, dan alamat wajib diisi');
      }

      const supabase = createClient();
      const data = {
        nama: formData.nama.trim(),
        deskripsi: formData.deskripsi.trim(),
        alamat: formData.alamat.trim(),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        jam_buka: formData.jam_buka.trim() || null,
        harga_tiket: formData.harga_tiket.trim() || null,
        duv_value: formData.duv_value ? parseFloat(parseFormattedNumber(formData.duv_value)) : null,
        ev_value: formData.ev_value ? parseFloat(parseFormattedNumber(formData.ev_value)) : null,
        tev_value: formData.tev_value ? parseFloat(parseFormattedNumber(formData.tev_value)) : null,
        hpm_min: formData.hpm_min ? parseFloat(parseFormattedNumber(formData.hpm_min)) : null,
        hpm_max: formData.hpm_max ? parseFloat(parseFormattedNumber(formData.hpm_max)) : null,
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
    } catch (error: any) {
      console.error('Error saving wisata:', error);
      toast.error(error.message || 'Gagal menyimpan wisata');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Informasi Dasar</h3>
        </div>
        
        <div className="space-y-4 pl-7">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Wisata *</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              placeholder="Contoh: Umbul Sidomukti"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi *</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => handleChange('deskripsi', e.target.value)}
              placeholder="Deskripsi lengkap tentang destinasi wisata..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat *</Label>
            <Input
              id="alamat"
              value={formData.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              placeholder="Alamat lengkap..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                placeholder="-7.0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                placeholder="110.0000"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Operational Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Informasi Operasional</h3>
        </div>
        
        <div className="space-y-4 pl-7">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jam_buka">Jam Buka</Label>
              <Input
                id="jam_buka"
                value={formData.jam_buka}
                onChange={(e) => handleChange('jam_buka', e.target.value)}
                placeholder="08:00 - 17:00"
              />
              <p className="text-xs text-muted-foreground">
                Contoh: 08:00 - 17:00 atau 24 Jam
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="harga_tiket">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Harga Tiket
              </Label>
              <Textarea
                id="harga_tiket"
                value={formData.harga_tiket}
                onChange={(e) => handleChange('harga_tiket', e.target.value)}
                placeholder="Rp 5.000/orang&#10;Rp 3.000/motor&#10;Rp 10.000/masuk zona lain"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Format: Rp [harga]/[keterangan] (satu baris per item)
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Economic Values */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Nilai Ekonomi</h3>
        </div>
        
        <div className="space-y-4 pl-7">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duv_value">DUV - Direct Use Value (TCM)</Label>
              <Input
                id="duv_value"
                type="text"
                value={formData.duv_value}
                onChange={(e) => handleNumberChange('duv_value', e.target.value)}
                placeholder="5.900.000"
              />
              <p className="text-xs text-muted-foreground">
                Travel Cost Method - Nilai Guna Langsung
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ev_value">EV - Existence Value (CVM)</Label>
              <Input
                id="ev_value"
                type="text"
                value={formData.ev_value}
                onChange={(e) => handleNumberChange('ev_value', e.target.value)}
                placeholder="335.400.000"
              />
              <p className="text-xs text-muted-foreground">
                Contingent Valuation Method - Nilai Keberadaan
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tev_value">TEV - Total Economic Value</Label>
            <Input
              id="tev_value"
              type="text"
              value={formData.tev_value}
              onChange={(e) => handleNumberChange('tev_value', e.target.value)}
              placeholder="341.300.000"
            />
            <p className="text-xs text-muted-foreground">
              Total Economic Value (DUV + EV)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hpm_min">HPM - Nilai Minimum</Label>
              <Input
                id="hpm_min"
                type="text"
                value={formData.hpm_min}
                onChange={(e) => handleNumberChange('hpm_min', e.target.value)}
                placeholder="4.000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hpm_max">HPM - Nilai Maksimum</Label>
              <Input
                id="hpm_max"
                type="text"
                value={formData.hpm_max}
                onChange={(e) => handleNumberChange('hpm_max', e.target.value)}
                placeholder="4.157"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Hedonic Pricing Method - Interval nilai properti
          </p>
        </div>
      </div>

      <Separator />

      {/* Peta Images - Only show when editing existing wisata */}
      {wisata && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Gambar Peta Lokasi</h3>
            </div>
            
            <div className="pl-7">
              <PetaImagesManager wisataId={wisata.id} />
            </div>
          </div>

          <Separator />
        </>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : wisata ? 'Perbarui' : 'Tambah'}
        </Button>
      </div>
    </form>
  );
}
