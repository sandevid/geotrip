'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type Wisata = Tables<'wisata'>;
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { WisataFormNew } from '@/components/admin/WisataFormNew';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WisataManagementPage() {
  const [wisataList, setWisataList] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWisata, setSelectedWisata] = useState<Wisata | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadWisata();
  }, []);

  async function loadWisata() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wisata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWisataList(data || []);
    } catch (error) {
      console.error('Error loading wisata:', error);
      toast.error('Gagal memuat data wisata');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedWisata(null);
    setIsDialogOpen(true);
  }

  function handleEdit(wisata: Wisata) {
    setSelectedWisata(wisata);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('wisata').delete().eq('id', id);

      if (error) throw error;

      toast.success('Wisata berhasil dihapus');
      setDeleteConfirm(null);
      loadWisata();
    } catch (error) {
      console.error('Error deleting wisata:', error);
      toast.error('Gagal menghapus wisata');
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedWisata(null);
    loadWisata();
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Kelola Wisata</h1>
          <p className="text-muted-foreground">
            Kelola destinasi wisata di Semarang
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Wisata
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Wisata</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wisataList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Belum ada data wisata
                  </TableCell>
                </TableRow>
              ) : (
                wisataList.map((wisata) => (
                  <TableRow key={wisata.id}>
                    <TableCell className="font-medium">{wisata.nama}</TableCell>
                    <TableCell>{wisata.alamat}</TableCell>
                    <TableCell className="text-sm">
                      {wisata.latitude.toFixed(4)}, {wisata.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(wisata)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(wisata.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>
              {selectedWisata ? 'Edit Wisata' : 'Tambah Wisata'}
            </DialogTitle>
            <DialogDescription>
              {selectedWisata
                ? 'Perbarui informasi wisata'
                : 'Tambahkan destinasi wisata baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-hidden">
            <WisataFormNew wisata={selectedWisata} onSuccess={handleSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus wisata ini? Semua data terkait
              (galeri, penelitian, ulasan) akan ikut terhapus. Tindakan ini tidak
              dapat dibatalkan.
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
