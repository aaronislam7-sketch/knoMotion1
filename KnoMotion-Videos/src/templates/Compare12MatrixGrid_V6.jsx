import React, { useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

// SDK imports - Agnostic Template System v6
import { 
  fadeUpIn,
  slideInLeft,
  slideInRight,
  popInSpring,
  EZ,
  toFrames,
  renderHero,
  mergeHeroConfig,
  resolvePosition,
  positionToCSS,
  generateAmbientParticles,
  renderAmbientParticles
} from '../sdk';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../sdk/fontSystem';
import { createTransitionProps } from '../sdk/transitions';

/**
 * TEMPLATE #12: MATRIX COMPARISON GRID - v6.0
 * 
 * PRIMARY INTENTION: COMPARE
 * SECONDARY INTENTIONS: BREAKDOWN, GUIDE
 * 
 * PURPOSE: Side-by-side comparison across multiple dimensions
 * 
 * VISUAL PATTERN:
 * - Grid layout (2x2, 2x3, 3x3, 2x4 configurable)
 * - Row headers (dimensions/criteria)
 * - Column headers (items being compared)
 * - Cell content: text, icons, checkmarks, ratings
 * - Progressive reveal with highlight winner
 * 
 * ONE CONCEPT RULE:
 * - Screen 1: Show title + empty grid structure
 * - Transition: Mid-scene wipe
 * - Screen 2: Fill grid row-by-row or column-by-column
 * - Transition: Highlight phase
 * - Screen 3: Winner/conclusion reveal
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (cell content via hero registry)
 * ✓ Data-Driven Structure (dynamic grid dimensions)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (content/layout/style/animation)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible cell types)
 */

// Default configuration
const DEFAULT_CONFIG = {
  title: {
    text: 'Feature Comparison',
    position: 'top-center',
    offset: { x: 0, y: 40 }
  },
  
  // Grid structure
  columns: [
    { header: 'Option A', highlight: false },
    { header: 'Option B', highlight: false }
  ],
  
  rows: [
    { 
      header: 'Feature 1',
      cells: ['✓', '✗']
    },
    { 
      header: 'Feature 2',
      cells: ['✓', '✓']
    }
  ],
  
  // Visual configuration
  fillAnimation: 'by-row', // by-row, by-column, cascade, all-at-once
  highlightWinner: true,
  winnerColumn: 0, // Which column to highlight (0-indexed)
  showConclusion: true,
  conclusionText: 'Option A is the best choice',
  
  style_tokens: {
    colors: {
      bg: '#FFF9F0',
      accent: '#FF6B35',
      accent2: '#9B59B6',
      ink: '#1A1A1A',
      gridLines: '#CCCCCC',
      cellBg: '#FFFFFF',
      headerBg: '#F5F5DC',
      highlight: '#FFD700',
      checkmark: '#00C853',
      cross: '#D32F2F'
    },
    fonts: {
      size_title: 64,
      size_header: 32,
      size_cell: 28,
      size_conclusion: 36
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.6,
    gridStructure: 1.2,
    fillStart: 2.0,
    cellInterval: 0.4, // Time between each cell reveal
    highlightStart: 0.8, // After all cells filled
    highlightDuration: 1.0,
    conclusion: 1.5,
    exit: 2.0
  },
  
  animation: {
    titleAnimation: 'fade-up',
    cellEntrance: 'pop', // fade, pop, slide-left
    highlightStyle: 'glow', // glow, border, scale
    easing: 'power3InOut'
  },
  typography: {
    voice: 'utility',
    align: 'center',
    transform: 'none'
  },
  transition: {
    exit: { style: 'fade', durationInFrames: 18, easing: 'smooth' }
  }
};

// Calculate grid layout positions
const calculateGridLayout = (rows, columns, width, height, margins = {}) => {
  const { top = 180, left = 100, right = 100, bottom = 180 } = margins;
  
  const availableWidth = width - left - right;
  const availableHeight = height - top - bottom;
  
  const colCount = columns.length + 1; // +1 for row headers
  const rowCount = rows.length + 1; // +1 for column headers
  
  const cellWidth = availableWidth / colCount;
  const cellHeight = availableHeight / rowCount;
  
  return {
    cellWidth,
    cellHeight,
    startX: left,
    startY: top,
    colCount,
    rowCount
  };
};

// Render cell content based on type
const renderCellContent = (content, colors, fonts, frame, beats, fps, EZ, fontTokens) => {
  // Checkmark
  if (content === '✓' || content === 'check' || content === 'yes') {
    return (
      <div style={{
        fontSize: fonts.size_cell * 1.5,
        fontWeight: 900,
        color: colors.checkmark,
        fontFamily: fontTokens.display.family
      }}>
        ✓
      </div>
    );
  }
  
  // Cross/No
  if (content === '✗' || content === 'cross' || content === 'no' || content === '×') {
    return (
      <div style={{
        fontSize: fonts.size_cell * 1.5,
        fontWeight: 900,
        color: colors.cross,
        fontFamily: fontTokens.display.family
      }}>
        ✗
      </div>
    );
  }
  
  // Rating (1-5)
  if (typeof content === 'number' && content >= 1 && content <= 5) {
    return (
      <div style={{
        display: 'flex',
        gap: 4,
        fontSize: fonts.size_cell * 0.8
      }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < content ? colors.accent : colors.gridLines }}>
            ★
          </span>
        ))}
      </div>
    );
  }
  
  // Object with type (hero visual)
  if (typeof content === 'object' && content !== null && content.type) {
    return renderHero(
      mergeHeroConfig({ ...content, size: 40 }),
      frame,
      beats,
      colors,
      EZ,
      fps
    );
  }
  
  // Plain text
  return (
    <div className="text-center leading-tight max-w-[90%]" style={{
      fontSize: fonts.size_cell,
      fontWeight: 600,
      fontFamily: fontTokens.body.family,
      color: colors.ink,
      wordWrap: 'break-word'
    }}>
      {content}
    </div>
  );
};

