import React, { useEffect, useMemo } from 'react';
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
  renderAmbientParticles,
  getLetterReveal,
  renderLetterReveal,
  getParticleBurst,
  renderParticleBurst,
  getCardEntrance,
  getIconPop,
  getPulseGlow
} from '../../sdk';
import { 
  GlassmorphicPane, 
  NoiseTexture, 
  SpotlightEffect 
} from '../../sdk/effects/broadcastEffects';
import { loadFontVoice, buildFontTokens, DEFAULT_FONT_VOICE } from '../../sdk/fontSystem';
import { createTransitionProps } from '../../sdk/transitions';

/**
 * TEMPLATE #12: MATRIX COMPARISON GRID - v6.2 (AESTHETIC UPLIFT)
 * 
 * PRIMARY INTENTION: COMPARE
 * SECONDARY INTENTIONS: BREAKDOWN, GUIDE
 * 
 * PURPOSE: Side-by-side comparison across multiple dimensions
 * 
 * VISUAL PATTERN:
 * - Glassmorphic grid layout (2x2, 2x3, 3x3, 2x4 configurable)
 * - Row headers (dimensions/criteria) with depth
 * - Column headers (items being compared) with glow
 * - Cell content: text, icons, checkmarks, ratings
 * - Progressive reveal with sophisticated highlight
 * - 5-layer broadcast polish
 * 
 * BROADCAST POLISH:
 * - Gradient background with noise texture
 * - Spotlight effects for depth
 * - Glassmorphic cells with inner highlights
 * - Multi-layered entrance animations
 * - Micro-delights (letter reveals, particle bursts)
 * - Continuous life animations (floating, pulsing)
 * - Sophisticated winner highlight with glow pulse
 * 
 * AGNOSTIC PRINCIPALS:
 * ✅ Type-Based Polymorphism (cell content via hero registry)
 * ✅ Data-Driven Structure (dynamic grid dimensions)
 * ✅ Cumulative beats system (relative timing)
 * ✅ 100% configurability (zero hardcoded values)
 * ✅ Separation of Concerns (content/layout/style/animation)
 * ✅ Broadcast-grade polish (5 layers, micro-delights)
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
    // CUMULATIVE TIMING
    entrance: 0.4,
    titleEntry: 0.2,
    titleHold: 0.8,
    gridStructure: 0.6,
    gridHold: 0.3,
    cellInterval: 0.3, // Per cell
    highlightDelay: 0.5, // After all cells
    highlightDuration: 1.2,
    conclusionDelay: 0.3,
    conclusionHold: 2.0,
    exit: 1.5
  },
  
  animation: {
    titleAnimation: 'fade-up',
    cellEntrance: 'pop', // fade, pop, slide-left
    highlightStyle: 'glow-pulse', // glow, border, scale, glow-pulse
    continuousFloat: true,
    continuousPulse: true,
    easing: 'power3InOut'
  },
  
  decorations: {
    showTitleUnderline: true,
    underlineColor: null,
    underlineStyle: 'wavy',
    showParticles: true,
    particleCount: 30,
    showSpotlights: true,
    showNoiseTexture: true,
    noiseOpacity: 0.03,
    glassmorphicCells: true,
    cellGlow: true,
    headerGradients: true
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

/**
 * Calculate cumulative beat timings for matrix grid
 */
