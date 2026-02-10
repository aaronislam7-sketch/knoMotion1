import React, { useState } from 'react';
import { ShowcasePreview } from './admin/ShowcasePreview';
import { SceneBuilder } from './admin/builder';
import { SlidesPreview } from './admin/SlidesPreview';
import { SlideBuilder } from './admin/slides-builder/SlideBuilder';

/**
 * KnoMotion - Main Application
 * 
 * Entry point with four views:
 * 1. Video Builder - Visual editor for creating video scene JSON configurations
 * 2. Video Preview - Preview and QA rendered videos
 * 3. Slides Preview - Preview KnoSlides interactive templates (local KnoSlides source)
 * 4. Slide Builder - Visual editor for unified KnoSlides JSON
 * 
 * Toggle between views using the header buttons.
 */
export default function App() {
  const resolveInitialView = () => {
    if (typeof window === 'undefined') return 'builder';
    const raw = new URLSearchParams(window.location.search).get('view');
    const aliases = {
      builder: 'builder',
      'video-builder': 'builder',
      preview: 'preview',
      videos: 'preview',
      slides: 'slides',
      'slides-preview': 'slides',
      'slide-builder': 'slide-builder',
    };
    return aliases[raw] || 'builder';
  };

  const [activeView, setActiveView] = useState(resolveInitialView); // 'builder' | 'preview' | 'slides' | 'slide-builder'

  const navigateView = (view) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('view', view);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  // Navigation buttons component
  const NavButtons = ({ current }) => (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {current !== 'builder' && (
        <button
          onClick={() => navigateView('builder')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🔧</span> Video Builder
        </button>
      )}
      {current !== 'preview' && (
        <button
          onClick={() => navigateView('preview')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🎬</span> Video Preview
        </button>
      )}
      {current !== 'slides' && (
        <button
          onClick={() => navigateView('slides')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>📑</span> Slides Preview
        </button>
      )}
      {current !== 'slide-builder' && (
        <button
          onClick={() => navigateView('slide-builder')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg transition-colors flex items-center gap-2"
        >
          <span>🧱</span> Slide Builder
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
  if (activeView === 'slides') {
    return (
      <div className="relative">
        <NavButtons current="slides" />
        <SlidesPreview />
      </div>
    );
  }

  // Slide Builder mode
  return (
    <div className="relative">
      <NavButtons current="slide-builder" />
      <SlideBuilder />
    </div>
  );
}
