import React, { useState } from 'react';

/**
 * Template Gallery - Visual Template Selector
 * 
 * Interactive gallery for browsing and selecting templates
 * Displays template cards with preview, intentions, and metadata
 * 
 * STAGING MODE: Toggle to view templates under review before production release
 */

// ==================== PRODUCTION TEMPLATES ====================
// These are live, tested, and ready for use
const TEMPLATE_CATALOG = [
  // EXISTING TEMPLATES (Remapped to new intentions)
  {
    id: 'Hook1AQuestionBurst',
    name: 'Question Burst',
    intentions: { primary: 'QUESTION', secondary: ['CHALLENGE', 'REVEAL'] },
    description: 'Provocative question with visual anchor',
    duration: '15-18s',
    icon: '❓',
    color: '#FF6B35',
    version: 'v5.1',
    hasConfig: false
  },
  {
    id: 'Hook1EAmbientMystery',
    name: 'Ambient Mystery',
    intentions: { primary: 'REVEAL', secondary: ['INSPIRE', 'QUESTION'] },
    description: 'Atmospheric fog and intrigue',
    duration: '12s',
    icon: '🌫️',
    color: '#9B59B6',
    version: 'v5.0'
  },
  {
    id: 'Explain2AConceptBreakdown',
    name: 'Concept Hub',
    intentions: { primary: 'BREAKDOWN', secondary: ['CONNECT', 'GUIDE'] },
    description: 'Hub-and-spoke with 2-8 parts',
    duration: '20-40s',
    icon: '🧩',
    color: '#3498DB',
    version: 'v5.0'
  },
  {
    id: 'Explain2BAnalogy',
    name: 'Visual Analogy',
    intentions: { primary: 'COMPARE', secondary: ['BREAKDOWN', 'INSPIRE'] },
    description: 'Side-by-side comparison',
    duration: '12s',
    icon: '🔄',
    color: '#16A085',
    version: 'v5.0'
  },
  {
    id: 'Apply3AMicroQuiz',
    name: 'Interactive Quiz',
    intentions: { primary: 'CHALLENGE', secondary: ['QUESTION', 'REVEAL'] },
    description: 'Multiple choice with countdown',
    duration: '12-15s',
    icon: '🎯',
    color: '#E74C3C',
    version: 'v5.0'
  },
  {
    id: 'Apply3BScenarioChoice',
    name: 'Scenario Choice',
    intentions: { primary: 'CHALLENGE', secondary: ['GUIDE', 'COMPARE'] },
    description: 'Real-world decision scenarios',
    duration: '11s',
    icon: '🎲',
    color: '#F39C12',
    version: 'v5.0'
  },
  {
    id: 'Reflect4AKeyTakeaways',
    name: 'Key Points',
    intentions: { primary: 'BREAKDOWN', secondary: ['GUIDE', 'REVEAL'] },
    description: 'Summary with 1-5 key points',
    duration: '8s',
    icon: '📋',
    color: '#27AE60',
    version: 'v5.0'
  },
  {
    id: 'Reflect4DForwardLink',
    name: 'Bridge',
    intentions: { primary: 'CONNECT', secondary: ['INSPIRE', 'REVEAL'] },
    description: 'Bridge to next topic',
    duration: '10s',
    icon: '🔗',
    color: '#8E44AD',
    version: 'v5.0'
  },
  
  // NEW V6 TEMPLATES
  {
    id: 'Reveal9ProgressiveUnveil',
    name: 'Progressive Reveal',
    intentions: { primary: 'REVEAL', secondary: ['QUESTION', 'BREAKDOWN'] },
    description: 'Curtain/layer progressive unveiling with 2-5 stages',
    duration: '15-45s',
    icon: '🎭',
    color: '#E91E63',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Guide10StepSequence',
    name: 'Step Sequence',
    intentions: { primary: 'GUIDE', secondary: ['BREAKDOWN', 'CONNECT'] },
    description: 'Step-by-step process with 2-8 numbered steps',
    duration: '40-90s',
    icon: '🗺️',
    color: '#00BCD4',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Compare11BeforeAfter',
    name: 'Before/After Split',
    intentions: { primary: 'COMPARE', secondary: ['INSPIRE', 'REVEAL'] },
    description: 'Split-screen comparison with slider transition',
    duration: '20-40s',
    icon: '⚖️',
    color: '#4CAF50',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  
  // LEARNING CONTENT PIPELINE (Nov 2025)
  {
    id: 'Compare12MatrixGrid',
    name: 'Matrix Comparison',
    intentions: { primary: 'COMPARE', secondary: ['BREAKDOWN', 'GUIDE'] },
    description: 'Feature comparison matrix with 2x2 to 5x4 grids',
    duration: '30-60s',
    icon: '📊',
    color: '#00796B',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Challenge13PollQuiz',
    name: 'Poll/Quiz',
    intentions: { primary: 'CHALLENGE', secondary: ['QUESTION', 'REVEAL'] },
    description: 'Interactive quiz with timer and answer reveal',
    duration: '15-25s',
    icon: '🎮',
    color: '#D32F2F',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Spotlight14SingleConcept',
    name: 'Concept Spotlight',
    intentions: { primary: 'QUESTION', secondary: ['REVEAL', 'BREAKDOWN'] },
    description: 'Deep dive into single concept with multi-stage reveal',
    duration: '20-30s',
    icon: '💡',
    color: '#FF6B35',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Connect15AnalogyBridge',
    name: 'Analogy Bridge',
    intentions: { primary: 'CONNECT', secondary: ['EXPLAIN', 'REVEAL'] },
    description: 'Visual analogy connecting familiar to new concept',
    duration: '25-35s',
    icon: '🌉',
    color: '#9C27B0',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  
  // INSPIRE TEMPLATES (Nov 7, 2025) - CRITICAL GAP FILLED
  {
    id: 'Quote16Showcase',
    name: 'Quote Showcase',
    intentions: { primary: 'INSPIRE', secondary: ['QUESTION', 'REVEAL'] },
    description: 'Inspirational quotes with beautiful visuals and animations',
    duration: '7-10s',
    icon: '✨',
    color: '#F39C12',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  
  // ADDITIONAL GUIDE TEMPLATES (Nov 7, 2025)
  {
    id: 'Progress18Path',
    name: 'Progress Path',
    intentions: { primary: 'GUIDE', secondary: ['INSPIRE', 'CONNECT'] },
    description: 'Visual journey with milestones and progress tracking',
    duration: '6-10s',
    icon: '🛤️',
    color: '#00BCD4',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  
  // V5 TO V6 MIGRATIONS
  {
    id: 'Hook1AQuestionBurst_V6',
    name: 'Question Burst V6',
    intentions: { primary: 'QUESTION', secondary: ['CHALLENGE', 'REVEAL'] },
    description: '✨ Fully configurable two-part question with optional visuals and conclusion',
    duration: '8-12s',
    icon: '❓',
    color: '#FF6B35',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Hook1EAmbientMystery_V6',
    name: 'Ambient Mystery V6',
    intentions: { primary: 'REVEAL', secondary: ['INSPIRE', 'QUESTION'] },
    description: '✨ Dark atmospheric template with fog, particles, and sequential mystery reveals',
    duration: '12-18s',
    icon: '🌫️',
    color: '#8E44AD',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Explain2AConceptBreakdown_V6',
    name: 'Concept Breakdown V6',
    intentions: { primary: 'BREAKDOWN', secondary: ['CONNECT', 'GUIDE'] },
    description: '✨ Hub-and-spoke layout with dynamic parts array (2-8 components) and connections',
    duration: '12-20s',
    icon: '🧩',
    color: '#3498DB',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Apply3AMicroQuiz_V6',
    name: 'Micro Quiz V6',
    intentions: { primary: 'CHALLENGE', secondary: ['QUESTION', 'REVEAL'] },
    description: '✨ Interactive multiple-choice quiz with countdown timer and answer reveal',
    duration: '12-16s',
    icon: '🎯',
    color: '#E74C3C',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Explain2BAnalogy_V6',
    name: 'Visual Analogy V6',
    intentions: { primary: 'COMPARE', secondary: ['BREAKDOWN', 'INSPIRE'] },
    description: '✨ Side-by-side comparison with familiar analogies for better understanding',
    duration: '9-12s',
    icon: '🔄',
    color: '#16A085',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Apply3BScenarioChoice_V6',
    name: 'Scenario Choice V6',
    intentions: { primary: 'CHALLENGE', secondary: ['GUIDE', 'COMPARE'] },
    description: '✨ Real-world decision scenarios with multiple paths and consequences',
    duration: '9-12s',
    icon: '🎲',
    color: '#F39C12',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Reflect4AKeyTakeaways_V6',
    name: 'Key Takeaways V6',
    intentions: { primary: 'BREAKDOWN', secondary: ['GUIDE', 'REVEAL'] },
    description: '✨ Clean bullet-point summary of main points with dynamic list',
    duration: '8-12s',
    icon: '📋',
    color: '#27AE60',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'Reflect4DForwardLink_V6',
    name: 'Forward Link V6',
    intentions: { primary: 'CONNECT', secondary: ['INSPIRE', 'REVEAL'] },
    description: '✨ Bridge to next topic with context and preview for continuity',
    duration: '9-12s',
    icon: '🔗',
    color: '#8E44AD',
    version: 'v6.0',
    isNew: true,
    hasConfig: true
  },
  
  // REVISED TEMPLATES (Testing Broadcast Quality)
  {
    id: 'TEST_Explain2AConceptBreakdown_V6',
    name: '🧪 TEST: Concept Breakdown (Revised)',
    intentions: { primary: 'BREAKDOWN', secondary: ['CONNECT', 'GUIDE'] },
    description: '🎬 BROADCAST QUALITY - Full screen usage, emphasis system for VO, circular badges, sophisticated visuals',
    duration: '14-18s',
    icon: '🧩',
    color: '#FF0099',
    version: 'v6.0-REVISED',
    isNew: true,
    hasConfig: true
  },
  {
    id: 'TEST_Guide10StepSequence_V6',
    name: '🧪 TEST: Step Sequence (Revised)',
    intentions: { primary: 'GUIDE', secondary: ['BREAKDOWN', 'CONNECT'] },
    description: '🎬 BROADCAST QUALITY - Horizontal/grid layouts, Lottie arrows, circular cards, progress tracker',
    duration: '14-16s',
    icon: '🗺️',
    color: '#FF0099',
    version: 'v6.0-REVISED',
    isNew: true,
    hasConfig: true
  }
];

// ==================== STAGING TEMPLATES ====================
// Templates under review - visible only in staging mode
// Once approved, move to TEMPLATE_CATALOG above
const STAGING_CATALOG = [
  // V7.0 Scene-Shell Templates (Dec 2025) - NEW ARCHITECTURE
  {
    id: 'FullFrameScene',
    name: '🎨 V7: Full Frame Scene',
    intentions: { primary: 'INSPIRE', secondary: ['REVEAL', 'QUESTION'] },
    description: '✨ NEW V7: Single full-screen canvas with centered content. Perfect for title cards, hero statements, and single concepts. Supports text, cards, and custom content types.',
    duration: '10-15s',
    icon: '🖼️',
    color: '#FF6B35',
    version: 'v7.0-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: false,
    features: [
      'Full 1920x1080 canvas utilization',
      'Centered content with optional title',
      'Multiple content types (text, card, custom)',
      'Configurable entrance animations',
      'Works across aspect ratios (16:9, 9:16, 1:1)',
      'Theme/style token system (no hardcoded colors)'
    ]
  },
  {
    id: 'GridLayoutScene',
    name: '🎨 V7: Grid Layout Scene',
    intentions: { primary: 'BREAKDOWN', secondary: ['COMPARE', 'GUIDE'] },
    description: '✨ NEW V7: N×M grid with auto-positioning and staggered animations. Integrates with AppMosaic component. Perfect for feature showcases and tool comparisons.',
    duration: '12-18s',
    icon: '📱',
    color: '#4ECDC4',
    version: 'v7.0-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: false,
    features: [
      'Auto-positions items in grid (no pixel coords)',
      'Adaptive sizing for different item counts',
      'Staggered animations (by index, row, or column)',
      'Integrates with AppMosaic component',
      'Glassmorphic card effects',
      'Handles 3-12 items gracefully'
    ]
  },
  {
    id: 'StackLayoutScene',
    name: '🎨 V7: Stack Layout Scene',
    intentions: { primary: 'GUIDE', secondary: ['BREAKDOWN', 'REVEAL'] },
    description: '✨ NEW V7: Vertical or horizontal linear stack with sequential reveals. Perfect for step-by-step guides, processes, and checklists.',
    duration: '14-20s',
    icon: '📋',
    color: '#9B59B6',
    version: 'v7.0-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: false,
    features: [
      'Vertical or horizontal direction',
      'Sequential/staggered reveal animations',
      'Optional step numbering',
      'Configurable spacing and alignment',
      'Glassmorphic or solid card styles',
      'Handles 1-6 items optimally'
    ]
  },
  {
    id: 'FlowLayoutScene',
    name: '🎨 V7: Flow Layout Scene',
    intentions: { primary: 'CONNECT', secondary: ['GUIDE', 'BREAKDOWN'] },
    description: '✨ NEW V7: Connected nodes with directional flow and animated edges. Integrates with FlowDiagram. Perfect for pipelines and workflows.',
    duration: '15-20s',
    icon: '🔄',
    color: '#00BCD4',
    version: 'v7.0-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: false,
    features: [
      'Left-to-right or top-to-bottom flow',
      'Auto-positions nodes (no manual coords)',
      'Animated edge drawing with arrowheads',
      'Node highlighting (active/visited)',
      'Integrates with FlowDiagram component',
      'Handles 3-8 nodes cleanly'
    ]
  },
  {
    id: 'SplitLayoutScene',
    name: '🎨 V7: Split Layout Scene',
    intentions: { primary: 'COMPARE', secondary: ['EXPLAIN', 'SHOWCASE'] },
    description: '✨ NEW V7: Two-panel split layout (vertical or horizontal) with configurable ratio. Perfect for before/after comparisons, side-by-side concepts, and dual-content scenarios.',
    duration: '12-15s',
    icon: '⚖️',
    color: '#FF9800',
    version: 'v7.0-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: false,
    features: [
      'Vertical (left/right) or horizontal (top/bottom) split',
      'Configurable split ratio (0.0 to 1.0)',
      'Optional divider line at split point',
      'Independent panel animations',
      'Works with any mid-level component',
      'Perfect for comparisons and dual-content'
    ]
  },
  
  // V6 Staging Templates
  {
    id: 'STAGING_Hook1AQuestionBurst_V6_Upgraded',
    name: '🧪 Question Burst V6 - Interactive Revelation',
    intentions: { primary: 'QUESTION', secondary: ['CHALLENGE', 'REVEAL'] },
    description: '🎬 UPGRADED: Scene transformation, corner icons, connecting lines, doodle effects, supporting text labels. Broadcast-quality polish with 7 visual layers.',
    duration: '11-13s',
    icon: '❓',
    color: '#FF0099',
    version: 'v6.2-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: true,
    features: [
      'Scene transformation (background shifts mid-scene)',
      'Corner icons (contextual emojis)',
      'Connecting lines between elements',
      'Doodle underline effects',
      'Supporting text labels',
      'Selective glassmorphic panes'
    ]
  },
  {
    id: 'STAGING_Reflect4AKeyTakeaways_V6_Enhanced',
    name: '🧪 Key Takeaways V6.4 - Modal Showcase',
    intentions: { primary: 'REFLECT', secondary: ['BREAKDOWN', 'GUIDE', 'REVEAL'] },
    description: '🎬 MODAL SHOWCASE: Each point gets full-screen spotlight with darkened background (modal-style). Optional Lottie animations per item. Uniform card sizing. Engaging presentation flow.',
    duration: '18-25s',
    icon: '💡',
    color: '#27AE60',
    version: 'v6.4-STAGING',
    isNew: true,
    isStaging: true,
    hasConfig: true,
    features: [
      'Modal-style showcase (85% dark overlay dims background)',
      'Optional Lottie animation placeholder per takeaway',
      'Uniform card sizing (no size variation)',
      'Each point gets 2.5s spotlight moment',
      'Smooth transitions: showcase → final list',
      '60fps optimized with willChange hints',
      'Fully configurable: overlay opacity, Lottie size, card scale'
    ],
    flowPattern: [
      '1. Title reveal',
      '2-4. Modal showcase per takeaway (background dims, Lottie plays if provided)',
      '5. Transition to final list (overlay fades out)',
      '6. Final list with subtle breathing/floating'
    ]
  }
];

// Intention badges
const INTENTION_COLORS = {
  'QUESTION': '#FF6B35',
  'REVEAL': '#9B59B6',
  'COMPARE': '#16A085',
  'BREAKDOWN': '#3498DB',
  'GUIDE': '#00BCD4',
  'CHALLENGE': '#E74C3C',
  'CONNECT': '#8E44AD',
  'INSPIRE': '#F39C12'
};

const INTENTION_ICONS = {
  'QUESTION': '❓',
  'REVEAL': '🎭',
  'COMPARE': '⚖️',
  'BREAKDOWN': '🧩',
  'GUIDE': '🗺️',
  'CHALLENGE': '🎯',
  'CONNECT': '🔗',
  'INSPIRE': '✨'
};

export const TemplateGallery = ({ onSelectTemplate, selectedTemplateId }) => {
  const [filterIntention, setFilterIntention] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stagingMode, setStagingMode] = useState(false);
  
  // Select catalog based on mode
  const activeCatalog = stagingMode ? STAGING_CATALOG : TEMPLATE_CATALOG;
  
  // Filter templates by intention
  const filteredTemplates = filterIntention
    ? activeCatalog.filter(t => 
        t.intentions.primary === filterIntention || 
        t.intentions.secondary.includes(filterIntention)
      )
    : activeCatalog;
  
  // Get unique intentions for filter buttons
  const allIntentions = Object.keys(INTENTION_COLORS);
  
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: 20
    }}>
      {/* Collapsible Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: stagingMode ? '#FF0099' : '#4CAF50',
          cursor: 'pointer',
          transition: 'all 0.2s',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = stagingMode ? '#E6008A' : '#45A049'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = stagingMode ? '#FF0099' : '#4CAF50'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{stagingMode ? '🧪' : '🎨'}</span>
          <h2 style={{
            fontSize: 22,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: '#FFFFFF',
            margin: 0
          }}>
            {stagingMode ? 'Staging Area' : 'Template Gallery'} {!isCollapsed && `(${filteredTemplates.length})`}
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isCollapsed && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStagingMode(!stagingMode);
                  setFilterIntention(null); // Clear filter when switching
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#FFFFFF',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                {stagingMode ? '🎨 Production' : '🧪 Staging'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#FFFFFF',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                {viewMode === 'grid' ? '📋 List' : '🎨 Grid'}
              </button>
            </>
          )}
          <span style={{ 
            fontSize: 24, 
            color: '#FFFFFF',
            transition: 'transform 0.3s',
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
          }}>
            ▼
          </span>
        </div>
      </div>
      
      {/* Gallery Content */}
      {!isCollapsed && (
        <div style={{ 
          padding: '20px',
          maxHeight: '400px',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4CAF50 #F0F0F0'
        }}>
      
      {/* Intention Filter */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#666',
          marginBottom: 8,
          letterSpacing: 1
        }}>
          FILTER BY INTENTION:
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <button
            onClick={() => setFilterIntention(null)}
            style={{
              padding: '6px 12px',
              backgroundColor: filterIntention === null ? '#1A1A1A' : '#FFFFFF',
              color: filterIntention === null ? '#FFFFFF' : '#1A1A1A',
              border: '2px solid #1A1A1A',
              borderRadius: 20,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              transition: 'all 0.2s'
            }}
          >
            ALL ({TEMPLATE_CATALOG.length})
          </button>
          {allIntentions.map(intention => {
            const count = TEMPLATE_CATALOG.filter(t => 
              t.intentions.primary === intention || 
              t.intentions.secondary.includes(intention)
            ).length;
            
            return (
              <button
                key={intention}
                onClick={() => setFilterIntention(intention)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: filterIntention === intention ? INTENTION_COLORS[intention] : '#FFFFFF',
                  color: filterIntention === intention ? '#FFFFFF' : '#1A1A1A',
                  border: `2px solid ${INTENTION_COLORS[intention]}`,
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s'
                }}
              >
                {INTENTION_ICONS[intention]} {intention} ({count})
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Template Cards */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'none',
        flexDirection: viewMode === 'list' ? 'column' : 'none',
        gap: 14
      }}>
        {filteredTemplates.map(template => {
          const isSelected = template.id === selectedTemplateId;
          
          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              style={{
                backgroundColor: isSelected ? '#E8F5E9' : '#FFFFFF',
                border: isSelected ? '3px solid #4CAF50' : '2px solid #E0E0E0',
                borderRadius: 12,
                padding: 16,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(76, 175, 80, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = template.color;
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {/* New Badge */}
              {template.isNew && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#FF6B35',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1
                }}>
                  NEW
                </div>
              )}
              
              {/* Staging Badge */}
              {template.isStaging && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: '#FF0099',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  boxShadow: '0 2px 8px rgba(255, 0, 153, 0.4)'
                }}>
                  🧪 STAGING
                </div>
              )}
              
              {/* Selected Badge */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#4CAF50',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1
                }}>
                  ✓ SELECTED
                </div>
              )}
              
              {/* Icon & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  fontSize: 48,
                  lineHeight: 1
                }}>
                  {template.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 800,
                    fontFamily: '"Permanent Marker", cursive',
                    color: template.color,
                    margin: 0,
                    marginBottom: 4
                  }}>
                    {template.name}
                  </h3>
                  <div style={{
          fontSize: 12,
          color: '#5A6C7D',
          fontWeight: 600
                  }}>
                    {template.version} • {template.duration}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p style={{
              fontSize: 14,
              color: '#2C3E50',
              lineHeight: 1.6,
              margin: '0 0 12px 0',
              fontWeight: 400
              }}>
                {template.description}
              </p>
              
              {/* Intentions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {/* Primary Intention */}
                <div style={{
                  padding: '4px 10px',
                  backgroundColor: INTENTION_COLORS[template.intentions.primary],
                  color: '#FFFFFF',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.5
                }}>
                  {INTENTION_ICONS[template.intentions.primary]} {template.intentions.primary}
                </div>
                
                {/* Secondary Intentions */}
                {template.intentions.secondary.map(intention => (
                  <div
                    key={intention}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#FFFFFF',
                      color: INTENTION_COLORS[intention],
                      border: `1.5px solid ${INTENTION_COLORS[intention]}`,
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: 0.5
                    }}
                  >
                    {INTENTION_ICONS[intention]} {intention}
                  </div>
                ))}
              </div>
              
              {/* Config Available Badge */}
              {template.hasConfig && (
                <div style={{
                  marginTop: 12,
                  padding: '6px 10px',
                  backgroundColor: '#E3F2FD',
                  color: '#1976D2',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: 'center',
                  border: '1px solid #BBDEFB'
                }}>
                  ⚙️ Interactive Config Available
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            No templates found for "{filterIntention}"
          </div>
          <button
            onClick={() => setFilterIntention(null)}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#FF6B35',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Clear Filter
          </button>
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export { TEMPLATE_CATALOG, STAGING_CATALOG, INTENTION_COLORS, INTENTION_ICONS };
