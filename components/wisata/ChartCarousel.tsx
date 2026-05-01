'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ChartData {
  id: string;
  chart_embed_url: string;
  chart_order: number;
  description: string | null;
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
  const [selectedChart, setSelectedChart] = useState<{ chart: ChartData; index: number } | null>(null);

  const handleChartLoad = (chartId: string) => {
    setLoadingCharts(prev => ({ ...prev, [chartId]: false }));
  };

  const openModal = (chart: ChartData, index: number) => {
    setSelectedChart({ chart, index });
  };

  const closeModal = () => {
    setSelectedChart(null);
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
            className="w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Chart Number Badge & Info Button */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Chart {index + 1}
              </span>
              {chart.description && (
                <button
                  onClick={() => openModal(chart, index)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-2 py-1 transition-colors flex items-center gap-1"
                  title="Lihat penjelasan chart"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  Lihat Penjelasan
                </button>
              )}
            </div>

            {/* Chart iframe */}
            <div className="relative" style={{ height: '350px' }}>
              {loadingCharts[chart.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <iframe
                src={chart.chart_embed_url}
                className={`w-full transition-opacity duration-300 ${
                  loadingCharts[chart.id] ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  border: 'none',
                  height: '420px',
                  display: 'block',
                  marginTop: '-5px',
                }}
                onLoad={() => handleChartLoad(chart.id)}
                title={`Chart ${index + 1}`}
                allow="fullscreen"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Full Chart View */}
      <Dialog open={!!selectedChart} onOpenChange={closeModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {title} - Chart {selectedChart ? selectedChart.index + 1 : ''}
            </DialogTitle>
          </DialogHeader>

          {selectedChart && (
            <div className="space-y-6 py-4">
              {/* Chart Display */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative" style={{ height: '500px' }}>
                  <iframe
                    src={selectedChart.chart.chart_embed_url}
                    className="w-full"
                    style={{
                      border: 'none',
                      height: '570px',
                      display: 'block',
                      marginTop: '-5px',
                    }}
                    title={`Chart ${selectedChart.index + 1}`}
                    allow="fullscreen"
                  />
                </div>
              </div>

              {/* Full Description */}
              {selectedChart.chart.description && (
                <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <svg 
                      className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    <h4 className="text-base font-semibold text-gray-900">
                      Penjelasan Chart
                    </h4>
                  </div>
                  <div className="pl-9">
                    <p 
                      className="text-base text-gray-700 leading-relaxed"
                      style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {selectedChart.chart.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

