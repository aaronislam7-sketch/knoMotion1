/**
 * KnoSlides Preview
 * 
 * Dev environment for previewing the 3 behaviour-driven slide templates.
 * Supports both:
 * - NEW: Unified SlideRenderer with JSON-driven content blocks
 * - LEGACY: Original template components (for comparison)
 * 
 * Templates:
 * - Build & Verify: teaches how something works + how to do it
 * - Flow Simulator: teaches systems, processes, causality
 * - Repair the Model: teaches debugging, judgement, common mistakes
 */

import React, { useState, useEffect } from 'react';

// Import unified renderer and blocks
import { SlideRenderer } from '../../../KnoSlides/src/core/SlideRenderer';
import { initializeBlocks } from '../../../KnoSlides/src/blocks';

// Import legacy behaviour-driven templates
import { BuildAndVerifySlide } from '../../../KnoSlides/src/templates/BuildAndVerify';
import { FlowSimulatorSlide } from '../../../KnoSlides/src/templates/FlowSimulator';
import { RepairTheModelSlide } from '../../../KnoSlides/src/templates/RepairTheModel';

// Import legacy example data
import buildAndVerifyLegacy from '../../../KnoSlides/preview/build-and-verify-inner-join.json';
import flowSimulatorLegacy from '../../../KnoSlides/preview/flow-simulator-api-auth.json';
import repairModelLegacy from '../../../KnoSlides/preview/repair-model-python-bug.json';

// Import unified schema example data
import buildAndVerifyUnified from '../../../KnoSlides/preview/build-and-verify-inner-join-unified.json';
import flowSimulatorUnified from '../../../KnoSlides/preview/flow-simulator-api-auth-unified.json';
import repairModelUnified from '../../../KnoSlides/preview/repair-model-python-bug-unified.json';

// Initialize blocks on module load
initializeBlocks();

const TEMPLATES = {
  'build-verify': {
    name: 'Build & Verify',
    description: 'INNER JOIN',
    Component: BuildAndVerifySlide,
    legacyData: buildAndVerifyLegacy,
    unifiedData: buildAndVerifyUnified,
    color: 'bg-blue-500',
  },
  'flow-simulator': {
    name: 'Flow Simulator',
    description: 'API Auth',
    Component: FlowSimulatorSlide,
    legacyData: flowSimulatorLegacy,
    unifiedData: flowSimulatorUnified,
    color: 'bg-purple-500',
  },
  'repair-model': {
    name: 'Repair the Model',
    description: 'Python Bug',
    Component: RepairTheModelSlide,
    legacyData: repairModelLegacy,
    unifiedData: repairModelUnified,
    color: 'bg-amber-500',
  },
};

export const SlidesPreview = () => {
  const [activeTemplate, setActiveTemplate] = useState('build-verify');
  const [renderMode, setRenderMode] = useState('unified'); // 'unified' | 'legacy'
  const template = TEMPLATES[activeTemplate];

  const handleComplete = () => {
    console.log('Slide completed!');
  };

  // Get the appropriate data based on render mode
  const getData = () => {
    return renderMode === 'unified' ? template.unifiedData : template.legacyData;
  };

  // Render based on mode
  const renderContent = () => {
    if (renderMode === 'unified') {
      return (
        <SlideRenderer
          slide={template.unifiedData}
          onStepChange={(index) => console.log('Step changed:', index)}
          onComplete={handleComplete}
          onEvent={(event) => console.log('Event:', event)}
        />
      );
    } else {
      return (
        <template.Component 
          data={template.legacyData} 
          onComplete={handleComplete}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Template Selection */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">KnoSlides</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                Phase 4 Complete
              </span>
            </div>
            
            {/* Render Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Render Mode:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setRenderMode('unified')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${renderMode === 'unified'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  ✨ Unified
                </button>
                <button
                  onClick={() => setRenderMode('legacy')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${renderMode === 'legacy'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  📦 Legacy
                </button>
              </div>
            </div>
          </div>
          
          {/* Template Toggle Buttons */}
          <div className="flex items-center gap-2">
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-200
                  ${activeTemplate === key
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                <span className={`w-2 h-2 rounded-full ${tmpl.color}`} />
                <span>{tmpl.name}</span>
                <span className={`text-xs ${activeTemplate === key ? 'text-gray-300' : 'text-gray-400'}`}>
                  ({tmpl.description})
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Template Info Bar */}
      <div className={`border-b px-6 py-3 ${
        renderMode === 'unified' 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100' 
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'
      }`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              renderMode === 'unified'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {renderMode === 'unified' ? 'Unified Schema' : 'Legacy Template'}
            </span>
            <span className={`font-medium ${renderMode === 'unified' ? 'text-indigo-900' : 'text-amber-900'}`}>
              Learning: {getData().learningObjective || getData().concept?.learningObjective}
            </span>
          </div>
          <div className={renderMode === 'unified' ? 'text-indigo-600' : 'text-amber-600'}>
            Enables: {getData().enablesNext || getData().concept?.enablesNext}
          </div>
        </div>
      </div>

      {/* Template Render Area */}
      <main className="py-4" key={`${activeTemplate}-${renderMode}`}>
        {renderContent()}
      </main>

      {/* Footer Legend */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
              <span>Explain Phase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" />
              <span>Guided Phase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span>Construct Phase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Outcome Phase</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {renderMode === 'unified' 
              ? 'Using SlideRenderer + BlockRegistry' 
              : 'Using legacy template components'
            }
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SlidesPreview;
