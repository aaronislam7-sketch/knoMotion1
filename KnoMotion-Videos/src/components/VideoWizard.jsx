import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';
import { MultiSceneVideo } from './MultiSceneVideo';
import { validateSceneCompat, detectSchemaVersion } from '../sdk';

// Import default v5 scenes for each pillar
import hook1AScene from '../scenes/hook_1a_knodovia_map_v5.json';
import explain2AScene from '../scenes/explain_2a_breakdown_v5.json';
import apply3AScene from '../scenes/apply_3a_quiz_v5.json';
import reflect4AScene from '../scenes/reflect_4a_takeaways_v5.json';
import show5AScene from '../scenes/Show5A_Example_GCP_VPC.json';
import compare3AScene from '../scenes/Compare3A_Example_GCP_Compute.json';

/**
 * PILLAR CONFIGURATION
 * 
 * Updated to support all 7 pedagogical pillars:
 * - Core HEAR: Hook, Explain, Apply, Reflect
 * - NEW: Compare, Show, Build
 */
const ALL_PILLARS = {
  hook: {
    title: 'Hook',
    icon: '🎯',
    description: 'Create curiosity & grab attention',
    color: '#E74C3C',
    defaultScene: hook1AScene,
    recommended: true,
    duration: '15-18s'
  },
  explain: {
    title: 'Explain',
    icon: '📚',
    description: 'Teach core concepts clearly',
    color: '#3498DB',
    defaultScene: explain2AScene,
    recommended: true,
    duration: '20-40s'
  },
  compare: {
    title: 'Compare',
    icon: '⚖️',
    description: 'Evaluate options for decisions',
    color: '#9B59B6',
    defaultScene: compare3AScene,
    recommended: false,
    duration: '35-50s'
  },
  show: {
    title: 'Show',
    icon: '📝',
    description: 'Demonstrate how-to procedures',
    color: '#F39C12',
    defaultScene: show5AScene,
    recommended: false,
    duration: '45-70s'
  },
  apply: {
    title: 'Apply',
    icon: '🛠️',
    description: 'Practice & implement knowledge',
    color: '#86BC25',
    defaultScene: apply3AScene,
    recommended: true,
    duration: '30-50s'
  },
  reflect: {
    title: 'Reflect',
    icon: '🤔',
    description: 'Consolidate & plan next steps',
    color: '#732282',
    defaultScene: reflect4AScene,
    recommended: true,
    duration: '25-35s'
  },
  // Build pillar coming soon
  build: {
    title: 'Build',
    icon: '🏗️',
    description: 'Show system evolution (Coming Soon)',
    color: '#1ABC9C',
    defaultScene: null,
    recommended: false,
    disabled: true,
    duration: '40-60s'
  }
};

/**
 * Flexible Video Creation Wizard
 * 
 * Allows users to:
 * 1. Select which pillars to include (not forced to use all 4)
 * 2. Configure each selected pillar
 * 3. Preview individual scenes
 * 4. Preview final stitched video
 */
