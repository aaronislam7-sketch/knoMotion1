/**
 * MidSceneEditor - Per Mid-Scene Type Configuration
 * 
 * Provides type-specific editors for all 10 mid-scene types,
 * with appropriate field inputs and previews.
 */
import React, { useState } from 'react';
import { LottiePickerInline } from './LottiePicker';

// Beats editor component
const BeatsEditor = ({ beats = {}, onChange, showExit = true, showEmphasis = false, showEntrance = false }) => {
  const update = (key, value) => {
    onChange({ ...beats, [key]: parseFloat(value) || 0 });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {showEntrance ? (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Entrance (s)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={beats.entrance || 0}
            onChange={(e) => update('entrance', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      ) : (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Start (s)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={beats.start || 0}
            onChange={(e) => update('start', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      )}
      {showExit && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Exit (s)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={beats.exit || 0}
            onChange={(e) => update('exit', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      )}
      {showEmphasis && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Emphasis (s)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={beats.emphasis || ''}
            onChange={(e) => update('emphasis', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="optional"
          />
        </div>
      )}
    </div>
  );
};

// Text Reveal Editor
const TextRevealEditor = ({ config, onChange }) => {
  const lines = config.lines || [];
  
  const updateLine = (index, field, value) => {
    const newLines = [...lines];
    if (field === 'beats') {
      newLines[index] = { ...newLines[index], beats: value };
    } else {
      newLines[index] = { ...newLines[index], [field]: value };
    }
    onChange({ ...config, lines: newLines });
  };
  
  const addLine = () => {
    onChange({
      ...config,
      lines: [...lines, { text: 'New line', emphasis: 'normal', beats: { start: lines.length * 0.5, exit: 5.0 } }]
    });
  };
  
  const removeLine = (index) => {
    onChange({
      ...config,
      lines: lines.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      {/* Lines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Lines</label>
          <button
            onClick={addLine}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
          >
            + Add Line
          </button>
        </div>
        
        {lines.map((line, i) => (
          <div key={i} className="p-3 bg-gray-700/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={line.text}
                onChange={(e) => updateLine(i, 'text', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                placeholder="Line text"
              />
              <select
                value={line.emphasis || 'normal'}
                onChange={(e) => updateLine(i, 'emphasis', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={() => removeLine(i)}
                className="p-1.5 text-red-400 hover:text-red-300"
                disabled={lines.length <= 1}
              >
                ×
              </button>
            </div>
            <BeatsEditor
              beats={line.beats}
              onChange={(beats) => updateLine(i, 'beats', beats)}
              showEmphasis
            />
          </div>
        ))}
      </div>
      
      {/* Reveal Options */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Reveal Type</label>
          <select
            value={config.revealType || 'fade'}
            onChange={(e) => onChange({ ...config, revealType: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="typewriter">Typewriter</option>
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="mask">Mask</option>
          </select>
        </div>
        
        {(config.revealType === 'slide' || config.revealType === 'mask') && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Direction</label>
            <select
              value={config.direction || 'up'}
              onChange={(e) => onChange({ ...config, direction: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value="up">Up</option>
              <option value="down">Down</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stagger (s)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={config.staggerDelay || 0.2}
            onChange={(e) => onChange({ ...config, staggerDelay: parseFloat(e.target.value) || 0.2 })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Line Spacing</label>
          <select
            value={config.lineSpacing || 'normal'}
            onChange={(e) => onChange({ ...config, lineSpacing: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="tight">Tight</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
            <option value="loose">Loose</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Hero Text Editor
const HeroTextEditor = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Description Text</label>
        <input
          type="text"
          value={config.text || ''}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          placeholder="Description below hero"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hero Type</label>
          <select
            value={config.heroType || 'lottie'}
            onChange={(e) => onChange({ ...config, heroType: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="lottie">Lottie Animation</option>
            <option value="image">Image</option>
            <option value="svg">SVG</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Animation Entrance</label>
          <select
            value={config.animationEntrance || 'fadeSlide'}
            onChange={(e) => onChange({ ...config, animationEntrance: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="fadeIn">Fade In</option>
            <option value="slideIn">Slide In</option>
            <option value="scaleIn">Scale In</option>
            <option value="fadeSlide">Fade Slide</option>
          </select>
        </div>
      </div>
      
      {config.heroType === 'lottie' && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Lottie Animation</label>
          <LottiePickerInline
            value={config.heroRef}
            onChange={(ref) => onChange({ ...config, heroRef: ref })}
          />
        </div>
      )}
      
      {config.heroType === 'image' && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">Image URL</label>
          <input
            type="text"
            value={config.heroRef || ''}
            onChange={(e) => onChange({ ...config, heroRef: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="https://..."
          />
        </div>
      )}
      
      <div>
        <label className="block text-xs text-gray-500 mb-2">Beats</label>
        <BeatsEditor
          beats={config.beats}
          onChange={(beats) => onChange({ ...config, beats })}
          showEntrance
        />
      </div>
    </div>
  );
};

// Grid Cards Editor
const GridCardsEditor = ({ config, onChange }) => {
  const cards = config.cards || [];
  
  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange({ ...config, cards: newCards });
  };
  
  const addCard = () => {
    onChange({
      ...config,
      cards: [...cards, { icon: '✨', label: 'New card' }]
    });
  };
  
  const removeCard = (index) => {
    onChange({
      ...config,
      cards: cards.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Cards</label>
          <button onClick={addCard} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            + Add Card
          </button>
        </div>
        
        {cards.map((card, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded">
            <input
              type="text"
              value={card.icon || ''}
              onChange={(e) => updateCard(i, 'icon', e.target.value)}
              className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-lg focus:border-orange-500 focus:outline-none"
              placeholder="🎯"
            />
            <input
              type="text"
              value={card.label || ''}
              onChange={(e) => updateCard(i, 'label', e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Label"
            />
            <button onClick={() => removeCard(i)} className="text-red-400 hover:text-red-300">×</button>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Columns</label>
          <input
            type="number"
            min="1"
            max="8"
            value={config.columns || 2}
            onChange={(e) => onChange({ ...config, columns: parseInt(e.target.value) || 2 })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Animation</label>
          <select
            value={config.animation || 'cascade'}
            onChange={(e) => onChange({ ...config, animation: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="bounce">Bounce</option>
            <option value="cascade">Cascade</option>
            <option value="mask">Mask</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Card Style</label>
          <select
            value={config.cardVariant || 'default'}
            onChange={(e) => onChange({ ...config, cardVariant: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="bordered">Bordered</option>
            <option value="glass">Glass</option>
            <option value="flat">Flat</option>
            <option value="elevated">Elevated</option>
          </select>
        </div>
      </div>
      
      <BeatsEditor
        beats={config.beats}
        onChange={(beats) => onChange({ ...config, beats })}
        showExit={false}
      />
    </div>
  );
};

// Checklist Editor
const ChecklistEditor = ({ config, onChange }) => {
  const items = config.items || [];
  
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (typeof newItems[index] === 'string') {
      newItems[index] = { text: newItems[index], [field]: value };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    onChange({ ...config, items: newItems });
  };
  
  const addItem = () => {
    onChange({
      ...config,
      items: [...items, { text: 'New item', checked: false, beats: { start: items.length * 0.5 } }]
    });
  };
  
  const removeItem = (index) => {
    onChange({ ...config, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Items</label>
          <button onClick={addItem} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            + Add Item
          </button>
        </div>
        
        {items.map((item, i) => {
          const itemObj = typeof item === 'string' ? { text: item } : item;
          return (
            <div key={i} className="p-2 bg-gray-700/50 rounded space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={itemObj.checked || false}
                  onChange={(e) => updateItem(i, 'checked', e.target.checked)}
                  className="rounded"
                />
                <input
                  type="text"
                  value={itemObj.text || ''}
                  onChange={(e) => updateItem(i, 'text', e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                />
                <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300">×</button>
              </div>
              <BeatsEditor
                beats={itemObj.beats}
                onChange={(beats) => updateItem(i, 'beats', beats)}
                showExit={false}
              />
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Icon</label>
          <select
            value={config.icon || 'check'}
            onChange={(e) => onChange({ ...config, icon: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="check">Check ✓</option>
            <option value="bullet">Bullet •</option>
            <option value="dot">Dot ○</option>
            <option value="arrow">Arrow →</option>
            <option value="star">Star ★</option>
            <option value="lottieCheck">Lottie Check</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Reveal Type</label>
          <select
            value={config.revealType || 'pop'}
            onChange={(e) => onChange({ ...config, revealType: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="pop">Pop</option>
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
            <option value="scale">Scale</option>
            <option value="spring">Spring</option>
            <option value="bounceIn">Bounce In</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stagger (s)</label>
          <input
            type="number"
            step="0.1"
            value={config.staggerDelay || 0.25}
            onChange={(e) => onChange({ ...config, staggerDelay: parseFloat(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>
      
      <BeatsEditor
        beats={config.beats}
        onChange={(beats) => onChange({ ...config, beats })}
      />
    </div>
  );
};

// Side by Side Editor
const SideBySideEditor = ({ config, onChange }) => {
  const updateSide = (side, field, value) => {
    onChange({
      ...config,
      [side]: { ...config[side], [field]: value }
    });
  };
  
  const updateSideItems = (side, items) => {
    onChange({
      ...config,
      [side]: { ...config[side], items }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Side */}
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Left Side</h5>
          <div className="space-y-2">
            <input
              type="text"
              value={config.left?.title || ''}
              onChange={(e) => updateSide('left', 'title', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Title"
            />
            <input
              type="text"
              value={config.left?.icon || ''}
              onChange={(e) => updateSide('left', 'icon', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Icon (emoji)"
            />
            <textarea
              value={(config.left?.items || []).join('\n')}
              onChange={(e) => updateSideItems('left', e.target.value.split('\n').filter(Boolean))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Items (one per line)"
              rows={3}
            />
          </div>
        </div>
        
        {/* Right Side */}
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <h5 className="text-sm font-medium text-gray-300 mb-2">Right Side</h5>
          <div className="space-y-2">
            <input
              type="text"
              value={config.right?.title || ''}
              onChange={(e) => updateSide('right', 'title', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Title"
            />
            <input
              type="text"
              value={config.right?.icon || ''}
              onChange={(e) => updateSide('right', 'icon', e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Icon (emoji)"
            />
            <textarea
              value={(config.right?.items || []).join('\n')}
              onChange={(e) => updateSideItems('right', e.target.value.split('\n').filter(Boolean))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
              placeholder="Items (one per line)"
              rows={3}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Divider</label>
          <select
            value={config.dividerType || 'vs'}
            onChange={(e) => onChange({ ...config, dividerType: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="none">None</option>
            <option value="line">Line</option>
            <option value="dashed">Dashed</option>
            <option value="vs">VS</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Animation</label>
          <select
            value={config.animation || 'slide'}
            onChange={(e) => onChange({ ...config, animation: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
            <option value="scale">Scale</option>
            <option value="bounce">Bounce</option>
            <option value="reveal">Reveal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stagger (s)</label>
          <input
            type="number"
            step="0.1"
            value={config.staggerDelay || 0.3}
            onChange={(e) => onChange({ ...config, staggerDelay: parseFloat(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>
      
      <BeatsEditor
        beats={config.beats}
        onChange={(beats) => onChange({ ...config, beats })}
        showExit={false}
      />
    </div>
  );
};

// Big Number Editor
const BigNumberEditor = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Number</label>
          <input
            type="text"
            value={config.number || ''}
            onChange={(e) => onChange({ ...config, number: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="100 or 11,000,000"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label</label>
          <input
            type="text"
            value={config.label || ''}
            onChange={(e) => onChange({ ...config, label: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="percent or items"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Animation</label>
          <select
            value={config.animation || 'countUp'}
            onChange={(e) => onChange({ ...config, animation: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="pop">Pop</option>
            <option value="countUp">Count Up</option>
            <option value="typewriter">Typewriter</option>
            <option value="fade">Fade</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Emphasis</label>
          <select
            value={config.emphasis || 'high'}
            onChange={(e) => onChange({ ...config, emphasis: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
        {config.animation === 'countUp' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Count From</label>
            <input
              type="number"
              value={config.countFrom || 0}
              onChange={(e) => onChange({ ...config, countFrom: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
        )}
      </div>
      
      <BeatsEditor
        beats={config.beats}
        onChange={(beats) => onChange({ ...config, beats })}
      />
    </div>
  );
};

// Animated Counter Editor
const AnimatedCounterEditor = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Start Value</label>
          <input
            type="number"
            value={config.startValue || 0}
            onChange={(e) => onChange({ ...config, startValue: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">End Value</label>
          <input
            type="number"
            value={config.endValue || 100}
            onChange={(e) => onChange({ ...config, endValue: parseInt(e.target.value) || 100 })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Duration (s)</label>
          <input
            type="number"
            step="0.5"
            value={config.duration || 2}
            onChange={(e) => onChange({ ...config, duration: parseFloat(e.target.value) || 2 })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Prefix</label>
          <input
            type="text"
            value={config.prefix || ''}
            onChange={(e) => onChange({ ...config, prefix: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="$ or €"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Suffix</label>
          <input
            type="text"
            value={config.suffix || ''}
            onChange={(e) => onChange({ ...config, suffix: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="% or k"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Label</label>
          <input
            type="text"
            value={config.label || ''}
            onChange={(e) => onChange({ ...config, label: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="items processed"
          />
        </div>
      </div>
      
      <BeatsEditor
        beats={config.beats}
        onChange={(beats) => onChange({ ...config, beats })}
        showExit={false}
      />
    </div>
  );
};

// Generic fallback editor for other types
const GenericEditor = ({ config, onChange, midSceneType }) => {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg">
      <p className="text-sm text-gray-400 mb-3">
        Configure {midSceneType} mid-scene. Edit JSON directly:
      </p>
      <textarea
        value={JSON.stringify(config, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {}
        }}
        className="w-full h-48 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm font-mono focus:border-orange-500 focus:outline-none"
      />
    </div>
  );
};

// Main MidSceneEditor component
export const MidSceneEditor = ({ midSceneType, config, onChange }) => {
  const editors = {
    textReveal: TextRevealEditor,
    heroText: HeroTextEditor,
    gridCards: GridCardsEditor,
    checklist: ChecklistEditor,
    sideBySide: SideBySideEditor,
    bigNumber: BigNumberEditor,
    animatedCounter: AnimatedCounterEditor,
  };

  const Editor = editors[midSceneType] || GenericEditor;

  return (
    <div className="border-t border-gray-600 pt-4 mt-4">
      <h4 className="text-sm font-medium text-gray-400 mb-3">
        {midSceneType} Configuration
      </h4>
      <Editor config={config} onChange={onChange} midSceneType={midSceneType} />
    </div>
  );
};

export default MidSceneEditor;
