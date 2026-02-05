/**
 * KnoSlides Development Preview App
 * 
 * Allows testing and previewing templates with example data.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResponsive } from './hooks';

// Template imports
import { BuildAndVerifySlide } from './templates/BuildAndVerify';
import { FlowSimulatorSlide } from './templates/FlowSimulator';
import { RepairTheModelSlide } from './templates/RepairTheModel';

// Example data imports
import buildAndVerifyExample from '../preview/build-and-verify-inner-join.json';
import flowSimulatorExample from '../preview/flow-simulator-api-auth.json';
import repairTheModelExample from '../preview/repair-model-python-bug.json';

type TemplateName = 'build-and-verify' | 'flow-simulator' | 'repair-the-model';
type ViewportPreset = 'desktop' | 'tablet' | 'mobile' | 'responsive';

const VIEWPORT_SIZES: Record<Exclude<ViewportPreset, 'responsive'>, { width: number; height: number }> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

const TEMPLATE_INFO: Record<TemplateName, { name: string; description: string; available: boolean }> = {
  'build-and-verify': {
    name: 'Build & Verify',
    description: 'Teach how something works through guided construction',
    available: true,
  },
  'flow-simulator': {
    name: 'Flow Simulator',
    description: 'Teach systems, processes, and causality through flow exploration',
    available: true,
  },
  'repair-the-model': {
    name: 'Repair the Model',
    description: 'Teach debugging and judgement through error identification',
    available: true,
  },
};

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>('build-and-verify');
  const [viewportPreset, setViewportPreset] = useState<ViewportPreset>('responsive');
  const responsive = useResponsive();

  const templateInfo = TEMPLATE_INFO[activeTemplate];

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'build-and-verify':
        return <BuildAndVerifySlide data={buildAndVerifyExample as any} />;
      case 'flow-simulator':
        return <FlowSimulatorSlide data={flowSimulatorExample as any} />;
      case 'repair-the-model':
        return <RepairTheModelSlide data={repairTheModelExample as any} />;
      default:
        return (
          <div className="flex items-center justify-center h-full min-h-[400px] bg-slate-50">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {templateInfo.name}
              </h2>
              <p className="text-slate-600 mb-4">
                {templateInfo.description}
              </p>
              <p className="text-sm text-slate-400">
                Template coming soon...
              </p>
            </div>
          </div>
        );
    }
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
              <h1 className="text-2xl font-bold text-slate-800">
                KnoSlides
              </h1>
              <p className="text-sm text-slate-500">
                Interactive Learning Templates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
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
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
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
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-gray-100'
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

              <h2 className="text-sm font-semibold text-slate-800 mb-3">
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
                          ? 'bg-gray-100 text-slate-800 font-medium'
                          : 'text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                      {preset !== 'responsive' && (
                        <span className="text-xs text-slate-400 ml-2">
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
                    <h2 className="font-semibold text-slate-800">
                      {templateInfo.name}
                    </h2>
                    <p className="text-sm text-slate-500">
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
