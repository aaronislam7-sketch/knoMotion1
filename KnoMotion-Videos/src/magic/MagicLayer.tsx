import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { MagicTokens, defaultMagicTokens } from './tokens';
import { breatheScale, paperGrainCSS, parallaxOffset, vignetteCSS } from './effects';

export type MagicLayerProps = {
  scene: any;
  tokens?: MagicTokens;
};

const ScribbleStar = ({ x, y, size = 48, color = '#000', opacity = 0.15 }) => (
  <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', opacity }}>
    <path
      d="M12 2l2.9 6.1 6.7.9-4.8 4.5 1.2 6.6L12 17.8 6 20.1l1.2-6.6L2.4 9l6.7-.9L12 2z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
);

export const MagicLayer: React.FC<MagicLayerProps> = ({ scene, tokens }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mode = scene?.style_tokens?.mode;
  const merged: MagicTokens = useMemo(() => ({
    ...defaultMagicTokens(mode),
    ...(tokens || {}),
  }), [tokens, mode]);

  // Enforce delight budget (animated effects)
  const animatedCount = [merged.breathe, merged.parallaxDrift, merged.highlightSwipe].filter(Boolean).length;
  if (animatedCount > (merged.delightBudget ?? 2)) {
    // eslint-disable-next-line no-console
    console.warn('[MagicLayer] delightBudget exceeded. Some effects may be ignored.');
  }

  const parallax = merged.parallaxDrift ? parallaxOffset(frame, merged.parallaxDrift.ampPx ?? 6) : { x: 0, y: 0 };

  const grainOpacity = mode === 'whiteboard' ? 0.05 : 0.08;

  return (
    <>
      {/* Paper grain and vignette overlays */}
      {merged.paper && (
        <AbsoluteFill style={{ pointerEvents: 'none', ...paperGrainCSS(grainOpacity) }} />
      )}
      {merged.vignette && (
        <AbsoluteFill style={{ pointerEvents: 'none', ...vignetteCSS(0.22) }} />
      )}

      {/* Scribble motifs with subtle parallax/breathe */}
      {Array.isArray(merged.motifs) && merged.motifs.length > 0 && (
        <AbsoluteFill style={{ pointerEvents: 'none', transform: `translate(${parallax.x}px, ${parallax.y}px)` }}>
          {/* Snap to 8px grid */}
          <div style={{ position: 'absolute', left: 32, top: 32 }}>
            {merged.motifs.includes('star.scribble') && (
              <div style={{ transform: `scale(${breatheScale(frame, fps, merged.breathe?.scale ?? [0.99, 1.01])})` }}>
                <ScribbleStar color={scene?.style_tokens?.colors?.accent || '#E74C3C'} />
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', right: 48, bottom: 48 }}>
            {merged.motifs.includes('star.scribble') && (
              <div style={{ transform: `scale(${breatheScale(frame, fps, merged.breathe?.scale ?? [0.99, 1.01])})` }}>
                <ScribbleStar color={scene?.style_tokens?.colors?.accent2 || '#E67E22'} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};

export default MagicLayer;
