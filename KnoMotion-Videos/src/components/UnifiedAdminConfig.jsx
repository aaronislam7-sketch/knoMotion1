import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';
import { TemplateGallery } from './TemplateGallery';
import { Reveal9Config } from './configs/Reveal9Config';
import { Guide10Config } from './configs/Guide10Config';
import { Compare11Config } from './configs/Compare11Config';
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

// Import example scenes
import reveal9Example from '../scenes/reveal_9_progressive_unveil_example.json';
import guide10Example from '../scenes/guide_10_step_sequence_example.json';
import compare11Example from '../scenes/compare_11_before_after_example.json';

// NEW: Example scenes for new templates
import compare12Example from '../scenes/compare_12_matrix_example.json';
import challenge13Example from '../scenes/challenge_13_poll_quiz_example.json';
import spotlight14Example from '../scenes/spotlight_14_single_concept_example.json';
import connect15Example from '../scenes/connect_15_analogy_bridge_example.json';

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
  'Connect15AnalogyBridge': connect15Example
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
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 900,
            fontFamily: '"Permanent Marker", cursive',
            color: '#1A1A1A',
            margin: 0,
            marginBottom: 8
          }}>
            🎛️ Interactive Template Config
          </h1>
          <p style={{
              fontSize: 15,
              color: '#4A5568',
              margin: 0,
              lineHeight: 1.6,
              fontWeight: 400
          }}>
            Select a template, configure it visually, and see real-time changes.
            <br />
            <strong>Currently available:</strong> 7 templates (Reveal9, Guide10, Compare11, Compare12, Challenge13, Spotlight14, Connect15)
            <br />
            <em style={{ fontSize: 13, color: '#718096' }}>Note: Config panels for new templates coming soon. JSON preview available for all.</em>
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
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: '#1A1A1A',
            marginTop: 0,
            marginBottom: 16
          }}>
            ⚙️ Configure: {selectedTemplateId}
          </h2>
          
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
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 800,
              fontFamily: '"Permanent Marker", cursive',
              color: '#1A1A1A',
              margin: 0
            }}>
              🎥 Live Preview
            </h2>
            
            <button
              onClick={handleReloadPlayer}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14
              }}
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
          
          {/* Meta Info */}
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            fontSize: 13,
            color: '#2C3E50',
            lineHeight: 1.6
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ fontSize: 13 }}><strong style={{ fontWeight: 700, color: '#1A1A1A' }}>Template:</strong> <span style={{ color: '#4CAF50', fontWeight: 600 }}>{selectedTemplateId}</span></div>
              <div style={{ fontSize: 13 }}><strong style={{ fontWeight: 700, color: '#1A1A1A' }}>Schema:</strong> {scene.schema_version || 'v6.0'}</div>
              <div style={{ fontSize: 13 }}><strong style={{ fontWeight: 700, color: '#1A1A1A' }}>Duration:</strong> {(getDurationInFrames() / fps).toFixed(1)}s</div>
              <div style={{ fontSize: 13 }}><strong style={{ fontWeight: 700, color: '#1A1A1A' }}>FPS:</strong> {fps} fps</div>
            </div>
          </div>
        </div>
        
        {/* JSON Viewer */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 800,
              fontFamily: '"Permanent Marker", cursive',
              color: '#1A1A1A',
              margin: 0
            }}>
              📋 Scene JSON
            </h3>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowJSON(!showJSON)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#2196F3',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12
                }}
              >
                {showJSON ? '👁️ Hide' : '👁️ Show'}
              </button>
              
              <button
                onClick={handleCopyJSON}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#9C27B0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12
                }}
              >
                📋 Copy
              </button>
              
              <button
                onClick={handleDownloadJSON}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#FF9800',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 12
                }}
              >
                💾 Download
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
