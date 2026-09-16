/**
 * Pixel checks for Stage 9 render-check (Sept M2).
 *
 * Two checks only, both deterministic and both computed as a diff against a
 * BASELINE still of the same scene at the same frame with every slot removed
 * (background only). Diffing against the baseline — rather than looking for
 * "uniform" regions — means textured or animated backgrounds (notebook paper,
 * chalkboard, spotlight vignette) never read as content and never hide the
 * absence of content.
 *
 *   blank_slot  — a slot the config fills has (almost) no pixels that differ
 *                 from the background where the layout engine placed it.
 *   edge_bleed  — pixels differ from the background inside the outer safe band
 *                 (desktop 60px / mobile 40px, from getViewportPadding).
 *
 * Everything here is pure: RGBA buffers in, numbers out. Thresholds are
 * expressed at NATIVE resolution (1920×1080 / 1080×1920) and scaled by the
 * still's render scale, so a 0.5-scale render uses the same knobs.
 */

import { PNG } from 'pngjs';
import type { LayoutArea as SlotRect } from '../geometry';

export interface RgbaImage {
  width: number;
  height: number;
  /** RGBA, row-major, 4 bytes per pixel. */
  data: Uint8Array;
}

export interface RenderCheckThresholds {
  /** Per-channel |a−b| above which a pixel counts as "different from background". */
  pixelTolerance: number;
  /**
   * A slot with fewer differing pixels than this (native px) is blank.
   * Calibrated on real stills: a broken <img> shows ~780px of alt text, the
   * shortest legitimate content (a 4-letter header title) ~2,300px, one body
   * line ~14,000px; a deterministic render's noise is 0.
   */
  blankMinPixels: number;
  /**
   * Edge bleed is reported when differing pixels in a band exceed this share
   * of the band's area. 0.2% of the 1920×60 top band is ~230 native px —
   * enough to ignore a soft drop shadow, not enough to hide a clipped glyph.
   */
  edgeBleedMaxCoverage: number;
}

export const DEFAULT_THRESHOLDS: RenderCheckThresholds = {
  pixelTolerance: 28,
  blankMinPixels: 1500,
  edgeBleedMaxCoverage: 0.002,
};

export type Edge = 'top' | 'right' | 'bottom' | 'left';
export const EDGES: Edge[] = ['top', 'right', 'bottom', 'left'];

export interface RegionStats {
  /** Pixels examined (after clipping the rect to the image). */
  area: number;
  /** Pixels that differ from the baseline by more than the tolerance. */
  changed: number;
  /** changed / area, 0 when the region is empty. */
  coverage: number;
}

export interface SlotResult extends RegionStats {
  slot: string;
  blank: boolean;
}

export interface EdgeResult extends RegionStats {
  edge: Edge;
  bleed: boolean;
}

// ---------------------------------------------------------------------------
// Decoding
// ---------------------------------------------------------------------------

export const decodePng = (buf: Buffer | Uint8Array): RgbaImage => {
  const png = PNG.sync.read(Buffer.from(buf));
  return { width: png.width, height: png.height, data: new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.byteLength) };
};

/** Test helper / inverse of decodePng — encodes an RGBA image as PNG bytes. */
export const encodePng = (img: RgbaImage): Buffer => {
  const png = new PNG({ width: img.width, height: img.height });
  png.data = Buffer.from(img.data.buffer, img.data.byteOffset, img.data.byteLength);
  return PNG.sync.write(png);
};

// ---------------------------------------------------------------------------
// Region diff
// ---------------------------------------------------------------------------

const assertSameSize = (a: RgbaImage, b: RgbaImage): void => {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(`render-check: content still is ${a.width}×${a.height} but baseline is ${b.width}×${b.height}`);
  }
};

/** Clips a rect to the image and rounds to whole pixels. */
const clipRect = (rect: SlotRect, width: number, height: number) => {
  const left = Math.max(0, Math.floor(rect.left));
  const top = Math.max(0, Math.floor(rect.top));
  const right = Math.min(width, Math.ceil(rect.left + rect.width));
  const bottom = Math.min(height, Math.ceil(rect.top + rect.height));
  return { left, top, right, bottom };
};

/**
 * Counts pixels inside `rect` where the content differs from the baseline by
 * more than `tolerance` on any RGB channel (alpha is ignored — stills are
 * opaque).
 */
export const regionDiff = (
  content: RgbaImage, baseline: RgbaImage, rect: SlotRect, tolerance = DEFAULT_THRESHOLDS.pixelTolerance,
): RegionStats => {
  assertSameSize(content, baseline);
  const { left, top, right, bottom } = clipRect(rect, content.width, content.height);
  if (right <= left || bottom <= top) return { area: 0, changed: 0, coverage: 0 };

  const a = content.data;
  const b = baseline.data;
  const stride = content.width * 4;
  let changed = 0;
  for (let y = top; y < bottom; y++) {
    let i = y * stride + left * 4;
    for (let x = left; x < right; x++, i += 4) {
      if (
        Math.abs(a[i] - b[i]) > tolerance ||
        Math.abs(a[i + 1] - b[i + 1]) > tolerance ||
        Math.abs(a[i + 2] - b[i + 2]) > tolerance
      ) changed++;
    }
  }
  const area = (right - left) * (bottom - top);
  return { area, changed, coverage: changed / area };
};

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

/** Scales native-resolution slot rects to the still's pixel grid. */
export const scaleRect = (rect: SlotRect, scale: number): SlotRect => ({
  left: rect.left * scale, top: rect.top * scale, width: rect.width * scale, height: rect.height * scale,
});

/**
 * blank_slot — for every configured slot, does anything render where the
 * layout engine placed it? `slots` are the NATIVE-resolution rects from
 * resolveSlots(); `scale` is the still's render scale.
 */
export const checkSlots = (
  content: RgbaImage, baseline: RgbaImage, slots: Record<string, SlotRect>, scale: number,
  thresholds: RenderCheckThresholds = DEFAULT_THRESHOLDS,
): SlotResult[] => {
  const minPixels = thresholds.blankMinPixels * scale * scale;
  return Object.entries(slots).map(([slot, rect]) => {
    const stats = regionDiff(content, baseline, scaleRect(rect, scale), thresholds.pixelTolerance);
    return { slot, ...stats, blank: stats.changed < minPixels };
  });
};

/** The four outer bands of a `band`-pixel safe zone (native px), as rects. */
export const edgeBands = (width: number, height: number, band: number): Record<Edge, SlotRect> => ({
  top: { left: 0, top: 0, width, height: band },
  bottom: { left: 0, top: height - band, width, height: band },
  // Left/right exclude the corners already covered by top/bottom so a bleed is
  // attributed to exactly one edge.
  left: { left: 0, top: band, width: band, height: height - 2 * band },
  right: { left: width - band, top: band, width: band, height: height - 2 * band },
});

/**
 * edge_bleed — does anything render inside the outer safe band? `viewport`
 * and `band` are native px; `scale` is the still's render scale.
 */
export const checkEdgeBleed = (
  content: RgbaImage, baseline: RgbaImage, viewport: { width: number; height: number }, band: number, scale: number,
  thresholds: RenderCheckThresholds = DEFAULT_THRESHOLDS,
): EdgeResult[] => {
  const bands = edgeBands(viewport.width, viewport.height, band);
  return EDGES.map((edge) => {
    const stats = regionDiff(content, baseline, scaleRect(bands[edge], scale), thresholds.pixelTolerance);
    return { edge, ...stats, bleed: stats.coverage > thresholds.edgeBleedMaxCoverage };
  });
};
