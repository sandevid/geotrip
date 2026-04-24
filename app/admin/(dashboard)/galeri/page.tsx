'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GaleriUpload } from '@/components/admin/GaleriUpload';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface GaleriWithWisata {
  id: string;
  image_url: string;
  caption: string | null;
  wisata_id: string;
  wisata: {
    nama: string;
  } | null;
  created_at?: string;
}

interface WisataOption {
  id: string;
  nama: string;
}

export default function GaleriManagementPage() {
  const [galeriList, setGaleriList] = useState<GaleriWithWisata[]>([]);
  const [wisataList, setWisataList] = useState<WisataOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<GaleriWithWisata | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const supabase = createClient();

      const [galeriResult, wisataResult] = await Promise.all([
        supabase
          .from('wisata_galeri')
          .select(
            `
            id,
            image_url,
            caption,
            wisata_id,
            created_at,
            wisata!inner (nama)
          `
          )
          .order('created_at', { ascending: false }),
        supabase.from('wisata').select('id, nama').order('nama'),
      ]);

      if (galeriResult.error) throw galeriResult.error;
      if (wisataResult.error) throw wisataResult.error;

      const transformedGaleri = (galeriResult.data || []).map((item: any) => ({
        ...item,
        wisata: Array.isArray(item.wisata) ? item.wisata[0] : item.wisata,
      }));

      setGaleriList(transformedGaleri);
      setWisataList(wisataResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Gagal memuat data galeri');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(galeri: GaleriWithWisata) {
    try {
      const supabase = createClient();

      const url = new URL(galeri.image_url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('wisata-images') + 1).join('/');

      const { error: storageError } = await supabase.storage
        .from('wisata-images')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('wisata_galeri')
        .delete()
        .eq('id', galeri.id);

      if (dbError) throw dbError;

      toast.success('Gambar berhasil dihapus');
      setDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting galeri:', error);
      toast.error('Gagal menghapus gambar');
    }
  }

  function handleUploadSuccess() {
    setIsUploadDialogOpen(false);
    loadData();
  }

  const galeriByWisata = galeriList.reduce((acc, galeri) => {
    const wisataId = galeri.wisata_id;
    if (!acc[wisataId]) {
      acc[wisataId] = [];
    }
    acc[wisataId].push(galeri);
    return acc;
  }, {} as Record<string, GaleriWithWisata[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Galeri</h1>
          <p className="text-muted-foreground">
            Upload dan kelola foto destinasi wisata
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload Gambar
        </Button>
      </div>

      {wisataList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Belum ada wisata. Tambahkan wisata terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {wisataList.map((wisata) => {
            const galeriItems = galeriByWisata[wisata.id] || [];

            return (
              <Card key={wisata.id}>
                <CardHeader>
                  <CardTitle>{wisata.nama}</CardTitle>
                </CardHeader>
                <CardContent>
                  {galeriItems.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      Belum ada gambar untuk wisata ini
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galeriItems.map((galeri) => (
                        <div
                          key={galeri.id}
                          className="group relative aspect-square rounded-lg overflow-hidden border"
                        >
                          <Image
                            src={galeri.image_url}
                            alt={galeri.caption || 'Gallery image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          {galeri.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                              <p className="text-xs text-white line-clamp-1">
                                {galeri.caption}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setDeleteConfirm(galeri)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Gambar</DialogTitle>
            <DialogDescription>
              Upload gambar untuk galeri destinasi wisata
            </DialogDescription>
          </DialogHeader>
          <GaleriUpload wisataList={wisataList} onSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Gambar akan dihapus dari
              storage dan database. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
