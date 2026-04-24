'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';

type KontenZnek = Tables<'konten_znek'>;
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ZnekEditor } from '@/components/admin/ZnekEditor';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function ZnekManagementPage() {
  const [znekList, setZnekList] = useState<KontenZnek[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedZnek, setSelectedZnek] = useState<KontenZnek | null>(null);

  useEffect(() => {
    loadZnek();
  }, []);

  async function loadZnek() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('konten_znek')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setZnekList(data || []);
    } catch (error) {
      console.error('Error loading ZNEK:', error);
      toast.error('Gagal memuat konten ZNEK');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(znek: KontenZnek) {
    setSelectedZnek(znek);
    setIsDialogOpen(true);
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedZnek(null);
    loadZnek();
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
        <h1 className="text-3xl font-bold tracking-tight">Kelola Konten ZNEK</h1>
        <p className="text-muted-foreground">
          Zona Nilai Ekonomi Kawasan - Edit konten informasi ekonomi
        </p>
      </div>

      <div className="space-y-4">
        {znekList.map((znek) => (
          <Card key={znek.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{znek.judul}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Terakhir diperbarui:{' '}
                    {new Date(znek.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleEdit(znek)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: znek.konten.substring(0, 300) + '...',
                }}
              />
            </CardContent>
          </Card>
        ))}

        {znekList.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Belum ada konten ZNEK</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Konten ZNEK</DialogTitle>
            <DialogDescription>
              Perbarui konten Zona Nilai Ekonomi Kawasan
            </DialogDescription>
          </DialogHeader>
          {selectedZnek && (
            <ZnekEditor znek={selectedZnek} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
