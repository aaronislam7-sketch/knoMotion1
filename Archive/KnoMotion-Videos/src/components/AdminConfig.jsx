import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';

/**
 * AdminConfig Component
 * 
 * Interactive configuration tool for HOOK1A template
 * Provides visual controls for all configurable aspects:
 * - Hero visual (polymorphic type selection)
 * - Question lines (dynamic 1-4 lines)
 * - Colors (palette)
 * - Fonts (typography)
 * - Timeline (beats)
 * - Text content (welcome/subtitle)
 */

// 9-Point Grid Positions
const GRID_POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

// Hero type options
const HERO_TYPES = [
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'svg', label: 'SVG', icon: '🎨' },
  { value: 'roughSVG', label: 'Rough SVG', icon: '✏️' },
  { value: 'lottie', label: 'Lottie', icon: '🎬' }
];

// Color presets
const COLOR_PRESETS = [
  {
    name: 'Geography',
    colors: { bg: '#FFF9F0', accent: '#E74C3C', accent2: '#E67E22', ink: '#1A1A1A' }
  },
  {
    name: 'Sports',
    colors: { bg: '#F0F9FF', accent: '#00FF00', accent2: '#FFD700', ink: '#1A1A1A' }
  },
  {
    name: 'Science',
    colors: { bg: '#F5F0FF', accent: '#9B59B6', accent2: '#3498DB', ink: '#1A1A1A' }
  },
  {
    name: 'Business',
    colors: { bg: '#F8F9FA', accent: '#2C3E50', accent2: '#3498DB', ink: '#1A1A1A' }
  }
];

// Scene Presets - Quick examples to demonstrate flexibility
const SCENE_PRESETS = [
  {
    name: 'Geography (Knodovia)',
    description: 'Original map-based geography scene',
    hero: {
      type: 'roughSVG',
      asset: 'knodovia-map',
      position: 'center'
    },
    question: {
      lines: [
        { text: 'What if geography', emphasis: 'normal' },
        { text: 'was measured in mindsets?', emphasis: 'high' }
      ]
    },
    welcome: { text: 'Welcome to Knodovia' },
    subtitle: { text: 'A place where your perspective shapes the landscape...' },
    colors: { bg: '#FFF9F0', accent: '#E74C3C', accent2: '#E67E22', ink: '#1A1A1A' }
  },
  {
    name: 'Sports (Football)',
    description: 'Single line question with player image',
    hero: {
      type: 'image',
      asset: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      position: 'center'
    },
    question: {
      lines: [
        { text: 'Who was the greatest?', emphasis: 'high' }
      ]
    },
    welcome: { text: 'The Beautiful Game' },
    subtitle: { text: 'Where legends are made and memories last forever...' },
    colors: { bg: '#F0F9FF', accent: '#00FF00', accent2: '#FFD700', ink: '#1A1A1A' }
  },
  {
    name: 'Science (3 lines)',
    description: 'Three-line question for science topics',
    hero: {
      type: 'image',
      asset: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
      position: 'center'
    },
    question: {
      lines: [
        { text: 'What if we could see', emphasis: 'normal' },
        { text: 'atoms dance', emphasis: 'high' },
        { text: 'in real time?', emphasis: 'normal' }
      ]
    },
    welcome: { text: 'The Quantum World' },
    subtitle: { text: 'Where the impossible becomes visible...' },
    colors: { bg: '#F5F0FF', accent: '#9B59B6', accent2: '#3498DB', ink: '#1A1A1A' }
  },
  {
    name: 'Business (Minimal)',
    description: 'Clean, professional business aesthetic',
    hero: {
      type: 'image',
      asset: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      position: 'center'
    },
    question: {
      lines: [
        { text: 'What defines success', emphasis: 'normal' },
        { text: 'in the modern workplace?', emphasis: 'high' }
      ]
    },
    welcome: { text: 'Welcome to the Future' },
    subtitle: { text: 'Where innovation meets opportunity...' },
    colors: { bg: '#F8F9FA', accent: '#2C3E50', accent2: '#3498DB', ink: '#1A1A1A' }
  }
];

