/**
 * KnoSlides Preview
 * 
 * Dev environment for previewing the 3 behaviour-driven slide templates
 * using the unified SlideRenderer architecture.
 * 
 * Architecture:
 * - SlideRenderer: Main orchestrator from KnoSlides/src/core/
 * - BlockRegistry: Maps block types to React components
 * - Unified JSON: Content defined in KnoSlides/preview/*.json
 * 
 * Templates:
 * - Build & Verify: teaches how something works + how to do it
 * - Flow Simulator: teaches systems, processes, causality
 * - Repair the Model: teaches debugging, judgement, common mistakes
 */

import React, { useState } from 'react';

// Core unified renderer from KnoSlides
import { SlideRenderer } from '../../../KnoSlides/src/core/SlideRenderer';
import { initializeBlocks } from '../../../KnoSlides/src/blocks';

// Unified schema example data (JSON-driven content)
import buildAndVerifyData from '../../../KnoSlides/preview/build-and-verify-inner-join.json';
import flowSimulatorData from '../../../KnoSlides/preview/flow-simulator-api-auth.json';
import repairModelData from '../../../KnoSlides/preview/repair-model-python-bug.json';

// Initialize blocks on module load
initializeBlocks();

const TEMPLATES = {
  'build-verify': {
    name: 'Build & Verify',
    description: 'INNER JOIN',
    data: buildAndVerifyData,
    color: 'bg-blue-500',
  },
  'flow-simulator': {
    name: 'Flow Simulator',
    description: 'API Auth',
    data: flowSimulatorData,
    color: 'bg-purple-500',
  },
  'repair-model': {
    name: 'Repair the Model',
    description: 'Python Bug',
    data: repairModelData,
    color: 'bg-amber-500',
  },
};

export const SlidesPreview = () => {
  const [activeTemplate, setActiveTemplate] = useState('build-verify');
  const template = TEMPLATES[activeTemplate];

  const handleComplete = () => {
    console.log('Slide completed!');
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
                Unified Architecture
              </span>
            </div>
            <div className="text-sm text-gray-500">
              3 Behaviour-Driven Templates
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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-indigo-900">
              Learning: {template.data.concept?.learningObjective}
            </span>
          </div>
          <div className="text-indigo-600">
            Enables: {template.data.concept?.enablesNext}
          </div>
        </div>
      </div>

      {/* Template Render Area - Using Unified SlideRenderer */}
      <main className="py-4" key={activeTemplate}>
        <SlideRenderer
          slide={template.data}
          onStepChange={(index) => console.log('Step changed:', index)}
          onComplete={handleComplete}
          onEvent={(event) => console.log('Event:', event)}
        />
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
            Powered by SlideRenderer + BlockRegistry
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SlidesPreview;
