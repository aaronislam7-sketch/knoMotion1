import React from 'react';

export const Explain2AConfig = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updated = { ...scene };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(updated);
  };
  
  const addPart = () => {
    const parts = scene.parts || [];
    const colors = ['#FF6B35', '#2ECC71', '#9B59B6', '#3498DB', '#E74C3C', '#F39C12', '#16A085', '#8E44AD'];
    const newPart = {
      label: `Part ${parts.length + 1}`,
      description: 'Component description',
      color: colors[parts.length % colors.length]
    };
    onUpdate({ ...scene, parts: [...parts, newPart] });
  };
  
  const removePart = (index) => {
    const parts = scene.parts || [];
    onUpdate({ ...scene, parts: parts.filter((_, i) => i !== index) });
  };
  
  const updatePart = (index, field, value) => {
    const parts = [...(scene.parts || [])];
    parts[index] = { ...parts[index], [field]: value };
    onUpdate({ ...scene, parts });
  };
  
  const title = scene.title || {};
  const center = scene.center || { visual: {} };
  const parts = scene.parts || [];
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  const layout = scene.layout || {};
  const effects = scene.effects || { particles: {} };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Section: Title & Center */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          📝 Title & Central Concept
        </h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Title
          </label>
          <input
            type="text"
            value={title.text || ''}
            onChange={(e) => handleChange('title.text', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #CBD5E0',
              borderRadius: 6,
              fontSize: 14
            }}
            placeholder="Understanding the Concept"
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Central Concept
          </label>
          <input
            type="text"
            value={center.text || ''}
            onChange={(e) => handleChange('center.text', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #CBD5E0',
              borderRadius: 6,
              fontSize: 14
            }}
            placeholder="Central Concept"
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={center.visual?.enabled || false}
              onChange={(e) => handleChange('center.visual.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Show Visual in Center</span>
          </label>
          
          {center.visual?.enabled && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                  Type
                </label>
                <select
                  value={center.visual.type || 'emoji'}
                  onChange={(e) => handleChange('center.visual.type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #CBD5E0',
                    borderRadius: 6,
                    fontSize: 14,
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="emoji">Emoji</option>
                  <option value="image">Image</option>
                  <option value="roughSVG">Rough SVG</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                  Value
                </label>
                <input
                  type="text"
                  value={center.visual.value || ''}
                  onChange={(e) => handleChange('center.visual.value', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #CBD5E0',
                    borderRadius: 6,
                    fontSize: center.visual.type === 'emoji' ? 24 : 14
                  }}
                  placeholder={center.visual.type === 'emoji' ? '💡' : 'path/to/image'}
                />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Section: Parts (Dynamic Array) */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2C3E50', margin: 0 }}>
            🧩 Concept Parts ({parts.length})
          </h3>
          <button
            onClick={addPart}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + Add Part
          </button>
        </div>
        
        {parts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
            No parts yet. Click "Add Part" to create one.
          </div>
        )}
        
        {parts.map((part, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              border: '2px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>
                Part {i + 1}
              </span>
              {parts.length > 2 && (
                <button
                  onClick={() => removePart(i)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>
                Label
              </label>
              <input
                type="text"
                value={part.label || ''}
                onChange={(e) => updatePart(i, 'label', e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  border: '1px solid #CBD5E0',
                  borderRadius: 4,
                  fontSize: 13
                }}
                placeholder="Part label"
              />
            </div>
            
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>
                Description
              </label>
              <textarea
                value={part.description || ''}
                onChange={(e) => updatePart(i, 'description', e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  border: '1px solid #CBD5E0',
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Component description"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>
                Color
              </label>
              <input
                type="color"
                value={part.color || '#FF6B35'}
                onChange={(e) => updatePart(i, 'color', e.target.value)}
                style={{ width: '100%', height: 32, border: '1px solid #CBD5E0', borderRadius: 4 }}
              />
            </div>
          </div>
        ))}
      </section>
      
      {/* Section: Colors */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          🎨 Colors
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Background
            </label>
            <input
              type="color"
              value={colors.bg || '#FFF9F0'}
              onChange={(e) => handleChange('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Center
            </label>
            <input
              type="color"
              value={colors.center || '#FF6B35'}
              onChange={(e) => handleChange('style_tokens.colors.center', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
        </div>
      </section>
      
      {/* Section: Typography */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          🔤 Typography
        </h3>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Title Size: {fonts.size_title || 52}px
          </label>
          <input
            type="range"
            min="32"
            max="80"
            value={fonts.size_title || 52}
            onChange={(e) => handleChange('style_tokens.fonts.size_title', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Center Size: {fonts.size_center || 44}px
          </label>
          <input
            type="range"
            min="28"
            max="64"
            value={fonts.size_center || 44}
            onChange={(e) => handleChange('style_tokens.fonts.size_center', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Part Label Size: {fonts.size_part_label || 28}px
          </label>
          <input
            type="range"
            min="18"
            max="40"
            value={fonts.size_part_label || 28}
            onChange={(e) => handleChange('style_tokens.fonts.size_part_label', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </section>
      
      {/* Section: Timing */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          ⏱️ Timing (seconds)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Center Reveal: {beats.centerReveal || 2.0}s
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={beats.centerReveal || 2.0}
              onChange={(e) => handleChange('beats.centerReveal', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              First Part: {beats.firstPart || 3.0}s
            </label>
            <input
              type="range"
              min="2"
              max="6"
              step="0.1"
              value={beats.firstPart || 3.0}
              onChange={(e) => handleChange('beats.firstPart', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Part Interval: {beats.partInterval || 0.6}s
            </label>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={beats.partInterval || 0.6}
              onChange={(e) => handleChange('beats.partInterval', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Exit: {beats.exit || 11.0}s
            </label>
            <input
              type="range"
              min="8"
              max="20"
              step="0.1"
              value={beats.exit || 11.0}
              onChange={(e) => handleChange('beats.exit', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>
      
      {/* Section: Layout */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          📐 Layout
        </h3>
        
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Spoke Radius: {layout.radius || 350}px
          </label>
          <input
            type="range"
            min="250"
            max="500"
            value={layout.radius || 350}
            onChange={(e) => handleChange('layout.radius', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </section>
      
    </div>
  );
};
