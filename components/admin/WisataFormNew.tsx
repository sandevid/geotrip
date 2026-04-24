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
    
    // Social Media
    instagram: wisata?.instagram || '',
    facebook: wisata?.facebook || '',
    tiktok: wisata?.tiktok || '',
    twitter: wisata?.twitter || '',
    
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
        instagram: formData.instagram.trim() || null,
        facebook: formData.facebook.trim() || null,
        tiktok: formData.tiktok.trim() || null,
        twitter: formData.twitter.trim() || null,
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

      {/* Social Media */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <h3 className="text-lg font-semibold">Media Sosial</h3>
        </div>
        
        <div className="space-y-4 pl-7">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </span>
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="@username atau URL lengkap"
                className="max-w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </span>
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                placeholder="username atau URL lengkap"
                className="max-w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </span>
              </Label>
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                placeholder="@username atau URL lengkap"
                className="max-w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </span>
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                placeholder="@username atau URL lengkap"
                className="max-w-full"
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Masukkan username (contoh: @wisataumbul) atau URL lengkap
          </p>
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
