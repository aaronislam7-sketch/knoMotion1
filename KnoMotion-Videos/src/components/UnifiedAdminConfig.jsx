import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';
import { TemplateGallery } from './TemplateGallery';
import { Reveal9Config } from './configs/Reveal9Config';
import { Guide10Config } from './configs/Guide10Config';
import { Compare11Config } from './configs/Compare11Config';
import { Compare12Config } from './configs/Compare12Config';
import { Challenge13Config } from './configs/Challenge13Config';
import { Spotlight14Config } from './configs/Spotlight14Config';
import { Connect15Config } from './configs/Connect15Config';
import { Quote16Config } from './configs/Quote16Config';
import { Progress18Config } from './configs/Progress18Config';
import { EZ } from '../sdk';

// Import templates directly to access their getDuration functions
import * as Reveal9Module from '../templates/Reveal9ProgressiveUnveil_V6';
import * as Guide10Module from '../templates/Guide10StepSequence_V6';
import * as Compare11Module from '../templates/Compare11BeforeAfter_V6';

// NEW: Learning Content Pipeline Templates (Nov 2025)
import * as Compare12Module from '../templates/Compare12MatrixGrid_V6';
import * as Challenge13Module from '../templates/Challenge13PollQuiz_V6';
import * as Spotlight14Module from '../templates/Spotlight14SingleConcept_V6';
import * as Connect15Module from '../templates/Connect15AnalogyBridge_V6';
import * as Quote16Module from '../templates/Quote16Showcase_V6';
import * as Progress18Module from '../templates/Progress18Path_V6';

// Import example scenes
import reveal9Example from '../scenes/reveal_9_progressive_unveil_example.json';
import guide10Example from '../scenes/guide_10_step_sequence_example.json';
import compare11Example from '../scenes/compare_11_before_after_example.json';

// NEW: Example scenes for new templates
import compare12Example from '../scenes/compare_12_matrix_example.json';
import challenge13Example from '../scenes/challenge_13_poll_quiz_example.json';
import spotlight14Example from '../scenes/spotlight_14_single_concept_example.json';
import connect15Example from '../scenes/connect_15_analogy_bridge_example.json';
import quote16Example from '../scenes/quote_16_showcase_example.json';
import progress18Example from '../scenes/progress_18_path_example.json';

/**
 * Unified Admin Configuration Tool
 * 
 * Features:
 * - Visual template gallery with intention filtering
 * - Dynamic configuration panels for each template
 * - Live preview with Remotion Player
 * - JSON export/import
 * - All configurable parameters exposed through UI
 */

// Default scenes for each template
const DEFAULT_SCENES = {
  'Reveal9ProgressiveUnveil': reveal9Example,
  'Guide10StepSequence': guide10Example,
  'Compare11BeforeAfter': compare11Example,
  
  // Learning Content Pipeline Templates (Nov 2025)
  'Compare12MatrixGrid': compare12Example,
  'Challenge13PollQuiz': challenge13Example,
  'Spotlight14SingleConcept': spotlight14Example,
  'Connect15AnalogyBridge': connect15Example,
  'Quote16Showcase': quote16Example,
  'Progress18Path': progress18Example
};

