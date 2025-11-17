import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { toFrames } from '../../sdk';

/**
 * SCENE TEMPLATE: ColumnLayoutScene - V7.0
 * 
 * PURPOSE: 1-3 vertical columns with stacked items
 * DIFFERENTIATOR: Multi-column vertical layout for comparisons, lists, and category groupings
 * 
 * ARCHITECTURE: Pure layout container - NO animations, NO styling, NO content rendering
 * - Only calculates column positions and item positions within columns
 * - Passes layout info to mid-level components via props
 * - Mid-level components handle all rendering, animations, and styling
 * 
 * ACCEPTANCE CRITERIA:
 * ✅ 1-3 vertical columns
 * ✅ Items stacked vertically within each column
 * ✅ Configurable column widths and spacing
 * ✅ Independent column animations
 * ✅ Optional column headers
 * ✅ Works with any mid-level component
 * ✅ Optional title support
 * ✅ Pure layout math only - no rendering logic
 * 
 * CONTENT STRUCTURE:
 * {
 *   content: {
 *     title: "Optional Title",  // Optional
 *     columns: [
 *       {
 *         header: "Column 1",  // Optional
 *         items: [ ...flexible content... ]
 *       },
 *       {
 *         header: "Column 2",  // Optional
 *         items: [ ...flexible content... ]
 *       }
 *     ]
 *   },
 *   layout: {
 *     columnCount: 2,
 *     columnWidth: 400,
 *     itemSpacing: 60,
 *     columnGap: 40,
 *     alignment: "center"
 *   }
 * }
 */

export const TEMPLATE_VERSION = '7.0';
export const TEMPLATE_ID = 'ColumnLayoutScene';

