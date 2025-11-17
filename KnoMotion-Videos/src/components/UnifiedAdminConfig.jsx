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
import { Hook1AConfig } from './configs/Hook1AConfig';
import { Hook1EConfig } from './configs/Hook1EConfig';
import { Explain2AConfig } from './configs/Explain2AConfig';
import { Apply3AConfig } from './configs/Apply3AConfig';
import { Explain2BConfig } from './configs/Explain2BConfig';
import { Apply3BConfig } from './configs/Apply3BConfig';
import { Reflect4AConfig } from './configs/Reflect4AConfig';
import { Reflect4DConfig } from './configs/Reflect4DConfig';
import { EZ } from '../sdk';

// Import templates directly to access their getDuration functions
import * as Reveal9Module from '../templates/v6/Reveal9ProgressiveUnveil_V6';
import * as Guide10Module from '../templates/v6/Guide10StepSequence_V6';
import * as Compare11Module from '../templates/v6/Compare11BeforeAfter_V6';

// NEW: Learning Content Pipeline Templates (Nov 2025)
import * as Compare12Module from '../templates/v6/Compare12MatrixGrid_V6';
import * as Challenge13Module from '../templates/v6/Challenge13PollQuiz_V6';
import * as Spotlight14Module from '../templates/v6/Spotlight14SingleConcept_V6';
import * as Connect15Module from '../templates/v6/Connect15AnalogyBridge_V6';
import * as Quote16Module from '../templates/v6/Quote16Showcase_V6';
import * as Progress18Module from '../templates/v6/Progress18Path_V6';
import * as Hook1AModule from '../templates/v6/Hook1AQuestionBurst_V6';
import * as Hook1EModule from '../templates/v6/Hook1EAmbientMystery_V6';
import * as Explain2AModule from '../templates/v6/Explain2AConceptBreakdown_V6';
import * as Apply3AModule from '../templates/v6/Apply3AMicroQuiz_V6';
import * as Explain2BModule from '../templates/v6/Explain2BAnalogy_V6';
import * as Apply3BModule from '../templates/v6/Apply3BScenarioChoice_V6';
import * as Reflect4AModule from '../templates/v6/Reflect4AKeyTakeaways_V6';
import * as Reflect4DModule from '../templates/v6/Reflect4DForwardLink_V6';

// Import example scenes
import reveal9Example from '../scenes/examples/reveal_9_progressive_unveil_example.json';
import guide10Example from '../scenes/examples/guide_10_step_sequence_example.json';
import compare11Example from '../scenes/examples/compare_11_before_after_example.json';

// NEW: Example scenes for new templates
import compare12Example from '../scenes/examples/compare_12_matrix_example.json';
import challenge13Example from '../scenes/examples/challenge_13_poll_quiz_example.json';
import spotlight14Example from '../scenes/examples/spotlight_14_single_concept_example.json';
import connect15Example from '../scenes/examples/connect_15_analogy_bridge_example.json';
import quote16Example from '../scenes/examples/quote_16_showcase_example.json';
import progress18Example from '../scenes/examples/progress_18_path_example.json';
import hook1AExample from '../scenes/v6/hook_1a_question_burst_v6.json';
import hook1EExample from '../scenes/v6/hook_1e_ambient_mystery_v6.json';
import explain2AExample from '../scenes/v6/explain_2a_concept_breakdown_v6.json';
import apply3AExample from '../scenes/v6/apply_3a_micro_quiz_v6.json';
import explain2BExample from '../scenes/v6/explain_2b_analogy_v6.json';
import apply3BExample from '../scenes/v6/apply_3b_scenario_choice_v6.json';
import reflect4AExample from '../scenes/v6/reflect_4a_key_takeaways_v6.json';
import reflect4DExample from '../scenes/v6/reflect_4d_forward_link_v6.json';

// Import TEST scenes (Revised templates)
import testConceptBreakdownRevised from '../scenes/examples/explain_2a_concept_breakdown_revised.json';
import testStepSequenceRevised from '../scenes/examples/guide_10_step_sequence_revised.json';
import testStepSequenceGrid from '../scenes/examples/guide_10_step_sequence_grid_layout.json';

