'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AboutForm } from '@/components/admin/AboutForm';
import { Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

type AboutSection = Tables<'about_section'>;

export default function AboutManagementPage() {
  const [aboutList, setAboutList] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAbout, setSelectedAbout] = useState<AboutSection | null>(null);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('about_section')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAboutList(data || []);
    } catch (error) {
      console.error('Error loading about:', error);
      toast.error('Gagal memuat data about section');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(about: AboutSection) {
    setSelectedAbout(about);
    setIsDialogOpen(true);
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('about_section')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(
        !currentStatus ? 'About section diaktifkan' : 'About section dinonaktifkan'
      );
      loadAbout();
    } catch (error) {
      console.error('Error toggling about status:', error);
      toast.error('Gagal mengubah status about section');
    }
  }

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedAbout(null);
    loadAbout();
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
        <h1 className="text-3xl font-bold tracking-tight">Kelola About Section</h1>
        <p className="text-muted-foreground">
          Kelola konten about section di halaman utama
        </p>
      </div>

      <div className="space-y-4">
        {aboutList.map((about) => (
          <Card key={about.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{about.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Terakhir diperbarui:{' '}
                    {about.updated_at && new Date(about.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={about.is_active ? 'default' : 'secondary'}
                    className={`cursor-pointer ${!about.is_active ? 'text-white' : ''}`}
                    onClick={() => handleToggleActive(about.id, about.is_active ?? false)}
                  >
                    {about.is_active ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Aktif
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3 text-white" />
                        Nonaktif
                      </>
                    )}
                  </Badge>
                  <Button size="sm" onClick={() => handleEdit(about)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none line-clamp-3 whitespace-pre-wrap">
                {about.content}
              </div>
            </CardContent>
          </Card>
        ))}

        {aboutList.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Belum ada konten about section</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
            <DialogDescription>
              Perbarui konten about section
            </DialogDescription>
          </DialogHeader>
          {selectedAbout && (
            <AboutForm about={selectedAbout} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
