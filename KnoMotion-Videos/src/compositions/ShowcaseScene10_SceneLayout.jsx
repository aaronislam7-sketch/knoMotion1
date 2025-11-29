/**
 * Showcase Scene 10: Macro Scene Layout Test
 * Duration: 15 seconds (450 frames @ 30fps)
 * 
 * Tests the new macro scene layout module:
 * - resolveSceneSlots() to carve viewport into named slots
 * - Mid-scenes (TextRevealSequence) rendered inside slots
 * - JSON-driven slot configuration
 * 
 * ARCHITECTURE:
 * - Macro Layout: viewport → named slots (header, col1, col2, etc.)
 * - Mid-Scenes: fill slots with content
 * - Micro Layout: handled by mid-scenes internally via layoutEngine
 * 
 * Change the `sceneConfig.layout.type` to test different layouts:
 * - 'full': single content area
 * - 'rowStack': horizontal rows
 * - 'columnSplit': vertical columns  
 * - 'headerRowColumns': header + row + columns
 * - 'gridSlots': R×C grid
 */

import React from 'react';
import { AbsoluteFill, useVideoConfig } from 'remotion';
import { resolveSceneSlots } from '../sdk/scene-layout/sceneLayout';
import { TextRevealSequence } from '../sdk/mid-scenes/TextRevealSequence';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

// ============================================================================
// JSON CONFIGURATION - Change this to test different layouts
// ============================================================================

/**
 * Scene configuration with slots-based mid-scene rendering.
 * 
 * To test different layouts, change layout.type to:
 * - 'full'
 * - 'rowStack' (with options.rows)
 * - 'columnSplit' (with options.columns)
 * - 'headerRowColumns' (with options.columns)
 * - 'gridSlots' (with options.rows and options.columns)
 */
const sceneConfig = {
  id: "scene-layout-demo-001",
  title: "Macro Scene Layout Demo",

  // ========================================
  // LAYOUT CONFIGURATION
  // Change type here to test different layouts
  // ========================================
  layout: {
    type: "columnSplit",  // ← CHANGE THIS TO TEST DIFFERENT LAYOUTS
    options: {
      columns: 2,
      ratios: [1, 1],
      padding: 40,
      titleHeight: 100  // Default is 100px
    }
  },

  // ========================================
  // SLOTS - Mid-scenes render here
  // Slot names must match what resolveSceneSlots returns
  // ========================================
  slots: {
    header: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [
            { text: "🎬 Scene Layout Demo", emphasis: "high" }
          ],
          revealType: "fade",
          staggerDelay: 0.1,
          animationDuration: 0.6,
          lineSpacing: "tight",
          beats: { start: 0.3 }
        }
      }
    },

    col1: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [
            { text: "Hello World!", emphasis: "high" },
            { text: "This is Column 1", emphasis: "normal" },
            { text: "Left side content", emphasis: "low" }
          ],
          revealType: "slide",
          direction: "left",
          staggerDelay: 0.2,
          animationDuration: 0.8,
          lineSpacing: "normal",
          beats: { start: 1.0 }
        }
      }
    },

    col2: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [
            { text: "Hello World!", emphasis: "high" },
            { text: "This is Column 2", emphasis: "normal" },
            { text: "Right side content", emphasis: "low" }
          ],
          revealType: "slide",
          direction: "right",
          staggerDelay: 0.2,
          animationDuration: 0.8,
          lineSpacing: "normal",
          beats: { start: 1.5 }
        }
      }
    },

    // For rowStack layout testing
    row1: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Row 1: Hello World!", emphasis: "high" }],
          revealType: "fade",
          staggerDelay: 0.1,
          animationDuration: 0.6,
          beats: { start: 1.0 }
        }
      }
    },

    row2: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Row 2: Hello World!", emphasis: "normal" }],
          revealType: "slide",
          direction: "up",
          staggerDelay: 0.1,
          animationDuration: 0.6,
          beats: { start: 1.5 }
        }
      }
    },

    row3: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Row 3: Hello World!", emphasis: "low" }],
          revealType: "typewriter",
          staggerDelay: 0.1,
          animationDuration: 1.0,
          beats: { start: 2.0 }
        }
      }
    },

    // For full layout testing
    full: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [
            { text: "Hello World!", emphasis: "high" },
            { text: "Full Layout Mode", emphasis: "normal" },
            { text: "All content in one area", emphasis: "low" }
          ],
          revealType: "fade",
          staggerDelay: 0.3,
          animationDuration: 0.8,
          lineSpacing: "relaxed",
          beats: { start: 1.0 }
        }
      }
    },

    // For headerRowColumns layout - the "row" slot
    row: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Row Section: Hello World!", emphasis: "high" }],
          revealType: "fade",
          staggerDelay: 0.1,
          animationDuration: 0.6,
          beats: { start: 1.0 }
        }
      }
    },

    // For gridSlots layout testing
    cellA: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Cell A", emphasis: "high" }],
          revealType: "fade",
          animationDuration: 0.5,
          beats: { start: 1.0 }
        }
      }
    },
    cellB: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Cell B", emphasis: "normal" }],
          revealType: "fade",
          animationDuration: 0.5,
          beats: { start: 1.2 }
        }
      }
    },
    cellC: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Cell C", emphasis: "low" }],
          revealType: "fade",
          animationDuration: 0.5,
          beats: { start: 1.4 }
        }
      }
    },
    cellD: {
      midScene: "textReveal",
      props: {
        config: {
          lines: [{ text: "Cell D", emphasis: "high" }],
          revealType: "fade",
          animationDuration: 0.5,
          beats: { start: 1.6 }
        }
      }
    },
  }
};

