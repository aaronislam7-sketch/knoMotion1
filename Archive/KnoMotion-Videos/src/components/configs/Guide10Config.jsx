import React from 'react';

/**
 * Configuration Panel for Guide10StepSequence Template
 * 
 * Exposes all configurable parameters:
 * - Layout (vertical, horizontal, grid)
 * - Connection style (line, arrow, dots, none)
 * - Steps (2-8 dynamic array)
 * - Colors, fonts, beats, animations
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
        backgroundColor: isOpen ? '#00BCD4' : '#F5F5F5',
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

export const Guide10Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    steps: true,
    colors: false,
    fonts: false,
    timing: false,
    animation: false
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
  
  const updateStep = (index, updates) => {
    const steps = [...(scene.steps || [])];
    steps[index] = { ...steps[index], ...updates };
    onUpdate({ ...scene, steps });
  };
  
  const addStep = () => {
    const steps = [...(scene.steps || [])];
    if (steps.length < 8) {
      steps.push({
        title: `Step ${steps.length + 1}`,
        description: 'Step description',
        icon: null
      });
      onUpdate({ ...scene, steps });
    }
  };
  
  const removeStep = (index) => {
    const steps = [...(scene.steps || [])];
    if (steps.length > 2) {
      steps.splice(index, 1);
      onUpdate({ ...scene, steps });
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
  
  const updateAnimation = (updates) => {
    onUpdate({
      ...scene,
      animation: { ...(scene.animation || {}), ...updates }
    });
  };
  
  const title = scene.title || {};
  const steps = scene.steps || [];
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  const animation = scene.animation || {};
  
  return (
    <div>
      {/* Basic Settings */}
      <AccordionSection
        title="Basic Settings"
        icon="⚙️"
        isOpen={openSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
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
        
        {/* Layout */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Layout Style
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginBottom: 8 }}>
            How steps are arranged on screen
          </div>
          <select
            value={scene.layout || 'vertical'}
            onChange={(e) => onUpdate({ ...scene, layout: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="vertical">↓ Vertical (Top to Bottom)</option>
            <option value="horizontal">→ Horizontal (Left to Right)</option>
            <option value="grid">⊞ Grid (Auto-arrange)</option>
          </select>
        </div>
        
        {/* Connection Style */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Connection Style
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginBottom: 8 }}>
            Visual connections between steps
          </div>
          <select
            value={scene.connectionStyle || 'arrow'}
            onChange={(e) => onUpdate({ ...scene, connectionStyle: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="line">━ Line</option>
            <option value="arrow">→ Arrow</option>
            <option value="dots">··· Dots</option>
            <option value="none">⭕ None</option>
          </select>
        </div>
      </AccordionSection>
      
      {/* Steps */}
      <AccordionSection
        title={`Steps (${steps.length})`}
        icon="🗺️"
        isOpen={openSections.steps}
        onToggle={() => toggleSection('steps')}
      >
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={addStep}
            disabled={steps.length >= 8}
            style={{
              padding: '8px 16px',
              backgroundColor: steps.length >= 8 ? '#CCC' : '#4CAF50',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              cursor: steps.length >= 8 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 13,
              marginRight: 8
            }}
          >
            + Add Step
          </button>
          <span style={{ fontSize: 13, color: '#5A6C7D' }}>
            (Min: 2, Max: 8, Current: {steps.length})
          </span>
        </div>
        
        {steps.map((step, index) => (
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
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                <span style={{
                  display: 'inline-block',
                  width: 28,
                  height: 28,
                  lineHeight: '28px',
                  textAlign: 'center',
                  backgroundColor: '#00BCD4',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  marginRight: 8,
                  fontSize: 13
                }}>
                  {index + 1}
                </span>
                Step {index + 1}
              </span>
              {steps.length > 2 && (
                <button
                  onClick={() => removeStep(index)}
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
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                Step Title
              </label>
              <input
                type="text"
                value={step.title || ''}
                onChange={(e) => updateStep(index, { title: e.target.value })}
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
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                Description
              </label>
              <textarea
                value={step.description || ''}
                onChange={(e) => updateStep(index, { description: e.target.value })}
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
        {['bg', 'accent', 'accent2', 'ink', 'stepBg', 'connectionColor'].map(colorKey => (
          <div key={colorKey} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
              {colorKey === 'bg' ? 'Background' : 
               colorKey === 'accent' ? 'Accent (Number Badge)' :
               colorKey === 'accent2' ? 'Accent 2 (Box Border)' :
               colorKey === 'ink' ? 'Text Color' :
               colorKey === 'stepBg' ? 'Step Box Background' :
               'Connection Line Color'}
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
          { key: 'size_title', label: 'Title Size', min: 40, max: 100, default: 64 },
          { key: 'size_stepTitle', label: 'Step Title Size', min: 20, max: 50, default: 32 },
          { key: 'size_stepDesc', label: 'Description Size', min: 12, max: 32, default: 20 },
          { key: 'size_stepNumber', label: 'Number Badge Size', min: 30, max: 70, default: 48 }
        ].map(font => (
          <div key={font.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
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
        {[
          { key: 'titleEntry', label: 'Title Entry', min: 0, max: 3, step: 0.1, default: 0.6 },
          { key: 'firstStep', label: 'First Step Start', min: 0.5, max: 4, step: 0.5, default: 1.5 },
          { key: 'stepInterval', label: 'Time Between Steps', min: 0.5, max: 4, step: 0.5, default: 2.0 },
          { key: 'emphasize', label: 'Emphasis Duration', min: 0.2, max: 2, step: 0.2, default: 0.8 },
          { key: 'exit', label: 'Exit Delay', min: 0.5, max: 4, step: 0.5, default: 2.0 }
        ].map(beat => (
          <div key={beat.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
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
      
      {/* Animation */}
      <AccordionSection
        title="Animation Settings"
        icon="✨"
        isOpen={openSections.animation}
        onToggle={() => toggleSection('animation')}
      >
        {/* Step Entrance */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Step Entrance Style
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginBottom: 8 }}>
            How each step appears
          </div>
          <select
            value={animation.stepEntrance || 'slide-left'}
            onChange={(e) => updateAnimation({ stepEntrance: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="fade-up">↗️ Fade Up</option>
            <option value="slide-left">← Slide Left</option>
            <option value="pop">⬆️ Pop</option>
            <option value="bounce">🎾 Bounce</option>
          </select>
        </div>
        
        {/* Connection Draw */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={animation.connectionDraw !== false}
              onChange={(e) => updateAnimation({ connectionDraw: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Animate Connection Lines
            </span>
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginTop: 4, marginLeft: 24 }}>
            Draw connections between steps as they appear
          </div>
        </div>
        
        {/* Pulse on Entry */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={animation.pulseOnEntry !== false}
              onChange={(e) => updateAnimation({ pulseOnEntry: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Pulse on Entry
            </span>
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginTop: 4, marginLeft: 24 }}>
            Add emphasis pulse when step appears
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
