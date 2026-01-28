/**
 * KnoSlides Development Preview App
 * 
 * Allows testing and previewing templates with example data.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from './hooks';

// Template imports (will be uncommented as templates are built)
// import { LayeredDeepDive } from './templates/LayeredDeepDive';
// import { AnatomyExplorer } from './templates/AnatomyExplorer';
// import { RelationshipMap } from './templates/RelationshipMap';
// import { ScenarioSandbox } from './templates/ScenarioSandbox';

// Example data imports
import layeredDeepDiveExample from '../preview/layered-deep-dive-example.json';
// import anatomyExplorerExample from '../preview/anatomy-explorer-example.json';
// import relationshipMapExample from '../preview/relationship-map-example.json';
// import scenarioSandboxExample from '../preview/scenario-sandbox-example.json';

type TemplateName = 'layered-deep-dive' | 'anatomy-explorer' | 'relationship-map' | 'scenario-sandbox';
type ViewportPreset = 'desktop' | 'tablet' | 'mobile' | 'responsive';

const VIEWPORT_SIZES: Record<Exclude<ViewportPreset, 'responsive'>, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

const TEMPLATE_INFO: Record<TemplateName, { name: string; description: string; available: boolean }> = {
  'layered-deep-dive': {
    name: 'Layered Deep Dive',
    description: 'Progressive depth exploration - learners choose how deep to go',
    available: false, // Will be true once built
  },
  'anatomy-explorer': {
    name: 'Anatomy Explorer',
    description: 'Deconstruct complex systems by exploring component parts',
    available: false,
  },
  'relationship-map': {
    name: 'Relationship Map',
    description: 'Visualize and explore connections between concepts',
    available: false,
  },
  'scenario-sandbox': {
    name: 'Scenario Sandbox',
    description: 'Manipulate variables and see different outcomes',
    available: false,
  },
};

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>('layered-deep-dive');
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>('responsive');
  const responsive = useResponsive();

  const templateInfo = TEMPLATE_INFO[activeTemplate];

  const renderTemplate = () => {
    // Placeholder until templates are built
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-kno-surface">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-header text-kno-ink mb-2">
            {templateInfo.name}
          </h2>
          <p className="text-kno-ink-soft mb-4">
            {templateInfo.description}
          </p>
          <p className="text-sm text-kno-ink-muted">
            Template coming soon...
          </p>
        </div>
      </div>
    );

    // Uncomment as templates are built:
    // switch (activeTemplate) {
    //   case 'layered-deep-dive':
    //     return <LayeredDeepDive data={layeredDeepDiveExample} />;
    //   case 'anatomy-explorer':
    //     return <AnatomyExplorer data={anatomyExplorerExample} />;
    //   case 'relationship-map':
    //     return <RelationshipMap data={relationshipMapExample} />;
    //   case 'scenario-sandbox':
    //     return <ScenarioSandbox data={scenarioSandboxExample} />;
    //   default:
    //     return null;
    // }
  };

  const getPreviewStyle = (): React.CSSProperties => {
    if (viewportPreset === 'responsive') {
      return { width: '100%', height: '100%' };
    }
    const size = VIEWPORT_SIZES[viewportPreset];
    return {
      width: size.width,
      height: size.height,
      maxWidth: '100%',
      margin: '0 auto',
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display text-kno-ink">
                KnoSlides
              </h1>
              <p className="text-sm text-kno-ink-soft">
                Interactive Learning Templates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-kno-ink-muted">
                {responsive.viewportType} ({responsive.width}px)
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Template Selector */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-sm font-semibold text-kno-ink mb-3">
                Templates
              </h2>
              <nav className="space-y-1">
                {(Object.keys(TEMPLATE_INFO) as TemplateName[]).map((key) => {
                  const info = TEMPLATE_INFO[key];
                  const isActive = activeTemplate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTemplate(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-kno-primary text-white'
                          : 'text-kno-ink hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{info.name}</div>
                      {!info.available && (
                        <span className="text-xs opacity-60">Coming soon</span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <hr className="my-4 border-gray-200" />

              <h2 className="text-sm font-semibold text-kno-ink mb-3">
                Viewport
              </h2>
              <div className="space-y-1">
                {(['responsive', 'desktop', 'tablet', 'mobile'] as ViewportPreset[]).map(
                  (preset) => (
                    <button
                      key={preset}
                      onClick={() => setViewportPreset(preset)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        viewportPreset === preset
                          ? 'bg-gray-100 text-kno-ink font-medium'
                          : 'text-kno-ink-soft hover:bg-gray-50'
                      }`}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                      {preset !== 'responsive' && (
                        <span className="text-xs text-kno-ink-muted ml-2">
                          ({VIEWPORT_SIZES[preset].width}px)
                        </span>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>
          </aside>

          {/* Main Preview Area */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-kno-ink">
                      {templateInfo.name}
                    </h2>
                    <p className="text-sm text-kno-ink-soft">
                      {templateInfo.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        templateInfo.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {templateInfo.available ? 'Ready' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div
                className="bg-gray-50 p-4 overflow-auto"
                style={{ minHeight: 500 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTemplate}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                    style={getPreviewStyle()}
                  >
                    {renderTemplate()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
