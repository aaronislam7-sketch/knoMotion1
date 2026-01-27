/**
 * StylePresetPicker - Style Preset Selection
 * 
 * Displays visual previews of available style presets
 * showing typography, colors, and decorations.
 * 
 * IMPORTANT: Uses the existing STYLE_PRESETS from the SDK.
 */
import React from 'react';
import { STYLE_PRESETS } from '../../sdk/theme/stylePresets';
import { KNODE_THEME } from '../../sdk/theme/knodeTheme';

// Style preset visual representations
const STYLE_PRESET_VISUALS = {
  educational: {
    name: 'Educational',
    description: 'Structured, clear - notebook feel',
    textSample: 'Learn Something',
    background: '#FFF9F0',
    textColor: KNODE_THEME.colors.textMain,
    decoration: 'underline',
    decorationColor: KNODE_THEME.colors.doodle,
    animationStyle: 'educational',
  },
  playful: {
    name: 'Playful',
    description: 'Energetic, fun - warm colors',
    textSample: 'Have Fun!',
    background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE4B5 100%)',
    textColor: KNODE_THEME.colors.primary,
    decoration: 'highlight',
    decorationColor: KNODE_THEME.colors.accentBlue,
    animationStyle: 'bouncy',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean, simple - no decoration',
    textSample: 'Keep it Simple',
    background: '#FFFFFF',
    textColor: KNODE_THEME.colors.textMain,
    decoration: 'none',
    decorationColor: null,
    animationStyle: 'minimal',
  },
  mentor: {
    name: 'Mentor',
    description: 'Wise, dramatic - dark backdrop',
    textSample: 'Trust the Process',
    background: 'linear-gradient(135deg, #1a3a4a 0%, #2c5f5f 100%)',
    textColor: '#F5F5F5',
    decoration: 'circle',
    decorationColor: KNODE_THEME.colors.accentGreen,
    animationStyle: 'dramatic',
  },
  focus: {
    name: 'Focus',
    description: 'Spotlight attention - emphasis',
    textSample: 'Pay Attention',
    background: 'radial-gradient(ellipse at center, #FFF9F0 0%, #D4C4A8 100%)',
    textColor: KNODE_THEME.colors.textSoft,
    decoration: 'underline',
    decorationColor: KNODE_THEME.colors.secondary,
    animationStyle: 'subtle',
  },
};

// Animation style indicators
const ANIMATION_STYLES = {
  subtle: { label: 'Subtle', speed: 'Slow', icon: '🌊' },
  bouncy: { label: 'Bouncy', speed: 'Playful', icon: '🎾' },
  dramatic: { label: 'Dramatic', speed: 'Impactful', icon: '💫' },
  minimal: { label: 'Minimal', speed: 'Quick', icon: '⚡' },
  educational: { label: 'Educational', speed: 'Paced', icon: '📚' },
};

const StylePresetCard = ({ presetKey, visual, isSelected, onClick }) => {
  const animStyle = ANIMATION_STYLES[visual.animationStyle];
  
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all text-left w-full ${
        isSelected
          ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-800'
          : 'hover:ring-1 hover:ring-gray-600'
      }`}
    >
      {/* Preview Card */}
      <div 
        className="w-full aspect-video rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
        style={{ background: visual.background }}
      >
        {/* Text Sample with Decoration */}
        <div className="relative px-4">
          <span 
            className="text-lg font-bold relative z-10"
            style={{ color: visual.textColor }}
          >
            {visual.textSample}
          </span>
          
          {/* Decorations */}
          {visual.decoration === 'underline' && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
              style={{ 
                backgroundColor: visual.decorationColor,
                transform: 'translateY(4px)',
              }}
            />
          )}
          
          {visual.decoration === 'highlight' && (
            <div 
              className="absolute inset-0 rounded-md -z-0"
              style={{ 
                backgroundColor: visual.decorationColor,
                opacity: 0.2,
                transform: 'scale(1.1)',
              }}
            />
          )}
          
          {visual.decoration === 'circle' && (
            <div 
              className="absolute inset-0 border-2 rounded-full -z-0"
              style={{ 
                borderColor: visual.decorationColor,
                transform: 'scale(1.3)',
              }}
            />
          )}
        </div>
      </div>
      
      {/* Info */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{visual.name}</span>
        <span className="text-lg">{animStyle.icon}</span>
      </div>
      <div className="text-xs text-gray-500 mb-2">{visual.description}</div>
      
      {/* Animation indicator */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-0.5 bg-gray-700 rounded text-gray-400">
          {animStyle.label}
        </span>
        <span className="text-gray-600">•</span>
        <span className="text-gray-500">{animStyle.speed}</span>
      </div>
    </button>
  );
};

export const StylePresetPicker = ({ value, onChange }) => {
  const currentPreset = value || 'playful';

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-300 mb-3">Style Preset</h4>
      <p className="text-xs text-gray-500 mb-4">
        Style presets control typography, colors, decorations, and animation feel.
      </p>
      
      {/* Preset Grid */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(STYLE_PRESET_VISUALS).map(([key, visual]) => (
          <StylePresetCard
            key={key}
            presetKey={key}
            visual={visual}
            isSelected={currentPreset === key}
            onClick={() => onChange(key)}
          />
        ))}
      </div>
      
      {/* Selected Preset Details */}
      {currentPreset && STYLE_PRESETS[currentPreset] && (
        <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-300 mb-2">
            Preset Details: {STYLE_PRESET_VISUALS[currentPreset].name}
          </h5>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Text Style</span>
              <div className="mt-1 font-mono text-gray-300">
                {STYLE_PRESETS[currentPreset].textVariant}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Decoration</span>
              <div className="mt-1 font-mono text-gray-300">
                {STYLE_PRESETS[currentPreset].decoration || 'none'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Animation</span>
              <div className="mt-1 font-mono text-gray-300">
                {STYLE_PRESETS[currentPreset].animationPreset}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Default BG</span>
              <div className="mt-1 font-mono text-gray-300">
                {STYLE_PRESETS[currentPreset].background?.preset}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Compact dropdown version
export const StylePresetDropdown = ({ value, onChange }) => {
  const currentPreset = value || 'playful';
  const visual = STYLE_PRESET_VISUALS[currentPreset];

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Style Preset</label>
      <select
        value={currentPreset}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
      >
        {Object.entries(STYLE_PRESET_VISUALS).map(([key, v]) => (
          <option key={key} value={key}>
            {v.name} - {v.description}
          </option>
        ))}
      </select>
      
      {visual && (
        <div 
          className="mt-2 h-8 rounded flex items-center justify-center text-xs font-medium"
          style={{ 
            background: visual.background, 
            color: visual.textColor 
          }}
        >
          {visual.textSample}
        </div>
      )}
    </div>
  );
};

export default StylePresetPicker;
