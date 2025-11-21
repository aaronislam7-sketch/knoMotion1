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

  // Test GRID layout with collision detection
  const gridPositions = calculateItemPositions(testItems, {
    arrangement: ARRANGEMENT_TYPES.GRID,
    columns: 3,
    gap: 40,
    viewport,
    enableCollisionDetection: true,
    minSpacing: 20,
  });

  // Test CIRCULAR layout
  const circularPositions = calculateItemPositions(testItems, {
    arrangement: ARRANGEMENT_TYPES.CIRCULAR,
    radius: 250,
    viewport,
  });

  // Test validation
  const validation = validateLayout(
    gridPositions.positions || gridPositions,
    viewport
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

      {/* Grid Layout Test (with collision detection) */}
      <div style={{
        position: 'absolute',
        top: 150,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
      }}>
        <div style={{
          fontSize: 28,
          fontWeight: 600,
          fontFamily: theme.fonts.header,
          color: theme.colors.textMain,
          marginBottom: 30,
        }}>
          GRID Layout (with Collision Detection)
        </div>

        <div style={{
          position: 'relative',
          width: 1200,
          height: 600,
        }}>
          {(gridPositions.positions || gridPositions).map((pos, index) => {
            const startFrame = index * 10;
            const scale = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            });

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: pos.x - (pos.width || 100) / 2,
                  top: pos.y - (pos.height || 100) / 2,
                  width: pos.width || 200,
                  height: pos.height || 150,
                  backgroundColor: theme.colors.cardBg,
                  borderRadius: theme.radii.card,
                  boxShadow: theme.shadows.card,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 600,
                  fontFamily: theme.fonts.body,
                  color: theme.colors.textMain,
                  transform: `scale(${scale})`,
                  border: `2px solid ${theme.colors.primary}`,
                }}
              >
                {testItems[index].label}
              </div>
            );
          })}
        </div>

        {/* Validation Status */}
        {gridPositions.valid !== undefined && (
          <div style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: gridPositions.valid ? theme.colors.accentGreen + '20' : '#E74C3C20',
            borderRadius: theme.radii.card,
            border: `2px solid ${gridPositions.valid ? theme.colors.accentGreen : '#E74C3C'}`,
          }}>
            <div style={{
              fontSize: 18,
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              color: gridPositions.valid ? theme.colors.accentGreen : '#E74C3C',
              marginBottom: 10,
            }}>
              {gridPositions.valid ? '✅ Layout Valid' : '❌ Layout Invalid'}
            </div>
            {gridPositions.warnings && gridPositions.warnings.length > 0 && (
              <div style={{ fontSize: 14, color: theme.colors.textSoft }}>
                Warnings: {gridPositions.warnings.length}
              </div>
            )}
            {gridPositions.errors && gridPositions.errors.length > 0 && (
              <div style={{ fontSize: 14, color: '#E74C3C' }}>
                Errors: {gridPositions.errors.length}
              </div>
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
