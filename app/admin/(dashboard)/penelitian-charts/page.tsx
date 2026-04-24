import { createClient } from '@/lib/supabase/server';
import { PenelitianChartsManager } from '@/components/admin/PenelitianChartsManager';

async function getWisataList() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisata')
    .select('id, nama')
    .order('nama');

  if (error) {
    console.error('Error fetching wisata:', error);
    return [];
  }

  return data;
}

export default async function PenelitianChartsPage() {
  const wisataList = await getWisataList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Management Chart Penelitian
        </h1>
        <p className="mt-2 text-gray-600">
          Kelola chart TCM, CVM, dan HPM untuk setiap wisata
        </p>
      </div>

      <PenelitianChartsManager wisataList={wisataList} />
    </div>
  );
}