const calculateCumulativeBeats = (beats, totalCells) => {
  const {
    entrance = 0.4,
    titleEntry = 0.2,
    titleHold = 0.8,
    gridStructure = 0.6,
    gridHold = 0.3,
    cellInterval = 0.3,
    highlightDelay = 0.5,
    highlightDuration = 1.2,
    conclusionDelay = 0.3,
    conclusionHold = 2.0,
    exit = 1.5
  } = beats;
  
  let cumulative = 0;
  
  return {
    entrance: cumulative,
    title: (cumulative += entrance),
    titleEnd: (cumulative += titleEntry + titleHold),
    gridStructure: cumulative,
    gridEnd: (cumulative += gridStructure + gridHold),
    fillStart: cumulative,
    fillEnd: (cumulative += totalCells * cellInterval),
    highlightStart: (cumulative += highlightDelay),
    highlightEnd: (cumulative += highlightDuration),
    conclusionStart: (cumulative += conclusionDelay),
    conclusionEnd: (cumulative += conclusionHold),
    exitStart: cumulative,
    exitEnd: (cumulative += exit),
    totalDuration: cumulative
  };
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
        fontSize: Math.min(fonts.size_cell * 1.5, 48),
        fontWeight: 900,
        color: colors.checkmark,
        fontFamily: fontTokens.title.family,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      }}>
        ✓
      </div>
    );
  }
  
  // Cross/No
  if (content === '✗' || content === 'cross' || content === 'no' || content === '×') {
    return (
      <div style={{
        fontSize: Math.min(fonts.size_cell * 1.5, 48),
        fontWeight: 900,
        color: colors.cross,
        fontFamily: fontTokens.title.family,
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
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
        fontSize: Math.min(fonts.size_cell * 0.8, 28)
      }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ 
            color: i < content ? colors.accent : `${colors.gridLines}80`,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}>
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
      fontSize: Math.min(fonts.size_cell, 30),
      fontWeight: 600,
      fontFamily: fontTokens.body.family,
      color: colors.ink,
      wordWrap: 'break-word',
      textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
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
  const fontTokens = buildFontTokens(typography?.voice || DEFAULT_FONT_VOICE) || {
    title: { family: 'Figtree, sans-serif' },
    body: { family: 'Inter, sans-serif' },
    accent: { family: 'Caveat, cursive' },
    utility: { family: 'Inter, sans-serif' }
  };
  
  useEffect(() => {
    loadFontVoice(typography?.voice || DEFAULT_FONT_VOICE);
  }, [typography?.voice]);
  
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
    animation: { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) },
    decorations: { ...DEFAULT_CONFIG.decorations, ...(scene.decorations || {}) },
    typography: { ...DEFAULT_CONFIG.typography, ...(scene.typography || {}) }
  };
  
  const colors = config.style_tokens.colors;
  const fonts = config.style_tokens.fonts;
  const rawBeats = config.beats;
  const columns = config.columns;
  const rows = config.rows;
  
  // Calculate cumulative beats
  const totalCells = rows.length * columns.length;
  const beats = useMemo(() => 
    calculateCumulativeBeats(rawBeats, totalCells),
    [rawBeats, totalCells]
  );
  
  // Calculate grid layout - ensure it stays below title safe zone
  const TITLE_SAFE_ZONE = 140;
  const layout = calculateGridLayout(rows, columns, width, height, {
    top: TITLE_SAFE_ZONE + 60,
    left: 120,
    right: 120,
    bottom: config.showConclusion ? 220 : 180
  });
  
  // Ambient particles (memoized)
  const particleCount = config.decorations.showParticles ? config.decorations.particleCount : 0;
  const particles = useMemo(() => 
    generateAmbientParticles(particleCount, 12001, width, height),
    [particleCount, width, height]
  );
  const particleElements = renderAmbientParticles(particles, frame, fps, [colors.accent, colors.accent2, colors.bg]);
  
  // Title animation with letter reveal
  const titleStartFrame = toFrames(beats.title, fps);
  const titleLetterReveal = getLetterReveal(frame, config.title.text, {
    startFrame: beats.title,
    duration: 0.05,
    staggerDelay: 0.05
  }, fps);
  
  const titleAnim = fadeUpIn(frame, {
    start: beats.title,
    dur: 0.8,
    dist: 50,
    ease: 'smooth'
  }, EZ, fps);
  
  // Grid structure animation with card entrance
  const gridStartFrame = toFrames(beats.gridStructure, fps);
  const gridCardAnim = getCardEntrance(frame, {
    startFrame: beats.gridStructure,
    duration: 0.8,
    direction: 'up',
    distance: 60,
    withGlow: true,
    glowColor: `${colors.accent}20`
  }, fps);
  
  // Cell fill animation
  const getCellVisibility = (rowIndex, colIndex) => {
    const cellSequence = 
      config.fillAnimation === 'by-row' ? (rowIndex * columns.length + colIndex) :
      config.fillAnimation === 'by-column' ? (colIndex * rows.length + rowIndex) :
      config.fillAnimation === 'cascade' ? (rowIndex + colIndex) :
      0;
    
    const cellStartTime = beats.fillStart + (cellSequence * rawBeats.cellInterval);
    const cellStartFrame = toFrames(cellStartTime, fps);
    
    if (frame < cellStartFrame) return { visible: false, progress: 0 };
    
    const cellProgress = Math.min((frame - cellStartFrame) / toFrames(0.4, fps), 1);
    return { visible: true, progress: cellProgress };
  };
  
  // Highlight animation with pulse
  const highlightStartFrame = toFrames(beats.highlightStart, fps);
  const highlightProgress = frame >= highlightStartFrame ? 
    Math.min((frame - highlightStartFrame) / toFrames(beats.highlightDuration - beats.highlightStart, fps), 1) : 0;
  
  // Pulse effect for highlight
  const highlightPulse = config.animation.continuousPulse && highlightProgress > 0
    ? Math.sin((frame - highlightStartFrame) * 0.08) * 0.3 + 0.7
    : 1;
  
  // Particle burst on highlight
  const highlightBurstParticles = config.highlightWinner && getParticleBurst(frame, {
    triggerFrame: highlightStartFrame,
    particleCount: 20,
    duration: 1.5,
    color: colors.highlight,
    size: 10,
    spread: 200
  }, fps);
  
  // Conclusion animation
  const conclusionStartFrame = toFrames(beats.conclusionStart, fps);
  const conclusionAnim = getCardEntrance(frame, {
    startFrame: beats.conclusionStart,
    duration: 1.0,
    direction: 'up',
    distance: 50,
    withGlow: true,
    glowColor: `${colors.accent}30`
  }, fps);
  
  // Continuous floating for grid
  const gridFloatOffset = config.animation.continuousFloat
    ? Math.sin((frame - gridStartFrame) * 0.015) * 4
    : 0;
  
  return (
    <AbsoluteFill className="overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}E6 50%, ${colors.bg} 100%)`,
      fontFamily: fontTokens.body.family 
    }}>
      {/* Noise texture overlay */}
      {config.decorations.showNoiseTexture && (
        <NoiseTexture opacity={config.decorations.noiseOpacity} scale={1.5} />
      )}
      
      {/* Spotlight effects */}
      {config.decorations.showSpotlights && (
        <>
          <SpotlightEffect 
            x={20} 
            y={30} 
            size={800} 
            color={colors.accent} 
            opacity={0.12} 
          />
          <SpotlightEffect 
            x={80} 
            y={70} 
            size={800} 
            color={colors.accent2} 
            opacity={0.12} 
          />
        </>
      )}
      
      {/* Ambient particles */}
      {config.decorations.showParticles && (
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 0,
            opacity: 0.4
          }}
          viewBox="0 0 1920 1080"
        >
          {particleElements.map(p => p.element)}
        </svg>
      )}
      
      {/* Title with letter reveal */}
      {frame >= titleStartFrame && (
        <div className="absolute left-0 right-0 text-center px-safe-x z-[200]" style={{
          top: 60,
          opacity: titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px) scale(${titleAnim.scale})`,
        }}>
          <div style={{
            fontSize: Math.min(fonts.size_title, 72),
            fontWeight: 900,
            fontFamily: fontTokens.title.family,
            color: colors.accent,
            textAlign: typography.align,
            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
            textTransform: typography.transform !== 'none' ? typography.transform : undefined,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
          }}>
            {renderLetterReveal(titleLetterReveal.letters, titleLetterReveal.letterOpacities)}
          </div>
          
          {/* Title underline */}
          {config.decorations.showTitleUnderline && (
            <svg 
              width="300" 
              height="20" 
              style={{ 
                margin: '10px auto 0',
                display: 'block',
                opacity: titleLetterReveal.isComplete ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              {config.decorations.underlineStyle === 'wavy' && (
                <path 
                  d="M 10,10 Q 75,5 150,10 T 290,10" 
                  stroke={config.decorations.underlineColor || colors.accent} 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
              {config.decorations.underlineStyle === 'straight' && (
                <line 
                  x1="10" y1="10" x2="290" y2="10"
                  stroke={config.decorations.underlineColor || colors.accent} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
            </svg>
          )}
        </div>
      )}
      
      {/* Grid Container with glassmorphic wrapper */}
      {frame >= gridStartFrame && (
        <div style={{
          position: 'absolute',
          left: layout.startX - 20,
          top: layout.startY - 20,
          transform: `translateY(${gridFloatOffset}px)`,
          zIndex: 5
        }}>
          {config.decorations.glassmorphicCells ? (
            <GlassmorphicPane
              innerRadius={20}
              glowOpacity={0.15}
              borderOpacity={0.3}
              backgroundColor={`${colors.accent}08`}
              padding={20}
              style={{
                opacity: gridCardAnim.opacity,
                transform: `scale(${gridCardAnim.scale})`,
                boxShadow: gridCardAnim.boxShadow
              }}
            >
              <GridContent 
                config={config}
                layout={layout}
                columns={columns}
                rows={rows}
                colors={colors}
                fonts={fonts}
                fontTokens={fontTokens}
                getCellVisibility={getCellVisibility}
                highlightProgress={highlightProgress}
                highlightPulse={highlightPulse}
                frame={frame}
                beats={beats}
                fps={fps}
                EZ={EZ}
              />
            </GlassmorphicPane>
          ) : (
            <div style={{
              opacity: gridCardAnim.opacity,
              transform: `scale(${gridCardAnim.scale})`
            }}>
              <GridContent 
                config={config}
                layout={layout}
                columns={columns}
                rows={rows}
                colors={colors}
                fonts={fonts}
                fontTokens={fontTokens}
                getCellVisibility={getCellVisibility}
                highlightProgress={highlightProgress}
                highlightPulse={highlightPulse}
                frame={frame}
                beats={beats}
                fps={fps}
                EZ={EZ}
              />
            </div>
          )}
          
          {/* Highlight particle burst */}
          {highlightBurstParticles.length > 0 && renderParticleBurst(
            highlightBurstParticles,
            layout.startX + layout.cellWidth * (config.winnerColumn + 1.5),
            layout.startY + (layout.cellHeight * rows.length) / 2
          )}
        </div>
      )}
      
      {/* Conclusion card with glassmorphic */}
      {config.showConclusion && frame >= conclusionStartFrame && (
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: 80,
          transform: `translate(-50%, 0) translateY(${conclusionAnim.translateY}px) scale(${conclusionAnim.scale})`,
          opacity: conclusionAnim.opacity,
          maxWidth: '80%',
          zIndex: 150
        }}>
          <GlassmorphicPane
            innerRadius={20}
            glowOpacity={0.25}
            borderOpacity={0.4}
            backgroundColor={`${colors.accent}15`}
            padding={30}
            style={{
              boxShadow: conclusionAnim.boxShadow
            }}
          >
            <div style={{
              fontSize: Math.min(fonts.size_conclusion, 38),
              fontWeight: 700,
              fontFamily: fontTokens.title.family,
              color: colors.accent,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              {config.conclusionText}
            </div>
          </GlassmorphicPane>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Extracted grid content component for cleaner rendering
const GridContent = ({ 
  config, layout, columns, rows, colors, fonts, fontTokens,
  getCellVisibility, highlightProgress, highlightPulse, frame, beats, fps, EZ 
}) => {
  return (
    <>
      {/* Column Headers */}
      <div style={{ display: 'flex' }}>
        {/* Empty top-left corner */}
        <div style={{
          width: layout.cellWidth,
          height: layout.cellHeight,
          background: config.decorations.headerGradients 
            ? `linear-gradient(135deg, ${colors.headerBg}, ${colors.headerBg}E0)`
            : colors.headerBg,
          border: `3px solid ${colors.gridLines}40`,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }} />
        
        {/* Column headers */}
        {columns.map((col, colIndex) => {
          const isHighlighted = config.highlightWinner && config.winnerColumn === colIndex && highlightProgress > 0;
          const glowIntensity = isHighlighted ? 15 + (highlightPulse * 10) : 0;
          const borderWidth = isHighlighted ? 4 : 3;
          
          return (
            <div key={colIndex} style={{
              width: layout.cellWidth,
              height: layout.cellHeight,
              background: isHighlighted 
                ? `linear-gradient(135deg, ${colors.highlight}, ${colors.highlight}E0)`
                : config.decorations.headerGradients 
                  ? `linear-gradient(135deg, ${colors.headerBg}, ${colors.headerBg}E0)`
                  : colors.headerBg,
              border: `${borderWidth}px solid ${isHighlighted ? colors.accent : `${colors.gridLines}40`}`,
              borderRadius: 12,
              marginLeft: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: Math.min(fonts.size_header, 34),
              fontWeight: 800,
              fontFamily: fontTokens.title.family,
              color: isHighlighted ? colors.ink : colors.accent2,
              boxShadow: isHighlighted 
                ? `0 0 ${glowIntensity}px ${colors.highlight}, 0 4px 12px rgba(0,0,0,0.15)`
                : '0 2px 8px rgba(0,0,0,0.08)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              transform: isHighlighted ? `scale(${1 + (highlightPulse * 0.02)})` : 'scale(1)'
            }}>
              {col.header}
            </div>
          );
        })}
      </div>
      
      {/* Rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', marginTop: 8 }}>
          {/* Row header */}
          <div className="flex items-center justify-center text-center p-3" style={{
            width: layout.cellWidth,
            height: layout.cellHeight,
            background: config.decorations.headerGradients 
              ? `linear-gradient(135deg, ${colors.headerBg}, ${colors.headerBg}E0)`
              : colors.headerBg,
            border: `3px solid ${colors.gridLines}40`,
            borderRadius: 12,
            fontSize: Math.min(fonts.size_header, 34),
            fontWeight: 700,
            fontFamily: fontTokens.accent.family,
            color: colors.ink,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
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
                marginLeft: 8
              }} />
            );
            
            const isHighlighted = config.highlightWinner && config.winnerColumn === colIndex && highlightProgress > 0;
            const cellScale = config.animation.cellEntrance === 'pop' ?
              EZ.backOut(visibility.progress) : 1;
            const cellOpacity = EZ.smooth(visibility.progress);
            const borderWidth = isHighlighted ? 4 : 3;
            const glowIntensity = isHighlighted ? 8 + (highlightPulse * 6) : 0;
            
            return (
              <div key={colIndex} style={{
                width: layout.cellWidth,
                height: layout.cellHeight,
                background: isHighlighted 
                  ? `linear-gradient(135deg, ${colors.highlight}E0, ${colors.highlight})`
                  : `linear-gradient(135deg, ${colors.cellBg}, ${colors.cellBg}F5)`,
                border: `${borderWidth}px solid ${isHighlighted ? colors.accent : `${colors.gridLines}40`}`,
                borderRadius: 12,
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: cellOpacity,
                transform: `scale(${cellScale * (isHighlighted ? 1 + (highlightPulse * 0.02) : 1)})`,
                boxShadow: isHighlighted 
                  ? `0 0 ${glowIntensity}px ${colors.highlight}80, 0 4px 12px rgba(0,0,0,0.15)`
                  : config.decorations.cellGlow 
                    ? '0 2px 8px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.5)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease'
              }}>
                {renderCellContent(cell, colors, fonts, frame, beats, fps, EZ, fontTokens)}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

// Required exports
export const TEMPLATE_ID = 'Compare12MatrixGrid';
export const TEMPLATE_VERSION = '6.2.0';

// Attach version to component for TemplateRouter detection
Compare12MatrixGrid.TEMPLATE_VERSION = '6.2.0';
Compare12MatrixGrid.TEMPLATE_ID = 'Compare12MatrixGrid';

export const LEARNING_INTENTIONS = {
  primary: ['compare'],
  secondary: ['breakdown', 'guide'],
  tags: ['comparison', 'matrix', 'grid', 'features', 'decision', 'broadcast-grade']
};

export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const rows = config.rows || DEFAULT_CONFIG.rows;
  const columns = config.columns || DEFAULT_CONFIG.columns;
  const rawBeats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  
  const totalCells = rows.length * columns.length;
  const beats = calculateCumulativeBeats(rawBeats, totalCells);
  
  return toFrames(beats.totalDuration, fps);
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
    default: 0,
    label: 'Winner Column Index (0-based)'
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
    description: 'CUMULATIVE timing - each value adds to previous',
    beats: [
      { key: 'entrance', label: 'Entrance (start)', default: 0.4 },
      { key: 'titleEntry', label: '+ Title Entry', default: 0.2 },
      { key: 'titleHold', label: '+ Title Hold', default: 0.8 },
      { key: 'gridStructure', label: '+ Grid Structure', default: 0.6 },
      { key: 'gridHold', label: '+ Grid Hold', default: 0.3 },
      { key: 'cellInterval', label: '+ Per Cell Interval', default: 0.3 },
      { key: 'highlightDelay', label: '+ Highlight Delay', default: 0.5 },
      { key: 'highlightDuration', label: '+ Highlight Duration', default: 1.2 },
      { key: 'conclusionDelay', label: '+ Conclusion Delay', default: 0.3 },
      { key: 'conclusionHold', label: '+ Conclusion Hold', default: 2.0 },
      { key: 'exit', label: '+ Exit', default: 1.5 }
    ]
  },
  animation: {
    type: 'animation-config',
    options: {
      titleAnimation: ['fade-up', 'slide-left', 'pop'],
      cellEntrance: ['fade', 'pop', 'slide-left'],
      highlightStyle: ['glow', 'border', 'scale', 'glow-pulse'],
      continuousFloat: { type: 'boolean', default: true, label: 'Grid Floating' },
      continuousPulse: { type: 'boolean', default: true, label: 'Highlight Pulse' },
      easing: ['power3InOut', 'backOut', 'smooth']
    }
  },
  decorations: {
    type: 'object',
    fields: {
      showTitleUnderline: { type: 'boolean', default: true },
      underlineColor: { type: 'color', default: null },
      underlineStyle: { type: 'select', options: ['wavy', 'straight'], default: 'wavy' },
      showParticles: { type: 'boolean', default: true },
      particleCount: { type: 'number', min: 0, max: 50, default: 30 },
      showSpotlights: { type: 'boolean', default: true },
      showNoiseTexture: { type: 'boolean', default: true },
      noiseOpacity: { type: 'number', min: 0, max: 0.1, step: 0.01, default: 0.03 },
      glassmorphicCells: { type: 'boolean', default: true, label: 'Glassmorphic Grid Wrapper' },
      cellGlow: { type: 'boolean', default: true, label: 'Cell Inner Glow' },
      headerGradients: { type: 'boolean', default: true, label: 'Header Gradients' }
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
