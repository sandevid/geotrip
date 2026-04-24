'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type HeroSection = Tables<'hero_section'>;
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
import { HeroForm } from '@/components/admin/HeroForm';
import { Plus, Edit, Trash2, Eye, EyeOff, Image } from 'lucide-react';
import { toast } from 'sonner';

export default function HeroManagementPage() {
  const [heroList, setHeroList] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<HeroSection | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadHero();
  }, []);

  async function loadHero() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setHeroList(data || []);
    } catch (error) {
      console.error('Error loading hero:', error);
      toast.error('Gagal memuat data hero section');
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setSelectedHero(null);
    setIsDialogOpen(true);
  }

  function handleEdit(hero: HeroSection) {
    setSelectedHero(hero);
    setIsDialogOpen(true);
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('hero_section')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(
        !currentStatus ? 'Hero section diaktifkan' : 'Hero section dinonaktifkan'
      );
      loadHero();
    } catch (error) {
      console.error('Error toggling hero status:', error);
      toast.error('Gagal mengubah status hero section');
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('hero_section').delete().eq('id', id);

      if (error) throw error;

      toast.success('Hero section berhasil dihapus');
      setDeleteConfirm(null);
      loadHero();
    } catch (error) {
      console.error('Error deleting hero:', error);
      toast.error('Gagal menghapus hero section');
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedHero(null);
    loadHero();
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
          <h1 className="text-3xl font-bold tracking-tight">Kelola Hero Section</h1>
          <p className="text-muted-foreground">
            Kelola konten hero section di halaman utama
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Hero
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urutan</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Gambar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Belum ada data hero section
                  </TableCell>
                </TableRow>
              ) : (
                heroList.map((hero) => (
                  <TableRow key={hero.id}>
                    <TableCell className="font-medium">
                      {hero.display_order}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{hero.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{hero.subtitle}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Image className="h-4 w-4" />
                        {hero.images.length} gambar
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={hero.is_active ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(hero.id, hero.is_active ?? false)}
                      >
                        {hero.is_active ? (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 h-3 w-3" />
                            Nonaktif
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(hero)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(hero.id)}
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
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedHero ? 'Edit Hero Section' : 'Tambah Hero Section'}
            </DialogTitle>
            <DialogDescription>
              {selectedHero
                ? 'Perbarui konten hero section'
                : 'Tambahkan hero section baru'}
            </DialogDescription>
          </DialogHeader>
          <HeroForm hero={selectedHero} onSuccess={handleSuccess} />
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
              Apakah Anda yakin ingin menghapus hero section ini? Tindakan ini
              tidak dapat dibatalkan.
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
