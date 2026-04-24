'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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
import { Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

interface UlasanWithDetails {
  id: string;
  rating: number;
  komentar: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
  wisata: {
    nama: string;
  } | null;
}

export default function UlasanModerationPage() {
  const [ulasanList, setUlasanList] = useState<UlasanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadUlasan();
  }, []);

  async function loadUlasan() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ulasan')
        .select(
          `
          id,
          rating,
          komentar,
          created_at,
          profiles!inner (full_name, email),
          wisata!inner (nama)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = (data || []).map((item: any) => ({
        ...item,
        profiles: Array.isArray(item.profiles)
          ? item.profiles[0]
          : item.profiles,
        wisata: Array.isArray(item.wisata) ? item.wisata[0] : item.wisata,
      }));

      setUlasanList(transformedData);
    } catch (error) {
      console.error('Error loading ulasan:', error);
      toast.error('Gagal memuat data ulasan');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('ulasan').delete().eq('id', id);

      if (error) throw error;

      toast.success('Ulasan berhasil dihapus');
      setDeleteConfirm(null);
      loadUlasan();
    } catch (error) {
      console.error('Error deleting ulasan:', error);
      toast.error('Gagal menghapus ulasan');
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderasi Ulasan</h1>
        <p className="text-muted-foreground">
          Kelola dan moderasi ulasan dari pengguna
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Ulasan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Wisata</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Komentar</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ulasanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Belum ada ulasan
                  </TableCell>
                </TableRow>
              ) : (
                ulasanList.map((ulasan) => (
                  <TableRow key={ulasan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {ulasan.profiles?.full_name || 'Pengguna'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ulasan.profiles?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{ulasan.wisata?.nama}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1 text-white">
                        <Star className="h-3 w-3 fill-current text-white" />
                        {ulasan.rating}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="line-clamp-2 text-sm">{ulasan.komentar}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(ulasan.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(ulasan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak
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
