'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface UlasanFormProps {
  wisataId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UlasanForm({ wisataId, onSuccess, onCancel }: UlasanFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Silakan pilih rating');
      return;
    }

    if (!komentar.trim()) {
      toast.error('Silakan tulis komentar');
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Anda harus login untuk memberikan ulasan');
      }

      // Insert ulasan
      const { error } = await supabase.from('ulasan').insert({
        wisata_id: wisataId,
        user_id: user.id,
        rating,
        komentar: komentar.trim(),
      });

      if (error) throw error;

      toast.success('Ulasan berhasil ditambahkan');
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting ulasan:', error);
      toast.error(error.message || 'Gagal menambahkan ulasan');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    starValue <= (hoverRating || rating)
                      ? 'fill-accent text-accent'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="text-sm text-gray-600 ml-2">
              {rating} dari 5 bintang
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="komentar">Komentar *</Label>
        <Textarea
          id="komentar"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Bagikan pengalaman Anda tentang destinasi wisata ini..."
          rows={5}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
        </Button>
      </div>
    </form>
  );
}
