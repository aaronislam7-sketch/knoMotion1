import React from 'react';

export const Hook1EConfig = ({ scene, onUpdate }) => {
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
  
  const whisper = scene.whisper || {};
  const question = scene.question || {};
  const hint = scene.hint || {};
  const centralVisual = scene.centralVisual || {};
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  const effects = scene.effects || { particles: {}, fog: {}, glow: {} };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Section: Content */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          📝 Content
        </h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={whisper.enabled !== false}
              onChange={(e) => handleChange('whisper.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Show Whisper Text</span>
          </label>
          {whisper.enabled !== false && (
            <textarea
              value={whisper.text || ''}
              onChange={(e) => handleChange('whisper.text', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #CBD5E0',
                borderRadius: 6,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="In the depths of knowledge..."
            />
          )}
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Question Text
          </label>
          <textarea
            value={question.text || ''}
            onChange={(e) => handleChange('question.text', e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #CBD5E0',
              borderRadius: 6,
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="What secrets lie beneath the surface?"
          />
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={hint.enabled !== false}
              onChange={(e) => handleChange('hint.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Show Hint</span>
          </label>
          {hint.enabled !== false && (
            <textarea
              value={hint.text || ''}
              onChange={(e) => handleChange('hint.text', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #CBD5E0',
                borderRadius: 6,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Sometimes the answer is in the shadows"
            />
          )}
        </div>
      </section>
      
      {/* Section: Visual */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          🎨 Central Visual
        </h3>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={centralVisual.enabled || false}
              onChange={(e) => handleChange('centralVisual.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Show Central Visual</span>
          </label>
        </div>
        
        {centralVisual.enabled && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Visual Type
              </label>
              <select
                value={centralVisual.type || 'emoji'}
                onChange={(e) => handleChange('centralVisual.type', e.target.value)}
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
                <option value="none">None</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                {centralVisual.type === 'emoji' ? 'Emoji' : 'Visual Value'}
              </label>
              <input
                type="text"
                value={centralVisual.value || ''}
                onChange={(e) => handleChange('centralVisual.value', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #CBD5E0',
                  borderRadius: 6,
                  fontSize: centralVisual.type === 'emoji' ? 32 : 14
                }}
                placeholder={centralVisual.type === 'emoji' ? '🌫️' : 'path/to/image.png'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Scale: {centralVisual.scale || 2.5}x
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={centralVisual.scale || 2.5}
                onChange={(e) => handleChange('centralVisual.scale', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </>
        )}
      </section>
      
      {/* Section: Colors */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          🎨 Colors (Dark Theme)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Background
            </label>
            <input
              type="color"
              value={colors.bg || '#1A1F2E'}
              onChange={(e) => handleChange('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Accent
            </label>
            <input
              type="color"
              value={colors.accent || '#8E44AD'}
              onChange={(e) => handleChange('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Text
            </label>
            <input
              type="color"
              value={colors.text || '#E8F4FD'}
              onChange={(e) => handleChange('style_tokens.colors.text', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Glow Color
            </label>
            <input
              type="color"
              value={colors.glow || '#F39C12'}
              onChange={(e) => handleChange('style_tokens.colors.glow', e.target.value)}
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
            Question Size: {fonts.size_question || 72}px
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={fonts.size_question || 72}
            onChange={(e) => handleChange('style_tokens.fonts.size_question', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Whisper Size: {fonts.size_whisper || 38}px
          </label>
          <input
            type="range"
            min="24"
            max="60"
            value={fonts.size_whisper || 38}
            onChange={(e) => handleChange('style_tokens.fonts.size_whisper', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Hint Size: {fonts.size_hint || 28}px
          </label>
          <input
            type="range"
            min="20"
            max="48"
            value={fonts.size_hint || 28}
            onChange={(e) => handleChange('style_tokens.fonts.size_hint', parseInt(e.target.value))}
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
              Whisper: {beats.whisper || 2.5}s
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={beats.whisper || 2.5}
              onChange={(e) => handleChange('beats.whisper', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Question: {beats.question || 4.0}s
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="0.1"
              value={beats.question || 4.0}
              onChange={(e) => handleChange('beats.question', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Hint: {beats.hint || 8.0}s
            </label>
            <input
              type="range"
              min="5"
              max="12"
              step="0.1"
              value={beats.hint || 8.0}
              onChange={(e) => handleChange('beats.hint', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Exit: {beats.exit || 12.0}s
            </label>
            <input
              type="range"
              min="8"
              max="18"
              step="0.1"
              value={beats.exit || 12.0}
              onChange={(e) => handleChange('beats.exit', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>
      
      {/* Section: Effects */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          ✨ Effects
        </h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={effects.particles?.enabled !== false}
              onChange={(e) => handleChange('effects.particles.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Ambient Particles</span>
          </label>
          {effects.particles?.enabled !== false && (
            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Count: {effects.particles?.count || 20}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={effects.particles?.count || 20}
                onChange={(e) => handleChange('effects.particles.count', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={effects.fog?.enabled !== false}
              onChange={(e) => handleChange('effects.fog.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Fog Effect</span>
          </label>
        </div>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={effects.glow?.enabled !== false}
              onChange={(e) => handleChange('effects.glow.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Glow Effect</span>
          </label>
        </div>
      </section>
      
    </div>
  );
};
