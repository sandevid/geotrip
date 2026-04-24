import type { Tables } from '@/lib/types/database';
import { MapPin, Star } from 'lucide-react';

interface WisataInfoProps {
  wisata: Tables<'wisata'>;
  averageRating: number;
  totalReviews: number;
}

export function WisataInfo({ wisata, averageRating, totalReviews }: WisataInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-h1 font-heading mb-4">{wisata.nama}</h1>
      
      <div className="flex items-center gap-2 mb-4">
        {averageRating > 0 ? (
          <>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-body font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-body-sm text-gray-500">
              ({totalReviews} ulasan)
            </span>
          </>
        ) : (
          <span className="text-body-sm text-gray-500">Belum ada ulasan</span>
        )}
      </div>

      <p className="text-body text-gray-700 mb-6 leading-relaxed">
        {wisata.deskripsi}
      </p>

      <div className="space-y-3 border-t pt-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-sm font-medium text-gray-900">Alamat</p>
            <p className="text-body-sm text-gray-600">{wisata.alamat}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-sm font-medium text-gray-900">Koordinat</p>
            <p className="text-body-sm text-gray-600 font-mono">
              {wisata.latitude.toFixed(6)}, {wisata.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
