import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';
import { MultiSceneVideo } from './MultiSceneVideo';

// Import default scenes
import hookScene from '../scenes/hook_sleep_science.json';
import explainScene from '../scenes/explain_growth_mindset.json';
import applyScene from '../scenes/apply_growth_mindset.json';
import reflectScene from '../scenes/reflect_growth_mindset.json';

const PILLAR_INFO = {
  hook: {
    title: 'Hook',
    icon: '🎯',
    description: 'Grab attention and spark curiosity',
    color: '#e74c3c',
    defaultScene: hookScene
  },
  explain: {
    title: 'Explain',
    icon: '📚',
    description: 'Teach core concepts clearly',
    color: '#3498db',
    defaultScene: explainScene
  },
  apply: {
    title: 'Apply',
    icon: '🛠️',
    description: 'Practice and implement',
    color: '#86BC25',
    defaultScene: applyScene
  },
  reflect: {
    title: 'Reflect',
    icon: '🤔',
    description: 'Consolidate and plan ahead',
    color: '#732282',
    defaultScene: reflectScene
  }
};

const STEPS = ['hook', 'explain', 'apply', 'reflect', 'final'];

/**
 * Video Creation Wizard
 * 
 * Multi-step interface for creating a complete video:
 * 1. Define Hook scene -> Preview -> Approve
 * 2. Define Explain scene -> Preview -> Approve
 * 3. Define Apply scene -> Preview -> Approve
 * 4. Define Reflect scene -> Preview -> Approve
 * 5. Final: Preview complete video with all scenes stitched
 */