export const VideoWizard = () => {
  // Step 1: Pillar selection
  const [step, setStep] = useState('select'); // 'select' | 'configure' | 'final'
  
  // Selected pillars (true = included in video)
  const [selectedPillars, setSelectedPillars] = useState({
    hook: true,
    explain: true,
    compare: false,
    show: false,
    apply: true,
    reflect: true,
    build: false
  });
  
  // Current pillar being configured
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  
  // Scene data for each pillar
  const [scenes, setScenes] = useState({
    hook: hook1AScene,
    explain: explain2AScene,
    compare: compare3AScene,
    show: show5AScene,
    apply: apply3AScene,
    reflect: reflect4AScene,
    build: null
  });
  
  // Approval status
  const [approvedPillars, setApprovedPillars] = useState({});
  
  // JSON editing
  const [editingJSON, setEditingJSON] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  
  // Get array of selected pillar keys in order
  const selectedPillarKeys = Object.keys(selectedPillars).filter(k => selectedPillars[k]);
  const currentPillarKey = selectedPillarKeys[currentPillarIndex];
  const currentPillarInfo = ALL_PILLARS[currentPillarKey];
  
  // Initialize editing JSON for current pillar
  React.useEffect(() => {
    if (step === 'configure' && currentPillarKey && !editingJSON[currentPillarKey]) {
      setEditingJSON(prev => ({
        ...prev,
        [currentPillarKey]: JSON.stringify(scenes[currentPillarKey], null, 2)
      }));
    }
  }, [currentPillarKey, step]);

  // Toggle pillar selection
  const togglePillar = (pillarKey) => {
    if (ALL_PILLARS[pillarKey].disabled) return;
    setSelectedPillars(prev => ({
      ...prev,
      [pillarKey]: !prev[pillarKey]
    }));
  };

  // Start configuration flow
  const handleStartConfiguration = () => {
    if (selectedPillarKeys.length === 0) {
      alert('Please select at least one pillar');
      return;
    }
    setStep('configure');
    setCurrentPillarIndex(0);
  };

  // Apply JSON changes
  const handleApplyJSON = () => {
    try {
      const parsed = JSON.parse(editingJSON[currentPillarKey]);
      
      // Validate using new schema system
      const errors = [];
      if (!parsed.template_id) errors.push('Missing template_id');
      
      const validation = validateSceneCompat(parsed);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
      
      if (errors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [currentPillarKey]: errors }));
        return;
      }
      
      // Success - update scene
      setScenes(prev => ({ ...prev, [currentPillarKey]: parsed }));
      setValidationErrors(prev => ({ ...prev, [currentPillarKey]: [] }));
      
    } catch (e) {
      setValidationErrors(prev => ({
        ...prev,
        [currentPillarKey]: [`Invalid JSON: ${e.message}`]
      }));
    }
  };

  // Approve current pillar
  const handleApprovePillar = () => {
    setApprovedPillars(prev => ({ ...prev, [currentPillarKey]: true }));
    
    // Move to next pillar or final step
    if (currentPillarIndex < selectedPillarKeys.length - 1) {
      setCurrentPillarIndex(prev => prev + 1);
    } else {
      setStep('final');
    }
  };

  // Go back to previous pillar
  const handlePreviousPillar = () => {
    if (currentPillarIndex > 0) {
      setCurrentPillarIndex(prev => prev - 1);
    } else {
      setStep('select');
    }
  };

  // ==============================================
  // STEP 1: PILLAR SELECTION
  // ==============================================
  
  if (step === 'select') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{
              fontSize: 42,
              fontWeight: 700,
              color: '#732282',
              margin: '0 0 16px 0'
            }}>
              🎬 Create Your Learning Video
            </h1>
            <p style={{
              fontSize: 18,
              color: '#666',
              margin: 0,
              lineHeight: 1.6
            }}>
              Select which pedagogical pillars to include in your video.<br/>
              Mix and match based on your content needs.
            </p>
          </div>

          {/* Pillar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: 48
          }}>
            {Object.entries(ALL_PILLARS).map(([key, pillar]) => {
              const isSelected = selectedPillars[key];
              const isDisabled = pillar.disabled;
              
              return (
                <div
                  key={key}
                  onClick={() => !isDisabled && togglePillar(key)}
                  style={{
                    backgroundColor: isSelected ? `${pillar.color}10` : '#fff',
                    border: isSelected ? `3px solid ${pillar.color}` : '2px solid #E0E0E0',
                    borderRadius: 12,
                    padding: 24,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                    transition: 'all 0.2s',
                    position: 'relative',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isSelected ? `0 4px 12px ${pillar.color}30` : '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: pillar.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  {/* Recommended badge */}
                  {pillar.recommended && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#86BC25',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase'
                    }}>
                      Recommended
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: 48,
                    marginBottom: 12,
                    marginTop: pillar.recommended ? 28 : 0
                  }}>
                    {pillar.icon}
                  </div>
                  
                  <h3 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: pillar.color,
                    margin: '0 0 8px 0'
                  }}>
                    {pillar.title}
                  </h3>
                  
                  <p style={{
                    fontSize: 15,
                    color: '#666',
                    margin: '0 0 12px 0',
                    lineHeight: 1.5
                  }}>
                    {pillar.description}
                  </p>
                  
                  <div style={{
                    fontSize: 13,
                    color: '#999',
                    fontWeight: 500
                  }}>
                    Duration: {pillar.duration}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary & CTA */}
          <div style={{
            backgroundColor: '#fff',
            border: '2px solid #E0E0E0',
            borderRadius: 12,
            padding: 32,
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#333',
                margin: '0 0 12px 0'
              }}>
                Selected Pillars: {selectedPillarKeys.length}
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                {selectedPillarKeys.length === 0 ? (
                  <span style={{ color: '#999', fontSize: 14 }}>
                    No pillars selected
                  </span>
                ) : (
                  selectedPillarKeys.map(key => {
                    const pillar = ALL_PILLARS[key];
                    return (
                      <div
                        key={key}
                        style={{
                          backgroundColor: `${pillar.color}15`,
                          color: pillar.color,
                          padding: '8px 16px',
                          borderRadius: 20,
                          fontSize: 14,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}
                      >
                        <span>{pillar.icon}</span>
                        <span>{pillar.title}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <button
              onClick={handleStartConfiguration}
              disabled={selectedPillarKeys.length === 0}
              style={{
                padding: '16px 48px',
                fontSize: 18,
                fontWeight: 700,
                backgroundColor: selectedPillarKeys.length === 0 ? '#ccc' : '#732282',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: selectedPillarKeys.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: selectedPillarKeys.length === 0 ? 'none' : '0 4px 16px rgba(115, 34, 130, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              {selectedPillarKeys.length === 0 
                ? 'Select Pillars to Continue'
                : `Configure ${selectedPillarKeys.length} Scene${selectedPillarKeys.length > 1 ? 's' : ''}`
              }
            </button>
            
            <p style={{
              fontSize: 13,
              color: '#999',
              margin: '16px 0 0 0'
            }}>
              💡 Tip: Start with the recommended pillars (Hook → Explain → Apply → Reflect)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // STEP 2: CONFIGURE EACH PILLAR
  // ==============================================
  
  if (step === 'configure' && currentPillarKey) {
    const fps = 30;
    const currentScene = scenes[currentPillarKey];
    
    // Safety check - if scene is null/undefined, show error
    if (!currentScene) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, color: '#E74C3C' }}>⚠️ Scene Not Available</h2>
            <p style={{ fontSize: 16, color: '#666' }}>
              The {currentPillarInfo?.title} template is not yet implemented.
            </p>
            <button
              onClick={() => setStep('select')}
              style={{
                marginTop: 20,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: '#732282',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              ← Back to Selection
            </button>
          </div>
        </div>
      );
    }
    
    const durationInFrames = currentScene?.beats?.exit 
      ? Math.round((currentScene.beats.exit + 0.5) * fps)
      : 15 * fps;
    
    const errors = validationErrors[currentPillarKey] || [];
    
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#F5F7FA',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header with Progress */}
        <div style={{
          backgroundColor: '#fff',
          borderBottom: '2px solid #E0E0E0',
          padding: '20px 40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: currentPillarInfo.color,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 36 }}>{currentPillarInfo.icon}</span>
              {currentPillarInfo.title}
            </h2>
            
            <div style={{ flex: 1 }} />
            
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#666'
            }}>
              Scene {currentPillarIndex + 1} of {selectedPillarKeys.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            height: 6,
            backgroundColor: '#E0E0E0',
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentPillarIndex + 1) / selectedPillarKeys.length) * 100}%`,
              backgroundColor: currentPillarInfo.color,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Panel - JSON Editor */}
          <div style={{
            width: '45%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRight: '2px solid #E0E0E0'
          }}>
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #E0E0E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
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
                onClick={handleApplyJSON}
                style={{
                  padding: '8px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  backgroundColor: currentPillarInfo.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Apply Changes
              </button>
            </div>
            
            <textarea
              value={editingJSON[currentPillarKey] || ''}
              onChange={(e) => setEditingJSON(prev => ({
                ...prev,
                [currentPillarKey]: e.target.value
              }))}
              style={{
                flex: 1,
                padding: 20,
                fontSize: 13,
                fontFamily: 'Monaco, Consolas, monospace',
                border: 'none',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.6
              }}
              spellCheck={false}
            />
            
            {/* Validation Messages */}
            {errors.length > 0 ? (
              <div style={{
                borderTop: '1px solid #E0E0E0',
                padding: 20,
                backgroundColor: '#FFF3CD',
                maxHeight: 150,
                overflowY: 'auto'
              }}>
                {errors.map((error, i) => (
                  <div key={i} style={{
                    color: '#856404',
                    fontSize: 13,
                    marginBottom: 6
                  }}>
                    ⚠️ {error}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                borderTop: '1px solid #E0E0E0',
                padding: '12px 20px',
                backgroundColor: '#D4EDDA',
                color: '#155724',
                fontSize: 13
              }}>
                ✅ Scene validated successfully
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
            backgroundColor: '#F8F8F8',
            overflow: 'auto'
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              marginBottom: 24,
              width: '100%',
              maxWidth: 640
            }}>
              {currentScene && (
                <Player
                  component={TemplateRouter}
                  inputProps={{ scene: currentScene }}
                  durationInFrames={durationInFrames}
                  fps={fps}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  controls
                  style={{
                    width: '100%',
                    aspectRatio: '16/9'
                  }}
                  clickToPlay
                />
              )}
            </div>
            
            <div style={{
              display: 'flex',
              gap: 16
            }}>
              <button
                onClick={handlePreviousPillar}
                style={{
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  backgroundColor: '#fff',
                  color: '#666',
                  border: '2px solid #E0E0E0',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              
              <button
                onClick={handleApprovePillar}
                disabled={errors.length > 0}
                style={{
                  padding: '12px 32px',
                  fontSize: 16,
                  fontWeight: 600,
                  backgroundColor: errors.length > 0 ? '#ccc' : currentPillarInfo.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
                  boxShadow: errors.length > 0 ? 'none' : `0 4px 12px ${currentPillarInfo.color}40`
                }}
              >
                {currentPillarIndex < selectedPillarKeys.length - 1
                  ? `Approve & Continue →`
                  : `Approve & Finish`
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // STEP 3: FINAL PREVIEW
  // ==============================================
  
  if (step === 'final') {
    const approvedScenesList = selectedPillarKeys
      .filter(key => approvedPillars[key])
      .map(key => scenes[key]);
    
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{
              fontSize: 42,
              fontWeight: 700,
              color: '#732282',
              margin: '0 0 16px 0'
            }}>
              🎉 Video Complete!
            </h1>
            <p style={{
              fontSize: 18,
              color: '#666',
              margin: 0
            }}>
              Preview your complete learning video with all {approvedScenesList.length} scenes.
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            marginBottom: 32
          }}>
            <MultiSceneVideo scenes={approvedScenesList} fps={30} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16
          }}>
            <button
              onClick={() => {
                setStep('select');
                setCurrentPillarIndex(0);
                setApprovedPillars({});
              }}
              style={{
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: '#fff',
                color: '#666',
                border: '2px solid #E0E0E0',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              ← Start Over
            </button>
            
            <button
              onClick={() => setStep('configure')}
              style={{
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: '#732282',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(115, 34, 130, 0.3)'
              }}
            >
              Edit Scenes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
