'use client';

import { useEffect, useRef, useState } from 'react';

interface ChartData {
  id: string;
  chart_embed_url: string;
  chart_order: number;
  description: string | null;
  chart_width?: number | null;
  chart_height?: number | null;
}

interface ChartCarouselProps {
  charts: ChartData[];
  title: string;
  description: string;
  icon: React.ElementType;
}

/**
 * Fallback dimensions used only when the embed snippet doesn't carry
 * explicit width/height (e.g. admin pasted the plain URL instead of
 * the full iframe snippet). Matches Google Sheets' default pubchart size.
 */
const FALLBACK_WIDTH = 600;
const FALLBACK_HEIGHT = 371;

interface ScaledChartIframeProps {
  url: string;
  title: string;
  naturalWidth: number;
  naturalHeight: number;
  onLoad?: () => void;
}

/**
 * Renders a Google Sheets pubchart iframe at its natural (published)
 * dimensions, then scales it to fit the container width using a CSS
 * transform. Because we never change the iframe's own width/height,
 * Google Sheets produces the layout it designed for the chart — legend
 * position, font sizes, and line breaks stay intact. The container
 * height is driven by the natural aspect ratio, so every card reserves
 * exactly the right amount of space (no cropping, no inner scrollbars).
 */
function ScaledChartIframe({
  url,
  title,
  naturalWidth,
  naturalHeight,
  onLoad,
}: ScaledChartIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width === 0) return;
      setScale(width / naturalWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalWidth]);

  const scaledHeight = scale > 0 ? naturalHeight * scale : naturalHeight;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: scaledHeight }}
    >
      <iframe
        src={url}
        title={title}
        onLoad={onLoad}
        allow="fullscreen"
        style={{
          width: naturalWidth,
          height: naturalHeight,
          border: 'none',
          overflow: 'hidden',
          transform: scale > 0 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          display: 'block',
        }}
      />
    </div>
  );
}

export function ChartCarousel({ charts, title, description, icon: Icon }: ChartCarouselProps) {
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>(
    Object.fromEntries(charts.map((chart) => [chart.id, true])),
  );

  const handleChartLoad = (chartId: string) => {
    setLoadingCharts((prev) => ({ ...prev, [chartId]: false }));
  };

  const naturalDimsFor = (chart: ChartData) => ({
    width: chart.chart_width && chart.chart_width > 0 ? chart.chart_width : FALLBACK_WIDTH,
    height: chart.chart_height && chart.chart_height > 0 ? chart.chart_height : FALLBACK_HEIGHT,
  });

  return (
    <section className="mb-8 sm:mb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
        <h3 className="text-xl sm:text-2xl font-heading font-semibold text-primary">{title}</h3>
        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
          {charts.length} chart{charts.length > 1 ? 's' : ''}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{description}</p>

      {/* Grid Layout - All Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        {charts.map((chart, index) => {
          const dims = naturalDimsFor(chart);
          return (
            <article
              key={chart.id}
              className="w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <header className="px-4 pt-3 pb-2 border-b border-gray-100">
                <span className="inline-block text-xs font-heading font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded tracking-wide">
                  Chart {index + 1}
                </span>
              </header>

              {/* Chart iframe — rendered at natural size, scaled to card width */}
              <div className="relative bg-white">
                {loadingCharts[chart.id] && (
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50"
                    style={{ aspectRatio: `${dims.width} / ${dims.height}` }}
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                )}
                <ScaledChartIframe
                  url={chart.chart_embed_url}
                  title={`Chart ${index + 1}`}
                  naturalWidth={dims.width}
                  naturalHeight={dims.height}
                  onLoad={() => handleChartLoad(chart.id)}
                />
              </div>

              {/* Description — shown inline directly under the chart */}
              {chart.description && (
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
                  <h4 className="text-xs font-heading font-semibold uppercase tracking-wider text-primary/80 mb-2">
                    Penjelasan
                  </h4>
                  <p
                    className="text-sm leading-relaxed text-gray-700"
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {chart.description}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
