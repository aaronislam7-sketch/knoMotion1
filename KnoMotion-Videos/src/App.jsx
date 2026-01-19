import React, { useState } from 'react';
import { ShowcasePreview } from './admin/ShowcasePreview';
import { SceneBuilder } from './admin/builder';

/**
 * KnoMotion Videos - Main Application
 * 
 * Entry point with two views:
 * 1. JSON Builder - Visual editor for creating scene JSON configurations
 * 2. Showcase Preview - Preview and QA rendered videos
 * 
 * Toggle between views using the header button.
 */
export default function App() {
  const [activeView, setActiveView] = useState('builder'); // 'builder' | 'preview'

  // If in builder mode, render the full SceneBuilder (which has its own layout)
  if (activeView === 'builder') {
    return (
      <div className="relative">
        {/* Floating toggle button */}
        <button
          onClick={() => setActiveView('preview')}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🎬</span> Switch to Preview
        </button>
        <SceneBuilder />
      </div>
    );
  }

  // Preview mode with toggle back to builder
  return (
    <div className="relative">
      {/* Floating toggle button */}
      <button
        onClick={() => setActiveView('builder')}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
      >
        <span>🔧</span> Switch to Builder
      </button>
      <ShowcasePreview />
    </div>
  );
}
