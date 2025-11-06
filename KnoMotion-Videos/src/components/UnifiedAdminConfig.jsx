import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { TemplateRouter } from '../templates/TemplateRouter';
import { TemplateGallery } from './TemplateGallery';
import { Reveal9Config } from './configs/Reveal9Config';
import { Guide10Config } from './configs/Guide10Config';
import { Compare11Config } from './configs/Compare11Config';

// Import example scenes
import reveal9Example from '../scenes/reveal_9_progressive_unveil_example.json';
import guide10Example from '../scenes/guide_10_step_sequence_example.json';
import compare11Example from '../scenes/compare_11_before_after_example.json';

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
  'Compare11BeforeAfter': compare11Example
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
            <br />Only the 3 new V6 templates have config panels currently.
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
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24,
      padding: 24,
      minHeight: '100vh',
      backgroundColor: '#F0F2F5'
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
            fontSize: 14,
            color: '#666',
            margin: 0,
            lineHeight: 1.5
          }}>
            Select a template, configure it visually, and see real-time changes.
            <br />
            <strong>Currently available:</strong> Reveal9, Guide10, Compare11 (more coming soon!)
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
            backgroundColor: '#000000'
          }}>
            <Player
              key={playerKey}
              component={TemplateRouter}
              inputProps={{ scene }}
              durationInFrames={300}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              style={{
                width: '100%',
                height: 'auto'
              }}
              controls
              loop
            />
          </div>
          
          {/* Meta Info */}
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            fontSize: 12,
            color: '#666'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><strong>Template:</strong> {selectedTemplateId}</div>
              <div><strong>Schema:</strong> {scene.schema_version || 'N/A'}</div>
              <div><strong>Dimensions:</strong> 1920×1080</div>
              <div><strong>FPS:</strong> 30</div>
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
