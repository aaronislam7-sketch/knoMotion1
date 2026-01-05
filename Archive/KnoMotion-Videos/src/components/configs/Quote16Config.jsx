import React from 'react';

/**
 * Quote16 Configuration Panel
 * 
 * Interactive UI for configuring Quote16Showcase template
 */

const STYLE_OPTIONS = ['classic', 'modern', 'minimal', 'bold'];
const EMPHASIS_OPTIONS = ['pulse', 'glow', 'scale', 'none'];
const VISUAL_TYPE_OPTIONS = ['emoji', 'roughSVG', 'lottie', 'none'];

export const Quote16Config = ({ scene, onUpdate }) => {
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
  
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};
  const particles = scene.particles || {};
  const animation = scene.animation || {};
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Quote Content */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          📝 Quote Content
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Quote Text
            </label>
            <textarea
              value={scene.quote?.text || ''}
              onChange={(e) => handleChange('quote.text', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              placeholder="Enter inspiring quote..."
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Author
            </label>
            <input
              type="text"
              value={scene.quote?.author || ''}
              onChange={(e) => handleChange('quote.author', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
              placeholder="Author name"
            />
          </div>
        </div>
      </section>
      
      {/* Visual Element */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎨 Visual Element
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Visual Type
            </label>
            <select
              value={scene.visual?.type || 'emoji'}
              onChange={(e) => handleChange('visual.type', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
            >
              {VISUAL_TYPE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Visual Value (emoji or asset)
            </label>
            <input
              type="text"
              value={scene.visual?.value || '💡'}
              onChange={(e) => handleChange('visual.value', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
              placeholder="💡"
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Visual Scale: {scene.visual?.scale || 2.0}
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scene.visual?.scale || 2.0}
              onChange={(e) => handleChange('visual.scale', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>
      
      {/* Style */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎭 Style & Animation
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Style Variant
            </label>
            <select
              value={scene.style || 'classic'}
              onChange={(e) => handleChange('style', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
            >
              {STYLE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Emphasis Effect
            </label>
            <select
              value={animation.emphasis || 'pulse'}
              onChange={(e) => handleChange('animation.emphasis', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
            >
              {EMPHASIS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
      
      {/* Colors */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎨 Colors
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Background
            </label>
            <input
              type="color"
              value={colors.bg || '#1A1A2E'}
              onChange={(e) => handleChange('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Quote Text
            </label>
            <input
              type="color"
              value={colors.quote || '#FFFFFF'}
              onChange={(e) => handleChange('style_tokens.colors.quote', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Author Text
            </label>
            <input
              type="color"
              value={colors.author || '#9B9B9B'}
              onChange={(e) => handleChange('style_tokens.colors.author', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Accent Color
            </label>
            <input
              type="color"
              value={colors.accent || '#FFD700'}
              onChange={(e) => handleChange('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
        </div>
      </section>
      
      {/* Typography */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🔤 Typography
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Quote Font Size: {fonts.size_quote || 48}px
            </label>
            <input
              type="range"
              min="32"
              max="72"
              value={fonts.size_quote || 48}
              onChange={(e) => handleChange('style_tokens.fonts.size_quote', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Author Font Size: {fonts.size_author || 28}px
            </label>
            <input
              type="range"
              min="18"
              max="40"
              value={fonts.size_author || 28}
              onChange={(e) => handleChange('style_tokens.fonts.size_author', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>
      
      {/* Timing */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          ⏱️ Timing
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Quote Reveal: {beats.quoteReveal || 1.0}s
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={beats.quoteReveal || 1.0}
              onChange={(e) => handleChange('beats.quoteReveal', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Hold Duration: {beats.hold || 6.5}s
            </label>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={beats.hold || 6.5}
              onChange={(e) => handleChange('beats.hold', parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>
      
      {/* Particles */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          ✨ Particles
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={particles.enabled !== false}
              onChange={(e) => handleChange('particles.enabled', e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label style={{ fontSize: 14, fontWeight: 600, color: '#2C3E50' }}>
              Enable Particle Effects
            </label>
          </div>
          
          {particles.enabled !== false && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
                Particle Count: {particles.count || 30}
              </label>
              <input
                type="range"
                min="10"
                max="60"
                value={particles.count || 30}
                onChange={(e) => handleChange('particles.count', parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