// Grid Position Picker Component
const GridPositionPicker = ({ value, onChange, label }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: '#333',
        marginBottom: 8
      }}>
        {label}
      </label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        maxWidth: 180,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '2px solid #e0e0e0'
      }}>
        {GRID_POSITIONS.map(pos => (
          <button
            key={pos}
            onClick={() => onChange(pos)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              border: value === pos ? '3px solid #732282' : '2px solid #ddd',
              backgroundColor: value === pos ? '#732282' : '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'all 0.2s',
              boxShadow: value === pos ? '0 4px 12px rgba(115, 34, 130, 0.3)' : 'none'
            }}
            title={pos}
          >
            {value === pos ? '●' : '○'}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
        Selected: <strong>{value}</strong>
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: '#333',
        marginBottom: 6
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 60,
            height: 36,
            border: '2px solid #ddd',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 13,
            fontFamily: 'Monaco, monospace',
            border: '1px solid #ddd',
            borderRadius: 6,
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
};

// Slider Component
const Slider = ({ label, value, onChange, min, max, step, unit = '' }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
      }}>
        <label style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#333'
        }}>
          {label}
        </label>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#732282',
          backgroundColor: '#f0e6f6',
          padding: '2px 8px',
          borderRadius: 4
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          outline: 'none',
          background: `linear-gradient(to right, #732282 0%, #732282 ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`
        }}
      />
    </div>
  );
};

