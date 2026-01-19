/**
 * SlotConfigurator - Slot Assignment and Mid-Scene Configuration
 * 
 * Allows users to configure which mid-scenes appear in each slot,
 * supporting both single and multiple mid-scenes per slot.
 */
import React, { useState } from 'react';
import { MidSceneEditor } from './MidSceneEditor';
import { StylePresetDropdown } from './StylePresetPicker';

// Available mid-scene types with descriptions
const MID_SCENE_TYPES = [
  { type: 'textReveal', name: 'Text Reveal', description: 'Animated text lines', icon: '📝' },
  { type: 'heroText', name: 'Hero Text', description: 'Hero visual + text', icon: '🦸' },
  { type: 'gridCards', name: 'Grid Cards', description: 'Icon/image card grid', icon: '🎴' },
  { type: 'checklist', name: 'Checklist', description: 'Bullet point list', icon: '✓' },
  { type: 'bubbleCallout', name: 'Bubble Callout', description: 'Floating callouts', icon: '💬' },
  { type: 'sideBySide', name: 'Side by Side', description: 'Left vs right compare', icon: '⚖️' },
  { type: 'iconGrid', name: 'Icon Grid', description: 'Icon-only grid', icon: '⬡' },
  { type: 'cardSequence', name: 'Card Sequence', description: 'Card stack/grid', icon: '🃏' },
  { type: 'bigNumber', name: 'Big Number', description: 'Large stat display', icon: '🔢' },
  { type: 'animatedCounter', name: 'Counter', description: 'Counting animation', icon: '⏱️' },
];

// Get default config for a mid-scene type
const getDefaultMidSceneConfig = (type) => {
  const defaults = {
    textReveal: {
      lines: [{ text: 'Enter text', emphasis: 'normal', beats: { start: 0.5, exit: 4.0 } }],
      revealType: 'fade',
    },
    heroText: {
      text: 'Description text',
      heroType: 'lottie',
      heroRef: 'lightbulb',
      beats: { entrance: 0.5, exit: 5.0 },
    },
    gridCards: {
      cards: [
        { icon: '💡', label: 'Idea' },
        { icon: '🚀', label: 'Launch' },
      ],
      columns: 2,
      animation: 'cascade',
      beats: { start: 0.5 },
    },
    checklist: {
      items: [
        { text: 'First item', checked: true, beats: { start: 0.5 } },
        { text: 'Second item', checked: false, beats: { start: 1.0 } },
      ],
      icon: 'check',
      revealType: 'pop',
      beats: { start: 0.3, exit: 6.0 },
    },
    bubbleCallout: {
      callouts: [
        { text: 'Tip 1', icon: '💡' },
        { text: 'Tip 2', icon: '✨' },
      ],
      shape: 'speech',
      pattern: 'diagonal',
      beats: { start: 0.5 },
    },
    sideBySide: {
      left: {
        title: 'Before',
        icon: '😕',
        items: ['Problem 1', 'Problem 2'],
      },
      right: {
        title: 'After',
        icon: '🎉',
        items: ['Solution 1', 'Solution 2'],
      },
      dividerType: 'vs',
      beats: { start: 0.5 },
    },
    iconGrid: {
      icons: [
        { iconRef: '🎯', label: 'Focus' },
        { iconRef: '🚀', label: 'Launch' },
      ],
      columns: 2,
      animation: 'cascade',
      beats: { start: 0.5 },
    },
    cardSequence: {
      cards: [
        { title: 'Step 1', content: 'Description' },
        { title: 'Step 2', content: 'Description' },
      ],
      layout: 'stacked',
      animation: 'fadeSlide',
      beats: { start: 0.5 },
    },
    bigNumber: {
      number: '100',
      label: 'percent',
      emphasis: 'high',
      animation: 'countUp',
      beats: { start: 0.5, exit: 5.0 },
    },
    animatedCounter: {
      startValue: 0,
      endValue: 100,
      duration: 2,
      label: 'items',
      beats: { start: 0.5 },
    },
  };
  
  return defaults[type] || {};
};