export const VideoWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scenes, setScenes] = useState({
    hook: hookScene,
    explain: explainScene,
    apply: applyScene,
    reflect: reflectScene
  });
  const [approvedScenes, setApprovedScenes] = useState({
    hook: false,
    explain: false,
    apply: false,
    reflect: false
  });
  const [editingJSON, setEditingJSON] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreviewHelper, setShowPreviewHelper] = useState(true);

  const currentPillar = STEPS[currentStep];
  const isFinalStep = currentPillar === 'final';
  const pillarInfo = PILLAR_INFO[currentPillar];

  // Initialize editing JSON for current pillar
  React.useEffect(() => {
    if (!isFinalStep && !editingJSON[currentPillar]) {
      setEditingJSON(prev => ({
        ...prev,
        [currentPillar]: JSON.stringify(scenes[currentPillar], null, 2)
      }));
    }
  }, [currentPillar, isFinalStep]);

  const handleApplyJSON = (pillar) => {
    try {
      const parsed = JSON.parse(editingJSON[pillar]);
      
      // Normalize attributes for consistency
      if (!parsed.duration_s && parsed.duration) {
        parsed.duration_s = parsed.duration;
      }
      if (!parsed.fps) parsed.fps = 30;
      if (!parsed.layout) {
        parsed.layout = { canvas: { w: 1920, h: 1080 } };
      }
      if (!parsed.meta) {
        parsed.meta = {
          title: parsed.fill?.texts?.title || `${pillar} scene`,
          description: '',
          tags: [],
          difficulty: 'beginner',
          tone: 'engaging'
        };
      }
      if (!parsed.timeline) {
        parsed.timeline = [];
      }
      
      // Basic validation
      const errors = [];
      if (!parsed.template_id) errors.push('Missing template_id');
      if (!parsed.duration_s) errors.push('Missing duration_s (or duration)');
      if (!parsed.fill) errors.push('Missing fill data');
      
      // Note: TemplateRouter will handle template_id validation at render time
      
      if (errors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [pillar]: errors }));
        return;
      }

      setScenes(prev => ({ ...prev, [pillar]: parsed }));
      setValidationErrors(prev => ({ ...prev, [pillar]: [] }));
    } catch (e) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [pillar]: [`Invalid JSON: ${e.message}`] 
      }));
    }
  };

  const handleApproveScene = () => {
    setApprovedScenes(prev => ({ ...prev, [currentPillar]: true }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleEditScene = (pillar) => {
    setApprovedScenes(prev => ({ ...prev, [pillar]: false }));
    setCurrentStep(STEPS.indexOf(pillar));
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Calculate total duration for final video
  const totalDuration = Object.values(scenes).reduce(
    (sum, scene) => sum + scene.duration_s, 
    0
  ) - 2; // Subtract transition overlaps

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 40px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 700,
          color: '#732282'
        }}>
          🎬 Video Creation Wizard
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: 14,
          color: '#666'
        }}>
          Create your complete {totalDuration}s educational video
        </p>
      </header>

      {/* Progress Indicator */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 40px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 1200,
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* Quick Jump to Final Button */}
          {currentStep < 4 && (
            <button
              onClick={() => setCurrentStep(4)}
              style={{
                position: 'absolute',
                right: -10,
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: '#2ecc71',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(46, 204, 113, 0.3)',
                zIndex: 10,
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-50%) scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
            >
              ⚡ Skip to Final Video
            </button>
          )}

          {STEPS.map((step, index) => {
            const info = step === 'final' 
              ? { title: 'Final Video', icon: '🎥', color: '#2ecc71' }
              : PILLAR_INFO[step];
            const isActive = index === currentStep;
            const isCompleted = index < currentStep || approvedScenes[step];
            
            return (
              <div
                key={step}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4
                }}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? info.color : '#e0e0e0',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  border: isActive ? `4px solid ${info.color}` : 'none',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? '✓' : info.icon}
                </div>
                <div style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? info.color : '#666'
                }}>
                  {info.title}
                </div>
                {index < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 30,
                    left: `${(index + 1) * (100 / STEPS.length)}%`,
                    width: `${100 / STEPS.length}%`,
                    height: 4,
                    backgroundColor: isCompleted ? info.color : '#e0e0e0',
                    zIndex: -1
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        
        {isFinalStep ? (
          // Final Step: Show complete video
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            backgroundColor: '#f8f8f8'
          }}>
            <div style={{
              marginBottom: 30,
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                color: '#2ecc71',
                margin: '0 0 10px 0'
              }}>
                🎉 Your Complete Video is Ready!
              </h2>
              <p style={{
                fontSize: 18,
                color: '#666',
                margin: 0
              }}>
                All {STEPS.length - 1} scenes stitched together • {totalDuration} seconds
              </p>
            </div>

            {/* Video Player with Frame */}
            <div style={{
              backgroundColor: '#2d3436',
              borderRadius: 16,
              padding: 6,
              boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
              maxWidth: 1200,
              width: '100%'
            }}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                overflow: 'hidden'
              }}>
                <Player
                  component={MultiSceneVideo}
                  inputProps={{ scenes }}
                  durationInFrames={Math.floor(totalDuration * 30)}
                  fps={30}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  controls
                  loop
                  clickToPlay
                  style={{
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Playback Info */}
            <div style={{
              marginTop: 20,
              padding: '15px 30px',
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                Complete Video
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: '#2ecc71' }}>
                {Math.floor(totalDuration)}s • 1920×1080 • 30 fps
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                Click play button or anywhere on video to watch
              </div>
            </div>

            {/* Scene Summary */}
            <div style={{
              marginTop: 30,
              display: 'flex',
              gap: 20,
              maxWidth: 1200,
              width: '100%'
            }}>
              {Object.entries(PILLAR_INFO).map(([pillar, info]) => (
                <div
                  key={pillar}
                  style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderLeft: `6px solid ${info.color}`,
                    borderRadius: 8,
                    padding: '15px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8
                  }}>
                    <span style={{ fontSize: 24 }}>{info.icon}</span>
                    <strong style={{ fontSize: 16 }}>{info.title}</strong>
                  </div>
                  <p style={{
                    fontSize: 13,
                    color: '#666',
                    margin: '0 0 8px 0'
                  }}>
                    {scenes[pillar].meta.title}
                  </p>
                  <button
                    onClick={() => handleEditScene(pillar)}
                    style={{
                      padding: '6px 14px',
                      fontSize: 12,
                      backgroundColor: 'transparent',
                      color: info.color,
                      border: `1px solid ${info.color}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = info.color;
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = info.color;
                    }}
                  >
                    Edit Scene
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Individual Pillar Steps
          <>
            {/* Left Panel - JSON Editor */}
            <div style={{
              width: '45%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRight: '1px solid #e0e0e0'
            }}>
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: pillarInfo.color,
                color: '#fff'
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <span style={{ fontSize: 32 }}>{pillarInfo.icon}</span>
                  Step {currentStep + 1}: Define {pillarInfo.title}
                </h2>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: 14,
                  opacity: 0.95
                }}>
                  {pillarInfo.description}
                </p>
              </div>

              <div style={{
                padding: '16px 24px',
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
                  Scene JSON
                </h3>
                <button
                  onClick={() => handleApplyJSON(currentPillar)}
                  style={{
                    padding: '8px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    backgroundColor: pillarInfo.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Apply Changes
                </button>
              </div>

              <textarea
                value={editingJSON[currentPillar] || ''}
                onChange={(e) => setEditingJSON(prev => ({
                  ...prev,
                  [currentPillar]: e.target.value
                }))}
                style={{
                  flex: 1,
                  padding: 20,
                  fontSize: 13,
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.6
                }}
                spellCheck={false}
              />

              {/* Validation Messages */}
              {validationErrors[currentPillar]?.length > 0 ? (
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  padding: 20,
                  backgroundColor: '#fff3cd',
                  maxHeight: 150,
                  overflowY: 'auto'
                }}>
                  {validationErrors[currentPillar].map((error, i) => (
                    <div key={i} style={{
                      color: '#856404',
                      fontSize: 13,
                      marginBottom: 6
                    }}>
                      ⚠ {error}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  padding: '12px 20px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  fontSize: 13
                }}>
                  <span style={{ marginRight: 8 }}>✓</span>
                  Scene validated successfully
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              backgroundColor: '#f8f8f8',
              position: 'relative'
            }}>
              {/* Helper Banner */}
              {showPreviewHelper && currentStep === 0 && (
                <div style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  right: 20,
                  backgroundColor: '#4a9c3b',
                  color: '#fff',
                  padding: '15px 20px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 10
                }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 15 }}>👋 Welcome!</strong>
                    <div style={{ fontSize: 13, marginTop: 5, opacity: 0.95 }}>
                      Watch the preview below, then click "Apply Changes" to update, or "Approve & Continue" to move forward!
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreviewHelper(false)}
                    style={{
                      marginLeft: 15,
                      padding: '5px 10px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 4,
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    Got it!
                  </button>
                </div>
              )}

              <div style={{
                marginTop: showPreviewHelper && currentStep === 0 ? 100 : 0,
                marginBottom: 30,
                width: '100%',
                maxWidth: 960
              }}>
                <div style={{
                  backgroundColor: '#2d3436',
                  borderRadius: 12,
                  padding: 4,
                  boxShadow: '0 12px 32px rgba(0,0,0,0.25)'
                }}>
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}>
                  <Player
                    component={TemplateRouter}
                    inputProps={{ scene: scenes[currentPillar] }}
                    durationInFrames={scenes[currentPillar].duration_s * scenes[currentPillar].fps}
                    fps={scenes[currentPillar].fps}
                      compositionWidth={scenes[currentPillar].layout.canvas.w}
                      compositionHeight={scenes[currentPillar].layout.canvas.h}
                      controls
                      loop
                      style={{
                        width: '100%'
                      }}
                    />
                  </div>
                </div>
                <div style={{
                  marginTop: 15,
                  textAlign: 'center',
                  fontSize: 14,
                  color: '#666',
                  padding: '10px 20px',
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ marginBottom: 5 }}>
                    <strong style={{ color: pillarInfo.color, fontSize: 16 }}>
                      {pillarInfo.icon} {scenes[currentPillar].meta.title}
                    </strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {scenes[currentPillar].duration_s}s • {scenes[currentPillar].layout.canvas.w}×{scenes[currentPillar].layout.canvas.h} • {scenes[currentPillar].fps} fps
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 15
              }}>
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    style={{
                      padding: '12px 30px',
                      fontSize: 16,
                      fontWeight: 600,
                      backgroundColor: '#fff',
                      color: '#666',
                      border: '2px solid #ddd',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.borderColor = '#999'}
                    onMouseOut={(e) => e.target.style.borderColor = '#ddd'}
                  >
                    ← Previous
                  </button>
                )}

                <button
                  onClick={handleApproveScene}
                  style={{
                    padding: '12px 50px',
                    fontSize: 18,
                    fontWeight: 700,
                    backgroundColor: pillarInfo.color,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {currentStep === STEPS.length - 2 ? '✓ Approve & Finish' : '✓ Approve & Continue'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoWizard;
