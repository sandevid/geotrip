'use client';

import { useState } from 'react';

interface ChartData {
  id: string;
  chart_embed_url: string;
  chart_order: number;
}

interface ChartCarouselProps {
  charts: ChartData[];
  title: string;
  description: string;
  icon: React.ElementType;
}

export function ChartCarousel({ charts, title, description, icon: Icon }: ChartCarouselProps) {
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>(
    Object.fromEntries(charts.map(chart => [chart.id, true]))
  );

  const handleChartLoad = (chartId: string) => {
    setLoadingCharts(prev => ({ ...prev, [chartId]: false }));
  };

  return (
    <section className="mb-8 sm:mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
        <h3 className="text-xl sm:text-2xl font-heading font-semibold text-primary">
          {title}
        </h3>
        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
          {charts.length} chart{charts.length > 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        {description}
      </p>

      {/* Grid Layout - All Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {charts.map((chart, index) => (
          <div
            key={chart.id}
            className="w-full overflow-hidden"
            style={{ height: '450px' }}
          >
            <iframe
              src={chart.chart_embed_url}
              className={`w-full transition-opacity duration-300 ${
                loadingCharts[chart.id] ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                border: 'none',
                height: '520px',
                display: 'block',
                marginTop: '-5px',
              }}
              onLoad={() => handleChartLoad(chart.id)}
              title={`Chart ${index + 1}`}
              allow="fullscreen"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

