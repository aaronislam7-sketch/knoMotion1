import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ShowcaseMain } from '../compositions/ShowcaseMain';
import { ShowcaseScene1_IntroValueProp } from '../compositions/ShowcaseScene1_IntroValueProp';
import { ShowcaseScene2_ArchitectureDeepDive } from '../compositions/ShowcaseScene2_ArchitectureDeepDive';
import { ShowcaseScene3_LayoutShowcase } from '../compositions/ShowcaseScene3_LayoutShowcase';
import { ShowcaseScene4_FeatureShowcaseCTA } from '../compositions/ShowcaseScene4_FeatureShowcaseCTA';
import { ShowcaseScene5_LayoutEngineTest } from '../compositions/ShowcaseScene5_LayoutEngineTest';
import { ShowcaseScene6_MidSceneHeroText } from '../compositions/ShowcaseScene6_MidSceneHeroText';
import { ShowcaseScene7_MidSceneCardSequence } from '../compositions/ShowcaseScene7_MidSceneCardSequence';
import { ContinuousAnimationShowcase } from '../compositions/ContinuousAnimationShowcase';

/**
 * Showcase Preview Tool
 * 
 * Preview all showcase compositions:
 * - Individual scenes (for review/QA)
 * - Full showcase (master composition)
 * - Continuous animations showcase
 */
export const ShowcasePreview = () => {
  const [selectedComp, setSelectedComp] = useState('full');

  const compositions = {
    full: {
      component: ShowcaseMain,
      duration: 6300, // 210 seconds @ 30fps
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Full Showcase (3.5 minutes)',
    },
    scene1: {
      component: ShowcaseScene1_IntroValueProp,
      duration: 1350, // 45 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 1: Intro + Value Prop (45s)',
    },
    scene2: {
      component: ShowcaseScene2_ArchitectureDeepDive,
      duration: 1800, // 60 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 2: Architecture Deep Dive (60s)',
    },
    scene3: {
      component: ShowcaseScene3_LayoutShowcase,
      duration: 1350, // 45 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 3: Layout Showcase (45s)',
    },
    scene4: {
      component: ShowcaseScene4_FeatureShowcaseCTA,
      duration: 1800, // 60 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 4: Feature Showcase + CTA (60s)',
    },
    scene5: {
      component: ShowcaseScene5_LayoutEngineTest,
      duration: 900, // 30 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 5: Layout Engine Test (30s)',
    },
    scene6: {
      component: ShowcaseScene6_MidSceneHeroText,
      duration: 300, // 10 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 6: Mid-Scene HeroTextEntranceExit (10s)',
    },
    scene7: {
      component: ShowcaseScene7_MidSceneCardSequence,
      duration: 300, // 10 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Scene 7: Mid-Scene CardSequence (10s)',
    },
    animations: {
      component: ContinuousAnimationShowcase,
      duration: 900, // 30 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Continuous Animation Showcase (30s)',
    },
  };

  const current = compositions[selectedComp];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 10 }}>
            🎬 KnoMotion Showcase Preview
          </h1>
          <p style={{ fontSize: 18, color: '#999' }}>
            Preview and QA all showcase compositions
          </p>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: 10, 
          marginBottom: 30, 
          flexWrap: 'wrap' 
        }}>
          {Object.entries(compositions).map(([key, comp]) => (
            <button
              key={key}
              onClick={() => setSelectedComp(key)}
              style={{
                padding: '12px 20px',
                fontSize: 16,
                fontWeight: selectedComp === key ? 700 : 400,
                backgroundColor: selectedComp === key ? '#FF6B35' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedComp !== key) {
                  e.target.style.backgroundColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedComp !== key) {
                  e.target.style.backgroundColor = '#333';
                }
              }}
            >
              {comp.name}
            </button>
          ))}
        </div>

        {/* Info Panel */}
        <div style={{
          backgroundColor: '#2a2a2a',
          padding: 20,
          borderRadius: 8,
          marginBottom: 30,
        }}>
          <h3 style={{ fontSize: 20, marginBottom: 10 }}>
            {current.name}
          </h3>
          <div style={{ display: 'flex', gap: 30, color: '#aaa' }}>
            <div>
              <strong>Duration:</strong> {Math.round(current.duration / current.fps)}s ({current.duration} frames)
            </div>
            <div>
              <strong>Resolution:</strong> {current.width}x{current.height}
            </div>
            <div>
              <strong>FPS:</strong> {current.fps}
            </div>
          </div>
        </div>

        {/* Player */}
        <div style={{
          backgroundColor: '#000',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <Player
            key={selectedComp}
            component={current.component}
            inputProps={{}}
            durationInFrames={current.duration}
            compositionWidth={current.width}
            compositionHeight={current.height}
            fps={current.fps}
            controls
            style={{
              width: '100%',
              aspectRatio: `${current.width}/${current.height}`,
            }}
          />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40,
          padding: 20,
          backgroundColor: '#2a2a2a',
          borderRadius: 8,
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>
            🎯 QA Checklist
          </h3>
          <ul style={{ color: '#aaa', lineHeight: 1.8 }}>
            <li>✅ All animations smooth and timed correctly</li>
            <li>✅ Text readable at all times</li>
            <li>✅ Colors consistent with KNODE_THEME</li>
            <li>✅ No visual glitches or stutters</li>
            <li>✅ Transitions smooth between scenes</li>
            <li>✅ Typography and spacing clean</li>
            <li>✅ Full showcase duration: 3.5 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
