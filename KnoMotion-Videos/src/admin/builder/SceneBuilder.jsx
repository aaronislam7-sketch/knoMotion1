/**
 * SceneBuilder - Main JSON Builder Interface
 * 
 * Visual editor for creating valid KnoMotion scene JSON configurations.
 * Allows users to:
 * - Set number of scenes (upfront + dynamic add/remove)
 * - Configure each scene: layout, background, slots, mid-scenes
 * - Preview visual elements (layouts, lotties, presets)
 * - Export valid JSON
 */
import React, { useState, useCallback } from 'react';
import { SceneEditor } from './SceneEditor';
import { JsonOutput } from './JsonOutput';

// Default scene template
const createDefaultScene = (index) => ({
  id: `scene-${index + 1}`,
  durationInFrames: 150,
  transition: { type: 'fade' },
  config: {
    background: { preset: 'sunriseGradient' },
    layout: { type: 'full', options: { padding: 60 } },
    slots: {
      full: {
        midScene: 'textReveal',
        stylePreset: 'playful',
        config: {
          lines: [
            { text: 'Your text here', emphasis: 'high', beats: { start: 0.5, exit: 4.0 } }
          ],
          revealType: 'typewriter',
        }
      }
    }
  }
});

export const SceneBuilder = () => {
  const [scenes, setScenes] = useState([createDefaultScene(0)]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [format, setFormat] = useState('mobile'); // 'desktop' | 'mobile'

  // Scene management
  const addScene = useCallback(() => {
    setScenes(prev => [...prev, createDefaultScene(prev.length)]);
    setActiveSceneIndex(scenes.length);
  }, [scenes.length]);

  const removeScene = useCallback((index) => {
    if (scenes.length <= 1) return;
    setScenes(prev => prev.filter((_, i) => i !== index));
    setActiveSceneIndex(prev => Math.min(prev, scenes.length - 2));
  }, [scenes.length]);

  const duplicateScene = useCallback((index) => {
    const sceneToCopy = scenes[index];
    const newScene = {
      ...JSON.parse(JSON.stringify(sceneToCopy)),
      id: `scene-${scenes.length + 1}-copy`
    };
    setScenes(prev => [...prev.slice(0, index + 1), newScene, ...prev.slice(index + 1)]);
    setActiveSceneIndex(index + 1);
  }, [scenes]);

  const updateScene = useCallback((index, updatedScene) => {
    setScenes(prev => prev.map((s, i) => i === index ? updatedScene : s));
  }, []);

  const moveScene = useCallback((fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= scenes.length) return;
    
    setScenes(prev => {
      const newScenes = [...prev];
      [newScenes[fromIndex], newScenes[toIndex]] = [newScenes[toIndex], newScenes[fromIndex]];
      return newScenes;
    });
    setActiveSceneIndex(toIndex);
  }, [scenes.length]);

  // Initial scene count setup
  const [hasSetInitialCount, setHasSetInitialCount] = useState(false);
  const [initialCountInput, setInitialCountInput] = useState(1);

  const handleSetInitialCount = () => {
    const count = Math.max(1, Math.min(20, initialCountInput));
    const newScenes = Array.from({ length: count }, (_, i) => createDefaultScene(i));
    setScenes(newScenes);
    setHasSetInitialCount(true);
  };

  // Initial setup screen
  if (!hasSetInitialCount) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-center">KnoMotion Builder</h1>
          <p className="text-gray-400 text-center mb-8">Visual JSON Scene Editor</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormat('mobile')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    format === 'mobile' 
                      ? 'border-orange-500 bg-orange-500/20 text-orange-300' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">📱</div>
                  <div className="font-medium">Mobile</div>
                  <div className="text-xs text-gray-400">1080×1920</div>
                </button>
                <button
                  onClick={() => setFormat('desktop')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    format === 'desktop' 
                      ? 'border-orange-500 bg-orange-500/20 text-orange-300' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">🖥️</div>
                  <div className="font-medium">Desktop</div>
                  <div className="text-xs text-gray-400">1920×1080</div>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How many scenes?
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={initialCountInput}
                  onChange={(e) => setInitialCountInput(parseInt(e.target.value) || 1)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:border-orange-500 focus:outline-none"
                />
                <button
                  onClick={handleSetInitialCount}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
                >
                  Start Building
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">You can add or remove scenes later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-orange-400">KnoMotion Builder</h1>
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {format === 'mobile' ? '📱 Mobile 1080×1920' : '🖥️ Desktop 1920×1080'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJsonOutput(!showJsonOutput)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showJsonOutput 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {showJsonOutput ? '← Back to Editor' : 'View JSON Output →'}
            </button>
          </div>
        </div>
      </div>

      {showJsonOutput ? (
        <JsonOutput scenes={scenes} format={format} />
      ) : (
        <div className="flex h-[calc(100vh-60px)]">
          {/* Scene List Sidebar */}
          <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-300">Scenes</h2>
                <span className="text-xs text-gray-500">{scenes.length} total</span>
              </div>
              <button
                onClick={addScene}
                className="w-full py-2 px-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span>+</span> Add Scene
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  className={`group rounded-lg transition-all cursor-pointer ${
                    index === activeSceneIndex 
                      ? 'bg-orange-500/20 border border-orange-500/50' 
                      : 'hover:bg-gray-700/50 border border-transparent'
                  }`}
                >
                  <div 
                    className="p-3"
                    onClick={() => setActiveSceneIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">{index + 1}</span>
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {scene.id}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{scene.config.layout.type}</span>
                      <span>•</span>
                      <span>{Math.round(scene.durationInFrames / 30)}s</span>
                    </div>
                  </div>
                  
                  {/* Scene actions */}
                  <div className={`flex items-center justify-between px-3 pb-2 ${
                    index === activeSceneIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } transition-opacity`}>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveScene(index, -1); }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveScene(index, 1); }}
                        disabled={index === scenes.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateScene(index); }}
                        className="p-1 text-gray-400 hover:text-blue-400"
                        title="Duplicate"
                      >
                        ⧉
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeScene(index); }}
                        disabled={scenes.length <= 1}
                        className="p-1 text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 overflow-y-auto">
            {scenes[activeSceneIndex] && (
              <SceneEditor
                scene={scenes[activeSceneIndex]}
                sceneIndex={activeSceneIndex}
                format={format}
                onChange={(updated) => updateScene(activeSceneIndex, updated)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneBuilder;
