/**
 * MidSceneEditor - Per Mid-Scene Type Configuration
 * 
 * Provides type-specific editors for all 10 mid-scene types,
 * with appropriate field inputs and previews.
 */
import React, { useState, useMemo } from 'react';
import { LottiePickerInline } from './LottiePicker';
import { MidScenePreview } from './MidScenePreview';

// Utility: Check if beats are in sequence and return warnings
const checkBeatsSequence = (items, getBeatsStart) => {
  const warnings = [];
  let prevStart = -1;
  
  items.forEach((item, index) => {
    const start = getBeatsStart(item);
    if (start !== undefined && start !== null) {
      if (start <= prevStart) {
        warnings.push({
          index,
          message: `Item ${index + 1} beats.start (${start}s) should be after item ${index} (${prevStart}s)`
        });
      }
      prevStart = start;
    }
  });
  
  return warnings;
};

// Warning display component
const SequenceWarnings = ({ warnings }) => {
  if (!warnings || warnings.length === 0) return null;
  
  return (
    <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <div className="text-xs text-yellow-400 font-medium mb-1">⚠️ Sequence Warning</div>
      {warnings.map((w, i) => (
        <div key={i} className="text-xs text-yellow-300">{w.message}</div>
      ))}
    </div>
  );
};

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
  
  // Check beats sequence
  const sequenceWarnings = useMemo(() => 
    checkBeatsSequence(lines, line => line.beats?.start),
    [lines]
  );
  
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
    // Auto-increment beats.start based on last line
    const lastLine = lines[lines.length - 1];
    const newStart = lastLine?.beats?.start ? lastLine.beats.start + 1.0 : lines.length * 0.5;
    const newExit = newStart + 3.5;
    
    onChange({
      ...config,
      lines: [...lines, { text: 'New line', emphasis: 'normal', beats: { start: newStart, exit: newExit } }]
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
          <label className="text-sm font-medium text-gray-300">Lines ({lines.length})</label>
          <button
            onClick={addLine}
            className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
          >
            + Add Line
          </button>
        </div>
        
        {lines.map((line, i) => {
          const hasWarning = sequenceWarnings.some(w => w.index === i);
          return (
            <div key={i} className={`p-3 rounded-lg space-y-2 ${hasWarning ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-700/50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
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
          );
        })}
        
        <SequenceWarnings warnings={sequenceWarnings} />
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
  
  // Check beats sequence
  const sequenceWarnings = useMemo(() => 
    checkBeatsSequence(items.map(item => typeof item === 'string' ? { text: item } : item), 
      item => item.beats?.start),
    [items]
  );
  
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
    // Auto-increment beats.start based on last item
    const lastItem = items[items.length - 1];
    const lastItemObj = typeof lastItem === 'string' ? {} : lastItem;
    const newStart = lastItemObj?.beats?.start ? lastItemObj.beats.start + 0.5 : items.length * 0.5;
    
    onChange({
      ...config,
      items: [...items, { text: 'New item', checked: false, beats: { start: newStart } }]
    });
  };
  
  const removeItem = (index) => {
    onChange({ ...config, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Items ({items.length})</label>
          <button onClick={addItem} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            + Add Item
          </button>
        </div>
        
        {items.map((item, i) => {
          const itemObj = typeof item === 'string' ? { text: item } : item;
          const hasWarning = sequenceWarnings.some(w => w.index === i);
          return (
            <div key={i} className={`p-2 rounded space-y-2 ${hasWarning ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-700/50'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
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
        
        <SequenceWarnings warnings={sequenceWarnings} />
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

// Side by Side Editor (supports both standard and beforeAfter modes)
const SideBySideEditor = ({ config, onChange }) => {
  const mode = config.mode || 'standard';
  
  const setMode = (newMode) => {
    if (newMode === 'beforeAfter') {
      onChange({
        mode: 'beforeAfter',
        before: {
          title: 'Before',
          media: { image: { src: '', fit: 'cover', borderRadius: 28 } }
        },
        after: {
          title: 'After', 
          media: { image: { src: '', fit: 'cover', borderRadius: 28 } }
        },
        slider: {
          autoAnimate: true,
          from: 0.05,
          to: 1.0,
          beats: { start: 1.5, exit: 7.0 }
        },
        beats: { start: 0.5, exit: 10.0 }
      });
    } else {
      onChange({
        left: { title: 'Before', icon: '😕', items: ['Item 1'] },
        right: { title: 'After', icon: '🎉', items: ['Item 1'] },
        dividerType: 'vs',
        beats: { start: 0.5 }
      });
    }
  };
  
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
  
  const updateBeforeAfterSide = (side, field, value) => {
    onChange({
      ...config,
      [side]: { ...config[side], [field]: value }
    });
  };
  
  const updateBeforeAfterMedia = (side, field, value) => {
    onChange({
      ...config,
      [side]: { 
        ...config[side], 
        media: { 
          ...config[side]?.media,
          image: { ...config[side]?.media?.image, [field]: value }
        }
      }
    });
  };
  
  const updateSlider = (field, value) => {
    onChange({
      ...config,
      slider: { ...config.slider, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('standard')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode !== 'beforeAfter' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            ⚖️ Standard (Left vs Right)
          </button>
          <button
            onClick={() => setMode('beforeAfter')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'beforeAfter' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            ↔️ Before/After (Image Slider)
          </button>
        </div>
      </div>
      
      {mode === 'beforeAfter' ? (
        <>
          {/* Before/After Mode */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div className="p-3 bg-gray-700/50 rounded-lg border-l-4 border-red-400">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Before Image</h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={config.before?.title || ''}
                  onChange={(e) => updateBeforeAfterSide('before', 'title', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Title (e.g., Before)"
                />
                <input
                  type="text"
                  value={config.before?.media?.image?.src || ''}
                  onChange={(e) => updateBeforeAfterMedia('before', 'src', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Image URL"
                />
                {config.before?.media?.image?.src && (
                  <img 
                    src={config.before.media.image.src} 
                    alt="Before preview"
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>
            
            {/* After */}
            <div className="p-3 bg-gray-700/50 rounded-lg border-l-4 border-green-400">
              <h5 className="text-sm font-medium text-gray-300 mb-2">After Image</h5>
              <div className="space-y-2">
                <input
                  type="text"
                  value={config.after?.title || ''}
                  onChange={(e) => updateBeforeAfterSide('after', 'title', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Title (e.g., After)"
                />
                <input
                  type="text"
                  value={config.after?.media?.image?.src || ''}
                  onChange={(e) => updateBeforeAfterMedia('after', 'src', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:border-orange-500 focus:outline-none"
                  placeholder="Image URL"
                />
                {config.after?.media?.image?.src && (
                  <img 
                    src={config.after.media.image.src} 
                    alt="After preview"
                    className="w-full h-20 object-cover rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Slider Settings */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h5 className="text-sm font-medium text-blue-300 mb-2">Slider Animation</h5>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Auto Animate</label>
                <button
                  onClick={() => updateSlider('autoAnimate', !config.slider?.autoAnimate)}
                  className={`w-full py-1.5 rounded text-sm ${
                    config.slider?.autoAnimate ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {config.slider?.autoAnimate ? 'ON' : 'OFF'}
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">From (%)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={config.slider?.from || 0.05}
                  onChange={(e) => updateSlider('from', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To (%)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={config.slider?.to || 1.0}
                  onChange={(e) => updateSlider('to', parseFloat(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Border Radius</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={config.before?.media?.image?.borderRadius || 28}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    updateBeforeAfterMedia('before', 'borderRadius', val);
                    updateBeforeAfterMedia('after', 'borderRadius', val);
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-500 mb-1">Slider Beats</label>
              <BeatsEditor
                beats={config.slider?.beats}
                onChange={(beats) => updateSlider('beats', beats)}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Standard Mode */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Side */}
            <div className="p-3 bg-gray-700/50 rounded-lg border-l-4 border-red-400">
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
            <div className="p-3 bg-gray-700/50 rounded-lg border-l-4 border-green-400">
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
        </>
      )}
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Main Beats</label>
        <BeatsEditor
          beats={config.beats}
          onChange={(beats) => onChange({ ...config, beats })}
        />
      </div>
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

// Bubble Callout Editor - Improved with visual layout
const BubbleCalloutEditor = ({ config, onChange }) => {
  const callouts = config.callouts || [];
  
  const updateCallout = (index, field, value) => {
    const newCallouts = [...callouts];
    if (typeof newCallouts[index] === 'string') {
      newCallouts[index] = { text: newCallouts[index], [field]: value };
    } else {
      newCallouts[index] = { ...newCallouts[index], [field]: value };
    }
    onChange({ ...config, callouts: newCallouts });
  };
  
  const addCallout = () => {
    const icons = ['💡', '✨', '🎯', '📝', '⚡', '🔥', '💬', '👋'];
    const randomIcon = icons[callouts.length % icons.length];
    onChange({
      ...config,
      callouts: [...callouts, { text: 'New callout', icon: randomIcon }]
    });
  };
  
  const removeCallout = (index) => {
    onChange({ ...config, callouts: callouts.filter((_, i) => i !== index) });
  };

  // Pattern preview visualization
  const PatternPreview = ({ pattern }) => {
    const patterns = {
      scattered: [
        { top: '10%', left: '15%', rotate: -5 },
        { top: '40%', left: '60%', rotate: 3 },
        { top: '70%', left: '25%', rotate: -2 },
      ],
      zigzag: [
        { top: '15%', left: '20%', rotate: 0 },
        { top: '45%', left: '60%', rotate: 0 },
        { top: '75%', left: '20%', rotate: 0 },
      ],
      diagonal: [
        { top: '10%', left: '10%', rotate: -3 },
        { top: '40%', left: '40%', rotate: 0 },
        { top: '70%', left: '70%', rotate: 3 },
      ],
    };
    
    const positions = patterns[pattern] || patterns.scattered;
    
    return (
      <div className="relative w-full h-16 bg-gray-800 rounded-lg overflow-hidden">
        {positions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-10 h-5 bg-blue-400/60 rounded-lg"
            style={{ 
              top: pos.top, 
              left: pos.left, 
              transform: `rotate(${pos.rotate}deg)` 
            }}
          />
        ))}
        <div className="absolute bottom-1 right-1 text-[8px] text-gray-500">{pattern}</div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Callouts List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">Callouts ({callouts.length})</label>
          <button onClick={addCallout} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            + Add Callout
          </button>
        </div>
        
        <div className="space-y-2">
          {callouts.map((callout, i) => {
            const calloutObj = typeof callout === 'string' ? { text: callout } : callout;
            return (
              <div key={i} className="p-3 bg-gray-700/50 rounded-lg flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{i + 1}</span>
                  <input
                    type="text"
                    value={calloutObj.icon || ''}
                    onChange={(e) => updateCallout(i, 'icon', e.target.value)}
                    className="w-10 h-10 bg-gray-700 border border-gray-600 rounded text-center text-xl focus:border-orange-500 focus:outline-none"
                    placeholder="💡"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={calloutObj.text || ''}
                    onChange={(e) => updateCallout(i, 'text', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="Callout text"
                  />
                  <div className="flex gap-2">
                    <select
                      value={calloutObj.shape || config.shape || 'speech'}
                      onChange={(e) => updateCallout(i, 'shape', e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                    >
                      <option value="speech">Speech bubble</option>
                      <option value="rounded">Rounded pill</option>
                      <option value="notebook">Notebook style</option>
                    </select>
                    <input
                      type="text"
                      value={calloutObj.color || ''}
                      onChange={(e) => updateCallout(i, 'color', e.target.value)}
                      className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                      placeholder="Color"
                    />
                  </div>
                </div>
                <button onClick={() => removeCallout(i)} className="text-red-400 hover:text-red-300 mt-2">×</button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pattern Selection with Previews */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">Layout Pattern</label>
        <div className="grid grid-cols-3 gap-3">
          {['scattered', 'zigzag', 'diagonal'].map(pattern => (
            <button
              key={pattern}
              onClick={() => onChange({ ...config, pattern })}
              className={`p-2 rounded-lg transition-all ${
                (config.pattern || 'scattered') === pattern
                  ? 'ring-2 ring-orange-500 bg-orange-500/10'
                  : 'bg-gray-700/50 hover:bg-gray-700'
              }`}
            >
              <PatternPreview pattern={pattern} />
            </button>
          ))}
        </div>
      </div>
      
      {/* Shape and Animation */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Default Shape</label>
          <select
            value={config.shape || 'speech'}
            onChange={(e) => onChange({ ...config, shape: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="speech">Speech (with tail)</option>
            <option value="rounded">Rounded (pill)</option>
            <option value="notebook">Notebook (dashed)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Animation</label>
          <select
            value={config.animation || 'float'}
            onChange={(e) => onChange({ ...config, animation: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="pop">Pop</option>
            <option value="float">Float</option>
            <option value="slide">Slide</option>
            <option value="scale">Scale</option>
            <option value="fade">Fade</option>
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
    bubbleCallout: BubbleCalloutEditor,
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
