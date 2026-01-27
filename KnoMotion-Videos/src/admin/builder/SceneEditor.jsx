/**
 * SceneEditor - Individual Scene Configuration
 * 
 * Handles editing of a single scene including:
 * - Scene metadata (id, duration, transition)
 * - Layout selection
 * - Background configuration
 * - Slot configuration with mid-scenes
 */
import React, { useState } from 'react';
import { LayoutPicker } from './LayoutPicker';
import { BackgroundPicker } from './BackgroundPicker';
import { TransitionPicker } from './TransitionPicker';
import { SlotConfigurator } from './SlotConfigurator';

// Get slot names for a layout type
const getLayoutSlots = (layoutType, options = {}) => {
  switch (layoutType) {
    case 'full':
      return ['header', 'full'];
    case 'rowStack': {
      const rows = options.rows || 2;
      return ['header', ...Array.from({ length: rows }, (_, i) => `row${i + 1}`)];
    }
    case 'columnSplit': {
      const cols = options.columns || 2;
      return ['header', ...Array.from({ length: cols }, (_, i) => `col${i + 1}`)];
    }
    case 'gridSlots': {
      const rows = options.rows || 2;
      const cols = options.columns || 2;
      const cells = rows * cols;
      if (cells <= 26) {
        return ['header', ...Array.from({ length: cells }, (_, i) => `cell${String.fromCharCode(65 + i)}`)];
      }
      const cellNames = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          cellNames.push(`r${r}c${c}`);
        }
      }
      return ['header', ...cellNames];
    }
    case 'headerRowColumns': {
      const cols = options.columns || 2;
      return ['header', 'row', ...Array.from({ length: cols }, (_, i) => `col${i + 1}`)];
    }
    default:
      return ['header', 'full'];
  }
};

export const SceneEditor = ({ scene, sceneIndex, format, onChange }) => {
  const [activeTab, setActiveTab] = useState('layout');

  const updateSceneField = (path, value) => {
    const newScene = JSON.parse(JSON.stringify(scene));
    const keys = path.split('.');
    let current = newScene;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onChange(newScene);
  };

  const handleLayoutChange = (layout) => {
    const newScene = JSON.parse(JSON.stringify(scene));
    const oldLayoutType = newScene.config.layout.type;
    const newLayoutType = layout.type;
    
    newScene.config.layout = layout;
    
    // Reset slots if layout type changed
    if (oldLayoutType !== newLayoutType) {
      const newSlots = getLayoutSlots(newLayoutType, layout.options);
      const defaultSlotConfig = {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [{ text: 'Enter text', emphasis: 'normal', beats: { start: 0.5, exit: 4.0 } }],
          revealType: 'fade'
        }
      };
      
      newScene.config.slots = {};
      newSlots.forEach(slotName => {
        if (slotName !== 'header') {
          newScene.config.slots[slotName] = { ...defaultSlotConfig };
        }
      });
    }
    
    onChange(newScene);
  };

  const handleSlotsChange = (slots) => {
    updateSceneField('config.slots', slots);
  };

  const availableSlots = getLayoutSlots(
    scene.config.layout.type, 
    scene.config.layout.options
  ).filter(s => s !== 'header'); // Header is optional

  const tabs = [
    { id: 'layout', label: 'Layout', icon: '⊞' },
    { id: 'background', label: 'Background', icon: '🎨' },
    { id: 'slots', label: 'Slots', icon: '📦' },
    { id: 'transition', label: 'Transition', icon: '↔️' },
  ];

  return (
    <div className="p-6">
      {/* Scene Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Scene ID</label>
            <input
              type="text"
              value={scene.id}
              onChange={(e) => updateSceneField('id', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="scene-id"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs text-gray-500 mb-1">Duration (sec)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={Math.round(scene.durationInFrames / 30)}
              onChange={(e) => updateSceneField('durationInFrames', Math.max(1, parseInt(e.target.value) || 1) * 30)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-800 rounded-xl p-6">
        {activeTab === 'layout' && (
          <LayoutPicker
            layout={scene.config.layout}
            format={format}
            onChange={handleLayoutChange}
          />
        )}

        {activeTab === 'background' && (
          <BackgroundPicker
            background={scene.config.background}
            onChange={(bg) => updateSceneField('config.background', bg)}
          />
        )}

        {activeTab === 'slots' && (
          <SlotConfigurator
            slots={scene.config.slots}
            availableSlots={availableSlots}
            layoutType={scene.config.layout.type}
            format={format}
            onChange={handleSlotsChange}
          />
        )}

        {activeTab === 'transition' && (
          <TransitionPicker
            transition={scene.transition}
            onChange={(t) => updateSceneField('transition', t)}
          />
        )}
      </div>
    </div>
  );
};

export default SceneEditor;
