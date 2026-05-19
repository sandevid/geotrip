import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building2, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UlasanLineChart } from '@/components/admin/UlasanLineChart';
import { RatingBarChart } from '@/components/admin/RatingBarChart';

async function getStats() {
  const supabase = await createClient();

  const [wisataResult, fasilitasResult, ulasanResult] = await Promise.all([
    supabase.from('wisata').select('id', { count: 'exact', head: true }),
    supabase.from('fasilitas').select('id', { count: 'exact', head: true }),
    supabase.from('ulasan').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalWisata: wisataResult.count || 0,
    totalFasilitas: fasilitasResult.count || 0,
    totalUlasan: ulasanResult.count || 0,
  };
}

async function getRecentReviews() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from('ulasan')
    .select(
      `
      id,
      rating,
      komentar,
      created_at,
      profiles!inner (full_name, email),
      wisata!inner (nama)
    `
    )
    .order('created_at', { ascending: false })
    .limit(5);

  const transformedReviews = (reviews || []).map((review: any) => ({
    ...review,
    profiles: Array.isArray(review.profiles)
      ? review.profiles[0]
      : review.profiles,
    wisata: Array.isArray(review.wisata) ? review.wisata[0] : review.wisata,
  }));

  return transformedReviews;
}

async function getUlasanStats() {
  const supabase = await createClient();

  // Get rating distribution
  const { data: allReviews } = await supabase
    .from('ulasan')
    .select('rating, created_at');

  const ratingDistribution = [0, 0, 0, 0, 0];
  let totalRating = 0;

  allReviews?.forEach((review) => {
    ratingDistribution[review.rating - 1]++;
    totalRating += review.rating;
  });

  const averageRating = allReviews?.length
    ? (totalRating / allReviews.length).toFixed(1)
    : '0';

  // Get reviews per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: recentReviews } = await supabase
    .from('ulasan')
    .select('created_at')
    .gte('created_at', sixMonthsAgo.toISOString());

  // Group by month
  const monthlyData: Record<string, number> = {};
  recentReviews?.forEach((review) => {
    const month = new Date(review.created_at).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
    });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  return {
    ratingDistribution,
    averageRating,
    totalReviews: allReviews?.length || 0,
    monthlyData,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentReviews = await getRecentReviews();
  const ulasanStats = await getUlasanStats();

  const statCards = [
    {
      title: 'Total Wisata',
      value: stats.totalWisata,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Fasilitas',
      value: stats.totalFasilitas,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Ulasan',
      value: stats.totalUlasan,
      icon: MessageSquare,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di panel admin JumpoZone
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ulasan Performance Chart */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Distribusi Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Average Rating Display */}
              <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="text-sm text-muted-foreground mb-2">
                  Rating Rata-rata
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(parseFloat(ulasanStats.averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold text-amber-600">
                    {ulasanStats.averageRating}
                  </span>
                  <span className="text-lg text-muted-foreground">/5</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  dari {ulasanStats.totalReviews} ulasan
                </div>
              </div>

              {/* Rating Distribution Bar Chart */}
              <RatingBarChart ratingDistribution={ulasanStats.ratingDistribution} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trend Ulasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UlasanLineChart monthlyData={ulasanStats.monthlyData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Ulasan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReviews.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Belum ada ulasan
            </p>
          ) : (
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <Avatar>
                    <AvatarFallback>
                      {(review.profiles?.full_name || review.profiles?.email)
                        ?.charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {review.profiles?.full_name || 'Pengguna'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.wisata?.nama}
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-1 text-white">
                        <Star className="h-3 w-3 fill-current text-white" />
                        {review.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.komentar}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
