/**
 * BackgroundPicker - Background Preset Selection
 * 
 * Displays visual previews of available background presets
 * and allows configuration of noise, particles, and spotlight options.
 */
import React from 'react';

// Background preset definitions with visual styles
const BACKGROUND_PRESETS = [
  {
    preset: 'notebookSoft',
    name: 'Notebook',
    description: 'Lined paper overlay',
    mood: 'Educational',
    preview: {
      background: 'linear-gradient(to bottom, #FFF9F0, #F5EBD9)',
      pattern: 'repeating-linear-gradient(transparent, transparent 27px, #E8D5B5 28px)',
    }
  },
  {
    preset: 'sunriseGradient',
    name: 'Sunrise',
    description: 'Warm diagonal gradient',
    mood: 'Playful',
    preview: {
      background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE4B5 50%, #FFB347 100%)',
    }
  },
  {
    preset: 'cleanCard',
    name: 'Clean',
    description: 'Neutral white',
    mood: 'Minimal',
    preview: {
      background: '#FFFFFF',
      border: '1px solid #E5E5E5',
    }
  },
  {
    preset: 'chalkboardGradient',
    name: 'Chalkboard',
    description: 'Dark blue-green gradient',
    mood: 'Mentor',
    preview: {
      background: 'linear-gradient(135deg, #1a3a4a 0%, #2c5f5f 100%)',
    }
  },
  {
    preset: 'spotlight',
    name: 'Spotlight',
    description: 'Vignette focus effect',
    mood: 'Focus',
    preview: {
      background: 'radial-gradient(ellipse at center, #FFF9F0 0%, #D4C4A8 70%, #B8A888 100%)',
    }
  },
];

// Particle style options
const PARTICLE_STYLES = [
  { style: 'sparkle', name: 'Sparkle', emoji: '✨' },
  { style: 'dots', name: 'Dots', emoji: '•' },
  { style: 'chalk', name: 'Chalk', emoji: '◦' },
  { style: 'snow', name: 'Snow', emoji: '❄' },
];

export const BackgroundPicker = ({ background, onChange }) => {
  const currentPreset = background?.preset || 'sunriseGradient';
  const currentOptions = background || {};

  const handlePresetChange = (preset) => {
    onChange({
      ...currentOptions,
      preset
    });
  };

  const handleOptionChange = (key, value) => {
    onChange({
      ...currentOptions,
      [key]: value
    });
  };

  const handleParticleChange = (key, value) => {
    onChange({
      ...currentOptions,
      particles: {
        ...currentOptions.particles,
        [key]: value
      }
    });
  };

  const handleSpotlightChange = (key, value) => {
    onChange({
      ...currentOptions,
      spotlight: {
        ...currentOptions.spotlight,
        [key]: value
      }
    });
  };

  const presetDef = BACKGROUND_PRESETS.find(p => p.preset === currentPreset);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Background</h3>
      
      {/* Preset Grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {BACKGROUND_PRESETS.map(bg => (
          <button
            key={bg.preset}
            onClick={() => handlePresetChange(bg.preset)}
            className={`p-3 rounded-xl transition-all text-left ${
              currentPreset === bg.preset
                ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-800'
                : 'hover:ring-1 hover:ring-gray-600'
            }`}
          >
            {/* Preview */}
            <div 
              className="w-full aspect-video rounded-lg mb-2 relative overflow-hidden"
              style={{ 
                ...bg.preview,
              }}
            >
              {bg.preview.pattern && (
                <div 
                  className="absolute inset-0" 
                  style={{ background: bg.preview.pattern }}
                />
              )}
              {bg.preset === 'spotlight' && (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 40% 40% at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)'
                  }}
                />
              )}
            </div>
            <div className="text-sm font-medium">{bg.name}</div>
            <div className="text-xs text-gray-500">{bg.description}</div>
            <div className="text-[10px] text-orange-400 mt-1">{bg.mood}</div>
          </button>
        ))}
      </div>

      {/* Background Options */}
      <div className="border-t border-gray-700 pt-6 space-y-6">
        <h4 className="text-sm font-medium text-gray-300">Background Options</h4>
        
        {/* Noise */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Film Grain (Noise)</div>
            <div className="text-xs text-gray-500">Adds subtle texture</div>
          </div>
          <button
            onClick={() => handleOptionChange('layerNoise', !currentOptions.layerNoise)}
            className={`w-12 h-6 rounded-full transition-colors ${
              currentOptions.layerNoise ? 'bg-orange-500' : 'bg-gray-600'
            }`}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                currentOptions.layerNoise ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Particles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium">Particles</div>
              <div className="text-xs text-gray-500">Floating animated elements</div>
            </div>
            <button
              onClick={() => handleParticleChange('enabled', !currentOptions.particles?.enabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                currentOptions.particles?.enabled ? 'bg-orange-500' : 'bg-gray-600'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  currentOptions.particles?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {currentOptions.particles?.enabled && (
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-4">
              {/* Particle Style */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Style</label>
                <div className="flex gap-2">
                  {PARTICLE_STYLES.map(p => (
                    <button
                      key={p.style}
                      onClick={() => handleParticleChange('style', p.style)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                        currentOptions.particles?.style === p.style
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <span className="mr-1">{p.emoji}</span> {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Count & Opacity */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Count</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={currentOptions.particles?.count || 15}
                    onChange={(e) => handleParticleChange('count', parseInt(e.target.value) || 15)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Opacity</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={currentOptions.particles?.opacity || 0.25}
                    onChange={(e) => handleParticleChange('opacity', parseFloat(e.target.value) || 0.25)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Speed</label>
                  <input
                    type="number"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={currentOptions.particles?.speed || 0.8}
                    onChange={(e) => handleParticleChange('speed', parseFloat(e.target.value) || 0.8)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Particle Color */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color (hex or theme key)</label>
                <input
                  type="text"
                  value={currentOptions.particles?.color || '#FBBF24'}
                  onChange={(e) => handleParticleChange('color', e.target.value)}
                  placeholder="#FBBF24 or 'primary'"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Spotlight Options (only for spotlight preset) */}
        {currentPreset === 'spotlight' && (
          <div>
            <div className="text-sm font-medium mb-3">Spotlight Position</div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">X Position (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentOptions.spotlight?.x || 50}
                    onChange={(e) => handleSpotlightChange('x', parseInt(e.target.value) || 50)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Y Position (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={currentOptions.spotlight?.y || 50}
                    onChange={(e) => handleSpotlightChange('y', parseInt(e.target.value) || 50)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Intensity</label>
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={currentOptions.spotlight?.intensity || 0.25}
                    onChange={(e) => handleSpotlightChange('intensity', parseFloat(e.target.value) || 0.25)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundPicker;
