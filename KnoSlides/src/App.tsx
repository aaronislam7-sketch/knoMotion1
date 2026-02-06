/**
 * KnoSlides Standalone Development Preview
 * 
 * This is a minimal dev entry point for testing KnoSlides in isolation.
 * For the full preview experience, use KnoMotion-Videos.
 * 
 * Usage: npm run dev (from KnoSlides folder)
 */

import React, { useState } from 'react';
import { SlideRenderer } from './core/SlideRenderer';
import { initializeBlocks } from './blocks';
import type { KnoSlide } from './types/unified-schema';

// Import example data
import buildAndVerifyData from '../preview/build-and-verify-inner-join.json';
import flowSimulatorData from '../preview/flow-simulator-api-auth.json';
import repairModelData from '../preview/repair-model-python-bug.json';

// Initialize blocks
initializeBlocks();

type TemplateName = 'build-verify' | 'flow-simulator' | 'repair-model';

const TEMPLATES: Record<TemplateName, { name: string; data: KnoSlide }> = {
  'build-verify': {
    name: 'Build & Verify (INNER JOIN)',
    data: buildAndVerifyData as unknown as KnoSlide,
  },
  'flow-simulator': {
    name: 'Flow Simulator (API Auth)',
    data: flowSimulatorData as unknown as KnoSlide,
  },
  'repair-model': {
    name: 'Repair the Model (Python Bug)',
    data: repairModelData as unknown as KnoSlide,
  },
};

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>('build-verify');
  const template = TEMPLATES[activeTemplate];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simple header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">KnoSlides Dev</h1>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              Unified
            </span>
          </div>
          <div className="flex gap-2">
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key as TemplateName)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTemplate === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Render area */}
      <main key={activeTemplate}>
        <SlideRenderer
          slide={template.data}
          onStepChange={(index) => console.log('Step:', index)}
          onComplete={() => console.log('Complete!')}
          onEvent={(event) => console.log('Event:', event)}
        />
      </main>
    </div>
  );
}
