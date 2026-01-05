import React from 'react';

export const Explain2BConfig = ({ scene, onUpdate }) => {
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
  
  const title = scene.title || {};
  const leftSide = scene.leftSide || { visual: {} };
  const rightSide = scene.rightSide || { visual: {} };
  const connector = scene.connector || {};
  const beats = scene.beats || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>📝 Content</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Title</label>
          <input type="text" value={title.text || ''} onChange={(e) => handleChange('title.text', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} placeholder="Understanding Through Analogy" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Left Label</label>
            <input type="text" value={leftSide.label || ''} onChange={(e) => handleChange('leftSide.label', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Right Label</label>
            <input type="text" value={rightSide.label || ''} onChange={(e) => handleChange('rightSide.label', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Left Description</label>
            <textarea value={leftSide.description || ''} onChange={(e) => handleChange('leftSide.description', e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Right Description</label>
            <textarea value={rightSide.description || ''} onChange={(e) => handleChange('rightSide.description', e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>
        </div>
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>⏱️ Timing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Left Reveal: {beats.leftReveal || 2.0}s</label>
            <input type="range" min="1" max="5" step="0.1" value={beats.leftReveal || 2.0} onChange={(e) => handleChange('beats.leftReveal', parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Right Reveal: {beats.rightReveal || 4.5}s</label>
            <input type="range" min="3" max="8" step="0.1" value={beats.rightReveal || 4.5} onChange={(e) => handleChange('beats.rightReveal', parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>
      </section>
    </div>
  );
};