// ============================================================================
// SLOT RENDERER COMPONENT
// Renders a mid-scene inside a slot's LayoutArea
// ============================================================================

/**
 * SlotRenderer - Renders mid-scene content inside a slot area.
 * 
 * Positions the content using the slot's LayoutArea (left, top, width, height)
 * and passes the area dimensions to the mid-scene for internal layout.
 * 
 * Header slots use bottom alignment (with padding for descenders).
 * Other slots use center alignment.
 * 
 * @param {Object} props
 * @param {Object} props.slot - LayoutArea { left, top, width, height }
 * @param {Object} props.midSceneConfig - Mid-scene configuration from JSON
 * @param {string} props.slotName - Name of the slot (for debugging)
 * @param {boolean} props.showDebug - Show debug borders
 */
const SlotRenderer = ({ slot, midSceneConfig, slotName, showDebug = false }) => {
  if (!slot || !midSceneConfig) return null;

  const { midScene, props } = midSceneConfig;

  // Determine if this is a header slot - use bottom alignment
  const isHeader = slotName === 'header';
  
  // Padding from bottom for descenders (letters like p, g, y, q)
  const descenderPadding = 10;

  // Enhance config with slot area for mid-scene to use
  const enhancedConfig = {
    ...props.config,
    // Pass slot area so mid-scene can use it for layout calculations
    position: {
      left: 0,
      top: 0,
      width: slot.width,
      height: slot.height,
    }
  };

  // Render appropriate mid-scene based on type
  const renderMidScene = () => {
    switch (midScene) {
      case 'textReveal':
        return <TextRevealSequence config={enhancedConfig} />;
      // Add more mid-scene types here as needed
      default:
        console.warn(`Unknown midScene type: ${midScene}`);
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: slot.left,
        top: slot.top,
        width: slot.width,
        height: slot.height,
        overflow: 'visible', // Allow slight overflow for text
        // Debug visualization
        ...(showDebug && {
          border: '2px dashed rgba(255, 107, 53, 0.5)',
          backgroundColor: 'rgba(255, 107, 53, 0.05)',
        }),
      }}
    >
      {/* Debug label */}
      {showDebug && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            fontSize: 12,
            fontWeight: 700,
            color: KNODE_THEME.colors.primary,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '2px 8px',
            borderRadius: 4,
            zIndex: 100,
          }}
        >
          {slotName}: {Math.round(slot.width)}×{Math.round(slot.height)}
        </div>
      )}

      {/* Mid-scene content - positioned relative to slot */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          // Header: align to bottom with descender padding
          // Other slots: center both axes
          alignItems: isHeader ? 'flex-end' : 'center',
          justifyContent: 'center',
          paddingBottom: isHeader ? descenderPadding : 0,
          boxSizing: 'border-box',
        }}
      >
        {renderMidScene()}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN SHOWCASE SCENE COMPONENT
// ============================================================================

export const ShowcaseScene10_SceneLayout = () => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  // Resolve slots from layout configuration
  const slots = resolveSceneSlots(sceneConfig.layout, viewport);

  // Debug: Show slot boundaries (set to true to visualize)
  const showDebug = true;

  // Get slot names that exist in both resolved slots AND scene config
  const configuredSlots = Object.keys(sceneConfig.slots).filter(
    slotName => slots[slotName]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
      }}
    >
      {/* Layout Info Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: 'monospace',
          zIndex: 200,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>
          Layout: {sceneConfig.layout.type}
        </div>
        <div style={{ color: '#aaa', fontSize: 12 }}>
          Slots: {Object.keys(slots).join(', ')}
        </div>
      </div>

      {/* Render each configured slot */}
      {configuredSlots.map((slotName) => (
        <SlotRenderer
          key={slotName}
          slot={slots[slotName]}
          midSceneConfig={sceneConfig.slots[slotName]}
          slotName={slotName}
          showDebug={showDebug}
        />
      ))}
    </AbsoluteFill>
  );
};

export default ShowcaseScene10_SceneLayout;