// Import STAGING scenes (Templates under review)
import stagingHook1AUpgraded from '../scenes/examples/hook_1a_upgraded_example.json';
import stagingReflect4AEnhanced from '../scenes/v6/reflect_4a_deep_learning_enhanced.json';

// V7.0 Scene-Shell Templates (Dec 2025)
import * as FullFrameSceneModule from '../templates/v7/FullFrameScene';
import * as GridLayoutSceneModule from '../templates/v7/GridLayoutScene';
import * as StackLayoutSceneModule from '../templates/v7/StackLayoutScene';
import * as FlowLayoutSceneModule from '../templates/v7/FlowLayoutScene';
import * as SplitLayoutSceneModule from '../templates/v7/SplitLayoutScene';
import * as HubSpokeSceneModule from '../templates/v7/HubSpokeScene';
import * as ColumnLayoutSceneModule from '../templates/v7/ColumnLayoutScene';

import fullframeExample from '../scenes/v7/fullframe_example.json';
import gridlayoutExample from '../scenes/v7/gridlayout_example.json';
import stacklayoutExample from '../scenes/v7/stacklayout_example.json';
import flowlayoutExample from '../scenes/v7/flowlayout_example.json';
import splitlayoutExample from '../scenes/v7/splitlayout_example.json';
import hubspokeExample from '../scenes/v7/hubspoke_example.json';
import columnlayoutExample from '../scenes/v7/columnlayout_example.json';
import fullframeMinimal from '../scenes/v7/fullframe_minimal.json';

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
  'Progress18Path': progress18Example,
  
  // V5 to V6 Migrations (Nov 2025)
  'Hook1AQuestionBurst_V6': hook1AExample,
  'Hook1EAmbientMystery_V6': hook1EExample,
  'Explain2AConceptBreakdown_V6': explain2AExample,
  'Apply3AMicroQuiz_V6': apply3AExample,
  'Explain2BAnalogy_V6': explain2BExample,
  'Apply3BScenarioChoice_V6': apply3BExample,
  'Reflect4AKeyTakeaways_V6': reflect4AExample,
  'Reflect4DForwardLink_V6': reflect4DExample,
  
  // TEST: Revised Templates (Broadcast Quality)
  'TEST_Explain2AConceptBreakdown_V6': testConceptBreakdownRevised,
  'TEST_Guide10StepSequence_V6': testStepSequenceRevised,
  
  // STAGING: Templates Under Review
  'STAGING_Hook1AQuestionBurst_V6_Upgraded': stagingHook1AUpgraded,
  'STAGING_Reflect4AKeyTakeaways_V6_Enhanced': stagingReflect4AEnhanced,
  
  // V7.0 Scene-Shell Templates (Dec 2025)
  'FullFrameScene': fullframeExample,
  'GridLayoutScene': gridlayoutExample,
  'StackLayoutScene': stacklayoutExample,
  'FlowLayoutScene': flowlayoutExample,
  'SplitLayoutScene': splitlayoutExample,
  'HubSpokeScene': hubspokeExample,
  'ColumnLayoutScene': columnlayoutExample
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
      
      // V5 to V6 Migrations
      case 'Hook1AQuestionBurst_V6':
        return <Hook1AConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Hook1EAmbientMystery_V6':
        return <Hook1EConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Explain2AConceptBreakdown_V6':
        return <Explain2AConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Apply3AMicroQuiz_V6':
        return <Apply3AConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Explain2BAnalogy_V6':
        return <Explain2BConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Apply3BScenarioChoice_V6':
        return <Apply3BConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Reflect4AKeyTakeaways_V6':
        return <Reflect4AConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'Reflect4DForwardLink_V6':
        return <Reflect4DConfig scene={scene} onUpdate={handleSceneUpdate} />;
      
      // TEST: Revised Templates
      case 'TEST_Explain2AConceptBreakdown_V6':
        return <Explain2AConfig scene={scene} onUpdate={handleSceneUpdate} />;
      case 'TEST_Guide10StepSequence_V6':
        return <Guide10Config scene={scene} onUpdate={handleSceneUpdate} />;
      
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
      
      // V5 to V6 Migrations
      case 'Hook1AQuestionBurst_V6':
        return Hook1AModule.getDuration ? Hook1AModule.getDuration(scene, fps) : 450;
      case 'Hook1EAmbientMystery_V6':
        return Hook1EModule.getDuration ? Hook1EModule.getDuration(scene, fps) : 450;
      case 'Explain2AConceptBreakdown_V6':
        return Explain2AModule.getDuration ? Explain2AModule.getDuration(scene, fps) : 450;
      case 'Apply3AMicroQuiz_V6':
        return Apply3AModule.getDuration ? Apply3AModule.getDuration(scene, fps) : 450;
      case 'Explain2BAnalogy_V6':
        return Explain2BModule.getDuration ? Explain2BModule.getDuration(scene, fps) : 450;
      case 'Apply3BScenarioChoice_V6':
        return Apply3BModule.getDuration ? Apply3BModule.getDuration(scene, fps) : 450;
      case 'Reflect4AKeyTakeaways_V6':
        return Reflect4AModule.getDuration ? Reflect4AModule.getDuration(scene, fps) : 450;
      case 'Reflect4DForwardLink_V6':
        return Reflect4DModule.getDuration ? Reflect4DModule.getDuration(scene, fps) : 450;
      
      // TEST: Revised Templates
      case 'TEST_Explain2AConceptBreakdown_V6':
        return Explain2AModule.getDuration ? Explain2AModule.getDuration(scene, fps) : 450;
      case 'TEST_Guide10StepSequence_V6':
        return Guide10Module.getDuration ? Guide10Module.getDuration(scene, fps) : 450;
      
      // STAGING: Templates Under Review
      case 'STAGING_Hook1AQuestionBurst_V6_Upgraded':
        return Hook1AModule.getDuration ? Hook1AModule.getDuration(scene, fps) : 450;
      case 'STAGING_Reflect4AKeyTakeaways_V6_Enhanced':
        return Reflect4AModule.getDuration ? Reflect4AModule.getDuration(scene, fps) : 450;
      
      // V7.0 Scene-Shell Templates (Dec 2025)
      case 'FullFrameScene':
        return FullFrameSceneModule.getDuration ? FullFrameSceneModule.getDuration(scene, fps) : 450;
      case 'GridLayoutScene':
        return GridLayoutSceneModule.getDuration ? GridLayoutSceneModule.getDuration(scene, fps) : 450;
      case 'StackLayoutScene':
        return StackLayoutSceneModule.getDuration ? StackLayoutSceneModule.getDuration(scene, fps) : 450;
      case 'FlowLayoutScene':
        return FlowLayoutSceneModule.getDuration ? FlowLayoutSceneModule.getDuration(scene, fps) : 450;
      case 'SplitLayoutScene':
        return SplitLayoutSceneModule.getDuration ? SplitLayoutSceneModule.getDuration(scene, fps) : 450;
      case 'HubSpokeScene':
        return HubSpokeSceneModule.getDuration ? HubSpokeSceneModule.getDuration(scene, fps) : 450;
      case 'ColumnLayoutScene':
        return ColumnLayoutSceneModule.getDuration ? ColumnLayoutSceneModule.getDuration(scene, fps) : 450;
      
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
        height: 'calc(100vh - 48px)',
        paddingRight: 12
      }}>
        {/* Header - Compact */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0
        }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: '"Permanent Marker", cursive',
            color: '#1A1A1A',
            margin: 0
          }}>
            🎛️ Template Builder
          </h1>
        </div>
        
        {/* Template Gallery - Fixed Height */}
        <div style={{ flexShrink: 0 }}>
          <TemplateGallery
            onSelectTemplate={handleTemplateSelect}
            selectedTemplateId={selectedTemplateId}
          />
        </div>
        
        {/* Configuration Panel - Scrollable */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            flexShrink: 0
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
          
          <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            flex: 1,
            paddingRight: 8,
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #F7FAFC'
          }}>
            {renderConfigPanel()}
          </div>
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
