import React from 'react';

/**
 * Configuration Panel for Spotlight14SingleConcept Template
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
        backgroundColor: isOpen ? '#FF6F00' : '#F5F5F5',
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

export const Spotlight14Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    stages: true,
    colors: false,
    timing: false
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const updateField = (path, value) => {
    const keys = path.split('.');
    const newScene = JSON.parse(JSON.stringify(scene));
    let current = newScene;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(newScene);
  };
  
  const updateStage = (index, field, value) => {
    const stages = [...(scene.stages || [])];
    stages[index] = { ...stages[index], [field]: value };
    onUpdate({ ...scene, stages });
  };
  
  const addStage = () => {
    const stages = [...(scene.stages || [])];
    if (stages.length < 5) {
      stages.push({
        type: 'explanation',
        headline: 'New Stage',
        bodyText: 'Stage content here...',
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
  
  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#FF6F00' }}>💡 Single Concept Spotlight Config</h3>
      
      {/* Basic Settings */}
      <AccordionSection
        title="Basic Settings"
        icon="⚙️"
        isOpen={openSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Title</label>
          <input
            type="text"
            value={scene.title?.text || ''}
            onChange={(e) => updateField('title.text', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Background Style</label>
          <select
            value={scene.backgroundStyle || 'gradient'}
            onChange={(e) => updateField('backgroundStyle', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          >
            <option value="gradient">Gradient</option>
            <option value="solid">Solid Color</option>
            <option value="spotlight">Spotlight Effect</option>
            <option value="particles">Animated Particles</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Transition Style</label>
          <select
            value={scene.transitionStyle || 'fade'}
            onChange={(e) => updateField('transitionStyle', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="zoom">Zoom</option>
          </select>
        </div>
      </AccordionSection>
      
      {/* Stages */}
      <AccordionSection
        title="Content Stages"
        icon="📖"
        isOpen={openSections.stages}
        onToggle={() => toggleSection('stages')}
      >
        {(scene.stages || []).map((stage, index) => (
          <div key={index} style={{ 
            marginBottom: 16, 
            padding: 12, 
            border: '2px solid #FF6F00',
            borderRadius: 4,
            backgroundColor: '#FFF3E0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Stage {index + 1}</span>
              <button
                onClick={() => removeStage(index)}
                disabled={(scene.stages || []).length <= 2}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: 12,
                  backgroundColor: '#F44336',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: (scene.stages || []).length <= 2 ? 0.5 : 1
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Stage Type</label>
              <select
                value={stage.type || 'explanation'}
                onChange={(e) => updateStage(index, 'type', e.target.value)}
                style={{ width: '100%', padding: 6, fontSize: 13 }}
              >
                <option value="question">Question</option>
                <option value="visual">Visual</option>
                <option value="explanation">Explanation</option>
                <option value="takeaway">Key Takeaway</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Headline</label>
              <input
                type="text"
                value={stage.headline || ''}
                onChange={(e) => updateStage(index, 'headline', e.target.value)}
                style={{ width: '100%', padding: 6, fontSize: 13 }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Body Text</label>
              <textarea
                value={stage.bodyText || ''}
                onChange={(e) => updateStage(index, 'bodyText', e.target.value)}
                rows={2}
                style={{ width: '100%', padding: 6, fontSize: 13 }}
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addStage}
          disabled={(scene.stages || []).length >= 5}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#FF6F00',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            opacity: (scene.stages || []).length >= 5 ? 0.5 : 1
          }}
        >
          + Add Stage (max 5)
        </button>
      </AccordionSection>
      
      {/* Colors */}
      <AccordionSection
        title="Colors"
        icon="🎨"
        isOpen={openSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Background</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.bg || '#1A1A1A'}
              onChange={(e) => updateField('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Accent</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.accent || '#FF6F00'}
              onChange={(e) => updateField('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Spotlight</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.spotlight || '#FFD54F'}
              onChange={(e) => updateField('style_tokens.colors.spotlight', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Text</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.text || '#FFFFFF'}
              onChange={(e) => updateField('style_tokens.colors.text', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
        </div>
      </AccordionSection>
      
      {/* Timing */}
      <AccordionSection
        title="Timing"
        icon="⏱️"
        isOpen={openSections.timing}
        onToggle={() => toggleSection('timing')}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Stage Interval: {scene.beats?.stageInterval || 4.5}s
          </label>
          <input
            type="range"
            min="2.0"
            max="8.0"
            step="0.5"
            value={scene.beats?.stageInterval || 4.5}
            onChange={(e) => updateField('beats.stageInterval', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Transition Duration: {scene.beats?.transitionDuration || 0.8}s
          </label>
          <input
            type="range"
            min="0.3"
            max="2.0"
            step="0.1"
            value={scene.beats?.transitionDuration || 0.8}
            onChange={(e) => updateField('beats.transitionDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </AccordionSection>
    </div>
  );
};
