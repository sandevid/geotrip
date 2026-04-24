export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateWisata(data: {
  nama: string;
  deskripsi: string;
  alamat: string;
  latitude: number;
  longitude: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.nama.trim()) {
    errors.nama = 'Nama wisata tidak boleh kosong';
  }

  if (!data.deskripsi.trim()) {
    errors.deskripsi = 'Deskripsi tidak boleh kosong';
  }

  if (!data.alamat.trim()) {
    errors.alamat = 'Alamat tidak boleh kosong';
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }

  if (data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFasilitas(data: {
  nama: string;
  kategori: string;
  latitude: number;
  longitude: number;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const validKategori = [
    'Hotel',
    'Niaga',
    'Kesehatan',
    'Pendidikan',
    'Peribadatan',
    'Pemerintah',
    'ATM',
    'SPBU',
    'Bengkel',
    'Lapangan',
    'Hiburan',
  ];

  if (!data.nama.trim()) {
    errors.nama = 'Nama fasilitas tidak boleh kosong';
  }

  if (!validKategori.includes(data.kategori)) {
    errors.kategori = 'Kategori tidak valid';
  }

  if (data.latitude < -90 || data.latitude > 90) {
    errors.latitude = 'Latitude harus antara -90 dan 90';
  }

  if (data.longitude < -180 || data.longitude > 180) {
    errors.longitude = 'Longitude harus antara -180 dan 180';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUlasan(data: {
  rating: number;
  komentar: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating harus antara 1-5';
  }

  if (!data.komentar.trim()) {
    errors.komentar = 'Komentar tidak boleh kosong';
  }

  if (data.komentar.length > 1000) {
    errors.komentar = 'Komentar maksimal 1000 karakter';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export const VALID_KATEGORI = [
  'Hotel',
  'Niaga',
  'Kesehatan',
  'Pendidikan',
  'Peribadatan',
  'Pemerintah',
  'ATM',
  'SPBU',
  'Bengkel',
  'Lapangan',
  'Hiburan',
];
