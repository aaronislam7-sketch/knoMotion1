import React from 'react';

export const Apply3BConfig = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => { const keys = path.split('.'); const updated = { ...scene }; let current = updated; for (let i = 0; i < keys.length - 1; i++) { if (!current[keys[i]]) current[keys[i]] = {}; current = current[keys[i]]; } current[keys[keys.length - 1]] = value; onUpdate(updated); };
  const updateOption = (index, field, value) => { const options = [...(scene.options || [])]; options[index] = { ...options[index], [field]: value }; onUpdate({ ...scene, options }); };
  const scenario = scene.scenario || {};
  const options = scene.options || [];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>🎭 Scenario</h3>
        <textarea value={scenario.text || ''} onChange={(e) => handleChange('scenario.text', e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} placeholder="Describe the scenario..." />
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>📝 Options ({options.length})</h3>
        {options.map((opt, i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, border: '2px solid #E2E8F0' }}>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>Option {i + 1}</label>
              <input type="text" value={opt.text || ''} onChange={(e) => updateOption(i, 'text', e.target.value)} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E0', borderRadius: 4, fontSize: 13 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>Consequence</label>
              <input type="text" value={opt.consequence || ''} onChange={(e) => updateOption(i, 'consequence', e.target.value)} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E0', borderRadius: 4, fontSize: 13 }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Best Choice Index: {scene.bestChoice ?? 1}</label>
          <input type="number" min="0" max={Math.max(0, options.length - 1)} value={scene.bestChoice ?? 1} onChange={(e) => handleChange('bestChoice', parseInt(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} />
        </div>
      </section>
    </div>
  );
};
