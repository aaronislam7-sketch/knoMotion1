import { useState } from 'react';
import { VideoWizard } from './components/VideoWizard';
import { Player } from '@remotion/player';
import { TemplateRouter } from './templates/TemplateRouter';
import { StyleTokensProvider } from './sdk/StyleTokensProvider';
import { DebugOverlay } from './components/DebugOverlay';

// Import v5 scene examples
import hookSleepScienceScene from './scenes/hook_sleep_science.json';
import explainGrowthMindsetScene from './scenes/explain_growth_mindset.json';
import applyGrowthMindsetScene from './scenes/apply_growth_mindset.json';
import reflectGrowthMindsetScene from './scenes/reflect_growth_mindset.json';

// Import Blueprint v5.0 scenes
import hook1AV5Scene from './scenes/hook_1a_knodovia_map_v5.json';
import hook1EV5Scene from './scenes/hook_1e_mystery_v5.json';
import explain2AV5Scene from './scenes/explain_2a_breakdown_v5.json';
import explain2BV5Scene from './scenes/explain_2b_analogy_v5.json';
import apply3AV5Scene from './scenes/apply_3a_quiz_v5.json';
import apply3BV5Scene from './scenes/apply_3b_scenario_v5.json';
import reflect4AV5Scene from './scenes/reflect_4a_takeaways_v5.json';
import reflect4DV5Scene from './scenes/reflect_4d_forward_v5.json';

// Template mapping - all v5 templates route through TemplateRouter
const templateMap = {
  // v5 template keys
  'hook_1a_v5': TemplateRouter,
  'hook_1e_v5': TemplateRouter,
  'explain_2a_v5': TemplateRouter,
  'explain_2b_v5': TemplateRouter,
  'apply_3a_v5': TemplateRouter,
  'apply_3b_v5': TemplateRouter,
  'reflect_4a_v5': TemplateRouter,
  'reflect_4d_v5': TemplateRouter,
  
  // v5 template_id values from JSON
  'Hook1AQuestionBurst': TemplateRouter,
  'Hook1EAmbientMystery': TemplateRouter,
  'Explain2AConceptBreakdown': TemplateRouter,
  'Explain2BAnalogy': TemplateRouter,
  'Apply3AMicroQuiz': TemplateRouter,
  'Apply3BScenarioChoice': TemplateRouter,
  'Reflect4AKeyTakeaways': TemplateRouter,
  'Reflect4DForwardLink': TemplateRouter,
  
  // Legacy fallbacks (for old scenes)
  'hook': TemplateRouter,
  'explain': TemplateRouter,
  'apply': TemplateRouter,
  'reflect': TemplateRouter,
};

const sampleScenes = {
  // Blueprint v5.0 scenes
  'hook_1a_v5': hook1AV5Scene,
  'hook_1e_v5': hook1EV5Scene,
  'explain_2a_v5': explain2AV5Scene,
  'explain_2b_v5': explain2BV5Scene,
  'apply_3a_v5': apply3AV5Scene,
  'apply_3b_v5': apply3BV5Scene,
  'reflect_4a_v5': reflect4AV5Scene,
  'reflect_4d_v5': reflect4DV5Scene,
  
  // Example scenes
  'hook_example': hookSleepScienceScene,
  'explain_example': explainGrowthMindsetScene,
  'apply_example': applyGrowthMindsetScene,
  'reflect_example': reflectGrowthMindsetScene,
};

// Scene validation function
const validateScene = (scene) => {
  const errors = [];
  
  try {
    const schemaVersion = scene.schema_version || '5.0';
    const isV5 = schemaVersion.startsWith('5.');
    
    // Check required fields
    if (!scene.template_id) {
      errors.push('Missing required field: template_id');
    }
    
    // v5.0 uses beats, v4 uses duration_s/fps/timeline
    if (isV5) {
      if (!scene.beats) {
        errors.push('Missing required field: beats (v5.0 schema)');
      }
      if (!scene.fill) {
        errors.push('Missing required field: fill (v5.0 schema)');
      }
    } else {
      // Legacy schema validation
      if (!scene.duration_s) {
        errors.push('Missing required field: duration_s');
      }
      if (!scene.fill) {
        errors.push('Missing required field: fill');
      }
    }
    
    // Check if template exists
    if (scene.template_id && !templateMap[scene.template_id]) {
      errors.push(`Unknown template_id: ${scene.template_id}. Valid v5 templates: Hook1AQuestionBurst, Hook1EAmbientMystery, Explain2AConceptBreakdown, Explain2BAnalogy, Apply3AMicroQuiz, Apply3BScenarioChoice, Reflect4AKeyTakeaways, Reflect4DForwardLink`);
    }
    
  } catch (e) {
    errors.push(`Validation error: ${e.message}`);
  }
  
  return errors;
};

