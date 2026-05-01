'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogFooter,
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
import { Plus, Trash2, MoveUp, MoveDown, X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/lib/types/database';
import { Textarea } from '@/components/ui/textarea';

interface WisataOption {
  id: string;
  nama: string;
}

interface PenelitianChartsManagerProps {
  wisataList: WisataOption[];
}

type ChartData = Tables<'wisata_penelitian_charts'>;

const DEFAULT_VARIABEL_OPTIONS = ['TCM', 'CVM', 'HPM'];

export function PenelitianChartsManager({ wisataList }: PenelitianChartsManagerProps) {
  const [selectedWisata, setSelectedWisata] = useState<string>('');
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteChartId, setDeleteChartId] = useState<string | null>(null);
  const [availableVariabels, setAvailableVariabels] = useState<string[]>(DEFAULT_VARIABEL_OPTIONS);

  // Form state - multiple URLs
  const [selectedVariabel, setSelectedVariabel] = useState('TCM');
  const [customVariabel, setCustomVariabel] = useState('');
  const [isCustomVariabel, setIsCustomVariabel] = useState(false);
  const [chartUrls, setChartUrls] = useState<string[]>(['']);

  // Edit state
  const [editingChart, setEditingChart] = useState<ChartData | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (selectedWisata) {
      fetchCharts();
    }
  }, [selectedWisata]);

  useEffect(() => {
    fetchAvailableVariabels();
  }, []);

  async function fetchAvailableVariabels() {
    const { data } = await supabase
      .from('wisata_penelitian_charts')
      .select('variabel_type');

    if (data) {
      const uniqueVariabels = Array.from(new Set(data.map(d => d.variabel_type)));
      const allVariabels = Array.from(new Set([...DEFAULT_VARIABEL_OPTIONS, ...uniqueVariabels]));
      setAvailableVariabels(allVariabels);
    }
  }

  async function fetchCharts() {
    if (!selectedWisata) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('wisata_penelitian_charts')
      .select('*')
      .eq('wisata_id', selectedWisata)
      .order('variabel_type')
      .order('chart_order');

    if (error) {
      toast.error('Gagal memuat data chart');
      console.error(error);
    } else {
      setCharts(data || []);
    }
    setLoading(false);
  }

  function openAddDialog() {
    setSelectedVariabel('TCM');
    setCustomVariabel('');
    setIsCustomVariabel(false);
    setChartUrls(['']);
    setIsDialogOpen(true);
  }

  function openEditDialog(chart: ChartData) {
    setEditingChart(chart);
    setEditUrl(chart.chart_embed_url);
    setEditDescription(chart.description || '');
    setIsEditDialogOpen(true);
  }

  function addUrlField() {
    setChartUrls([...chartUrls, '']);
  }

  function removeUrlField(index: number) {
    setChartUrls(chartUrls.filter((_, i) => i !== index));
  }

  function updateUrl(index: number, value: string) {
    const newUrls = [...chartUrls];
    newUrls[index] = value;
    setChartUrls(newUrls);
  }

  async function handleSubmit() {
    if (!selectedWisata) {
      toast.error('Pilih wisata terlebih dahulu');
      return;
    }

    const variabelToUse = isCustomVariabel ? customVariabel.trim() : selectedVariabel;

    if (!variabelToUse) {
      toast.error('Variabel harus diisi');
      return;
    }

    const validUrls = chartUrls.filter(url => url.trim() !== '');

    if (validUrls.length === 0) {
      toast.error('Minimal 1 URL chart harus diisi');
      return;
    }

    setLoading(true);

    try {
      // Get max order for this variabel_type
      const { data: maxOrderData } = await supabase
        .from('wisata_penelitian_charts')
        .select('chart_order')
        .eq('wisata_id', selectedWisata)
        .eq('variabel_type', variabelToUse)
        .order('chart_order', { ascending: false })
        .limit(1);

      let nextOrder = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].chart_order + 1 
        : 0;

      // Insert all URLs
      const insertData = validUrls.map(url => ({
        wisata_id: selectedWisata,
        variabel_type: variabelToUse,
        chart_embed_url: url.trim(),
        chart_order: nextOrder++,
        description: null, // Can be added later via edit
      }));

      const { error } = await supabase
        .from('wisata_penelitian_charts')
        .insert(insertData);

      if (error) throw error;

      toast.success(`${validUrls.length} chart berhasil ditambahkan`);
      setIsDialogOpen(false);
      fetchCharts();
      fetchAvailableVariabels();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan chart');
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    if (!editingChart) return;

    if (!editUrl.trim()) {
      toast.error('URL chart harus diisi');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('wisata_penelitian_charts')
        .update({
          chart_embed_url: editUrl.trim(),
          description: editDescription.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingChart.id);

      if (error) throw error;

      toast.success('Chart berhasil diupdate');
      setIsEditDialogOpen(false);
      setEditingChart(null);
      fetchCharts();
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengupdate chart');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteChartId) return;

    setLoading(true);
    const { error } = await supabase
      .from('wisata_penelitian_charts')
      .delete()
      .eq('id', deleteChartId);

    if (error) {
      toast.error('Gagal menghapus chart');
      console.error(error);
    } else {
      toast.success('Chart berhasil dihapus');
      fetchCharts();
    }

    setDeleteChartId(null);
    setLoading(false);
  }

  async function moveChart(chartId: string, direction: 'up' | 'down') {
    const chartIndex = charts.findIndex(c => c.id === chartId);
    if (chartIndex === -1) return;

    const chart = charts[chartIndex];
    const swapIndex = direction === 'up' ? chartIndex - 1 : chartIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= charts.length) return;
    if (charts[swapIndex].variabel_type !== chart.variabel_type) return;

    const swapChart = charts[swapIndex];

    setLoading(true);

    const { error: error1 } = await supabase
      .from('wisata_penelitian_charts')
      .update({ chart_order: swapChart.chart_order })
      .eq('id', chart.id);

    const { error: error2 } = await supabase
      .from('wisata_penelitian_charts')
      .update({ chart_order: chart.chart_order })
      .eq('id', swapChart.id);

    if (error1 || error2) {
      toast.error('Gagal mengubah urutan');
    } else {
      toast.success('Urutan berhasil diubah');
      fetchCharts();
    }

    setLoading(false);
  }

  const groupedCharts = charts.reduce((acc, chart) => {
    if (!acc[chart.variabel_type]) {
      acc[chart.variabel_type] = [];
    }
    acc[chart.variabel_type].push(chart);
    return acc;
  }, {} as Record<string, ChartData[]>);

  return (
    <div className="space-y-6">
      {/* Wisata Selector */}
      <div className="bg-white p-6 rounded-lg border">
        <Label htmlFor="wisata-select" className="text-base font-medium">
          Pilih Wisata
        </Label>
        <Select value={selectedWisata} onValueChange={setSelectedWisata}>
          <SelectTrigger id="wisata-select" className="mt-2">
            <SelectValue placeholder="Pilih wisata..." />
          </SelectTrigger>
          <SelectContent>
            {wisataList.map((wisata) => (
              <SelectItem key={wisata.id} value={wisata.id}>
                {wisata.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWisata && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total: {charts.length} chart
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Chart
            </Button>
          </div>

          {loading && charts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : charts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-gray-500">Belum ada chart. Tambahkan chart pertama!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(groupedCharts).map((variabel) => {
                const varCharts = groupedCharts[variabel];

                return (
                  <div key={variabel} className="bg-white rounded-lg border">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-semibold text-lg">{variabel}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {varCharts.length} chart
                      </p>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead className="w-1/3">URL Embed</TableHead>
                          <TableHead className="w-1/2">Penjelasan</TableHead>
                          <TableHead className="w-40 text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {varCharts.map((chart, index) => (
                          <TableRow key={chart.id}>
                            <TableCell className="font-medium align-top">{index + 1}</TableCell>
                            <TableCell className="align-top">
                              <div className="max-w-xs">
                                <p className="text-xs text-gray-600 font-mono truncate">
                                  {chart.chart_embed_url}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              {chart.description ? (
                                <div className="max-w-md">
                                  <p className="text-sm text-gray-700 line-clamp-3">
                                    {chart.description}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400 italic">
                                  Belum ada penjelasan
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(chart)}
                                  title="Edit chart"
                                >
                                  <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveChart(chart.id, 'up')}
                                  disabled={index === 0 || loading}
                                  title="Pindah ke atas"
                                >
                                  <MoveUp className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveChart(chart.id, 'down')}
                                  disabled={index === varCharts.length - 1 || loading}
                                  title="Pindah ke bawah"
                                >
                                  <MoveDown className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteChartId(chart.id)}
                                  title="Hapus chart"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Chart Baru</DialogTitle>
            <DialogDescription>
              Masukkan URL embed chart dari Google Sheets. Bisa tambah multiple URL sekaligus.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Variabel Selection */}
            <div className="space-y-2">
              <Label>Variabel</Label>
              <div className="flex gap-2">
                <Select
                  value={isCustomVariabel ? 'custom' : selectedVariabel}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setIsCustomVariabel(true);
                    } else {
                      setIsCustomVariabel(false);
                      setSelectedVariabel(value);
                    }
                  }}
                  disabled={isCustomVariabel && customVariabel !== ''}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVariabels.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">+ Variabel Baru</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isCustomVariabel && (
                <Input
                  placeholder="Nama variabel baru (contoh: ZNEK)"
                  value={customVariabel}
                  onChange={(e) => setCustomVariabel(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Multiple URL Inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>URL Embed Chart</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addUrlField}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah URL
                </Button>
              </div>

              <div className="space-y-3">
                {chartUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`URL Chart ${index + 1}`}
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                    />
                    {chartUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUrlField(index)}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500">
                Paste URL dari Google Sheets → Chart → Publish chart → Link
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Semua'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteChartId} onOpenChange={() => setDeleteChartId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Chart?</AlertDialogTitle>
            <AlertDialogDescription>
              Chart akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Chart</DialogTitle>
            <DialogDescription>
              Update URL embed dan penjelasan chart penelitian
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Variabel Type (Read-only) */}
            <div className="space-y-2">
              <Label>Variabel</Label>
              <Input
                value={editingChart?.variabel_type || ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL Embed Chart</Label>
              <Input
                id="edit-url"
                placeholder="https://docs.google.com/spreadsheets/..."
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Paste URL dari Google Sheets → Chart → Publish chart → Link
              </p>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Penjelasan Chart
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Opsional)
                </span>
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Contoh: Diagram ini menunjukkan distribusi frekuensi kunjungan wisatawan berdasarkan survei terhadap 102 responden. Mayoritas responden (37%) melakukan kunjungan 2 kali dalam setahun."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={6}
                className="resize-y min-h-[120px] max-h-[300px] w-full"
                style={{ 
                  wordBreak: 'break-word', 
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              />
              <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-md p-3">
                <svg 
                  className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-medium text-blue-700 break-words">Tips penjelasan yang baik:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-600 break-words">
                    <li className="break-words">Jelaskan apa yang ditampilkan dalam chart</li>
                    <li className="break-words">Sebutkan jumlah responden atau data yang digunakan</li>
                    <li className="break-words">Highlight insight atau temuan penting</li>
                    <li className="break-words">Gunakan bahasa yang mudah dipahami pengunjung</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingChart(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
