import React from 'react';

export const Apply3AConfig = ({ scene, onUpdate }) => {
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
  
  const updateChoice = (index, field, value) => {
    const choices = [...(scene.choices || [])];
    choices[index] = { ...choices[index], [field]: value };
    onUpdate({ ...scene, choices });
  };
  
  const addChoice = () => {
    const choices = scene.choices || [];
    const ids = ['A', 'B', 'C', 'D', 'E', 'F'];
    onUpdate({ ...scene, choices: [...choices, { text: `Option ${ids[choices.length]}`, id: ids[choices.length] }] });
  };
  
  const removeChoice = (index) => {
    const choices = scene.choices || [];
    onUpdate({ ...scene, choices: choices.filter((_, i) => i !== index) });
  };
  
  const question = scene.question || { visual: {} };
  const choices = scene.choices || [];
  const timer = scene.timer || {};
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>❓ Question</h3>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleChange('question.text', e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
          placeholder="What is the capital of France?"
        />
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#2C3E50', margin: 0 }}>
            📝 Choices ({choices.length})
          </h3>
          <button onClick={addChoice} style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Choice
          </button>
        </div>
        
        {choices.map((choice, i) => (
          <div key={i} style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, border: '2px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50' }}>Choice {choice.id || i + 1}</span>
              {choices.length > 2 && (
                <button onClick={() => removeChoice(i)} style={{ padding: '4px 8px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={choice.text || ''}
              onChange={(e) => updateChoice(i, 'text', e.target.value)}
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #CBD5E0', borderRadius: 4, fontSize: 13 }}
              placeholder="Choice text"
            />
          </div>
        ))}
        
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Correct Answer (0-based index): {scene.correctAnswer ?? 1}
          </label>
          <input
            type="number"
            min="0"
            max={Math.max(0, choices.length - 1)}
            value={scene.correctAnswer ?? 1}
            onChange={(e) => handleChange('correctAnswer', parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E0', borderRadius: 6, fontSize: 14 }}
          />
        </div>
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>⏱️ Timer</h3>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
          <input type="checkbox" checked={timer.enabled !== false} onChange={(e) => handleChange('timer.enabled', e.target.checked)} style={{ marginRight: 8 }} />
          <span style={{ fontWeight: 600 }}>Show Timer</span>
        </label>
        {timer.enabled !== false && (
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Duration: {timer.duration || 8}s
            </label>
            <input type="range" min="5" max="20" value={timer.duration || 8} onChange={(e) => handleChange('timer.duration', parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>
        )}
      </section>
      
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>🎨 Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Correct</label>
            <input type="color" value={colors.correct || '#2ECC71'} onChange={(e) => handleChange('style_tokens.colors.correct', e.target.value)} style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>Incorrect</label>
            <input type="color" value={colors.incorrect || '#E74C3C'} onChange={(e) => handleChange('style_tokens.colors.incorrect', e.target.value)} style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }} />
          </div>
        </div>
      </section>
    </div>
  );
};
