import React from 'react';

export const Reflect4AConfig = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => { const keys = path.split('.'); const updated = { ...scene }; let current = updated; for (let i = 0; i < keys.length - 1; i++) { if (!current[keys[i]]) current[keys[i]] = {}; current = current[keys[i]]; } current[keys[keys.length - 1]] = value; onUpdate(updated); };
  const updateTakeaway = (index, field, value) => { const takeaways = [...(scene.takeaways || [])]; takeaways[index] = { ...takeaways[index], [field]: value }; onUpdate({ ...scene, takeaways }); };
  const addTakeaway = () => { const takeaways = scene.takeaways || []; onUpdate({ ...scene, takeaways: [...takeaways, { text: 'New key point', icon: '💡' }] }); };
  const removeTakeaway = (index) => { const takeaways = scene.takeaways || []; onUpdate({ ...scene, takeaways: takeaways.filter((_, i) => i !== index) }); };
  
  const title = scene.title || {};
  const takeaways = scene.takeaways || [];
  const beats = scene.beats || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>📝 Title</h3>
        <input type="text" value={title.text || ''} onChange={(e) => handleChange('title.text', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }} placeholder="Key Takeaways" />
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2C3E50', margin: 0 }}>📋 Takeaways ({takeaways.length})</h3>
          <button onClick={addTakeaway} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
        </div>
        {takeaways.map((item, i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, border: '2px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Point {i + 1}</span>
              {takeaways.length > 1 && <button onClick={() => removeTakeaway(i)} style={{ padding: '4px 8px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Remove</button>}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>Text</label>
              <textarea value={item.text || ''} onChange={(e) => updateTakeaway(i, 'text', e.target.value)} rows={2} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E0', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 600, color: '#34495E' }}>Icon</label>
              <input type="text" value={item.icon || ''} onChange={(e) => updateTakeaway(i, 'icon', e.target.value)} style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E0', borderRadius: 4, fontSize: 24 }} />
            </div>
          </div>
        ))}
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>⏱️ Timing</h3>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Item Interval: {beats.takeawayInterval || 1.0}s</label>
          <input type="range" min="0.5" max="2" step="0.1" value={beats.takeawayInterval || 1.0} onChange={(e) => handleChange('beats.takeawayInterval', parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>
      </section>
    </div>
  );
};
