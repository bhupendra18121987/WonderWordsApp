// Split a string into user-perceived characters (grapheme clusters).
// For English this behaves like `Array.from(s)` — each Latin letter is one
// grapheme. For Devanagari (Hindi) it correctly groups a consonant with any
// attached matras / anusvara / nukta so `गा` is one cell, not two.
//
// Uses `Intl.Segmenter` when available (all modern browsers + Node 16+).
// Falls back to code-point splitting on ancient runtimes.

// Minimal structural types — we don't rely on newer TS lib definitions.
interface GraphemeSegment { segment: string }
interface GraphemeSegmenter {
  segment(input: string): Iterable<GraphemeSegment>;
}
interface SegmenterCtor {
  new (locale?: string, options?: { granularity: 'grapheme' | 'word' | 'sentence' }): GraphemeSegmenter;
}

let cachedSegmenter: GraphemeSegmenter | null | undefined = undefined;

function getSegmenter(): GraphemeSegmenter | null {
  if (cachedSegmenter !== undefined) return cachedSegmenter;
  const S = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter;
  cachedSegmenter = S ? new S(undefined, { granularity: 'grapheme' }) : null;
  return cachedSegmenter;
}

export function splitGraphemes(text: string): string[] {
  if (!text) return [];
  const seg = getSegmenter();
  if (seg) {
    const out: string[] = [];
    for (const s of seg.segment(text)) out.push(s.segment);
    return out;
  }
  return Array.from(text);
}

export function graphemeLength(text: string): number {
  return splitGraphemes(text).length;
}