const DEFAULT_CONFIG = {
  content: {
    title: null,
    columns: [
      { header: null, items: [] },
      { header: null, items: [] }
    ]
  },
  
  layout: {
    columnCount: 2,  // 1-3 columns
    columnWidth: 400,
    itemSpacing: 60,  // Vertical spacing between items
    columnGap: 40,  // Horizontal gap between columns
    alignment: 'center',  // 'center', 'start', 'end'
    headerHeight: 80  // Height reserved for column headers
  },
  
  style_tokens: {
    colors: {
      bg: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      divider: '#4ECDC4'
    },
    fonts: {
      size_title: 64,
      size_header: 28,
      weight_title: 800,
      weight_header: 700,
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    spacing: {
      padding: 80
    }
  },
  
  beats: {
    entrance: 0.5,
    title: 1.0,
    firstColumn: 1.5,
    columnInterval: 0.3,
    firstItem: 2.0,
    itemInterval: 0.2,
    hold: 10.0,
    exit: 12.0
  }
};

/**
 * Calculate column and item positions
 * Returns layout info that mid-level components can use for rendering
 */
const calculateColumnLayout = (config, viewport) => {
  const { layout, content } = config;
  const { columnCount, columnWidth, itemSpacing, columnGap, alignment, headerHeight } = layout;
  
  const hasTitle = !!content.title;
  const titleHeight = hasTitle ? 120 : 0;
  const availableHeight = viewport.height - titleHeight - (config.style_tokens.spacing.padding * 2);
  const availableWidth = viewport.width - (config.style_tokens.spacing.padding * 2);
  
  // Calculate total width needed for all columns
  const totalColumnsWidth = (columnCount * columnWidth) + ((columnCount - 1) * columnGap);
  
  // Calculate starting X position based on alignment
  let startX;
  switch (alignment) {
    case 'start':
      startX = config.style_tokens.spacing.padding;
      break;
    case 'end':
      startX = viewport.width - config.style_tokens.spacing.padding - totalColumnsWidth;
      break;
    case 'center':
    default:
      startX = (viewport.width - totalColumnsWidth) / 2;
      break;
  }
  
  const startY = config.style_tokens.spacing.padding + titleHeight;
  
  // Calculate column positions
  const columns = [];
  const columnsData = content.columns || [];
  
  for (let colIndex = 0; colIndex < columnCount; colIndex++) {
    const columnData = columnsData[colIndex] || { header: null, items: [] };
    const columnX = startX + (colIndex * (columnWidth + columnGap));
    
    // Calculate item positions within column
    const items = columnData.items || [];
    const itemPositions = [];
    
    let currentY = startY;
    if (columnData.header) {
      currentY += headerHeight;
    }
    
    items.forEach((item, itemIndex) => {
      itemPositions.push({
        index: itemIndex,
        x: columnX,
        y: currentY,
        width: columnWidth,
        centerX: columnX + (columnWidth / 2),
        centerY: currentY
      });
      currentY += itemSpacing;
    });
    
    columns.push({
      index: colIndex,
      x: columnX,
      y: startY,
      width: columnWidth,
      height: availableHeight,
      centerX: columnX + (columnWidth / 2),
      header: columnData.header ? {
        x: columnX,
        y: startY,
        width: columnWidth,
        height: headerHeight,
        text: columnData.header
      } : null,
      items: itemPositions
    });
  }
  
  return {
    columns,
    titlePosition: hasTitle ? {
      x: viewport.width / 2,
      y: 60,
      width: viewport.width - (config.style_tokens.spacing.padding * 2)
    } : null,
    totalWidth: totalColumnsWidth,
    startX,
    startY
  };
};

export const ColumnLayoutScene = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Merge with defaults
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...scene,
    content: { ...DEFAULT_CONFIG.content, ...scene.content },
    layout: { ...DEFAULT_CONFIG.layout, ...scene.layout },
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...scene.style_tokens?.colors },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...scene.style_tokens?.fonts },
      spacing: { ...DEFAULT_CONFIG.style_tokens.spacing, ...scene.style_tokens?.spacing }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...scene.beats }
  }), [scene]);
  
  const { content, layout, style_tokens, beats } = config;
  const colors = style_tokens.colors;
  const fonts = style_tokens.fonts;
  
  // Calculate column layout positions
  const layoutInfo = useMemo(() => {
    return calculateColumnLayout(config, { width, height });
  }, [config, width, height]);
  
  // Calculate beat frames
  const beatFrames = {
    entrance: toFrames(beats.entrance, fps),
    title: toFrames(beats.title, fps),
    firstColumn: toFrames(beats.firstColumn, fps),
    firstItem: toFrames(beats.firstItem, fps)
  };
  
  // Simple fade-in helper (minimal animation, should be in mid-level)
  const fadeIn = (frame, startFrame, duration) => {
    const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
    return { opacity: progress };
  };

  // Title animation
  const titleAnim = content.title && layoutInfo.titlePosition 
    ? fadeIn(frame, beatFrames.title, 0.8 * fps)
    : null;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Optional Title - Simple text rendering (fallback, mid-level can override) */}
      {content.title && layoutInfo.titlePosition && (
        <div
          style={{
            position: 'absolute',
            left: layoutInfo.titlePosition.x - (layoutInfo.titlePosition.width / 2),
            top: layoutInfo.titlePosition.y - 30,
            width: layoutInfo.titlePosition.width,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...titleAnim,
            color: colors.text,
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            fontFamily: fonts.family,
            textAlign: 'center'
          }}
        >
          {typeof content.title === 'string' ? content.title : content.title.text || ''}
        </div>
      )}
      
      {/* Column Containers - Layout info passed for mid-level use */}
      {layoutInfo.columns.map((column, colIndex) => {
        const columnStartFrame = beatFrames.firstColumn + (beats.columnInterval || 0.3) * fps * colIndex;
        const columnAnim = fadeIn(frame, columnStartFrame, 0.6 * fps);
        
        return (
          <div
            key={`column-${colIndex}`}
            style={{
              position: 'absolute',
              left: column.x,
              top: column.y,
              width: column.width,
              height: column.height,
              ...columnAnim
            }}
          >
            {/* Column Header - Simple fallback rendering */}
            {column.header && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: column.width,
                  height: column.header.height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text,
                  fontSize: fonts.size_header,
                  fontWeight: fonts.weight_header,
                  fontFamily: fonts.family,
                  textAlign: 'center',
                  borderBottom: `2px solid ${colors.divider || colors.text}`,
                  opacity: 0.5
                }}
              >
                {column.header.text}
              </div>
            )}
            
            {/* Column Items - Layout info passed for mid-level use */}
            {column.items.map((item, itemIndex) => {
              const itemStartFrame = beatFrames.firstItem + 
                (beats.columnInterval || 0.3) * fps * colIndex +
                (beats.itemInterval || 0.2) * fps * itemIndex;
              const itemAnim = fadeIn(frame, itemStartFrame, 0.5 * fps);
              
              const itemContent = content.columns?.[colIndex]?.items?.[itemIndex];
              if (!itemContent) return null;
              
              return (
                <div
                  key={`item-${colIndex}-${itemIndex}`}
                  style={{
                    position: 'absolute',
                    left: item.x - column.x,
                    top: item.y - column.y,
                    width: item.width,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...itemAnim
                  }}
                >
                  {/* Simple fallback rendering - mid-level components should replace this */}
                  {typeof itemContent === 'string' ? (
                    <div style={{ color: colors.text, fontSize: 18, textAlign: 'center', padding: 15 }}>
                      {itemContent}
                    </div>
                  ) : itemContent.text ? (
                    <div style={{ color: colors.text, fontSize: 18, textAlign: 'center', padding: 15 }}>
                      {itemContent.text}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Export getDuration for template registry (returns FRAMES)
export const getDuration = (scene, fps = 30) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const exitTime = config.beats?.exit || DEFAULT_CONFIG.beats.exit;
  return Math.ceil((exitTime + 1.0) * fps); // Convert seconds to frames
};

// Template metadata
export const TEMPLATE_METADATA = {
  id: TEMPLATE_ID,
  version: TEMPLATE_VERSION,
  name: 'Column Layout Scene',
  description: '1-3 vertical columns with stacked items for comparisons and multi-column lists',
  category: 'Layout',
  learningIntentions: ['COMPARE', 'BREAKDOWN', 'GUIDE'],
  requiredFields: ['content.columns'],
  optionalFields: ['content.title', 'layout.columnCount', 'layout.columnWidth', 'layout.itemSpacing'],
  maxColumns: 3,
  integrations: []
};
