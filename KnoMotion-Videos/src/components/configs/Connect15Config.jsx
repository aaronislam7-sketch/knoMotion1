import React from 'react';

/**
 * Configuration Panel for Connect15AnalogyBridge Template
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
        backgroundColor: isOpen ? '#7B1FA2' : '#F5F5F5',
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

export const Connect15Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    concepts: true,
    mappings: true,
    colors: false
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
  
  const updateMapping = (index, field, value) => {
    const mappings = [...(scene.mappings || [])];
    mappings[index] = { ...mappings[index], [field]: value };
    updateField('mappings', mappings);
  };
  
  const addMapping = () => {
    const mappings = [...(scene.mappings || [])];
    if (mappings.length < 5) {
      mappings.push({
        from: 'Feature A',
        to: 'Feature B'
      });
      updateField('mappings', mappings);
    }
  };
  
  const removeMapping = (index) => {
    const mappings = [...(scene.mappings || [])];
    if (mappings.length > 1) {
      mappings.splice(index, 1);
      updateField('mappings', mappings);
    }
  };
  
  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#7B1FA2' }}>🌉 Analogy Bridge Config</h3>
      
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
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Bridge Direction</label>
          <select
            value={scene.bridgeDirection || 'horizontal'}
            onChange={(e) => updateField('bridgeDirection', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          >
            <option value="horizontal">Horizontal (Left → Right)</option>
            <option value="vertical">Vertical (Top → Bottom)</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={scene.showBridgeAnimation !== false}
              onChange={(e) => updateField('showBridgeAnimation', e.target.checked)}
            />
            <span style={{ fontWeight: 600 }}>Animate Bridge Building</span>
          </label>
        </div>
      </AccordionSection>
      
      {/* Concepts */}
      <AccordionSection
        title="Two Concepts"
        icon="💡"
        isOpen={openSections.concepts}
        onToggle={() => toggleSection('concepts')}
      >
        <div style={{ marginBottom: 16, padding: 12, border: '2px solid #7B1FA2', borderRadius: 4, backgroundColor: '#F3E5F5' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#7B1FA2' }}>Familiar Concept (Left/Top)</label>
          
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Label</label>
            <input
              type="text"
              value={scene.familiarConcept?.label || ''}
              onChange={(e) => updateField('familiarConcept.label', e.target.value)}
              placeholder="e.g., Water Flowing"
              style={{ width: '100%', padding: 6, fontSize: 13 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Description</label>
            <textarea
              value={scene.familiarConcept?.description || ''}
              onChange={(e) => updateField('familiarConcept.description', e.target.value)}
              rows={2}
              placeholder="Brief description..."
              style={{ width: '100%', padding: 6, fontSize: 13 }}
            />
          </div>
        </div>
        
        <div style={{ padding: 12, border: '2px solid #7B1FA2', borderRadius: 4, backgroundColor: '#F3E5F5' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#7B1FA2' }}>New Concept (Right/Bottom)</label>
          
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Label</label>
            <input
              type="text"
              value={scene.newConcept?.label || ''}
              onChange={(e) => updateField('newConcept.label', e.target.value)}
              placeholder="e.g., Electricity"
              style={{ width: '100%', padding: 6, fontSize: 13 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Description</label>
            <textarea
              value={scene.newConcept?.description || ''}
              onChange={(e) => updateField('newConcept.description', e.target.value)}
              rows={2}
              placeholder="Brief description..."
              style={{ width: '100%', padding: 6, fontSize: 13 }}
            />
          </div>
        </div>
      </AccordionSection>
      
      {/* Mappings */}
      <AccordionSection
        title="Connection Mappings"
        icon="🔗"
        isOpen={openSections.mappings}
        onToggle={() => toggleSection('mappings')}
      >
        <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
          Show how features from the familiar concept map to the new concept
        </p>
        
        {(scene.mappings || []).map((mapping, index) => (
          <div key={index} style={{ 
            marginBottom: 12, 
            padding: 12, 
            border: '1px solid #E0E0E0',
            borderRadius: 4,
            backgroundColor: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Mapping {index + 1}</span>
              <button
                onClick={() => removeMapping(index)}
                disabled={(scene.mappings || []).length <= 1}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: 12,
                  backgroundColor: '#F44336',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: (scene.mappings || []).length <= 1 ? 0.5 : 1
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                value={mapping.from || ''}
                onChange={(e) => updateMapping(index, 'from', e.target.value)}
                placeholder="Familiar"
                style={{ padding: 6, fontSize: 13 }}
              />
              <span style={{ fontSize: 16, fontWeight: 700 }}>→</span>
              <input
                type="text"
                value={mapping.to || ''}
                onChange={(e) => updateMapping(index, 'to', e.target.value)}
                placeholder="New"
                style={{ padding: 6, fontSize: 13 }}
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addMapping}
          disabled={(scene.mappings || []).length >= 5}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#7B1FA2',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginTop: 8,
            opacity: (scene.mappings || []).length >= 5 ? 0.5 : 1
          }}
        >
          + Add Mapping (max 5)
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
              value={scene.style_tokens?.colors?.bg || '#F8F9FA'}
              onChange={(e) => updateField('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Accent</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.accent || '#7B1FA2'}
              onChange={(e) => updateField('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Bridge</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.bridge || '#9C27B0'}
              onChange={(e) => updateField('style_tokens.colors.bridge', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Text</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.ink || '#212121'}
              onChange={(e) => updateField('style_tokens.colors.ink', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
