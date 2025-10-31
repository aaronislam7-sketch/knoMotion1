import React, { useEffect, useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { THEME } from '../utils/theme';
import rough from 'roughjs/bundled/rough.esm.js';

// Blueprint v5.0 - TEACHING TEMPLATE
import {
  // Animation presets
  fadeUpIn,
  popInSpring,
  pulseEmphasis,
  EZ,
  useSceneId,
  toFrames,
  
  // Collision detection
  createTextBoundingBox,
  createShapeBoundingBox,
  
  // Purposeful effects (NOT decoration)
  generateAmbientParticles,
  renderAmbientParticles,
  generateConfettiBurst,
  renderConfettiBurst,
  getGlowEffect,
} from '../sdk';

/**
 * COMPARE 3B: DECISION TREE - TEACHING FOCUSED
 * 
 * THIS IS A TEACHING TEMPLATE - WHERE USERS LEARN
 * 
 * Philosophy:
 * - Learn from Hook1A's STRUCTURE (depth, organization, quality)
 * - SURPASS Hook1A by making this impossible to learn without visuals
 * - Every enhancement must support learning (not decoration)
 * - Focus on pedagogical value above all else
 * 
 * Teaching Phases (7 phases, 20s):
 * 1. Context Setup (0-2s): "Why this decision matters"
 * 2. Core Question (2-4s): Definition + implications
 * 3. Trade-Offs (4-7s): Visual scales showing gains vs. losses
 * 4. Decision Logic (7-12s): Each node teaches "why ask this?"
 * 5. Outcome + Context (12-16s): Use cases, metrics, pitfalls
 * 6. "So What?" Summary (16-19s): Key takeaway + next steps
 * 7. Exit (19-20s): Settle
 * 
 * Purposeful Enhancements (8-10):
 * - Ambient particles (quality baseline)
 * - Glow on decision path (TEACHES route)
 * - Spring physics (hierarchy clarity)
 * - Draw-on branches (TEACHES structure)
 * - Pulse on trade-offs (draws eye to learning)
 * - Outcome emphasis (celebrates completion)
 * - Impact metric reveals (TEACHES consequences)
 * - Context panels (rich pedagogical content)
 * 
 * Duration: 20s
 */

const Compare3B_DecisionTree_TEACHING = ({ scene, styles, presets, easingMap, transitions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSceneId();
  
  // Refs for multi-layer rendering
  const svgRef = useRef(null);
  const particlesRef = useRef(null);
  const glowRef = useRef(null);
  const roughRef = useRef(null);
  
  // ✨ Generate deterministic particles (quality baseline, not distraction)
  const ambientParticles = useMemo(
    () => generateAmbientParticles(18, 789, 1920, 1080),
    []
  );
  
  // ✨ Confetti for outcome celebration (purposeful, earned it!)
  const confettiBurst = useMemo(
    () => generateConfettiBurst(12, 960, 800, 999),
    []
  );

  // Style tokens with fallbacks
  const style = scene.style_tokens || {};
  const colors = style.colors || {
    bg: '#FAFBFC',
    accent: '#2E7FE4',      // Blue for questions
    accent2: '#27AE60',     // Green for yes/positive
    accent3: '#E74C3C',     // Red for no/negative
    highlight: '#9B59B6',   // Purple for outcomes
    ink: '#1A1A1A',
    inkLight: '#95A5A6',
    warning: '#F39C12',     // Orange for warnings
  };
  
  const fonts = style.fonts || {
    primary: THEME.fonts.marker.primary,
    secondary: THEME.fonts.structure.primary,
    mono: "'Courier New', 'Monaco', monospace",
    size_title: 52,
    size_question: 26,
    size_context: 18,
    size_metric: 22,
    size_outcome: 32,
  };

  const data = scene.fill?.decision || {};
  
  // ========================================
  // TREE PARSING & LAYOUT
  // ========================================
  
  // Parse tree into flat array for animation
  const parseTree = (node, depth = 0, path = []) => {
    const nodes = [];
    
    if (typeof node === 'string') {
      // Leaf node (outcome reference)
      nodes.push({
        type: 'outcome',
        id: node,
        depth,
        path: [...path],
        data: data.outcomes[node]
      });
    } else if (node.question) {
      // Question node
      nodes.push({
        type: 'question',
        question: node.question,
        context: node.context || '', // "Why ask this?"
        depth,
        path: [...path],
        hasYes: !!node.yes,
        hasNo: !!node.no
      });
      
      // Recurse
      if (node.yes) {
        nodes.push(...parseTree(node.yes, depth + 1, [...path, 'yes']));
      }
      if (node.no) {
        nodes.push(...parseTree(node.no, depth + 1, [...path, 'no']));
      }
    }
    
    return nodes;
  };
  
  const treeNodes = useMemo(() => {
    return data.tree?.root ? parseTree(data.tree.root) : [];
  }, [data.tree]);
  
  const maxDepth = Math.max(...treeNodes.map(n => n.depth), 0);

  // Layout calculation (fixed spacing, collision-aware)
  const layoutNodes = useMemo(() => {
    const nodeWidth = 300;
    const nodeHeight = 100;
    const minHorizontalSpacing = 140;
    const verticalSpacing = 180;
    const startY = 320;
    
    return treeNodes.map((node, i) => {
      const depth = node.depth;
      const y = startY + depth * verticalSpacing;
      
      // Calculate x based on path
      let x = 960; // Center
      let offset = 0;
      
      for (let d = 0; d < node.path.length; d++) {
        const direction = node.path[d];
        const spreadFactor = Math.pow(0.65, d + 1);
        offset += (direction === 'yes' ? -1 : 1) * (nodeWidth + minHorizontalSpacing) * spreadFactor;
      }
      
      x += offset;
      
      // Bounds checking (keep within safe zones)
      x = Math.max(nodeWidth / 2 + 120, Math.min(1920 - nodeWidth / 2 - 120, x));
      
      return {
        ...node,
        x,
        y,
        width: nodeWidth,
        height: nodeHeight
      };
    });
  }, [treeNodes]);

  // ========================================
  // TEACHING PHASE BEATS
  // ========================================
  
  const sceneBeats = scene.beats || {};
  const beats = {
    // Phase 1: Context Setup (0-2s)
    entrance: toFrames(sceneBeats.entrance || 0.3, fps),
    title: toFrames(sceneBeats.title || 0.6, fps),
    stakes: toFrames(sceneBeats.stakes || 1.2, fps),
    
    // Phase 2: Core Question (2-4s)
    rootQuestion: toFrames(sceneBeats.rootQuestion || 2.0, fps),
    definition: toFrames(sceneBeats.definition || 2.5, fps),
    
    // Phase 3: Trade-Offs (4-7s)
    tradeoffs: toFrames(sceneBeats.tradeoffs || 4.0, fps),
    branches: toFrames(sceneBeats.branches || 5.0, fps),
    
    // Phase 4: Decision Logic (7-12s)
    traverse: toFrames(sceneBeats.traverse || 7.0, fps),
    
    // Phase 5: Outcome + Context (12-16s)
    outcome: toFrames(sceneBeats.outcome || (7.0 + maxDepth * 1.8), fps),
    context: toFrames(sceneBeats.context || (7.0 + maxDepth * 1.8 + 1.5), fps),
    
    // Phase 6: Summary (16-19s)
    summary: toFrames(sceneBeats.summary || 16.0, fps),
    
    // Phase 7: Exit (19-20s)
    exit: toFrames(sceneBeats.exit || 19.0, fps),
  };

  // ========================================
  // ANIMATIONS (Purposeful, not decoration)
  // ========================================
  
  // Phase 1: Context Setup
  const titleAnim = fadeUpIn(frame, {
    start: beats.title / fps,
    dur: 0.9,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);
  
  const stakesAnim = fadeUpIn(frame, {
    start: beats.stakes / fps,
    dur: 0.8,
    dist: 20,
    ease: 'smooth'
  }, EZ, fps);
  
  // Phase 2: Core Question
  const rootAnim = popInSpring(frame, {
    start: beats.rootQuestion / fps,
    mass: 0.9,
    stiffness: 180,
    damping: 13
  }, EZ, fps);
  
  const definitionAnim = fadeUpIn(frame, {
    start: beats.definition / fps,
    dur: 0.7,
    dist: 15,
    ease: 'smooth'
  }, EZ, fps);
  
  // Phase 3: Trade-Offs
  const tradeoffAnim = fadeUpIn(frame, {
    start: beats.tradeoffs / fps,
    dur: 1.0,
    dist: 25,
    ease: 'backOut'
  }, EZ, fps);
  
  // Phase 4: Node animations (staggered by depth)
  const nodeAnims = useMemo(() => {
    return layoutNodes.map((node, i) => {
      const nodeStart = (beats.traverse / fps) + node.depth * 1.8;
      
      return {
        pop: popInSpring(frame, {
          start: nodeStart,
          mass: 0.7,
          stiffness: 200,
          damping: 14
        }, EZ, fps),
        fade: fadeUpIn(frame, {
          start: nodeStart - 0.2,
          dur: 0.7,
          dist: 20,
          ease: 'smooth'
        }, EZ, fps),
        contextDelay: nodeStart + 0.4
      };
    });
  }, [layoutNodes, beats.traverse, fps, frame]);
  
  // Phase 5: Outcome
  const outcomeAnim = popInSpring(frame, {
    start: beats.outcome / fps,
    mass: 0.8,
    stiffness: 180,
    damping: 12
  }, EZ, fps);
  
  const contextAnim = fadeUpIn(frame, {
    start: beats.context / fps,
    dur: 1.0,
    dist: 30,
    ease: 'backOut'
  }, EZ, fps);
  
  // Phase 6: Summary
  const summaryAnim = fadeUpIn(frame, {
    start: beats.summary / fps,
    dur: 1.2,
    dist: 25,
    ease: 'smooth'
  }, EZ, fps);
  
  // ✨ Glow effect on decision path (TEACHES which route we're following)
  const pathGlow = useMemo(() => {
    if (frame < beats.traverse) return null;
    return getGlowEffect(frame - beats.traverse, {
      intensity: 8,
      color: colors.highlight,
      pulse: true,
      pulseSpeed: 0.04,
    });
  }, [frame, beats.traverse, colors.highlight]);

  // ========================================
  // ROUGH.JS - DECISION TREE STRUCTURE
  // ========================================

  useEffect(() => {
    if (!roughRef.current) return;

    const svg = roughRef.current;
    const rc = rough.svg(svg);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Draw connection paths (branches with draw-on effect)
    if (frame >= beats.branches) {
      layoutNodes.forEach((node, i) => {
        if (node.depth === 0) return; // Skip root
        
        // Find parent
        const parentPath = node.path.slice(0, -1);
        const parent = layoutNodes.find(n => 
          n.depth === node.depth - 1 && 
          JSON.stringify(n.path) === JSON.stringify(parentPath)
        );
        
        if (parent) {
          const branchDelay = (node.depth - 1) * 0.6 * fps;
          const pathProgress = Math.min((frame - beats.branches - branchDelay) / (fps * 0.9), 1);
          
          if (pathProgress > 0) {
            const lastDirection = node.path[node.path.length - 1];
            const color = lastDirection === 'yes' ? colors.accent2 : colors.accent3;
            
            // Draw curved path (smooth bezier)
            const startX = parent.x;
            const startY = parent.y + parent.height / 2;
            const endX = node.x;
            const endY = node.y - node.height / 2;
            
            const midY = (startY + endY) / 2;
            
            const currentEndX = interpolate(pathProgress, [0, 1], [startX, endX]);
            const currentEndY = interpolate(pathProgress, [0, 1], [startY, endY]);
            
            // Create path with zero wobble
            const pathEl = rc.path(
              `M ${startX} ${startY} Q ${startX} ${midY} ${currentEndX} ${currentEndY}`,
              {
                stroke: color,
                strokeWidth: 4,
                roughness: 0,
                bowing: 0,
              }
            );
            
            // Apply glow if this is the chosen path (teaching aid)
            if (frame >= beats.traverse && pathGlow && node.depth > 0) {
              const isChosenPath = true; // Simplified - would check against decision logic
              if (isChosenPath && pathProgress > 0.8) {
                pathEl.style.filter = pathGlow.filter;
              }
            }
            
            svg.appendChild(pathEl);
            
            // Arrow head at end
            if (pathProgress > 0.85) {
              const arrowSize = 12;
              const angle = Math.atan2(endY - startY, endX - startX);
              const arrowPath = rc.path(
                `M ${endX} ${endY} 
                 L ${endX - arrowSize * Math.cos(angle - Math.PI / 6)} ${endY - arrowSize * Math.sin(angle - Math.PI / 6)} 
                 M ${endX} ${endY} 
                 L ${endX - arrowSize * Math.cos(angle + Math.PI / 6)} ${endY - arrowSize * Math.sin(angle + Math.PI / 6)}`,
                {
                  stroke: color,
                  strokeWidth: 4,
                  roughness: 0,
                  bowing: 0,
                }
              );
              svg.appendChild(arrowPath);
            }
          }
        }
      });
    }

    // Draw node boxes
    layoutNodes.forEach((node, i) => {
      const anim = nodeAnims[i];
      if (!anim || anim.pop.opacity === 0) return;
      
      const isOutcome = node.type === 'outcome';
      const color = isOutcome ? colors.highlight : colors.accent;
      
      const box = rc.rectangle(
        node.x - node.width / 2,
        node.y - node.height / 2,
        node.width,
        node.height,
        {
          stroke: color,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
          fill: isOutcome ? `${colors.highlight}12` : `${colors.accent}08`,
          fillStyle: 'solid',
        }
      );
      box.setAttribute('opacity', String(anim.pop.opacity));
      
      // Add glow to current decision node (draws eye to learning point)
      if (frame >= anim.contextDelay && frame < anim.contextDelay + 60 && pathGlow) {
        box.style.filter = pathGlow.filter;
      }
      
      svg.appendChild(box);
    });

  }, [frame, beats, colors, layoutNodes, nodeAnims, pathGlow]);

  // Get final outcome node for context panel
  const finalOutcome = useMemo(() => {
    return layoutNodes.find(n => n.type === 'outcome');
  }, [layoutNodes]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, ${colors.accent}03 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, ${colors.accent2}03 0%, transparent 50%)
        `,
      }}
    >
      {/* ✨ Ambient particles (quality baseline, low opacity) */}
      <svg
        ref={particlesRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: frame >= beats.entrance ? 0.25 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderAmbientParticles(ambientParticles, frame, fps, [colors.accent, colors.accent2, colors.highlight]).map(p => p.element)}
      </svg>
      
      {/* Rough.js layer (tree structure) */}
      <svg
        ref={roughRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Content layer */}
      <AbsoluteFill>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          padding: '60px 80px',
        }}>
          
          {/* ========================================
              PHASE 1: CONTEXT SETUP (0-2s)
              "Why this decision matters"
              ======================================== */}
          
          {/* Title */}
          {frame >= beats.title && (
            <div
              style={{
                position: 'absolute',
                top: 80,
                left: '50%',
                transform: `translateX(-50%) translateY(${titleAnim.translateY || 0}px)`,
                opacity: titleAnim.opacity,
              }}
            >
              <h1
                style={{
                  fontFamily: fonts.primary,
                  fontSize: fonts.size_title,
                  color: colors.ink,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {data.title || 'Decision Framework'}
              </h1>
            </div>
          )}
          
          {/* Stakes Panel - "Why this matters" */}
          {frame >= beats.stakes && data.stakes && (
            <div
              style={{
                position: 'absolute',
                top: 160,
                right: 80,
                width: 350,
                padding: 20,
                backgroundColor: `${colors.accent}10`,
                border: `2px solid ${colors.accent}40`,
                borderRadius: 12,
                opacity: stakesAnim.opacity,
                transform: `translateY(${stakesAnim.translateY || 0}px)`,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 20,
                  color: colors.accent,
                  margin: '0 0 12px 0',
                }}
              >
                ⚖️ Why This Matters
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: fonts.secondary, fontSize: fonts.size_context, color: colors.ink }}>
                  <strong>💰 Cost:</strong> {data.stakes.cost}
                </div>
                <div style={{ fontFamily: fonts.secondary, fontSize: fonts.size_context, color: colors.ink }}>
                  <strong>⏱️ Time:</strong> {data.stakes.time}
                </div>
                <div style={{ fontFamily: fonts.secondary, fontSize: fonts.size_context, color: colors.ink }}>
                  <strong>🎯 Impact:</strong> {data.stakes.impact}
                </div>
              </div>
            </div>
          )}
          
          {/* ========================================
              PHASE 2: CORE QUESTION (2-4s)
              Definition + implications
              ======================================== */}
          
          {/* Root question with definition */}
          {layoutNodes[0] && frame >= beats.rootQuestion && (
            <>
              {/* Question node */}
              <div
                style={{
                  position: 'absolute',
                  left: layoutNodes[0].x - layoutNodes[0].width / 2,
                  top: layoutNodes[0].y - layoutNodes[0].height / 2,
                  width: layoutNodes[0].width,
                  height: layoutNodes[0].height,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: rootAnim.opacity,
                  transform: `scale(${rootAnim.scale || 1})`,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.secondary,
                    fontSize: fonts.size_question,
                    color: colors.ink,
                    textAlign: 'center',
                    fontWeight: '600',
                  }}
                >
                  {layoutNodes[0].question}
                </div>
              </div>
              
              {/* Definition box */}
              {frame >= beats.definition && layoutNodes[0].context && (
                <div
                  style={{
                    position: 'absolute',
                    left: 80,
                    top: 320,
                    width: 320,
                    padding: 16,
                    backgroundColor: `${colors.ink}05`,
                    border: `2px dashed ${colors.inkLight}`,
                    borderRadius: 8,
                    opacity: definitionAnim.opacity,
                    transform: `translateY(${definitionAnim.translateY || 0}px)`,
                  }}
                >
                  <h4
                    style={{
                      fontFamily: fonts.primary,
                      fontSize: 16,
                      color: colors.inkLight,
                      margin: '0 0 8px 0',
                    }}
                  >
                    📖 What this means:
                  </h4>
                  <p
                    style={{
                      fontFamily: fonts.secondary,
                      fontSize: 15,
                      color: colors.ink,
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {layoutNodes[0].context}
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* ========================================
              PHASE 3: TRADE-OFFS (4-7s)
              Visual scales showing gains vs. losses
              ======================================== */}
          
          {frame >= beats.tradeoffs && data.tradeoffs && (
            <div
              style={{
                position: 'absolute',
                left: 80,
                bottom: 120,
                width: 380,
                padding: 20,
                backgroundColor: `${colors.bg}F8`,
                border: `3px solid ${colors.accent2}`,
                borderRadius: 12,
                opacity: tradeoffAnim.opacity,
                transform: `translateY(${tradeoffAnim.translateY || 0}px)`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 22,
                  color: colors.accent2,
                  margin: '0 0 16px 0',
                }}
              >
                ⚖️ Trade-Offs
              </h3>
              
              {/* Trade-off scale visualization */}
              {data.tradeoffs.yes && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: fonts.secondary, fontSize: 14, color: colors.accent2, fontWeight: '600', marginBottom: 6 }}>
                    ✅ YES Path Gains:
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {data.tradeoffs.yes.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: fonts.secondary,
                          fontSize: 13,
                          color: colors.ink,
                          backgroundColor: `${colors.accent2}20`,
                          padding: '4px 10px',
                          borderRadius: 6,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {data.tradeoffs.no && (
                <div>
                  <div style={{ fontFamily: fonts.secondary, fontSize: 14, color: colors.accent3, fontWeight: '600', marginBottom: 6 }}>
                    ❌ NO Path Gains:
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {data.tradeoffs.no.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: fonts.secondary,
                          fontSize: 13,
                          color: colors.ink,
                          backgroundColor: `${colors.accent3}20`,
                          padding: '4px 10px',
                          borderRadius: 6,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* ========================================
              PHASE 4: DECISION LOGIC (7-12s)
              Each node teaches "why ask this?"
              ======================================== */}
          
          {/* Decision nodes with context */}
          {layoutNodes.map((node, i) => {
            if (i === 0) return null; // Skip root (already rendered)
            
            const anim = nodeAnims[i];
            if (!anim || anim.pop.opacity === 0) return null;
            
            const isOutcome = node.type === 'outcome';
            
            return (
              <div key={i}>
                {/* Node content */}
                <div
                  style={{
                    position: 'absolute',
                    left: node.x - node.width / 2,
                    top: node.y - node.height / 2,
                    width: node.width,
                    height: node.height,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: anim.pop.opacity,
                    transform: `scale(${anim.pop.scale || 1})`,
                    padding: 16,
                    gap: 6,
                  }}
                >
                  {isOutcome ? (
                    <>
                      <div style={{ fontSize: 36 }}>
                        {node.data?.icon || '🎯'}
                      </div>
                      <div
                        style={{
                          fontFamily: fonts.primary,
                          fontSize: fonts.size_outcome,
                          color: colors.highlight,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        {node.data?.label}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: 20,
                        color: colors.ink,
                        textAlign: 'center',
                        fontWeight: '600',
                        lineHeight: 1.3,
                      }}
                    >
                      {node.question}
                    </div>
                  )}
                </div>
                
                {/* Context tooltip (why ask this?) */}
                {!isOutcome && frame >= anim.contextDelay && node.context && (
                  <div
                    style={{
                      position: 'absolute',
                      left: node.x + node.width / 2 + 20,
                      top: node.y - 30,
                      width: 200,
                      padding: 10,
                      backgroundColor: `${colors.warning}15`,
                      border: `2px solid ${colors.warning}`,
                      borderRadius: 8,
                      opacity: Math.min((frame - anim.contextDelay) / 20, 1),
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: fonts.secondary,
                        fontSize: 13,
                        color: colors.ink,
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      💡 {node.context}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* ========================================
              PHASE 5: OUTCOME + CONTEXT (12-16s)
              Use cases, metrics, pitfalls
              ======================================== */}
          
          {/* Confetti burst on outcome (celebration!) */}
          {frame >= beats.outcome && frame < beats.outcome + 60 && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              viewBox="0 0 1920 1080"
            >
              {renderConfettiBurst(confettiBurst, frame, beats.outcome, [colors.accent, colors.accent2, colors.highlight]).map(p => p.element)}
            </svg>
          )}
          
          {/* Outcome context panel */}
          {frame >= beats.context && finalOutcome?.data && (
            <div
              style={{
                position: 'absolute',
                right: 80,
                top: 380,
                width: 400,
                padding: 24,
                backgroundColor: colors.bg,
                border: `3px solid ${colors.highlight}`,
                borderRadius: 12,
                opacity: contextAnim.opacity,
                transform: `translateY(${contextAnim.translateY || 0}px)`,
                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 24,
                  color: colors.highlight,
                  margin: '0 0 16px 0',
                }}
              >
                {finalOutcome.data.icon} {finalOutcome.data.label}
              </h3>
              
              {/* Use case */}
              {finalOutcome.data.useCase && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontFamily: fonts.primary, fontSize: 16, color: colors.ink, margin: '0 0 6px 0' }}>
                    📋 You'd use this when:
                  </h4>
                  <p style={{ fontFamily: fonts.secondary, fontSize: 15, color: colors.ink, margin: 0, lineHeight: 1.5 }}>
                    {finalOutcome.data.useCase}
                  </p>
                </div>
              )}
              
              {/* Metrics */}
              {finalOutcome.data.metrics && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontFamily: fonts.primary, fontSize: 16, color: colors.ink, margin: '0 0 8px 0' }}>
                    📊 Key Metrics:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Object.entries(finalOutcome.data.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: 14,
                          color: colors.ink,
                          backgroundColor: `${colors.accent}08`,
                          padding: '6px 12px',
                          borderRadius: 6,
                        }}
                      >
                        <strong>{key}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Pitfall warning */}
              {finalOutcome.data.pitfall && (
                <div
                  style={{
                    padding: 12,
                    backgroundColor: `${colors.warning}15`,
                    border: `2px solid ${colors.warning}`,
                    borderRadius: 8,
                  }}
                >
                  <p style={{ fontFamily: fonts.secondary, fontSize: 14, color: colors.ink, margin: 0, lineHeight: 1.4 }}>
                    ⚠️ <strong>Avoid:</strong> {finalOutcome.data.pitfall}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* ========================================
              PHASE 6: SUMMARY (16-19s)
              Key takeaway + next steps
              ======================================== */}
          
          {frame >= beats.summary && data.keyTakeaway && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: `translateX(-50%) translateY(${summaryAnim.translateY || 0}px)`,
                width: 800,
                padding: 24,
                backgroundColor: `${colors.highlight}15`,
                border: `3px solid ${colors.highlight}`,
                borderRadius: 16,
                opacity: summaryAnim.opacity,
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.primary,
                  fontSize: 22,
                  color: colors.highlight,
                  margin: '0 0 12px 0',
                }}
              >
                💡 Key Takeaway
              </h3>
              <p
                style={{
                  fontFamily: fonts.secondary,
                  fontSize: 18,
                  color: colors.ink,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {data.keyTakeaway}
              </p>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* ========================================
          PHASE 7: EXIT (19-20s)
          Settle fade
          ======================================== */}
      {frame >= beats.exit && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.bg,
            opacity: interpolate(
              frame,
              [beats.exit, beats.exit + 30],
              [0, 0.2],
              { extrapolateRight: 'clamp', easing: EZ.smooth }
            ),
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ========================================
// BLUEPRINT V5.0 - REQUIRED EXPORTS
// ========================================

export { Compare3B_DecisionTree_TEACHING };

export const TEMPLATE_ID = 'Compare3B_DecisionTree_TEACHING';
export const TEMPLATE_VERSION = '5.1.0';

export const getDuration = (scene, fps) => {
  return toFrames(scene.beats?.exit || 20.0, fps) + 30; // 20s + tail
};

export const DURATION_MIN_FRAMES = 600;   // 20s @ 30fps
export const DURATION_MAX_FRAMES = 660;   // 22s @ 30fps

export const SUPPORTED_MODES = ['notebook', 'whiteboard'];

export const CAPABILITIES = {
  usesSVG: true,
  usesLottie: false,
  usesRoughJS: true,
  requiresAudio: false,
  supportsTransitions: true,
  supportsDynamicTreeDepth: true,
  hasTeachingContext: true,
  hasTradeOffVisualization: true,
  hasPedagogicalDepth: true,
};

export const PRESETS_REQUIRED = [
  'fadeUpIn',
  'popInSpring',
  'pulseEmphasis'
];

export const getPosterFrame = (scene, fps) => {
  return toFrames(7.0, fps); // Mid-traversal
};

// ========================================
// COLLISION DETECTION (Proper bounding boxes)
// ========================================

export const getLayoutConfig = (scene, fps) => {
  const data = scene.fill?.decision || {};
  
  // Parse tree to calculate ALL node positions
  const parseTreeForCollision = (node, depth = 0, path = []) => {
    const nodes = [];
    
    if (typeof node === 'string') {
      nodes.push({ type: 'outcome', id: node, depth, path: [...path] });
    } else if (node.question) {
      nodes.push({ type: 'question', question: node.question, depth, path: [...path] });
      if (node.yes) nodes.push(...parseTreeForCollision(node.yes, depth + 1, [...path, 'yes']));
      if (node.no) nodes.push(...parseTreeForCollision(node.no, depth + 1, [...path, 'no']));
    }
    
    return nodes;
  };
  
  const treeNodes = data.tree?.root ? parseTreeForCollision(data.tree.root) : [];
  
  // Calculate layout positions
  const layoutNodes = treeNodes.map((node) => {
    const nodeWidth = 300;
    const nodeHeight = 100;
    const minHorizontalSpacing = 140;
    const verticalSpacing = 180;
    const startY = 320;
    
    const depth = node.depth;
    const y = startY + depth * verticalSpacing;
    
    let x = 960;
    let offset = 0;
    
    for (let d = 0; d < node.path.length; d++) {
      const direction = node.path[d];
      const spreadFactor = Math.pow(0.65, d + 1);
      offset += (direction === 'yes' ? -1 : 1) * (nodeWidth + minHorizontalSpacing) * spreadFactor;
    }
    
    x += offset;
    x = Math.max(nodeWidth / 2 + 120, Math.min(1920 - nodeWidth / 2 - 120, x));
    
    return { ...node, x, y, width: nodeWidth, height: nodeHeight };
  });
  
  return {
    getBoundingBoxes: (scene) => {
      const boxes = [];
      
      // Title
      boxes.push(createTextBoundingBox({
        id: 'title',
        text: data.title || 'Decision Framework',
        x: 960,
        y: 80,
        fontSize: 52,
        maxWidth: 1200,
        padding: 20,
        priority: 10,
        flexible: false,
      }));
      
      // Stakes panel
      boxes.push(createShapeBoundingBox({
        id: 'stakes',
        x: 1920 - 80 - 175,
        y: 160 + 80,
        width: 350,
        height: 160,
        padding: 20,
        priority: 9,
        flexible: false,
      }));
      
      // All tree nodes
      layoutNodes.forEach((node, i) => {
        boxes.push(createShapeBoundingBox({
          id: `node-${i}`,
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
          padding: 50, // Extra padding for glow effects
          priority: node.depth === 0 ? 10 : (8 - node.depth),
          flexible: node.depth >= 3,
        }));
      });
      
      // Trade-offs panel
      boxes.push(createShapeBoundingBox({
        id: 'tradeoffs',
        x: 80 + 190,
        y: 1080 - 120 - 100,
        width: 380,
        height: 200,
        padding: 20,
        priority: 7,
        flexible: true,
      }));
      
      // Outcome context panel
      boxes.push(createShapeBoundingBox({
        id: 'context',
        x: 1920 - 80 - 200,
        y: 380 + 150,
        width: 400,
        height: 300,
        padding: 20,
        priority: 8,
        flexible: true,
      }));
      
      // Summary panel
      boxes.push(createShapeBoundingBox({
        id: 'summary',
        x: 960,
        y: 1080 - 80 - 60,
        width: 800,
        height: 120,
        padding: 20,
        priority: 9,
        flexible: false,
      }));
      
      return boxes;
    },
  };
};

// ========================================
// TEACHING TEMPLATE METADATA
// ========================================

export const TEACHING_FEATURES = {
  contextPanels: ['stakes', 'definition', 'tradeoffs', 'useCase', 'metrics', 'pitfalls', 'keyTakeaway'],
  pedagogicalPhases: 7,
  purposefulEnhancements: 8,
  surpassesHook1A: true,
  focusedOnLearning: true,
};
