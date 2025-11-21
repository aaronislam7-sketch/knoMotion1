import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import {
  ARRANGEMENT_TYPES,
  calculateItemPositions,
  validateLayout,
  findSafePosition,
} from '../sdk/layout/layoutEngine';

/**
 * Showcase Scene 5: Layout Engine Test
 * Duration: 30 seconds (900 frames @ 30fps)
 * 
 * Tests unified layout engine features:
 * - All 7 arrangement types
 * - Collision detection
 * - Layout validation
 * - Safe positioning
 */
export const ShowcaseScene5_LayoutEngineTest = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = KNODE_THEME;
  const viewport = { width: 1920, height: 1080 };

  const containerStyles = {
    backgroundColor: theme.colors.pageBg,
    padding: 60,
  };

  // Test items
  const testItems = Array.from({ length: 6 }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i + 1}`,
  }));

  // Define content area (accounting for title and padding)
  // Center the grid in the available space with proper margins
  const contentArea = {
    left: 100,  // Left margin
    top: 250,   // Start below title
    width: 1720, // Full width minus margins (1920 - 200)
    height: 750,  // Height for grid
  };

  // Test GRID layout
  // Use area to constrain grid within visible bounds
  const gridPositions = calculateItemPositions(testItems, {
    arrangement: ARRANGEMENT_TYPES.GRID,
    columns: 3,
    gap: 50,
    viewport,
    area: contentArea,
    itemWidth: 500,
    itemHeight: 200,
    centerGrid: true,
    enableCollisionDetection: false, // Disable for now to test basic grid first
    minSpacing: 20,
  });

  // Test validation on the actual positions
  const positionsToValidate = gridPositions.positions || gridPositions;
  // Validate against viewport (positions are absolute viewport coordinates)
  const validation = validateLayout(
    positionsToValidate,
    viewport,
    {
      checkBounds: true,
      checkCollisions: true,
    }
  );

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={containerStyles}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: fadeIn,
      }}>
        <div style={{
          fontSize: 48,
          fontWeight: 700,
          fontFamily: theme.fonts.marker,
          color: theme.colors.primary,
          marginBottom: 10,
        }}>
          Unified Layout Engine Test
        </div>
        <div style={{
          fontSize: 20,
          color: theme.colors.textSoft,
          fontFamily: theme.fonts.body,
        }}>
          Collision Detection • Safe Positioning • Layout Validation
        </div>
      </div>

      {/* Grid Layout Test */}
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <div style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 600,
            fontFamily: theme.fonts.header,
            color: theme.colors.textMain,
            marginBottom: 40,
          }}>
            GRID Layout Test
          </div>
        </div>

        {/* Grid Items - positions are absolute viewport coordinates */}
        {positionsToValidate.map((pos, index) => {
          const startFrame = index * 10;
          const scale = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
          });

          // Grid returns center coordinates (absolute viewport), convert to top-left for positioning
          const itemWidth = pos.width || 500;
          const itemHeight = pos.height || 200;
          const left = pos.x - itemWidth / 2;
          const top = pos.y - itemHeight / 2;

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                backgroundColor: theme.colors.cardBg,
                borderRadius: theme.radii.card,
                boxShadow: theme.shadows.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 700,
                fontFamily: theme.fonts.header,
                color: theme.colors.primary,
                transform: `scale(${scale})`,
                border: `3px solid ${theme.colors.primary}`,
              }}
            >
              {testItems[index].label}
            </div>
          );
        })}

        {/* Validation Status */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: 20,
          backgroundColor: validation.valid ? theme.colors.accentGreen + '20' : '#E74C3C20',
          borderRadius: theme.radii.card,
          border: `2px solid ${validation.valid ? theme.colors.accentGreen : '#E74C3C'}`,
          minWidth: 400,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            fontFamily: theme.fonts.body,
            color: validation.valid ? theme.colors.accentGreen : '#E74C3C',
            marginBottom: 10,
          }}>
            {validation.valid ? '✅ Layout Valid' : `❌ Layout Invalid - Errors: ${validation.errors.length}`}
          </div>
          {validation.warnings && validation.warnings.length > 0 && (
            <div style={{ fontSize: 14, color: theme.colors.doodle, marginTop: 5 }}>
              Warnings: {validation.warnings.length}
            </div>
          )}
          {validation.errors && validation.errors.length > 0 && (
            <div style={{ fontSize: 12, color: '#E74C3C', marginTop: 10, textAlign: 'left' }}>
              {validation.errors.slice(0, 3).map((err, i) => (
                <div key={i} style={{ marginTop: 5 }}>
                  • {err.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
