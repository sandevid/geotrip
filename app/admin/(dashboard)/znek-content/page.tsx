'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ZnekSectionForm } from '@/components/admin/ZnekSectionForm';
import { ZnekItemForm } from '@/components/admin/ZnekItemForm';

interface ZnekSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  display_order: number;
  is_active: boolean;
}

interface ZnekItem {
  id: string;
  section_id: string;
  item_type: string;
  title: string;
  description: string;
  icon_number: number | null;
  display_order: number;
  is_active: boolean;
}

const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: 'Hero Section',
  introduction: 'Pendahuluan',
  methodology: 'Metodologi',
  impact: 'Dampak Ekonomi',
  recommendation: 'Rekomendasi',
  conclusion: 'Kesimpulan',
  cta: 'Call to Action',
};

export default function ZnekContentManagementPage() {
  const [sections, setSections] = useState<ZnekSection[]>([]);
  const [items, setItems] = useState<Record<string, ZnekItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<ZnekSection | null>(null);
  const [selectedItem, setSelectedItem] = useState<ZnekItem | null>(null);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const supabase = createClient();

      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('znek_sections')
        .select('*')
        .order('display_order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Fetch items for each section
      const { data: itemsData, error: itemsError } = await supabase
        .from('znek_items')
        .select('*')
        .order('display_order');

      if (itemsError) throw itemsError;

      // Group items by section_id
      const groupedItems: Record<string, ZnekItem[]> = {};
      itemsData?.forEach((item) => {
        if (!groupedItems[item.section_id]) {
          groupedItems[item.section_id] = [];
        }
        groupedItems[item.section_id].push(item);
      });
      setItems(groupedItems);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSection(id: string) {
    if (!confirm('Yakin ingin menghapus section ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('znek_sections').delete().eq('id', id);

      if (error) throw error;
      toast.success('Section berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast.error('Gagal menghapus section');
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Yakin ingin menghapus item ini?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('znek_items').delete().eq('id', id);

      if (error) throw error;
      toast.success('Item berhasil dihapus');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Gagal menghapus item');
    }
  }

  async function toggleSectionActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('znek_sections')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Section ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      fetchData();
    } catch (error: any) {
      console.error('Error toggling section:', error);
      toast.error('Gagal mengubah status');
    }
  }

  async function toggleItemActive(id: string, currentStatus: boolean) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('znek_items')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Item ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      fetchData();
    } catch (error: any) {
      console.error('Error toggling item:', error);
      toast.error('Gagal mengubah status');
    }
  }

  function handleEditSection(section: ZnekSection) {
    setSelectedSection(section);
    setSectionDialogOpen(true);
  }

  function handleAddSection() {
    setSelectedSection(null);
    setSectionDialogOpen(true);
  }

  function handleEditItem(item: ZnekItem) {
    setSelectedItem(item);
    setCurrentSectionId(item.section_id);
    setItemDialogOpen(true);
  }

  function handleAddItem(sectionId: string) {
    setSelectedItem(null);
    setCurrentSectionId(sectionId);
    setItemDialogOpen(true);
  }

  function handleSuccess() {
    setSectionDialogOpen(false);
    setItemDialogOpen(false);
    setSelectedSection(null);
    setSelectedItem(null);
    setCurrentSectionId(null);
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Konten ZNEK</h1>
          <p className="text-gray-600 mt-1">
            Manajemen konten Zona Nilai Ekonomi Kawasan
          </p>
        </div>
        <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSection}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Section
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSection ? 'Edit Section' : 'Tambah Section Baru'}
              </DialogTitle>
            </DialogHeader>
            <ZnekSectionForm section={selectedSection} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                      {SECTION_TYPE_LABELS[section.section_type] || section.section_type}
                    </span>
                    <span className="text-sm text-gray-500">
                      Order: {section.display_order}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-sm text-gray-600 mb-2">{section.subtitle}</p>
                  )}
                  {section.content && (
                    <p className="text-sm text-gray-700 line-clamp-2">{section.content}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSectionActive(section.id, section.is_active)}
                >
                  {section.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(section)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSection(section.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>

            {/* Items for this section */}
            {items[section.id] && items[section.id].length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Items ({items[section.id].length})
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(section.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {items[section.id].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-start gap-2 flex-1">
                        {item.icon_number && (
                          <span className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.icon_number}
                          </span>
                        )}
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItemActive(item.id, item.is_active)}
                        >
                          {item.is_active ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Item button if no items */}
            {(!items[section.id] || items[section.id].length === 0) &&
              ['methodology', 'impact', 'recommendation'].includes(section.section_type) && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(section.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Tambah Item
                  </Button>
                </div>
              )}
          </Card>
        ))}
      </div>

      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Item' : 'Tambah Item Baru'}
            </DialogTitle>
          </DialogHeader>
          {currentSectionId && (
            <ZnekItemForm
              item={selectedItem}
              sectionId={currentSectionId}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