export default function App() {
  const [mode, setMode] = useState('wizard'); // 'wizard' or 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState('hook_1a_v5');
  const [sceneJSON, setSceneJSON] = useState(JSON.stringify(hook1AV5Scene, null, 2));
  const [currentScene, setCurrentScene] = useState(hook1AV5Scene);
  const [validationErrors, setValidationErrors] = useState([]);
  const [jsonError, setJsonError] = useState(null);
  
  // Handle template change
  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    const newScene = sampleScenes[templateId];
    setSceneJSON(JSON.stringify(newScene, null, 2));
    setCurrentScene(newScene);
    setValidationErrors([]);
    setJsonError(null);
  };
  
  // Handle JSON edit and apply
  const handleApplyJSON = () => {
    try {
      const parsed = JSON.parse(sceneJSON);
      
      // Check if v5.0 schema
      const isV5 = parsed.schema_version?.startsWith('5.');
      
      // Add default layout if missing
      if (!parsed.layout) {
        parsed.layout = {
          canvas: { w: 1920, h: 1080 }
        };
      }
      
      const errors = validateScene(parsed);
      
      setValidationErrors(errors);
      setJsonError(null);
      
      if (errors.length === 0) {
        setCurrentScene(parsed);
        setSelectedTemplate(parsed.template_id);
      }
    } catch (e) {
      setJsonError(`Invalid JSON: ${e.message}`);
    }
  };
  
  const Component = templateMap[currentScene.template_id] || TemplateRouter;

  // Calculate duration and FPS for v5.0 scenes
  const isV5 = currentScene.schema_version?.startsWith('5.');
  const fps = 30; // v5 standard
  
  // For v5, calculate duration from beats
  let durationInFrames;
  if (isV5) {
    if (currentScene.beats && currentScene.beats.exit !== undefined) {
      const totalSeconds = currentScene.beats.exit + 0.5; // Add tail padding
      durationInFrames = Math.round(totalSeconds * fps);
    } else {
      durationInFrames = 15 * fps; // Default 15s for v5
    }
  } else {
    durationInFrames = Math.round((currentScene.duration_s || 30) * fps);
  }
  
  const [playerKey, setPlayerKey] = useState(0);
  
  // Reload player
  const handleReloadPlayer = () => {
    setPlayerKey(prev => prev + 1);
  };

  // Render wizard mode by default
  if (mode === 'wizard') {
    return (
      <div style={{ position: 'relative' }}>
        <VideoWizard />
        {/* Mode toggle button */}
        <button
          onClick={() => setMode('preview')}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '10px 20px',
            fontSize: 13,
            backgroundColor: '#732282',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(115, 34, 130, 0.3)',
            zIndex: 9999
          }}
        >
          Switch to Scene Preview
        </button>
      </div>
    );
  }
  
  // Single-scene preview mode
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
          🎬 KnoMotion Videos - Blueprint v5.0
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          fontSize: 14,
          color: '#666'
        }}>
          JSON-driven video templates for educational content
        </p>
      </header>
      
      {/* Template Selector */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        <label style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#333'
        }}>
          Template:
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            borderRadius: 6,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <optgroup label="🌟 Blueprint v5.0 Templates">
            <option value="hook_1a_v5">🎯 Hook 1A: Question Burst (15s)</option>
            <option value="hook_1e_v5">🌫️ Hook 1E: Ambient Mystery (12s)</option>
            <option value="explain_2a_v5">📊 Explain 2A: Concept Breakdown (10s)</option>
            <option value="explain_2b_v5">🔄 Explain 2B: Analogy (12s)</option>
            <option value="apply_3a_v5">✅ Apply 3A: Micro Quiz (12s)</option>
            <option value="apply_3b_v5">🛤️ Apply 3B: Scenario Choice (11s)</option>
            <option value="reflect_4a_v5">💡 Reflect 4A: Key Takeaways (8s)</option>
            <option value="reflect_4d_v5">➡️ Reflect 4D: Forward Link (10s)</option>
          </optgroup>
          <optgroup label="📚 Example Scenes">
            <option value="hook_example">Hook Example: Sleep Science</option>
            <option value="explain_example">Explain Example: Growth Mindset</option>
            <option value="apply_example">Apply Example: Growth Mindset</option>
            <option value="reflect_example">Reflect Example: Growth Mindset</option>
          </optgroup>
        </select>
        
        <div style={{ flex: 1 }} />

        <button
          onClick={() => setMode('wizard')}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#732282',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Switch to Wizard Mode
        </button>
        
        <div style={{
          fontSize: 12,
          color: '#666'
        }}>
          {(durationInFrames / fps).toFixed(1)}s • {fps} fps • 1920×1080
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#333'
            }}>
              Scene JSON
            </h2>
            <button
              onClick={handleApplyJSON}
              style={{
                padding: '8px 20px',
                fontSize: 14,
                fontWeight: 600,
                backgroundColor: '#732282',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a1b66'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#732282'}
            >
              Apply Changes
            </button>
          </div>
          
          <textarea
            value={sceneJSON}
            onChange={(e) => setSceneJSON(e.target.value)}
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
          {(jsonError || validationErrors.length > 0) && (
            <div style={{
              borderTop: '1px solid #e0e0e0',
              padding: 20,
              backgroundColor: '#fff3cd',
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              {jsonError && (
                <div style={{
                  color: '#721c24',
                  backgroundColor: '#f8d7da',
                  padding: '8px 12px',
                  borderRadius: 4,
                  fontSize: 13,
                  marginBottom: 8
                }}>
                  <strong>JSON Error:</strong> {jsonError}
                </div>
              )}
              
              {validationErrors.map((error, index) => (
                <div
                  key={index}
                  style={{
                    color: '#856404',
                    fontSize: 13,
                    marginBottom: 6,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8
                  }}
                >
                  <span style={{ color: '#f39c12' }}>⚠</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
          
          {validationErrors.length === 0 && !jsonError && (
            <div style={{
              borderTop: '1px solid #e0e0e0',
              padding: '12px 20px',
              backgroundColor: '#d4edda',
              color: '#155724',
              fontSize: 13
            }}>
              <span style={{ color: '#28a745', marginRight: 8 }}>✓</span>
              Scene validated successfully (v5.0)
            </div>
          )}
        </div>
        
        {/* Right Panel - Preview */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8f8f8',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40
        }}>
          {/* Reload Button */}
          <button
            onClick={handleReloadPlayer}
            style={{
              marginBottom: 16,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: '#E74C3C',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(231, 76, 60, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#C0392B';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#E74C3C';
              e.target.style.transform = 'translateY(0)';
            }}
            title="Reload player to reset animations"
          >
            🔄 Reload Player
          </button>
          
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            {/* Main Player */}
            <Player
              key={playerKey}
              component={Component}
              inputProps={{ scene: currentScene }}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={1920}
              compositionHeight={1080}
              controls
              style={{
                width: '100%',
                maxWidth: 960,
                aspectRatio: '16/9'
              }}
            />

            {/* Debug Overlay */}
            <DebugOverlay 
              scene={currentScene}
              templateId={currentScene.template_id}
            />
          </div>

          {/* Meta Info */}
          <div style={{
            marginTop: 24,
            padding: '12px 24px',
            backgroundColor: '#fff',
            borderRadius: 6,
            fontSize: 13,
            color: '#666',
            textAlign: 'center'
          }}>
            <strong>{currentScene.meta?.title || 'Untitled Scene'}</strong>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              {currentScene.meta?.tags?.slice(0, 3).join(' • ') || 'Blueprint v5.0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
