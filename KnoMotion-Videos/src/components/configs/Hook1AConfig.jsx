import React from 'react';

export const Hook1AConfig = ({ scene, onUpdate }) => {
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
  
  const questionPart1 = scene.questionPart1 || {};
  const questionPart2 = scene.questionPart2 || {};
  const centralVisual = scene.centralVisual || {};
  const conclusion = scene.conclusion || {};
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  const particles = scene.particles || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Section: Question Content */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          ❓ Question Content
        </h3>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Question Part 1
          </label>
          <textarea
            value={questionPart1.text || ''}
            onChange={(e) => handleChange('questionPart1.text', e.target.value)}
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
            placeholder="What if geography"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Question Part 2
          </label>
          <textarea
            value={questionPart2.text || ''}
            onChange={(e) => handleChange('questionPart2.text', e.target.value)}
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
            placeholder="was measured in mindsets?"
          />
        </div>
      </section>
      
      {/* Section: Central Visual */}
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
            <span style={{ fontWeight: 600 }}>Show Central Visual (after questions fade)</span>
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
                <option value="lottie">Lottie Animation</option>
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
                placeholder={centralVisual.type === 'emoji' ? '🗺️' : 'path/to/image.png'}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Scale: {centralVisual.scale || 3.0}x
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={centralVisual.scale || 3.0}
                onChange={(e) => handleChange('centralVisual.scale', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </>
        )}
      </section>
      
      {/* Section: Conclusion */}
      <section style={{ backgroundColor: '#F8F9FA', padding: 16, borderRadius: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#2C3E50' }}>
          ✨ Conclusion (Optional)
        </h3>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={conclusion.enabled || false}
              onChange={(e) => handleChange('conclusion.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Show Conclusion Text</span>
          </label>
        </div>
        
        {conclusion.enabled && (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Conclusion Text
              </label>
              <input
                type="text"
                value={conclusion.text || ''}
                onChange={(e) => handleChange('conclusion.text', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #CBD5E0',
                  borderRadius: 6,
                  fontSize: 14
                }}
                placeholder="Welcome to Knodovia"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Subtitle (optional)
              </label>
              <input
                type="text"
                value={conclusion.subtitle || ''}
                onChange={(e) => handleChange('conclusion.subtitle', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #CBD5E0',
                  borderRadius: 6,
                  fontSize: 14
                }}
                placeholder="Where your mindset shapes reality"
              />
            </div>
          </>
        )}
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
              Accent (Q1)
            </label>
            <input
              type="color"
              value={colors.accent || '#FF6B35'}
              onChange={(e) => handleChange('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Accent 2 (Q2)
            </label>
            <input
              type="color"
              value={colors.accent2 || '#9B59B6'}
              onChange={(e) => handleChange('style_tokens.colors.accent2', e.target.value)}
              style={{ width: '100%', height: 36, border: '1px solid #CBD5E0', borderRadius: 6 }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Text
            </label>
            <input
              type="color"
              value={colors.text || '#1A1A1A'}
              onChange={(e) => handleChange('style_tokens.colors.text', e.target.value)}
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
            Question Size: {fonts.size_question || 80}px
          </label>
          <input
            type="range"
            min="40"
            max="120"
            value={fonts.size_question || 80}
            onChange={(e) => handleChange('style_tokens.fonts.size_question', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Conclusion Size: {fonts.size_conclusion || 64}px
          </label>
          <input
            type="range"
            min="32"
            max="100"
            value={fonts.size_conclusion || 64}
            onChange={(e) => handleChange('style_tokens.fonts.size_conclusion', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
            Question Weight: {fonts.weight_question || 800}
          </label>
          <input
            type="range"
            min="400"
            max="900"
            step="100"
            value={fonts.weight_question || 800}
            onChange={(e) => handleChange('style_tokens.fonts.weight_question', parseInt(e.target.value))}
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
              Q1 Appears: {beats.questionPart1 || 0.8}s
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={beats.questionPart1 || 0.8}
              onChange={(e) => handleChange('beats.questionPart1', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Q2 Appears: {beats.questionPart2 || 2.5}s
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={beats.questionPart2 || 2.5}
              onChange={(e) => handleChange('beats.questionPart2', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Emphasis: {beats.emphasis || 4.0}s
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="0.1"
              value={beats.emphasis || 4.0}
              onChange={(e) => handleChange('beats.emphasis', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Questions Exit: {beats.exit || 5.5}s
            </label>
            <input
              type="range"
              min="3"
              max="10"
              step="0.1"
              value={beats.exit || 5.5}
              onChange={(e) => handleChange('beats.exit', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          {centralVisual.enabled && (
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                Visual Reveal: {beats.visualReveal || 6.0}s
              </label>
              <input
                type="range"
                min="4"
                max="12"
                step="0.1"
                value={beats.visualReveal || 6.0}
                onChange={(e) => handleChange('beats.visualReveal', parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}
          
          {conclusion.enabled && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                  Conclusion: {beats.conclusion || 7.0}s
                </label>
                <input
                  type="range"
                  min="5"
                  max="12"
                  step="0.1"
                  value={beats.conclusion || 7.0}
                  onChange={(e) => handleChange('beats.conclusion', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
                  Hold: {beats.hold || 9.0}s
                </label>
                <input
                  type="range"
                  min="7"
                  max="15"
                  step="0.1"
                  value={beats.hold || 9.0}
                  onChange={(e) => handleChange('beats.hold', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Fade Out: {beats.fadeOut || 10.0}s
            </label>
            <input
              type="range"
              min="8"
              max="16"
              step="0.1"
              value={beats.fadeOut || 10.0}
              onChange={(e) => handleChange('beats.fadeOut', parseFloat(e.target.value))}
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
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={particles.enabled !== false}
              onChange={(e) => handleChange('particles.enabled', e.target.checked)}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Ambient Particles</span>
          </label>
        </div>
        
        {particles.enabled !== false && (
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#34495E' }}>
              Particle Count: {particles.count || 25}
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={particles.count || 25}
              onChange={(e) => handleChange('particles.count', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </section>
      
    </div>
  );
};
