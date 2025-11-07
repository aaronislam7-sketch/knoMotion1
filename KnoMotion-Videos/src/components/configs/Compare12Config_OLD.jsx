import React from 'react';

/**
 * Configuration Panel for Compare12MatrixGrid Template
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
        backgroundColor: isOpen ? '#00796B' : '#F5F5F5',
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

export const Compare12Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    grid: true,
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
  
  const updateRow = (index, field, value) => {
    const rows = [...(scene.rows || [])];
    rows[index] = { ...rows[index], [field]: value };
    updateField('rows', rows);
  };
  
  const updateColumn = (index, field, value) => {
    const columns = [...(scene.columns || [])];
    columns[index] = { ...columns[index], [field]: value };
    updateField('columns', columns);
  };
  
  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#00796B' }}>📊 Matrix Comparison Config</h3>
      
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
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Fill Animation</label>
          <select
            value={scene.fillAnimation || 'by-row'}
            onChange={(e) => updateField('fillAnimation', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          >
            <option value="by-row">By Row</option>
            <option value="by-column">By Column</option>
            <option value="cascade">Cascade</option>
            <option value="all-at-once">All At Once</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={scene.showConclusion !== false}
              onChange={(e) => updateField('showConclusion', e.target.checked)}
            />
            <span style={{ fontWeight: 600 }}>Show Conclusion</span>
          </label>
        </div>
        
        {scene.showConclusion !== false && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Conclusion Text</label>
            <input
              type="text"
              value={scene.conclusionText || ''}
              onChange={(e) => updateField('conclusionText', e.target.value)}
              style={{ width: '100%', padding: 8, fontSize: 14 }}
            />
          </div>
        )}
      </AccordionSection>
      
      {/* Grid Structure */}
      <AccordionSection
        title="Grid Structure"
        icon="📊"
        isOpen={openSections.grid}
        onToggle={() => toggleSection('grid')}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Columns</label>
          {(scene.columns || []).map((col, index) => (
            <div key={index} style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={col.header || ''}
                onChange={(e) => updateColumn(index, 'header', e.target.value)}
                placeholder={`Column ${index + 1}`}
                style={{ flex: 1, padding: 6, fontSize: 13 }}
              />
            </div>
          ))}
        </div>
        
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Rows</label>
          {(scene.rows || []).map((row, index) => (
            <div key={index} style={{ marginBottom: 12, padding: 12, border: '1px solid #E0E0E0', borderRadius: 4 }}>
              <input
                type="text"
                value={row.header || ''}
                onChange={(e) => updateRow(index, 'header', e.target.value)}
                placeholder={`Row ${index + 1} Header`}
                style={{ width: '100%', padding: 6, fontSize: 13, marginBottom: 8 }}
              />
              <div style={{ fontSize: 12, color: '#666' }}>
                Cells: {(row.cells || []).join(', ')}
              </div>
            </div>
          ))}
        </div>
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
              value={scene.style_tokens?.colors?.accent || '#00796B'}
              onChange={(e) => updateField('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Highlight</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.highlight || '#FFD700'}
              onChange={(e) => updateField('style_tokens.colors.highlight', e.target.value)}
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
      
      {/* Timing */}
      <AccordionSection
        title="Timing"
        icon="⏱️"
        isOpen={openSections.timing}
        onToggle={() => toggleSection('timing')}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Cell Interval: {scene.beats?.cellInterval || 0.4}s
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.1"
            value={scene.beats?.cellInterval || 0.4}
            onChange={(e) => updateField('beats.cellInterval', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Highlight Duration: {scene.beats?.highlightDuration || 1.0}s
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={scene.beats?.highlightDuration || 1.0}
            onChange={(e) => updateField('beats.highlightDuration', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </AccordionSection>
    </div>
  );
};
