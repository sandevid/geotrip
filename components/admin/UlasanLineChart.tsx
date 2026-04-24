'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface UlasanLineChartProps {
  monthlyData: Record<string, number>;
}

export function UlasanLineChart({ monthlyData }: UlasanLineChartProps) {
  const entries = Object.entries(monthlyData).slice(-6);
  
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
        <p className="text-sm">Belum ada data</p>
      </div>
    );
  }

  const data = entries.map(([month, count]) => ({
    month: month.split(' ')[0], // Ambil nama bulan saja
    ulasan: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUlasan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={12}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value} ulasan`, 'Jumlah']}
        />
        <Area
          type="monotone"
          dataKey="ulasan"
          stroke="#1D4ED8"
          strokeWidth={2}
          fill="url(#colorUlasan)"
        />
        <Line
          type="monotone"
          dataKey="ulasan"
          stroke="#1D4ED8"
          strokeWidth={3}
          dot={{ fill: '#1D4ED8', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