// Single slot editor component
const SlotEditor = ({ slotName, slotConfig, onChange, format }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Support both single and array configs
  const configs = Array.isArray(slotConfig) ? slotConfig : [slotConfig];
  
  const handleAddMidScene = () => {
    const newConfig = {
      midScene: 'textReveal',
      stylePreset: 'playful',
      config: getDefaultMidSceneConfig('textReveal'),
    };
    
    if (Array.isArray(slotConfig)) {
      onChange([...slotConfig, newConfig]);
    } else {
      onChange([slotConfig, newConfig]);
    }
  };
  
  const handleRemoveMidScene = (index) => {
    if (Array.isArray(slotConfig) && slotConfig.length > 1) {
      onChange(slotConfig.filter((_, i) => i !== index));
    }
  };
  
  const handleUpdateMidScene = (index, updated) => {
    if (Array.isArray(slotConfig)) {
      const newConfigs = [...slotConfig];
      newConfigs[index] = updated;
      onChange(newConfigs);
    } else {
      onChange(updated);
    }
  };
  
  const handleMidSceneTypeChange = (index, newType) => {
    const config = configs[index];
    const updated = {
      ...config,
      midScene: newType,
      config: getDefaultMidSceneConfig(newType),
    };
    handleUpdateMidScene(index, updated);
  };

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      {/* Slot Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-700/50 cursor-pointer hover:bg-gray-700/70"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-mono text-sm">{slotName}</span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-400">
            {configs.length} mid-scene{configs.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleAddMidScene(); }}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
            title="Add another mid-scene to this slot"
          >
            + Add
          </button>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      
      {/* Slot Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {configs.map((config, index) => (
            <div 
              key={index} 
              className={`${configs.length > 1 ? 'p-4 bg-gray-700/30 rounded-lg' : ''}`}
            >
              {configs.length > 1 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">
                    Mid-scene {index + 1} of {configs.length}
                  </span>
                  <button
                    onClick={() => handleRemoveMidScene(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {/* Mid-scene Type Selector */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mid-scene Type</label>
                  <select
                    value={config.midScene}
                    onChange={(e) => handleMidSceneTypeChange(index, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    {MID_SCENE_TYPES.map(ms => (
                      <option key={ms.type} value={ms.type}>
                        {ms.icon} {ms.name} - {ms.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <StylePresetDropdown
                  value={config.stylePreset}
                  onChange={(preset) => handleUpdateMidScene(index, { ...config, stylePreset: preset })}
                />
              </div>
              
              {/* Mid-scene Config Editor */}
              <MidSceneEditor
                midSceneType={config.midScene}
                config={config.config}
                onChange={(newConfig) => handleUpdateMidScene(index, { ...config, config: newConfig })}
                format={format}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SlotConfigurator = ({ slots, availableSlots, layoutType, format, onChange }) => {
  const handleSlotChange = (slotName, config) => {
    onChange({
      ...slots,
      [slotName]: config
    });
  };
  
  const handleEnableSlot = (slotName) => {
    onChange({
      ...slots,
      [slotName]: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: getDefaultMidSceneConfig('textReveal'),
      }
    });
  };
  
  const handleDisableSlot = (slotName) => {
    const newSlots = { ...slots };
    delete newSlots[slotName];
    onChange(newSlots);
  };

  const enabledSlots = Object.keys(slots);
  const disabledSlots = availableSlots.filter(s => !enabledSlots.includes(s));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Configure Slots</h3>
          <p className="text-sm text-gray-500 mt-1">
            Assign mid-scenes to layout slots. Each slot can have multiple mid-scenes (use beats for timing).
          </p>
        </div>
      </div>
      
      {/* Warning for sideBySide */}
      {layoutType === 'columnSplit' && Object.values(slots).some(s => 
        (Array.isArray(s) ? s : [s]).some(c => c.midScene === 'sideBySide')
      ) && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
          ⚠️ <strong>Warning:</strong> sideBySide mid-scene should use <code className="bg-gray-800 px-1 rounded">layout: full</code>, not columnSplit. 
          It creates its own internal columns.
        </div>
      )}
      
      {/* Enabled Slots */}
      <div className="space-y-4 mb-6">
        {enabledSlots.map(slotName => (
          <SlotEditor
            key={slotName}
            slotName={slotName}
            slotConfig={slots[slotName]}
            onChange={(config) => handleSlotChange(slotName, config)}
            format={format}
          />
        ))}
      </div>
      
      {/* Disabled Slots */}
      {disabledSlots.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Available Slots (not configured)</h4>
          <div className="flex flex-wrap gap-2">
            {disabledSlots.map(slotName => (
              <button
                key={slotName}
                onClick={() => handleEnableSlot(slotName)}
                className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
              >
                + {slotName}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Slot help */}
      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Slot Array (Multi Mid-Scene) Tips</h4>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Multiple mid-scenes in one slot render in the same space</li>
          <li>• Use <code className="bg-gray-800 px-1 rounded">beats.start</code> and <code className="bg-gray-800 px-1 rounded">beats.exit</code> to control when each appears</li>
          <li>• Great for revealing content in sequence without separate scenes</li>
        </ul>
      </div>
    </div>
  );
};

export default SlotConfigurator;
