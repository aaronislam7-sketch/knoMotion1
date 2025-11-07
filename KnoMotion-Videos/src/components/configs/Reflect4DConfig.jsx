import React from 'react';

export const Reflect4DConfig = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => { const keys = path.split('.'); const updated = { ...scene }; let current = updated; for (let i = 0; i < keys.length - 1; i++) { if (!current[keys[i]]) current[keys[i]] = {}; current = current[keys[i]]; } current[keys[keys.length - 1]] = value; onUpdate(updated); };
  
  const current = scene.current || {};
  const next = scene.next || {};
  const bridge = scene.bridge || {};
  const visual = scene.visual || {};
  const beats = scene.beats || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>⬅️ Current Topic</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Heading</label>
          <input type="text" value={current.text || ''} onChange={(e) => handleChange('current.text', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} placeholder="What we learned:" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Summary</label>
          <textarea value={current.summary || ''} onChange={(e) => handleChange('current.summary', e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} placeholder="Core concepts covered" />
        </div>
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>➡️ Next Topic</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Heading</label>
          <input type="text" value={next.text || ''} onChange={(e) => handleChange('next.text', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} placeholder="Coming up next:" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Preview</label>
          <textarea value={next.preview || ''} onChange={(e) => handleChange('next.preview', e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} placeholder="Advanced topics ahead" />
        </div>
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>⏱️ Timing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Current: {beats.current || 1.0}s</label>
            <input type="range" min="0.5" max="3" step="0.1" value={beats.current || 1.0} onChange={(e) => handleChange('beats.current', parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Next: {beats.next || 5.0}s</label>
            <input type="range" min="3" max="8" step="0.1" value={beats.next || 5.0} onChange={(e) => handleChange('beats.next', parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </div>
      </section>
    </div>
  );
};
