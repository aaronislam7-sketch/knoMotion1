/**
 * JsonOutput - JSON Output with Validation
 * 
 * Displays the generated JSON with validation errors
 * and provides export functionality.
 */
import React, { useState, useMemo } from 'react';

// Validation rules
const validateScene = (scene, index) => {
  const errors = [];
  const warnings = [];
  
  // Scene-level validation
  if (!scene.id || scene.id.trim() === '') {
    errors.push({ path: `scenes[${index}].id`, message: 'Scene ID is required' });
  }
  
  if (!scene.durationInFrames || scene.durationInFrames < 30) {
    errors.push({ path: `scenes[${index}].durationInFrames`, message: 'Duration must be at least 1 second (30 frames)' });
  }
  
  // Layout validation
  if (!scene.config?.layout?.type) {
    errors.push({ path: `scenes[${index}].config.layout`, message: 'Layout type is required' });
  }
  
  // Slots validation
  const slots = scene.config?.slots;
  if (!slots || Object.keys(slots).length === 0) {
    errors.push({ path: `scenes[${index}].config.slots`, message: 'At least one slot must be configured' });
  } else {
    Object.entries(slots).forEach(([slotName, slotConfig]) => {
      const configs = Array.isArray(slotConfig) ? slotConfig : [slotConfig];
      
      configs.forEach((config, msIndex) => {
        const basePath = `scenes[${index}].slots.${slotName}${configs.length > 1 ? `[${msIndex}]` : ''}`;
        
        // Mid-scene type validation
        if (!config.midScene) {
          errors.push({ path: basePath, message: 'Mid-scene type is required' });
        }
        
        // sideBySide layout warning
        if (config.midScene === 'sideBySide' && scene.config?.layout?.type !== 'full') {
          warnings.push({ 
            path: basePath, 
            message: 'sideBySide should use layout: full (it creates its own internal columns)' 
          });
        }
        
        // Beats validation
        const msConfig = config.config;
        if (msConfig) {
          // TextReveal lines need beats
          if (config.midScene === 'textReveal' && msConfig.lines) {
            msConfig.lines.forEach((line, lineIndex) => {
              if (!line.beats || line.beats.start === undefined) {
                warnings.push({
                  path: `${basePath}.config.lines[${lineIndex}]`,
                  message: 'Line should have beats.start defined'
                });
              }
              if (line.beats && line.beats.start !== undefined && line.beats.exit !== undefined) {
                if (line.beats.start >= line.beats.exit) {
                  errors.push({
                    path: `${basePath}.config.lines[${lineIndex}].beats`,
                    message: 'beats.start must be less than beats.exit'
                  });
                }
                // Check if exit exceeds duration
                const sceneDurationSeconds = scene.durationInFrames / 30;
                if (line.beats.exit > sceneDurationSeconds) {
                  warnings.push({
                    path: `${basePath}.config.lines[${lineIndex}].beats`,
                    message: `beats.exit (${line.beats.exit}s) exceeds scene duration (${sceneDurationSeconds}s)`
                  });
                }
              }
            });
          }
          
          // HeroText needs beats
          if (config.midScene === 'heroText') {
            if (!msConfig.beats || (msConfig.beats.entrance === undefined && msConfig.beats.start === undefined)) {
              warnings.push({
                path: `${basePath}.config.beats`,
                message: 'heroText should have beats.entrance defined'
              });
            }
          }
          
          // Checklist items validation
          if (config.midScene === 'checklist' && msConfig.items) {
            if (msConfig.items.length === 0) {
              errors.push({
                path: `${basePath}.config.items`,
                message: 'Checklist must have at least one item'
              });
            }
          }
          
          // GridCards validation
          if (config.midScene === 'gridCards' && msConfig.cards) {
            if (msConfig.cards.length === 0) {
              errors.push({
                path: `${basePath}.config.cards`,
                message: 'Grid must have at least one card'
              });
            }
          }
        }
      });
    });
  }
  
  return { errors, warnings };
};

