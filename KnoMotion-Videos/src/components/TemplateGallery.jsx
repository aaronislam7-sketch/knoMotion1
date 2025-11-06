import React, { useState } from 'react';

/**
 * Template Gallery - Visual Template Selector
 * 
 * Interactive gallery for browsing and selecting templates
 * Displays template cards with preview, intentions, and metadata
 */

// Template metadata with learning intentions
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
    version: 'v5.1'
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
  
  // Filter templates by intention
  const filteredTemplates = filterIntention
    ? TEMPLATE_CATALOG.filter(t => 
        t.intentions.primary === filterIntention || 
        t.intentions.secondary.includes(filterIntention)
      )
    : TEMPLATE_CATALOG;
  
  // Get unique intentions for filter buttons
  const allIntentions = Object.keys(INTENTION_COLORS);
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      marginBottom: 20
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <h2 style={{
          fontSize: 28,
          fontWeight: 900,
          fontFamily: '"Permanent Marker", cursive',
          color: '#1A1A1A',
          margin: 0
        }}>
          🎨 Template Gallery
        </h2>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #DDD',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            {viewMode === 'grid' ? '📋 List View' : '🎨 Grid View'}
          </button>
        </div>
      </div>
      
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
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
        flexDirection: viewMode === 'list' ? 'column' : 'none',
        gap: 16
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
                    fontSize: 11,
                    color: '#666',
                    fontWeight: 600
                  }}>
                    {template.version} • {template.duration}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p style={{
                fontSize: 13,
                color: '#555',
                lineHeight: 1.5,
                margin: '0 0 12px 0'
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
                  fontSize: 11,
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
                      fontSize: 11,
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
                  fontSize: 11,
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
  );
};

export { TEMPLATE_CATALOG, INTENTION_COLORS, INTENTION_ICONS };