export const Compare12MatrixGrid = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  if (!scene) {
    return <AbsoluteFill style={{ backgroundColor: '#1A1A2E' }} />;
  }
  
  // Font loading
  const typography = { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) };
  const fontTokens = buildFontTokens(typography.voice || DEFAULT_FONT_VOICE);
  
  useEffect(() => {
    loadFontVoice(typography.voice || DEFAULT_FONT_VOICE);
  }, [typography.voice]);
  
  // Merge with defaults
  const config = {
    ...DEFAULT_CONFIG,
    ...scene,
    title: { ...DEFAULT_CONFIG.title, ...(scene.title || {}) },
    columns: scene.columns || DEFAULT_CONFIG.columns,
    rows: scene.rows || DEFAULT_CONFIG.rows,
    style_tokens: {
      colors: { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) },
      fonts: { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) }
    },
    beats: { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) },
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const beats = config.beats;
  const columns = config.columns;
  const rows = config.rows;
  
  // Calculate grid layout - ensure it stays below title safe zone
  const TITLE_SAFE_ZONE = 140; // Title lives in 0-140px zone
  const layout = calculateGridLayout(rows, columns, width, height, {
    top: TITLE_SAFE_ZONE + 60, // Start well below title
    left: 120,
    right: 120,
    bottom: config.showConclusion ? 220 : 180
  });
  
  // Ambient particles
  const particles = generateAmbientParticles(20, 12001, width, height);
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation
  const titleStartFrame = toFrames(beats.titleEntry, fps);
  const titleAnim = fadeUpIn(frame, {
    start: beats.titleEntry,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  const titlePos = resolvePosition(
    config.title.position || DEFAULT_CONFIG.title.position,
    config.title.offset || DEFAULT_CONFIG.title.offset,
    { width, height }
  );
  
  // Grid structure animation
  const gridStartFrame = toFrames(beats.gridStructure, fps);
  const gridProgress = Math.min((frame - gridStartFrame) / toFrames(0.6, fps), 1);
  const gridOpacity = frame >= gridStartFrame ? EZ.smooth(gridProgress) : 0;
  
  // Cell fill animation
  const fillStartFrame = toFrames(beats.fillStart, fps);
  const totalCells = rows.length * columns.length;
  
  // Calculate which cells should be visible
  const getCellVisibility = (rowIndex, colIndex) => {
    const cellTime = beats.fillStart + (
      config.fillAnimation === 'by-row' ? (rowIndex * columns.length + colIndex) * beats.cellInterval :
      config.fillAnimation === 'by-column' ? (colIndex * rows.length + rowIndex) * beats.cellInterval :
      config.fillAnimation === 'cascade' ? ((rowIndex + colIndex) * 0.5) * beats.cellInterval :
      0
    );
    
    const cellStartFrame = toFrames(cellTime, fps);
    
    if (frame < cellStartFrame) return { visible: false, progress: 0 };
    
    const cellProgress = Math.min((frame - cellStartFrame) / toFrames(0.4, fps), 1);
    return { visible: true, progress: cellProgress };
  };
  
  // Highlight animation
  const highlightStartTime = beats.fillStart + (totalCells * beats.cellInterval) + beats.highlightStart;
  const highlightStartFrame = toFrames(highlightStartTime, fps);
  const highlightProgress = frame >= highlightStartFrame ? 
    Math.min((frame - highlightStartFrame) / toFrames(beats.highlightDuration, fps), 1) : 0;
  
  // Conclusion animation
  const conclusionStartTime = highlightStartTime + beats.highlightDuration + 0.3;
  const conclusionStartFrame = toFrames(conclusionStartTime, fps);
  const conclusionAnim = fadeUpIn(frame, {
    start: conclusionStartTime,
    dur: 0.8,
    dist: 40,
    ease: 'smooth'
  }, EZ, fps);
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ backgroundColor: colors.bg, fontFamily: fontTokens.body.family }}>
      {/* Ambient particles */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.3
        }}
        viewBox="0 0 1920 1080"
      >
        {particleElements.map(p => p.element)}
      </svg>
      
      {/* Title - Fixed at top in safe zone */}
      {frame >= titleStartFrame && (
        <div className="absolute left-1/2 text-center max-w-[90%] z-[100]" style={{
          top: 70,
          fontSize: fonts.size_title,
          fontWeight: 900,
          fontFamily: fontTokens.title.family,
          color: colors.accent,
          textAlign: typography.align,
          opacity: titleAnim.opacity,
          transform: `translate(-50%, 0) translateY(${titleAnim.translateY}px)`,
          textTransform: typography.transform !== 'none' ? typography.transform : undefined
        }}>
          {config.title.text}
        </div>
      )}
      
      {/* Grid Container */}
      {frame >= gridStartFrame && (
        <div style={{
          position: 'absolute',
          left: layout.startX,
          top: layout.startY,
          opacity: gridOpacity,
          zIndex: 5
        }}>
          {/* Column Headers */}
          <div style={{ display: 'flex' }}>
            {/* Empty top-left corner */}
            <div style={{
              width: layout.cellWidth,
              height: layout.cellHeight,
              backgroundColor: colors.headerBg,
              border: `2px solid ${colors.gridLines}`,
              borderRadius: 8
            }} />
            
            {/* Column headers */}
            {columns.map((col, colIndex) => {
              const isHighlighted = config.highlightWinner && config.winnerColumn === colIndex && highlightProgress > 0;
              const highlightGlow = isHighlighted ? `0 0 30px ${colors.highlight}` : 'none';
              const borderWidth = isHighlighted ? 5 : 3;
              
              return (
                <div key={colIndex} style={{
                  width: layout.cellWidth,
                  height: layout.cellHeight,
                  backgroundColor: isHighlighted ? colors.highlight : colors.headerBg,
                  border: `${borderWidth}px solid ${isHighlighted ? colors.accent : colors.gridLines}`,
                  borderRadius: 8,
                  marginLeft: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: fonts.size_header,
                  fontWeight: 800,
                  fontFamily: fontTokens.display.family,
                  color: isHighlighted ? colors.ink : colors.accent2,
                  boxShadow: highlightGlow,
                  transition: 'all 0.3s ease'
                }}>
                  {col.header}
                </div>
              );
            })}
          </div>
          
          {/* Rows */}
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', marginTop: 4 }}>
              {/* Row header */}
              <div className="flex items-center justify-center text-center p-3" style={{
                width: layout.cellWidth,
                height: layout.cellHeight,
                backgroundColor: colors.headerBg,
                border: `2px solid ${colors.gridLines}`,
                borderRadius: 8,
                fontSize: fonts.size_header,
                fontWeight: 700,
                fontFamily: fontTokens.accent.family,
                color: colors.ink
              }}>
                {row.header}
              </div>
              
              {/* Cells */}
              {row.cells.map((cell, colIndex) => {
                const visibility = getCellVisibility(rowIndex, colIndex);
                if (!visibility.visible) return (
                  <div key={colIndex} style={{
                    width: layout.cellWidth,
                    height: layout.cellHeight,
                    marginLeft: 4
                  }} />
                );
                
                const isHighlighted = config.highlightWinner && config.winnerColumn === colIndex && highlightProgress > 0;
                const cellScale = config.animation.cellEntrance === 'pop' && !isHighlighted ?
                  EZ.backOut(visibility.progress) :
                  1;
                const cellOpacity = EZ.smooth(visibility.progress);
                const borderWidth = isHighlighted ? 4 : 2;
                
                return (
                  <div key={colIndex} style={{
                    width: layout.cellWidth,
                    height: layout.cellHeight,
                    backgroundColor: isHighlighted ? colors.highlight : colors.cellBg,
                    border: `${borderWidth}px solid ${isHighlighted ? colors.accent : colors.gridLines}`,
                    borderRadius: 8,
                    marginLeft: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: cellOpacity,
                    transform: `scale(${cellScale})`,
                    boxShadow: isHighlighted ? `0 0 20px ${colors.highlight}` : '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {renderCellContent(cell, colors, fonts, frame, beats, fps, EZ, fontTokens)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      
      {/* Conclusion text */}
      {config.showConclusion && frame >= conclusionStartFrame && (
        <div className="absolute left-1/2 text-center max-w-[80%] bg-white rounded-card shadow-soft z-10" style={{
          bottom: 80,
          transform: `translate(-50%, 0) translateY(${conclusionAnim.translateY}px)`,
          fontSize: fonts.size_conclusion,
          fontWeight: 700,
          fontFamily: fontTokens.display.family,
          color: colors.accent,
          opacity: conclusionAnim.opacity,
          padding: '20px 40px',
          border: `3px solid ${colors.accent}`
        }}>
          {config.conclusionText}
        </div>
      )}
    </AbsoluteFill>
  );
};

// Required exports
export const TEMPLATE_ID = 'Compare12MatrixGrid';
export const TEMPLATE_VERSION = '6.0.0';

// Attach version to component for TemplateRouter detection
Compare12MatrixGrid.TEMPLATE_VERSION = '6.0.0';
Compare12MatrixGrid.TEMPLATE_ID = 'Compare12MatrixGrid';

export const LEARNING_INTENTIONS = {
  primary: ['compare'],
  secondary: ['breakdown', 'guide'],
  tags: ['comparison', 'matrix', 'grid', 'features', 'decision']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const rows = config.rows || DEFAULT_CONFIG.rows;
  const columns = config.columns || DEFAULT_CONFIG.columns;
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalCells = rows.length * columns.length;
  const fillDuration = totalCells * beats.cellInterval;
  const conclusionDuration = config.showConclusion ? beats.conclusion + 1.5 : 0;
  
  const totalDuration = beats.fillStart + fillDuration + beats.highlightStart + 
                        beats.highlightDuration + conclusionDuration + beats.exit;
  
  return toFrames(totalDuration, fps);
};

export const CAPABILITIES = {
  usesSVG: false,
  usesRoughJS: false,
  usesLottie: false,
  requiresAudio: false,
  dynamicGrid: true,
  maxColumns: 4,
  minColumns: 2,
  maxRows: 5,
  minRows: 2
};

// Configuration schema for AdminConfig integration
export const CONFIG_SCHEMA = {
  title: {
    type: 'object',
    fields: {
      text: { type: 'string', required: true },
      position: { type: 'position-token', default: 'top-center' },
      offset: { type: 'offset', default: { x: 0, y: 40 } }
    }
  },
  columns: {
    type: 'dynamic-array',
    min: 2,
    max: 4,
    itemSchema: {
      header: { type: 'string', required: true },
      highlight: { type: 'boolean', default: false }
    }
  },
  rows: {
    type: 'dynamic-array',
    min: 2,
    max: 5,
    itemSchema: {
      header: { type: 'string', required: true },
      cells: { type: 'array', items: 'mixed' }
    }
  },
  fillAnimation: {
    type: 'enum',
    options: ['by-row', 'by-column', 'cascade', 'all-at-once'],
    default: 'by-row'
  },
  highlightWinner: {
    type: 'boolean',
    default: true
  },
  winnerColumn: {
    type: 'number',
    min: 0,
    default: 0
  },
  showConclusion: {
    type: 'boolean',
    default: true
  },
  conclusionText: {
    type: 'string',
    default: ''
  },
  style_tokens: {
    type: 'style-tokens',
    colors: ['bg', 'accent', 'accent2', 'ink', 'gridLines', 'cellBg', 'headerBg', 'highlight', 'checkmark', 'cross'],
    fonts: ['size_title', 'size_header', 'size_cell', 'size_conclusion']
  },
  beats: {
    type: 'timeline',
    beats: ['entrance', 'titleEntry', 'gridStructure', 'fillStart', 'cellInterval', 'highlightStart', 'highlightDuration', 'conclusion', 'exit']
  },
  animation: {
    type: 'animation-config',
    options: {
      titleAnimation: ['fade-up', 'slide-left', 'pop'],
      cellEntrance: ['fade', 'pop', 'slide-left'],
      highlightStyle: ['glow', 'border', 'scale'],
      easing: ['power3InOut', 'backOut', 'smooth']
    }
  },
  typography: {
    voice: { type: 'select', label: 'Font Voice', options: ['notebook', 'story', 'utility'] },
    align: { type: 'select', label: 'Text Align', options: ['left', 'center', 'right'] },
    transform: { type: 'select', label: 'Text Transform', options: ['none', 'uppercase', 'lowercase', 'capitalize'] }
  },
  transition: {
    exit: {
      style: { type: 'select', label: 'Exit Style', options: ['none', 'fade', 'slide', 'wipe'] },
      durationInFrames: { type: 'number', label: 'Exit Duration (frames)', min: 6, max: 60 }
    }
  }
};
