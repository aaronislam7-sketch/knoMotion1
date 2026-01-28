/**
 * KnoSlides Preview
 * 
 * Preview environment for KnoSlides interactive templates.
 * Integrates with the main KnoMotion app for unified development.
 */

import React, { useState } from 'react';

// Import templates from KnoSlides (sibling directory)
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
  'layered-deep-dive': {
    name: 'Layered Deep Dive',
    description: 'Progressive depth exploration - learners choose how deep to go',
    Component: LayeredDeepDive,
    data: layeredDeepDiveExample,
    color: 'bg-purple-500',
  },
  'anatomy-explorer': {
    name: 'Anatomy Explorer',
    description: 'Deconstruct complex systems by exploring component parts',
    Component: AnatomyExplorer,
    data: anatomyExplorerExample,
    color: 'bg-blue-500',
  },
  'relationship-map': {
    name: 'Relationship Map',
    description: 'Visualize and explore connections between concepts',
    Component: RelationshipMap,
    data: relationshipMapExample,
    color: 'bg-green-500',
  },
  'scenario-sandbox': {
    name: 'Scenario Sandbox',
    description: 'Manipulate variables and see different outcomes',
    Component: ScenarioSandbox,
    data: scenarioSandboxExample,
    color: 'bg-orange-500',
  },
};

const VIEWPORTS = {
  desktop: { width: '100%', maxWidth: '1280px', label: 'Desktop' },
  tablet: { width: '768px', maxWidth: '768px', label: 'Tablet' },
  mobile: { width: '375px', maxWidth: '375px', label: 'Mobile' },
};

export const SlidesPreview = () => {
  const [activeTemplate, setActiveTemplate] = useState('layered-deep-dive');
  const [viewport, setViewport] = useState('desktop');

  const template = TEMPLATES[activeTemplate];
  const viewportConfig = VIEWPORTS[viewport];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📑</span> KnoSlides Preview
              </h1>
              <p className="text-sm text-gray-500">Interactive Learning Templates</p>
            </div>
            
            {/* Viewport Toggle */}
            <div className="flex items-center gap-2">
              {Object.entries(VIEWPORTS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setViewport(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewport === key
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Template Selector */}
        <aside className="w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Templates
          </h2>
          <nav className="space-y-2">
            {Object.entries(TEMPLATES).map(([key, tmpl]) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  activeTemplate === key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${tmpl.color}`} />
                  <span className="font-medium">{tmpl.name}</span>
                </div>
                <p className={`text-xs mt-1 ${
                  activeTemplate === key ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {tmpl.description}
                </p>
              </button>
            ))}
          </nav>

          {/* Template Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              About KnoSlides
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Interactive templates for deep learning. Each template serves a specific 
              pedagogical purpose that video content cannot achieve.
            </p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                ✓ JSON-driven content<br/>
                ✓ Framer Motion animations<br/>
                ✓ Responsive design<br/>
                ✓ Shares KNODE_THEME
              </p>
            </div>
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div 
            className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
            style={{ 
              width: viewportConfig.width,
              maxWidth: viewportConfig.maxWidth,
            }}
          >
            {/* Template Render */}
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              <template.Component data={template.data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SlidesPreview;
