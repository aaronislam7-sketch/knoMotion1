/**
 * KnoSlides Preview
 * 
 * Minimal dev environment for previewing KnoSlides templates.
 * Templates render at 95% viewport width for maximum real estate.
 */

import React, { useState } from 'react';

// Import templates from KnoSlides
import { LayeredDeepDive } from '../../../KnoSlides/src/templates/LayeredDeepDive';
import { AnatomyExplorer } from '../../../KnoSlides/src/templates/AnatomyExplorer';
import { RelationshipMap } from '../../../KnoSlides/src/templates/RelationshipMap';
import { ScenarioSandbox } from '../../../KnoSlides/src/templates/ScenarioSandbox';

// Import example data
import layeredDeepDiveExample from '../../../KnoSlides/preview/layered-deep-dive-example.json';
import anatomyExplorerExample from '../../../KnoSlides/preview/anatomy-explorer-example.json';
import relationshipMapExample from '../../../KnoSlides/preview/relationship-map-example.json';
import scenarioSandboxExample from '../../../KnoSlides/preview/scenario-sandbox-example.json';

const TEMPLATES = {
  'deep-dive': {
    name: 'Deep Dive',
    Component: LayeredDeepDive,
    data: layeredDeepDiveExample,
  },
  'anatomy': {
    name: 'Anatomy',
    Component: AnatomyExplorer,
    data: anatomyExplorerExample,
  },
  'mind-map': {
    name: 'Mind Map',
    Component: RelationshipMap,
    data: relationshipMapExample,
  },
  'scenario': {
    name: 'Scenario',
    Component: ScenarioSandbox,
    data: scenarioSandboxExample,
  },
};

export const SlidesPreview = () => {
  const [activeTemplate, setActiveTemplate] = useState('deep-dive');
  const template = TEMPLATES[activeTemplate];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header with Template Toggles */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">KnoSlides</span>
          
          {/* Template Toggle Buttons */}
          <div className="flex items-center gap-1">
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTemplate === key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Template Render Area - 95% VW */}
      <main 
        className="mx-auto py-8"
        style={{ width: '95vw', maxWidth: '95vw' }}
      >
        <template.Component data={template.data} />
      </main>
    </div>
  );
};

export default SlidesPreview;
