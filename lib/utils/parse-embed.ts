/**
 * Utilities for parsing Google Sheets chart embed snippets.
 *
 * Google Sheets' "Publish to the web" dialog gives two options:
 *  - Link: a plain URL (no width/height info)
 *  - Embed: a full <iframe ...> snippet with width + height attributes
 *
 * We accept both. If the admin pastes the full iframe snippet, we extract
 * the recommended natural dimensions so the chart renders at the size
 * Google designed it for (chart + legend fits perfectly). Otherwise we
 * fall back to default dimensions.
 */

export interface ParsedEmbed {
  src: string;
  width: number | null;
  height: number | null;
}

/** Matches `<iframe ... src="..." width="..." height="..." ...>` in any order. */
export function parseChartEmbed(input: string): ParsedEmbed {
  const trimmed = input.trim();

  // If it doesn't look like HTML, treat it as a raw URL.
  if (!trimmed.startsWith('<')) {
    return { src: trimmed, width: null, height: null };
  }

  const pick = (attr: string): string | null => {
    // attr="value" or attr='value'
    const re = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i');
    const m = trimmed.match(re);
    return m ? m[1] : null;
  };

  const toInt = (raw: string | null): number | null => {
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  return {
    src: pick('src') ?? trimmed,
    width: toInt(pick('width')),
    height: toInt(pick('height')),
  };
}
