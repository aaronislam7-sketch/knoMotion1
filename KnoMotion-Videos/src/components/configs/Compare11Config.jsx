import React from 'react';

/**
 * Configuration Panel for Compare11BeforeAfter Template
 * 
 * Exposes all configurable parameters:
 * - Split orientation (vertical, horizontal)
 * - Transition style (slider, wipe, fade)
 * - Before/After states (label, headline, description, visual, backgroundColor)
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
        backgroundColor: isOpen ? '#4CAF50' : '#F5F5F5',
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

export const Compare11Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    before: true,
    after: true,
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
  
  const updateBefore = (updates) => {
    onUpdate({
      ...scene,
      before: { ...(scene.before || {}), ...updates }
    });
  };
  
  const updateAfter = (updates) => {
    onUpdate({
      ...scene,
      after: { ...(scene.after || {}), ...updates }
    });
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
  const before = scene.before || {};
  const after = scene.after || {};
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
        
        {/* Split Orientation */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Split Orientation
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginBottom: 8 }}>
            How the screen is divided
          </div>
          <select
            value={scene.splitOrientation || 'vertical'}
            onChange={(e) => onUpdate({ ...scene, splitOrientation: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="vertical">⬌ Vertical (Side-by-Side)</option>
            <option value="horizontal">⬍ Horizontal (Top-Bottom)</option>
          </select>
        </div>
        
        {/* Transition Style */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Transition Style
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginBottom: 8 }}>
            How the transition reveals the after state
          </div>
          <select
            value={scene.transitionStyle || 'slider'}
            onChange={(e) => onUpdate({ ...scene, transitionStyle: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="slider">⟷ Slider (Interactive Handle)</option>
            <option value="wipe">━ Wipe</option>
            <option value="slide">→ Slide</option>
            <option value="fade">🌫️ Fade</option>
          </select>
        </div>
      </AccordionSection>
      
      {/* BEFORE State */}
      <AccordionSection
        title="BEFORE State"
        icon="◀"
        isOpen={openSections.before}
        onToggle={() => toggleSection('before')}
      >
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Label
          </label>
          <input
            type="text"
            value={before.label || ''}
            onChange={(e) => updateBefore({ label: e.target.value })}
            placeholder="BEFORE"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Headline
          </label>
          <input
            type="text"
            value={before.headline || ''}
            onChange={(e) => updateBefore({ headline: e.target.value })}
            placeholder="Starting Point"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Description
          </label>
          <textarea
            value={before.description || ''}
            onChange={(e) => updateBefore({ description: e.target.value })}
            placeholder="Describe the before state..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6,
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Background Color
          </label>
          <input
            type="color"
            value={before.backgroundColor || '#FFE5E5'}
            onChange={(e) => updateBefore({ backgroundColor: e.target.value })}
            style={{
              width: '100%',
              height: 40,
              border: '2px solid #DDD',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          />
        </div>
      </AccordionSection>
      
      {/* AFTER State */}
      <AccordionSection
        title="AFTER State"
        icon="▶"
        isOpen={openSections.after}
        onToggle={() => toggleSection('after')}
      >
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Label
          </label>
          <input
            type="text"
            value={after.label || ''}
            onChange={(e) => updateAfter({ label: e.target.value })}
            placeholder="AFTER"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Headline
          </label>
          <input
            type="text"
            value={after.headline || ''}
            onChange={(e) => updateAfter({ headline: e.target.value })}
            placeholder="End Result"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Description
          </label>
          <textarea
            value={after.description || ''}
            onChange={(e) => updateAfter({ description: e.target.value })}
            placeholder="Describe the after state..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6,
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Background Color
          </label>
          <input
            type="color"
            value={after.backgroundColor || '#E5FFE5'}
            onChange={(e) => updateAfter({ backgroundColor: e.target.value })}
            style={{
              width: '100%',
              height: 40,
              border: '2px solid #DDD',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          />
        </div>
      </AccordionSection>
      
      {/* Colors */}
      <AccordionSection
        title="Colors"
        icon="🎨"
        isOpen={openSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        {['bg', 'accent', 'accent2', 'ink', 'divider'].map(colorKey => (
          <div key={colorKey} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
              {colorKey === 'bg' ? 'Overall Background' : 
               colorKey === 'accent' ? 'Accent (Before)' :
               colorKey === 'accent2' ? 'Accent 2 (After)' :
               colorKey === 'ink' ? 'Text Color' :
               'Divider/Slider Color'}
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
          { key: 'size_label', label: 'Label Size (BEFORE/AFTER)', min: 16, max: 36, default: 24 },
          { key: 'size_headline', label: 'Headline Size', min: 28, max: 64, default: 42 },
          { key: 'size_description', label: 'Description Size', min: 16, max: 36, default: 24 }
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
          { key: 'beforeReveal', label: 'Before Reveal', min: 0.5, max: 4, step: 0.5, default: 1.2 },
          { key: 'transitionStart', label: 'Transition Start', min: 2, max: 8, step: 0.5, default: 3.5 },
          { key: 'transitionDuration', label: 'Transition Duration', min: 0.5, max: 3, step: 0.1, default: 1.8 },
          { key: 'afterEmphasize', label: 'After Emphasis Duration', min: 0.3, max: 2, step: 0.1, default: 1.0 },
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
        {/* Before Entrance */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            Before State Entrance
          </label>
          <select
            value={animation.beforeEntrance || 'slide-right'}
            onChange={(e) => updateAnimation({ beforeEntrance: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="slide-right">→ Slide Right</option>
            <option value="fade-up">↗️ Fade Up</option>
            <option value="pop">⬆️ Pop</option>
          </select>
        </div>
        
        {/* After Entrance */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#1A1A1A' }}>
            After State Entrance
          </label>
          <select
            value={animation.afterEntrance || 'slide-left'}
            onChange={(e) => updateAnimation({ afterEntrance: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: 14,
              border: '2px solid #DDD',
              borderRadius: 6
            }}
          >
            <option value="slide-left">← Slide Left</option>
            <option value="fade-up">↗️ Fade Up</option>
            <option value="pop">⬆️ Pop</option>
          </select>
        </div>
        
        {/* Pulse After */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={animation.pulseAfter !== false}
              onChange={(e) => updateAnimation({ pulseAfter: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Pulse After State
            </span>
          </label>
          <div style={{ fontSize: 13, color: '#5A6C7D', fontStyle: 'italic', marginTop: 4, marginLeft: 24 }}>
            Add emphasis pulse to the after state when revealed
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