export const UnifiedAdminConfig = ({ initialScene, onSceneUpdate }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialScene?.template_id || 'Reveal9ProgressiveUnveil'
  );
  
  const [scene, setScene] = useState(
    initialScene || DEFAULT_SCENES[selectedTemplateId] || reveal9Example
  );
  
  const [playerKey, setPlayerKey] = useState(0);
  const [showJSON, setShowJSON] = useState(false);
  
  // Update scene when template changes
  useEffect(() => {
    if (DEFAULT_SCENES[selectedTemplateId] && scene.template_id !== selectedTemplateId) {
      const newScene = {
        ...DEFAULT_SCENES[selectedTemplateId],
        template_id: selectedTemplateId
      };
      setScene(newScene);
      setPlayerKey(prev => prev + 1);
    }
  }, [selectedTemplateId]);
  
  // Update parent when scene changes
  useEffect(() => {
    if (onSceneUpdate) {
      onSceneUpdate(scene);
    }
  }, [scene, onSceneUpdate]);
  
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };
  
  const handleSceneUpdate = (updatedScene) => {
    setScene(updatedScene);
  };
  
  const handleReloadPlayer = () => {
    setPlayerKey(prev => prev + 1);
  };
  
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(scene, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scene.template_id || 'scene'}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
    alert('JSON copied to clipboard!');
  };
  
  // Get the appropriate config panel based on selected template
  const renderConfigPanel = () => {
    const hasConfig = DEFAULT_SCENES[selectedTemplateId];
    
    if (!hasConfig) {
      return (
        <div style={{
          padding: 40,
          textAlign: 'center',
          backgroundColor: '#FFF3CD',
          border: '2px solid #FFC107',
          borderRadius: 12,
          color: '#856404'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Configuration Not Available Yet
          </h3>
          <p style={{ fontSize: 14, margin: 0 }}>
            The interactive configuration panel for <strong>{selectedTemplateId}</strong> is coming soon.
            <br />Currently, only Reveal9, Guide10, and Compare11 have config panels.
            <br /><br />
            <strong>You can still:</strong>
            <ul style={{ textAlign: 'left', marginTop: 8, paddingLeft: 20 }}>
              <li>View the live preview</li>
              <li>See the JSON configuration</li>
              <li>Copy or download the JSON</li>
              <li>Manually edit the JSON and reload</li>
            </ul>
          </p>
        </div>
      );
    }
    
    switch (selectedTemplateId) {
      case 'Reveal9ProgressiveUnveil':
        return <Reveal9Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Guide10StepSequence':
        return <Guide10Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Compare11BeforeAfter':
        return <Compare11Config scene={scene} onUpdate={handleSceneUpdate} />;
      
      // Learning Content Pipeline Templates (Nov 2025)
      case 'Compare12MatrixGrid':
        return <Compare12Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Challenge13PollQuiz':
        return <Challenge13Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Spotlight14SingleConcept':
        return <Spotlight14Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Connect15AnalogyBridge':
        return <Connect15Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Quote16Showcase':
        return <Quote16Config scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Progress18Path':
        return <Progress18Config scene={scene} onUpdate={handleSceneUpdate} />;
      
      default:
        return (
          <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
            <p>Select a template to configure</p>
          </div>
        );
    }
  };
  
  // Calculate duration for player using template-specific getDuration
  const fps = 30;
  const getDurationInFrames = () => {
    if (!scene) return 450; // 15s default
    
    // Use template-specific duration calculation
    switch (selectedTemplateId) {
      case 'Reveal9ProgressiveUnveil':
        return Reveal9Module.getDuration ? Reveal9Module.getDuration(scene, fps) : 450;
      case 'Guide10StepSequence':
        return Guide10Module.getDuration ? Guide10Module.getDuration(scene, fps) : 450;
      case 'Compare11BeforeAfter':
        return Compare11Module.getDuration ? Compare11Module.getDuration(scene, fps) : 450;
      
      // Learning Content Pipeline Templates
      case 'Compare12MatrixGrid':
        return Compare12Module.getDuration ? Compare12Module.getDuration(scene, fps) : 450;
      case 'Challenge13PollQuiz':
        return Challenge13Module.getDuration ? Challenge13Module.getDuration(scene, fps) : 450;
      case 'Spotlight14SingleConcept':
        return Spotlight14Module.getDuration ? Spotlight14Module.getDuration(scene, fps) : 450;
      case 'Connect15AnalogyBridge':
        return Connect15Module.getDuration ? Connect15Module.getDuration(scene, fps) : 450;
      case 'Quote16Showcase':
        return Quote16Module.getDuration ? Quote16Module.getDuration(scene, fps) : 450;
      case 'Progress18Path':
        return Progress18Module.getDuration ? Progress18Module.getDuration(scene, fps) : 450;
      
      default:
        // Fallback: try to calculate from beats
        if (scene.beats && scene.beats.exit) {
          return Math.ceil((scene.beats.exit + 1.0) * fps);
        }
        return 450;
    }
  };
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      padding: 24,
      minHeight: '100vh',
      backgroundColor: '#F0F2F5',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* LEFT COLUMN: Template Gallery + Config */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
        maxHeight: '100vh',
        paddingRight: 12
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: '#1A1A1A',
            margin: 0,
            marginBottom: 6
          }}>
            🎛️ Template Builder
          </h1>
          <p style={{
              fontSize: 14,
              color: '#5A6C7D',
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 400
          }}>
            Choose a template, customize it, and preview your video in real-time.
          </p>
        </div>
        
        {/* Template Gallery */}
        <TemplateGallery
          onSelectTemplate={handleTemplateSelect}
          selectedTemplateId={selectedTemplateId}
        />
        
        {/* Configuration Panel */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16
          }}>
            <span style={{ fontSize: 20 }}>⚙️</span>
            <h2 style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#2C3E50',
              margin: 0
            }}>
              Configuration
            </h2>
          </div>
          
          {renderConfigPanel()}
        </div>
      </div>
      
      {/* RIGHT COLUMN: Live Preview + JSON */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        position: 'sticky',
        top: 24,
        height: 'fit-content'
      }}>
        {/* Live Preview */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🎥</span>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#2C3E50',
                margin: 0
              }}>
                Preview
              </h2>
            </div>
            
            <button
              onClick={handleReloadPlayer}
              style={{
                padding: '6px 14px',
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#45A049'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              🔄 Reload
            </button>
          </div>
          
          {/* Remotion Player */}
          <div style={{
            border: '3px solid #E0E0E0',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#000000',
            minHeight: 400
          }}>
            <Player
              key={playerKey}
              component={TemplateRouter}
              inputProps={{ 
                scene,
                easingMap: EZ,
                styles: {},
                presets: {}
              }}
              durationInFrames={getDurationInFrames()}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={fps}
              style={{
                width: '100%',
                height: '100%',
                minHeight: 600
              }}
              controls
              loop
              clickToPlay
              autoPlay
            />
          </div>
          
          {/* Meta Info - Simplified */}
          <div style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: '#F8F9FA',
            borderRadius: 6,
            fontSize: 12,
            color: '#5A6C7D',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span><strong>Template:</strong> {selectedTemplateId.replace(/([0-9]+)/, ' $1 ')}</span>
            <span><strong>Duration:</strong> {(getDurationInFrames() / fps).toFixed(1)}s</span>
          </div>
        </div>
        
        {/* JSON Viewer - Simplified */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📋</span>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#2C3E50',
                margin: 0
              }}>
                Export
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setShowJSON(!showJSON)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: showJSON ? '#5A6C7D' : '#E0E0E0',
                  color: showJSON ? '#FFFFFF' : '#2C3E50',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s'
                }}
              >
                {showJSON ? 'Hide' : 'Show'}
              </button>
              
              <button
                onClick={handleCopyJSON}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#9C27B0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7B1FA2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#9C27B0'}
              >
                Copy
              </button>
              
              <button
                onClick={handleDownloadJSON}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#FF9800',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 12,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F57C00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#FF9800'}
              >
                Download
              </button>
            </div>
          </div>
          
          {showJSON && (
            <pre style={{
              backgroundColor: '#1E1E1E',
              color: '#D4D4D4',
              padding: 16,
              borderRadius: 8,
              fontSize: 12,
              maxHeight: 400,
              overflowY: 'auto',
              margin: 0,
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              {JSON.stringify(scene, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
