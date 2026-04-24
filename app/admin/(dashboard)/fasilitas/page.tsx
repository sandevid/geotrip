'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type Fasilitas = Tables<'fasilitas'>;
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FasilitasForm } from '@/components/admin/FasilitasForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCategoryColor } from '@/lib/utils/colors';

export default function FasilitasManagementPage() {
  const [fasilitasList, setFasilitasList] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFasilitas, setSelectedFasilitas] = useState<Fasilitas | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadFasilitas();
  }, []);

  async function loadFasilitas() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('fasilitas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFasilitasList(data || []);
    } catch (error) {
      console.error('Error loading fasilitas:', error);
      toast.error('Gagal memuat data fasilitas');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedFasilitas(null);
    setIsDialogOpen(true);
  }

  function handleEdit(fasilitas: Fasilitas) {
    setSelectedFasilitas(fasilitas);
    setIsDialogOpen(true);
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('fasilitas').delete().eq('id', id);

      if (error) throw error;

      toast.success('Fasilitas berhasil dihapus');
      setDeleteConfirm(null);
      loadFasilitas();
    } catch (error) {
      console.error('Error deleting fasilitas:', error);
      toast.error('Gagal menghapus fasilitas');
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedFasilitas(null);
    loadFasilitas();
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
          <h1 className="text-3xl font-bold tracking-tight">Kelola Fasilitas</h1>
          <p className="text-muted-foreground">
            Kelola fasilitas di sekitar destinasi wisata
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Fasilitas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Fasilitas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Koordinat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fasilitasList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Belum ada data fasilitas
                  </TableCell>
                </TableRow>
              ) : (
                fasilitasList.map((fasilitas) => (
                  <TableRow key={fasilitas.id}>
                    <TableCell className="font-medium">{fasilitas.nama}</TableCell>
                    <TableCell>
                      <Badge 
                        style={{ 
                          backgroundColor: getCategoryColor(fasilitas.kategori),
                          color: 'white',
                          borderColor: getCategoryColor(fasilitas.kategori)
                        }}
                      >
                        {fasilitas.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {fasilitas.latitude.toFixed(4)}, {fasilitas.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(fasilitas)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(fasilitas.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFasilitas ? 'Edit Fasilitas' : 'Tambah Fasilitas'}
            </DialogTitle>
            <DialogDescription>
              {selectedFasilitas
                ? 'Perbarui informasi fasilitas'
                : 'Tambahkan fasilitas baru'}
            </DialogDescription>
          </DialogHeader>
          <FasilitasForm fasilitas={selectedFasilitas} onSuccess={handleSuccess} />
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
              Apakah Anda yakin ingin menghapus fasilitas ini? Tindakan ini tidak
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