const validateScenes = (scenes) => {
  const allErrors = [];
  const allWarnings = [];
  
  if (!scenes || scenes.length === 0) {
    allErrors.push({ path: 'scenes', message: 'At least one scene is required' });
    return { errors: allErrors, warnings: allWarnings };
  }
  
  // Check for duplicate IDs
  const ids = scenes.map(s => s.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicates.length > 0) {
    allErrors.push({ path: 'scenes', message: `Duplicate scene IDs: ${[...new Set(duplicates)].join(', ')}` });
  }
  
  scenes.forEach((scene, index) => {
    const { errors, warnings } = validateScene(scene, index);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  });
  
  return { errors: allErrors, warnings: allWarnings };
};

export const JsonOutput = ({ scenes, format }) => {
  const [copied, setCopied] = useState(false);
  
  const { errors, warnings } = useMemo(() => validateScenes(scenes), [scenes]);
  const isValid = errors.length === 0;
  
  // Clean the scenes for output (remove any internal fields)
  const cleanedScenes = useMemo(() => {
    return scenes.map(scene => {
      const cleaned = JSON.parse(JSON.stringify(scene));
      // Add format to config if mobile
      if (format === 'mobile') {
        cleaned.config.format = 'mobile';
      }
      return cleaned;
    });
  }, [scenes, format]);
  
  const jsonOutput = JSON.stringify(cleanedScenes, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scenes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">JSON Output</h2>
          <p className="text-gray-500 mt-1">
            {scenes.length} scene{scenes.length !== 1 ? 's' : ''} • 
            {format === 'mobile' ? ' Mobile 1080×1920' : ' Desktop 1920×1080'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isValid ? (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
              <span>✓</span> Valid JSON
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm">
              <span>✕</span> {errors.length} error{errors.length !== 1 ? 's' : ''}
            </span>
          )}
          
          <button
            onClick={handleCopy}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isValid
                ? copied
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy JSON'}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isValid
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Download
          </button>
        </div>
      </div>
      
      {/* Validation Results */}
      {(errors.length > 0 || warnings.length > 0) && (
        <div className="mb-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <span>⛔</span> Errors ({errors.length})
              </h3>
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-300">
                    <code className="text-red-400 bg-red-500/20 px-1 rounded">{error.path}</code>
                    <span className="text-gray-400 mx-2">—</span>
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {warnings.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span> Warnings ({warnings.length})
              </h3>
              <ul className="space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-yellow-300">
                    <code className="text-yellow-400 bg-yellow-500/20 px-1 rounded">{warning.path}</code>
                    <span className="text-gray-400 mx-2">—</span>
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* JSON Output */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-700/50 border-b border-gray-700">
          <span className="text-sm text-gray-400 font-mono">scenes.json</span>
          <span className="text-xs text-gray-500">{jsonOutput.length} characters</span>
        </div>
        <pre className="p-4 overflow-auto max-h-[60vh] text-sm">
          <code className="text-gray-300">{jsonOutput}</code>
        </pre>
      </div>
      
      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">How to Use</h3>
        <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
          <li>Copy the JSON above</li>
          <li>Open a composition file in <code className="bg-gray-700 px-1 rounded">src/compositions/</code></li>
          <li>Replace the <code className="bg-gray-700 px-1 rounded">scenes</code> array with your JSON</li>
          <li>Toggle to ShowcasePreview to see the result</li>
        </ol>
        
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Example usage in .jsx file:</div>
          <pre className="text-xs text-gray-400 overflow-x-auto">
{`const scenes = ${jsonOutput.slice(0, 100)}...

export const MyVideo = () => {
  return (
    <AbsoluteFill>
      <Series>
        {scenes.map((scene, index) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneTransitionWrapper transition={scene.transition}>
              <SceneFromConfig config={scene.config} />
            </SceneTransitionWrapper>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonOutput;
