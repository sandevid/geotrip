import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/types/database';
import FasilitasMapWithSidebar from '@/components/fasilitas/FasilitasMapWithSidebar';

async function getFasilitasData(): Promise<Tables<'fasilitas'>[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('fasilitas')
    .select('*')
    .order('nama');

  if (error) {
    console.error('Error fetching fasilitas:', error);
    return [];
  }

  return data || [];
}

async function getWisataData(): Promise<Tables<'wisata'>[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('wisata')
    .select('*')
    .order('nama');

  if (error) {
    console.error('Error fetching wisata:', error);
    return [];
  }

  return data || [];
}

export default async function FasilitasPage() {
  const [fasilitasData, wisataData] = await Promise.all([
    getFasilitasData(),
    getWisataData(),
  ]);

  return (
    <div className="pt-20">
      <FasilitasMapWithSidebar 
        fasilitasData={fasilitasData}
        wisataData={wisataData}
      />
    </div>
  );
}

export const metadata = {
  title: 'Peta Fasilitas - GeoTrip',
  description: 'Jelajahi fasilitas di sekitar destinasi wisata Semarang dengan peta interaktif.',
};