// Accordion Section Component
const AccordionSection = ({ title, icon, isOpen, onToggle, children }) => {
  return (
    <div style={{
      marginBottom: 12,
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isOpen ? '#f8f9fa' : '#fff',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#333'
          }}>
            {title}
          </span>
        </div>
        <span style={{
          fontSize: 18,
          color: '#666',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fafafa'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export const AdminConfig = ({ initialScene, onSceneUpdate }) => {
  const [scene, setScene] = useState(initialScene);
  const [openSections, setOpenSections] = useState({
    hero: true,
    question: false,
    colors: false,
    fonts: false,
    timeline: false,
    content: false,
    animations: false,
    layout: false
  });
  const [showJSON, setShowJSON] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  const [beatMode, setBeatMode] = useState('relative'); // 'relative' or 'absolute'

  // Sync scene updates
  useEffect(() => {
    if (onSceneUpdate) {
      onSceneUpdate(scene);
    }
  }, [scene, onSceneUpdate]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateScene = (updates) => {
    setScene(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateHero = (heroUpdates) => {
    setScene(prev => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        ...heroUpdates
      }
    }));
  };

  const updateQuestion = (questionUpdates) => {
    setScene(prev => ({
      ...prev,
      question: {
        ...(prev.question || {}),
        ...questionUpdates
      }
    }));
  };

  const updateQuestionLine = (index, updates) => {
    setScene(prev => ({
      ...prev,
      question: {
        ...(prev.question || {}),
        lines: (prev.question?.lines || []).map((line, i) =>
          i === index ? { ...line, ...updates } : line
        )
      }
    }));
  };

  const addQuestionLine = () => {
    setScene(prev => ({
      ...prev,
      question: {
        ...(prev.question || {}),
        lines: [
          ...(prev.question?.lines || []),
          { text: 'New line', emphasis: 'normal' }
        ]
      }
    }));
  };

  const removeQuestionLine = (index) => {
    setScene(prev => ({
      ...prev,
      question: {
        ...(prev.question || {}),
        lines: (prev.question?.lines || []).filter((_, i) => i !== index)
      }
    }));
  };

  const updateColors = (colorUpdates) => {
    setScene(prev => ({
      ...prev,
      style_tokens: {
        ...(prev.style_tokens || {}),
        colors: {
          ...(prev.style_tokens?.colors || {}),
          ...colorUpdates
        }
      }
    }));
  };

  const updateFonts = (fontUpdates) => {
    setScene(prev => ({
      ...prev,
      style_tokens: {
        ...(prev.style_tokens || {}),
        fonts: {
          ...(prev.style_tokens?.fonts || {}),
          ...fontUpdates
        }
      }
    }));
  };

  const updateBeat = (beat, value) => {
    setScene(prev => ({
      ...prev,
      beats: {
        ...(prev.beats || {}),
        [beat]: value
      }
    }));
  };

  // Helper: Calculate cumulative beats (relative to previous)
  const calculateCumulativeBeats = (beats) => {
    const order = [
      'entrance', 'questionStart', 'moveUp', 'emphasis',
      'wipeQuestions', 'mapReveal', 'transformMap', 
      'welcome', 'subtitle', 'breathe', 'exit'
    ];
    
    const cumulative = {};
    let runningTotal = 0;
    
    order.forEach(beat => {
      if (beats[beat] !== undefined) {
        cumulative[beat] = runningTotal + beats[beat];
        runningTotal = cumulative[beat];
      }
    });
    
    return cumulative;
  };

  // Helper: Get relative beat value (duration from previous)
  const getRelativeBeat = (beat, beats) => {
    const order = [
      'entrance', 'questionStart', 'moveUp', 'emphasis',
      'wipeQuestions', 'mapReveal', 'transformMap', 
      'welcome', 'subtitle', 'breathe', 'exit'
    ];
    
    const index = order.indexOf(beat);
    if (index === 0) return beats[beat] || 0;
    
    const prevBeat = order[index - 1];
    return (beats[beat] || 0) - (beats[prevBeat] || 0);
  };

  const updateContent = (contentUpdates) => {
    setScene(prev => ({
      ...prev,
      ...contentUpdates
    }));
  };

  const applyColorPreset = (preset) => {
    updateColors(preset.colors);
  };

  const applyScenePreset = (preset) => {
    // Apply hero settings
    if (preset.hero) {
      updateHero(preset.hero);
    }
    
    // Apply question lines
    if (preset.question) {
      updateQuestion(preset.question);
    }
    
    // Apply colors
    if (preset.colors) {
      updateColors(preset.colors);
    }
    
    // Apply welcome text
    if (preset.welcome) {
      updateContent({ welcome: preset.welcome });
    }
    
    // Apply subtitle text
    if (preset.subtitle) {
      updateContent({ subtitle: preset.subtitle });
    }
    
    // Reload player to see changes
    setPlayerKey(prev => prev + 1);
  };

  const reloadPlayer = () => {
    setPlayerKey(prev => prev + 1);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(scene, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `hook1a-${scene.meta?.title?.toLowerCase().replace(/\s+/g, '-') || 'scene'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Calculate duration
  const isV5 = scene.schema_version?.startsWith('5.');
  const fps = 30;
  const durationInFrames = isV5
    ? Math.round((scene.beats?.exit || 15.0 + 0.5) * fps)
    : Math.round((scene.duration_s || 30) * fps);

  const hero = scene.hero || {};
  const question = scene.question || {};
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  const beats = scene.beats || {};

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Left Panel - Configuration Controls */}
      <div style={{
        width: '45%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#732282',
          color: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: 32 }}>⚙️</span>
            HOOK1A Configuration
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: 14,
            opacity: 0.95
          }}>
            Interactive visual controls for your template
          </p>
        </div>

        <div style={{ padding: 20 }}>
          
          {/* Scene Presets Section */}
          <div style={{
            marginBottom: 20,
            padding: 16,
            backgroundColor: '#f0e6f6',
            border: '2px solid #732282',
            borderRadius: 8
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12
            }}>
              <span style={{ fontSize: 20 }}>🎭</span>
              <h3 style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: '#732282'
              }}>
                Quick Start Presets
              </h3>
            </div>
            <p style={{
              margin: '0 0 12px 0',
              fontSize: 12,
              color: '#666'
            }}>
              Load a complete example to see the template's flexibility
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8
            }}>
              {SCENE_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyScenePreset(preset)}
                  style={{
                    padding: '10px 12px',
                    border: '2px solid #732282',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#732282';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 4
                  }}>
                    {preset.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    opacity: 0.8
                  }}>
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Hero Visual Section */}
          <AccordionSection
            title="Hero Visual"
            icon="🎨"
            isOpen={openSections.hero}
            onToggle={() => toggleSection('hero')}
          >
            {/* Hero Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Hero Type
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8
              }}>
                {HERO_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => updateHero({ type: type.value })}
                    style={{
                      padding: '12px 16px',
                      border: hero.type === type.value ? '3px solid #732282' : '2px solid #ddd',
                      borderRadius: 8,
                      backgroundColor: hero.type === type.value ? '#f0e6f6' : '#fff',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      color: hero.type === type.value ? '#732282' : '#666',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Asset */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Asset URL/Path
              </label>
              <input
                type="text"
                value={hero.asset || ''}
                onChange={(e) => updateHero({ asset: e.target.value })}
                placeholder="https://... or /path/to/asset"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  fontFamily: 'Monaco, monospace'
                }}
              />
            </div>

            {/* Hero Position */}
            <GridPositionPicker
              label="Hero Position"
              value={hero.position || 'center'}
              onChange={(pos) => updateHero({ position: pos })}
            />

            {/* Entrance Animation */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Entrance Animation
              </label>
              <select
                value={hero.animation?.entrance || 'fadeIn'}
                onChange={(e) => updateHero({
                  animation: { ...(hero.animation || {}), entrance: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="fadeIn">Fade In</option>
                <option value="drawOn">Draw On</option>
              </select>
            </div>

            <Slider
              label="Entrance Duration"
              value={hero.animation?.entranceDuration || 1.3}
              onChange={(val) => updateHero({
                animation: { ...(hero.animation || {}), entranceDuration: val }
              })}
              min={0.3}
              max={3.0}
              step={0.1}
              unit="s"
            />
          </AccordionSection>

          {/* Question Lines Section */}
          <AccordionSection
            title="Question Lines"
            icon="📝"
            isOpen={openSections.question}
            onToggle={() => toggleSection('question')}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
                  Lines ({question.lines?.length || 0})
                </span>
                <button
                  onClick={addQuestionLine}
                  disabled={(question.lines?.length || 0) >= 4}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: (question.lines?.length || 0) >= 4 ? '#ccc' : '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: (question.lines?.length || 0) >= 4 ? 'not-allowed' : 'pointer'
                  }}
                >
                  + Add Line
                </button>
              </div>

              {(question.lines || []).map((line, index) => (
                <div
                  key={index}
                  style={{
                    padding: 12,
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#666' }}>
                      Line {index + 1}
                    </span>
                    <button
                      onClick={() => removeQuestionLine(index)}
                      style={{
                        padding: '4px 8px',
                        fontSize: 11,
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={line.text || ''}
                    onChange={(e) => updateQuestionLine(index, { text: e.target.value })}
                    placeholder="Enter line text..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: 13,
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      outline: 'none',
                      marginBottom: 8
                    }}
                  />
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: '#666',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={line.emphasis === 'high'}
                      onChange={(e) => updateQuestionLine(index, {
                        emphasis: e.target.checked ? 'high' : 'normal'
                      })}
                    />
                    High Emphasis (Larger & Accent Color)
                  </label>
                </div>
              ))}
            </div>

            <Slider
              label="Vertical Spacing"
              value={question.layout?.verticalSpacing || 80}
              onChange={(val) => updateQuestion({
                layout: { ...(question.layout || {}), verticalSpacing: val }
              })}
              min={40}
              max={120}
              step={5}
              unit="px"
            />

            <Slider
              label="Stagger Delay"
              value={question.layout?.stagger || 0.3}
              onChange={(val) => updateQuestion({
                layout: { ...(question.layout || {}), stagger: val }
              })}
              min={0}
              max={0.6}
              step={0.05}
              unit="s"
            />

            <GridPositionPicker
              label="Base Position"
              value={question.layout?.basePosition || 'center'}
              onChange={(pos) => updateQuestion({
                layout: { ...(question.layout || {}), basePosition: pos }
              })}
            />
          </AccordionSection>

          {/* Colors Section */}
          <AccordionSection
            title="Colors"
            icon="🎨"
            isOpen={openSections.colors}
            onToggle={() => toggleSection('colors')}
          >
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Color Presets
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 8
              }}>
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    style={{
                      padding: '10px 14px',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#333',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#732282';
                      e.target.style.backgroundColor = '#f0e6f6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#ddd';
                      e.target.style.backgroundColor = '#fff';
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <ColorPicker
              label="Background"
              value={colors.bg || '#FFF9F0'}
              onChange={(val) => updateColors({ bg: val })}
            />
            <ColorPicker
              label="Accent (Primary)"
              value={colors.accent || '#E74C3C'}
              onChange={(val) => updateColors({ accent: val })}
            />
            <ColorPicker
              label="Accent 2 (Secondary)"
              value={colors.accent2 || '#E67E22'}
              onChange={(val) => updateColors({ accent2: val })}
            />
            <ColorPicker
              label="Ink (Text)"
              value={colors.ink || '#1A1A1A'}
              onChange={(val) => updateColors({ ink: val })}
            />
          </AccordionSection>

          {/* Typography Section */}
          <AccordionSection
            title="Typography"
            icon="✏️"
            isOpen={openSections.fonts}
            onToggle={() => toggleSection('fonts')}
          >
            <Slider
              label="Question Size"
              value={fonts.size_question || 92}
              onChange={(val) => updateFonts({ size_question: val })}
              min={60}
              max={120}
              step={2}
              unit="px"
            />
            <Slider
              label="Welcome Size"
              value={fonts.size_welcome || 72}
              onChange={(val) => updateFonts({ size_welcome: val })}
              min={48}
              max={96}
              step={2}
              unit="px"
            />
            <Slider
              label="Subtitle Size"
              value={fonts.size_subtitle || 32}
              onChange={(val) => updateFonts({ size_subtitle: val })}
              min={24}
              max={48}
              step={2}
              unit="px"
            />
          </AccordionSection>

          {/* Timeline Section - WITH SMART BEAT CALCULATION */}
          <AccordionSection
            title="Timeline (Beats)"
            icon="⏱️"
            isOpen={openSections.timeline}
            onToggle={() => toggleSection('timeline')}
          >
            <div style={{
              marginBottom: 20,
              padding: 16,
              backgroundColor: '#e8f5e9',
              border: '2px solid #4caf50',
              borderRadius: 8
            }}>
              <div style={{ fontSize: 13, color: '#2e7d32', marginBottom: 8, fontWeight: 600 }}>
                💡 Smart Beat Timing
              </div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                Each beat's value = <strong>duration after previous beat</strong>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                Example: Beat1=4s, Beat2=2.5s → Beat2 happens at 6.5s total
              </div>
            </div>

            <div style={{
              marginBottom: 20,
              padding: 12,
              backgroundColor: '#fff',
              border: '2px solid #e0e0e0',
              borderRadius: 8
            }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                Timeline Duration: <strong>{beats.exit || 15.0}s</strong>
              </div>
            </div>

            {/* Beat sliders with cumulative display */}
            {[
              { key: 'entrance', label: 'Entrance', default: 0.6, max: 3 },
              { key: 'questionStart', label: 'Question Start (+)', default: 0.6, max: 3 },
              { key: 'moveUp', label: 'Move Up (+)', default: 2.0, max: 5 },
              { key: 'emphasis', label: 'Emphasis (+)', default: 4.2, max: 5 },
              { key: 'wipeQuestions', label: 'Wipe Questions (+)', default: 5.5, max: 5 },
              { key: 'mapReveal', label: 'Map Reveal (+)', default: 6.5, max: 5 },
              { key: 'transformMap', label: 'Transform Map (+)', default: 9.0, max: 5 },
              { key: 'welcome', label: 'Welcome (+)', default: 10.0, max: 5 },
              { key: 'subtitle', label: 'Subtitle (+)', default: 12.0, max: 5 },
              { key: 'exit', label: 'Exit (+)', default: 15.0, max: 8 }
            ].map((beat, index) => {
              const prevBeat = index > 0 ? 
                ['entrance', 'questionStart', 'moveUp', 'emphasis', 'wipeQuestions', 'mapReveal', 'transformMap', 'welcome', 'subtitle', 'exit'][index - 1] : null;
              const cumulativeTime = prevBeat ? (beats[prevBeat] || 0) + (beats[beat.key] || beat.default) : (beats[beat.key] || beat.default);
              
              return (
                <div key={beat.key} style={{ marginBottom: 16 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6
                  }}>
                    <label style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      {beat.label}
                    </label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        fontSize: 11,
                        color: '#999',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: 3
                      }}>
                        Cumulative: {cumulativeTime.toFixed(1)}s
                      </span>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#732282',
                        backgroundColor: '#f0e6f6',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}>
                        {(beats[beat.key] || beat.default).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    value={beats[beat.key] || beat.default}
                    onChange={(e) => updateBeat(beat.key, parseFloat(e.target.value))}
                    min={0}
                    max={beat.max}
                    step={0.1}
                    style={{
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      outline: 'none',
                      background: `linear-gradient(to right, #732282 0%, #732282 ${((beats[beat.key] || beat.default) / beat.max) * 100}%, #e0e0e0 ${((beats[beat.key] || beat.default) / beat.max) * 100}%, #e0e0e0 100%)`
                    }}
                  />
                </div>
              );
            })}
          </AccordionSection>

          {/* Text Content Section */}
          <AccordionSection
            title="Text Content"
            icon="💬"
            isOpen={openSections.content}
            onToggle={() => toggleSection('content')}
          >
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Welcome Text
              </label>
              <input
                type="text"
                value={scene.welcome?.text || ''}
                onChange={(e) => updateContent({
                  welcome: { ...(scene.welcome || {}), text: e.target.value }
                })}
                placeholder="Welcome to Knodovia"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 8
              }}>
                Subtitle Text
              </label>
              <textarea
                value={scene.subtitle?.text || ''}
                onChange={(e) => updateContent({
                  subtitle: { ...(scene.subtitle || {}), text: e.target.value }
                })}
                placeholder="A place where your perspective shapes the landscape..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </AccordionSection>

          {/* Animations Section - NEW! */}
          <AccordionSection
            title="Animations & Effects"
            icon="✨"
            isOpen={openSections.animations}
            onToggle={() => toggleSection('animations')}
          >
            {/* Text Effects */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Question Text Effect
              </label>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 8,
                fontStyle: 'italic'
              }}>
                Affects: Question lines when they appear
              </div>
              <select
                value={scene.question?.effects?.entrance || 'sparkles'}
                onChange={(e) => updateQuestion({
                  effects: { ...(scene.question?.effects || {}), entrance: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="sparkles">✨ Sparkles</option>
                <option value="none">⭕ None</option>
                <option value="glow">💫 Glow</option>
                <option value="shimmer">🌟 Shimmer</option>
              </select>
            </div>

            {/* Scene Transition */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Scene Exit Transition
              </label>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 8,
                fontStyle: 'italic'
              }}>
                Affects: How the entire scene exits at the end
              </div>
              <select
                value={scene.transition?.type || 'wipe-left'}
                onChange={(e) => updateContent({
                  transition: { ...(scene.transition || {}), type: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="wipe-left">← Wipe Left</option>
                <option value="wipe-right">→ Wipe Right</option>
                <option value="wipe-up">↑ Wipe Up</option>
                <option value="wipe-down">↓ Wipe Down</option>
                <option value="fade">🌫️ Fade</option>
                <option value="zoom-out">🔍 Zoom Out</option>
              </select>
            </div>

            {/* Hero Rotation */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Hero Transform Effect
              </label>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 8,
                fontStyle: 'italic'
              }}>
                Affects: Hero element (map/image) rotation during transformation
              </div>
              <Slider
                label="Rotation (degrees)"
                value={hero.transforms?.[0]?.rotation || 0}
                onChange={(val) => updateHero({
                  transforms: [{
                    ...(hero.transforms?.[0] || {}),
                    rotation: val,
                    beat: 'transformMap',
                    targetScale: hero.transforms?.[0]?.targetScale || 0.4,
                    targetPos: hero.transforms?.[0]?.targetPos || { x: 600, y: -300 },
                    duration: hero.transforms?.[0]?.duration || 1.2
                  }]
                })}
                min={-360}
                max={360}
                step={15}
                unit="°"
              />
            </div>

            {/* Element Entrance Animation */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Question Lines Entrance
              </label>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 8,
                fontStyle: 'italic'
              }}>
                Affects: How question lines enter (animation style)
              </div>
              <select
                value={scene.animations?.entrance || 'fade-up'}
                onChange={(e) => updateContent({
                  animations: { ...(scene.animations || {}), entrance: e.target.value }
                })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="fade-up">↗️ Fade Up</option>
                <option value="fade-in">⚪ Fade In</option>
                <option value="slide-right">→ Slide Right</option>
                <option value="slide-left">← Slide Left</option>
                <option value="scale-up">⬆️ Scale Up</option>
                <option value="bounce">🎾 Bounce</option>
              </select>
            </div>
          </AccordionSection>

          {/* Layout Section - NEW! */}
          <AccordionSection
            title="Layout & Spacing"
            icon="📐"
            isOpen={openSections.layout}
            onToggle={() => toggleSection('layout')}
          >
            <div style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: '#e3f2fd',
              border: '2px solid #2196f3',
              borderRadius: 8,
              fontSize: 12,
              color: '#1565c0'
            }}>
              <strong>💡 Pro Tip:</strong> Use offsets to fine-tune element positioning
            </div>

            {/* Question Offset */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Question Position Offset
              </div>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 12,
                fontStyle: 'italic'
              }}>
                Affects: Shifts ALL question lines left/right/up/down
              </div>
              <Slider
                label="Horizontal (X)"
                value={question.layout?.offset?.x || 0}
                onChange={(val) => updateQuestion({
                  layout: {
                    ...(question.layout || {}),
                    offset: { ...(question.layout?.offset || {}), x: val }
                  }
                })}
                min={-500}
                max={500}
                step={10}
                unit="px"
              />
              <Slider
                label="Vertical (Y)"
                value={question.layout?.offset?.y || 0}
                onChange={(val) => updateQuestion({
                  layout: {
                    ...(question.layout || {}),
                    offset: { ...(question.layout?.offset || {}), y: val }
                  }
                })}
                min={-300}
                max={300}
                step={10}
                unit="px"
              />
            </div>

            {/* Hero Offset */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 4
              }}>
                Hero Position Offset
              </div>
              <div style={{
                fontSize: 11,
                color: '#666',
                marginBottom: 12,
                fontStyle: 'italic'
              }}>
                Affects: Shifts hero element (map/image) position
              </div>
              <Slider
                label="Horizontal (X)"
                value={hero.offset?.x || 0}
                onChange={(val) => updateHero({
                  offset: { ...(hero.offset || {}), x: val }
                })}
                min={-500}
                max={500}
                step={10}
                unit="px"
              />
              <Slider
                label="Vertical (Y)"
                value={hero.offset?.y || 0}
                onChange={(val) => updateHero({
                  offset: { ...(hero.offset || {}), y: val }
                })}
                min={-300}
                max={300}
                step={10}
                unit="px"
              />
            </div>

            {/* Padding Controls */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#333',
                marginBottom: 12
              }}>
                Content Padding
              </div>
              <Slider
                label="Top Padding"
                value={scene.layout?.padding?.top || 0}
                onChange={(val) => updateContent({
                  layout: {
                    ...(scene.layout || {}),
                    padding: { ...(scene.layout?.padding || {}), top: val }
                  }
                })}
                min={0}
                max={200}
                step={10}
                unit="px"
              />
              <Slider
                label="Bottom Padding"
                value={scene.layout?.padding?.bottom || 0}
                onChange={(val) => updateContent({
                  layout: {
                    ...(scene.layout || {}),
                    padding: { ...(scene.layout?.padding || {}), bottom: val }
                  }
                })}
                min={0}
                max={200}
                step={10}
                unit="px"
              />
            </div>
          </AccordionSection>

        </div>
      </div>

      {/* Right Panel - Preview & JSON */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f8f8'
      }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: '#333'
          }}>
            Live Preview
          </h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={downloadJSON}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Download scene as JSON file"
            >
              💾 Download JSON
            </button>
            <button
              onClick={() => setShowJSON(!showJSON)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: showJSON ? '#732282' : '#fff',
                color: showJSON ? '#fff' : '#732282',
                border: '2px solid #732282',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showJSON ? 'Hide JSON' : 'Show JSON'}
            </button>
            <button
              onClick={reloadPlayer}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: '#E74C3C',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🔄 Reload
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          overflowY: 'auto',
          position: 'relative'
        }}>
          {/* Helper Tip */}
          <div style={{
            marginBottom: 16,
            padding: '10px 16px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: 8,
            fontSize: 13,
            color: '#856404',
            textAlign: 'center',
            maxWidth: 800
          }}>
            💡 <strong>Tip:</strong> Click the <strong>🔄 Reload</strong> button above after making changes to see them in the preview
          </div>

          <div style={{
            backgroundColor: '#2d3436',
            borderRadius: 12,
            padding: 6,
            boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
            marginBottom: 20,
            width: '100%',
            maxWidth: 820
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%' // 16:9 aspect ratio
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}>
                <Player
                  key={playerKey}
                  component={TemplateRouter}
                  inputProps={{ scene }}
                  durationInFrames={durationInFrames}
                  fps={fps}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  controls
                  loop
                  clickToPlay
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: 13,
            color: '#666',
            textAlign: 'center'
          }}>
            <strong>{scene.meta?.title || 'HOOK1A Scene'}</strong>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              {(durationInFrames / fps).toFixed(1)}s • 1920×1080 • {fps} fps
            </div>
          </div>

          {/* JSON Viewer */}
          {showJSON && (
            <div style={{
              marginTop: 20,
              width: '100%',
              maxWidth: 800
            }}>
              <div style={{
                backgroundColor: '#fff',
                border: '2px solid #e0e0e0',
                borderRadius: 8,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#333'
                  }}>
                    JSON Configuration
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
                      alert('JSON copied to clipboard!');
                    }}
                    style={{
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
                <pre style={{
                  padding: 16,
                  margin: 0,
                  fontSize: 12,
                  fontFamily: 'Monaco, Consolas, monospace',
                  lineHeight: 1.6,
                  overflow: 'auto',
                  maxHeight: 400,
                  backgroundColor: '#fafafa'
                }}>
                  {JSON.stringify(scene, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;
