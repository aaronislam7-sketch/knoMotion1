import React, { useState } from 'react';
import { ShowcasePreview } from './admin/ShowcasePreview';
import { SceneBuilder } from './admin/builder';
import { SlidesPreview } from './admin/SlidesPreview';

/**
 * KnoMotion - Main Application
 * 
 * Entry point with three views:
 * 1. JSON Builder - Visual editor for creating scene JSON configurations
 * 2. Video Preview - Preview and QA rendered videos
 * 3. Slides Preview - Preview KnoSlides interactive templates
 * 
 * Toggle between views using the header buttons.
 */
export default function App() {
  const [activeView, setActiveView] = useState('builder'); // 'builder' | 'preview' | 'slides'

  // Navigation buttons component
  const NavButtons = ({ current }) => (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {current !== 'builder' && (
        <button
          onClick={() => setActiveView('builder')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🔧</span> Builder
        </button>
      )}
      {current !== 'preview' && (
        <button
          onClick={() => setActiveView('preview')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🎬</span> Videos
        </button>
      )}
      {current !== 'slides' && (
        <button
          onClick={() => setActiveView('slides')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>📑</span> Slides
        </button>
      )}
    </div>
  );

  // Builder mode
  if (activeView === 'builder') {
    return (
      <div className="relative">
        <NavButtons current="builder" />
        <SceneBuilder />
      </div>
    );
  }

  // Video Preview mode
  if (activeView === 'preview') {
    return (
      <div className="relative">
        <NavButtons current="preview" />
        <ShowcasePreview />
      </div>
    );
  }

  // Slides Preview mode
  return (
    <div className="relative">
      <NavButtons current="slides" />
      <SlidesPreview />
    </div>
  );
}
