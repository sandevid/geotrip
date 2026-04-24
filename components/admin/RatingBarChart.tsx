'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RatingBarChartProps {
  ratingDistribution: number[];
}

export function RatingBarChart({ ratingDistribution }: RatingBarChartProps) {
  const data = [5, 4, 3, 2, 1].map((rating, index) => ({
    rating: `${rating}★`,
    count: ratingDistribution[rating - 1],
    fill: '#F59E0B', // amber-500
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" fontSize={12} />
        <YAxis dataKey="rating" type="category" stroke="#6b7280" fontSize={12} width={40} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value} ulasan`, 'Jumlah']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
