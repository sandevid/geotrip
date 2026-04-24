'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Tables } from '@/lib/types/database';

interface WisataPenelitianProps {
  penelitian: Tables<'wisata_penelitian'>[];
}

const JENIS_LABELS: Record<string, string> = {
  TCM: 'Travel Cost Method (TCM)',
  CVM: 'Contingent Valuation Method (CVM)',
  HPM: 'Hedonic Pricing Method (HPM)',
};

function PenelitianItem({ item }: { item: Tables<'wisata_penelitian'> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-body font-medium text-gray-900">
          {JENIS_LABELS[item.jenis_penelitian] || item.jenis_penelitian}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="prose prose-sm max-w-none">
            <p className="text-body text-gray-700 whitespace-pre-wrap leading-relaxed">
              {item.konten}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function WisataPenelitian({ penelitian }: WisataPenelitianProps) {
  if (penelitian.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-h3 font-heading mb-4">Penelitian Ekonomi</h2>
        <p className="text-body-sm text-gray-500">
          Belum ada data penelitian tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-h3 font-heading mb-4">Penelitian Ekonomi</h2>
      <p className="text-body-sm text-gray-600 mb-4">
        Analisis nilai ekonomi kawasan wisata menggunakan berbagai metode penelitian
      </p>
      
      <div className="space-y-3">
        {penelitian.map((item) => (
          <PenelitianItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
