import React from 'react';

/**
 * Configuration Panel for Reveal9ProgressiveUnveil Template
 * 
 * Exposes all configurable parameters from the JSX/JSON:
 * - Reveal style (5 options)
 * - Stages (2-5 dynamic array)
 * - Title, colors, fonts, beats
 */

const AccordionSection = ({ title, icon, isOpen, onToggle, children }) => (
  <div style={{
    marginBottom: 16,
    border: '2px solid #E0E0E0',
    borderRadius: 8,
    overflow: 'hidden'
  }}>
    <div
      onClick={onToggle}
      style={{
        padding: '12px 16px',
        backgroundColor: isOpen ? '#E91E63' : '#F5F5F5',
        color: isOpen ? '#FFFFFF' : '#1A1A1A',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: 15,
        transition: 'all 0.2s'
      }}
    >
      <span>{icon} {title}</span>
      <span>{isOpen ? '▼' : '▶'}</span>
    </div>
    {isOpen && (
      <div style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
        {children}
      </div>
    )}
  </div>
);

export const Reveal9Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    stages: true,
    colors: false,
    fonts: false,
    timing: false
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const updateTitle = (updates) => {
    onUpdate({
      ...scene,
      title: { ...(scene.title || {}), ...updates }
    });
  };
  
  const updateStage = (index, updates) => {
    const stages = [...(scene.stages || [])];
    stages[index] = { ...stages[index], ...updates };
    onUpdate({ ...scene, stages });
  };
  
  const addStage = () => {
    const stages = [...(scene.stages || [])];
    if (stages.length < 5) {
      stages.push({
        headline: `Stage ${stages.length + 1}`,
        description: 'New stage description',
        visual: null,
        position: 'center'
      });
      onUpdate({ ...scene, stages });
    }
  };
  
  const removeStage = (index) => {
    const stages = [...(scene.stages || [])];
    if (stages.length > 2) {
      stages.splice(index, 1);
      onUpdate({ ...scene, stages });
    }
  };
  
  const updateColors = (updates) => {
    onUpdate({
      ...scene,
      style_tokens: {
        ...(scene.style_tokens || {}),
        colors: { ...(scene.style_tokens?.colors || {}), ...updates }
      }
    });
  };
  
  const updateFonts = (updates) => {
    onUpdate({
      ...scene,
      style_tokens: {
        ...(scene.style_tokens || {}),
        fonts: { ...(scene.style_tokens?.fonts || {}), ...updates }
      }
    });
  };
  
  const updateBeats = (updates) => {
    onUpdate({
      ...scene,
      beats: { ...(scene.beats || {}), ...updates }
    });
  };
  
  const title = scene.title || {};
  const stages = scene.stages || [];
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  
  return (
    <div>
      {/* Basic Settings */}
      <AccordionSection
        title="Basic Settings"
        icon="⚙️"
        isOpen={openSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        {/* Title Text */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            Title Text
          </label>
          <input
            type="text"
            value={title.text || ''}
            onChange={(e) => updateTitle({ text: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          />
        </div>
        
        {/* Reveal Style */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            Reveal Style
          </label>
          <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginBottom: 8 }}>
            How the curtain/overlay reveals each stage
          </div>
          <select
            value={scene.revealStyle || 'curtain'}
            onChange={(e) => onUpdate({ ...scene, revealStyle: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="curtain">🎭 Curtain (Horizontal Split)</option>
            <option value="fade">🌫️ Fade</option>
            <option value="slide-left">← Slide Left</option>
            <option value="slide-right">→ Slide Right</option>
            <option value="zoom">🔍 Zoom</option>
          </select>
        </div>
      </AccordionSection>
      
      {/* Stages */}
      <AccordionSection
        title={`Reveal Stages (${stages.length})`}
        icon="🎭"
        isOpen={openSections.stages}
        onToggle={() => toggleSection('stages')}
      >
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={addStage}
            disabled={stages.length >= 5}
            style={{
              padding: '8px 16px',
              backgroundColor: stages.length >= 5 ? '#CCC' : '#4CAF50',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              cursor: stages.length >= 5 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 13,
              marginRight: 8
            }}
          >
            + Add Stage
          </button>
          <span style={{ fontSize: 11, color: '#666' }}>
            (Min: 2, Max: 5, Current: {stages.length})
          </span>
        </div>
        
        {stages.map((stage, index) => (
          <div
            key={index}
            style={{
              padding: 12,
              border: '2px solid #E0E0E0',
              borderRadius: 6,
              marginBottom: 12,
              backgroundColor: '#FAFAFA'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Stage {index + 1}</span>
              {stages.length > 2 && (
                <button
                  onClick={() => removeStage(index)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#F44336',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 700
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Headline
              </label>
              <input
                type="text"
                value={stage.headline || ''}
                onChange={(e) => updateStage(index, { headline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: 13,
                  border: '1px solid #DDD',
                  borderRadius: 4
                }}
              />
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Description
              </label>
              <textarea
                value={stage.description || ''}
                onChange={(e) => updateStage(index, { description: e.target.value })}
                rows={2}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: 13,
                  border: '1px solid #DDD',
                  borderRadius: 4,
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>
        ))}
      </AccordionSection>
      
      {/* Colors */}
      <AccordionSection
        title="Colors"
        icon="🎨"
        isOpen={openSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        {['bg', 'accent', 'accent2', 'ink', 'curtain'].map(colorKey => (
          <div key={colorKey} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              {colorKey === 'bg' ? 'Background' : 
               colorKey === 'accent' ? 'Accent (Primary)' :
               colorKey === 'accent2' ? 'Accent 2 (Secondary)' :
               colorKey === 'ink' ? 'Text Color' :
               'Curtain Color'}
            </label>
            <input
              type="color"
              value={colors[colorKey] || '#FFFFFF'}
              onChange={(e) => updateColors({ [colorKey]: e.target.value })}
              style={{
                width: '100%',
                height: 40,
                border: '2px solid #DDD',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            />
            <input
              type="text"
              value={colors[colorKey] || ''}
              onChange={(e) => updateColors({ [colorKey]: e.target.value })}
              placeholder="#FFFFFF"
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: 12,
                border: '1px solid #DDD',
                borderRadius: 4,
                marginTop: 4
              }}
            />
          </div>
        ))}
      </AccordionSection>
      
      {/* Fonts */}
      <AccordionSection
        title="Typography"
        icon="✏️"
        isOpen={openSections.fonts}
        onToggle={() => toggleSection('fonts')}
      >
        {[
          { key: 'size_title', label: 'Title Size', min: 40, max: 100, default: 72 },
          { key: 'size_headline', label: 'Stage Headline Size', min: 30, max: 80, default: 52 },
          { key: 'size_description', label: 'Description Size', min: 16, max: 40, default: 28 }
        ].map(font => (
          <div key={font.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              {font.label}: {fonts[font.key] || font.default}px
            </label>
            <input
              type="range"
              min={font.min}
              max={font.max}
              value={fonts[font.key] || font.default}
              onChange={(e) => updateFonts({ [font.key]: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </AccordionSection>
      
      {/* Timing */}
      <AccordionSection
        title="Timeline (Beats)"
        icon="⏱️"
        isOpen={openSections.timing}
        onToggle={() => toggleSection('timing')}
      >
        <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic', marginBottom: 12 }}>
          Control when each animation happens (in seconds)
        </div>
        
        {[
          { key: 'titleEntry', label: 'Title Entry', min: 0, max: 3, step: 0.1, default: 0.6 },
          { key: 'stageInterval', label: 'Time Between Stages', min: 1, max: 6, step: 0.5, default: 3.5 },
          { key: 'stageTransition', label: 'Stage Transition Duration', min: 0.3, max: 2, step: 0.1, default: 1.0 },
          { key: 'exit', label: 'Exit Delay', min: 0.5, max: 4, step: 0.5, default: 2.0 }
        ].map(beat => (
          <div key={beat.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              {beat.label}: {beats[beat.key] || beat.default}s
            </label>
            <input
              type="range"
              min={beat.min}
              max={beat.max}
              step={beat.step}
              value={beats[beat.key] || beat.default}
              onChange={(e) => updateBeats({ [beat.key]: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </AccordionSection>
    </div>
  );
};
