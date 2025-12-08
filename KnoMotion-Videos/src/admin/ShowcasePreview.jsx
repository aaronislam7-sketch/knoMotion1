import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { ShowcaseMain } from '../compositions/ShowcaseMain';
import { ContinuousAnimationShowcase } from '../compositions/ContinuousAnimationShowcase';
import { CanonShowerVideo } from '../compositions/CanonShowerVideo';
import {
  KnodoviaAccidentalArrival,
  KNODOVIA_VIDEO1_DURATION,
} from '../compositions/KnodoviaVideo1_AccidentalArrival';
import {
  KnodoviaAccidentalArrivalMobile,
  KNODOVIA_VIDEO1_MOBILE_DURATION,
} from '../compositions/KnodoviaVideo1_Mobile';
import {
  KnodoviaCultureAnthro,
  KNODOVIA_VIDEO2_DURATION,
} from '../compositions/KnodoviaVideo2_Culture';
import {
  KnodoviaCultureMobile,
  KNODOVIA_VIDEO2_MOBILE_DURATION,
} from '../compositions/KnodoviaVideo2_Mobile';
import {
  KnodoviaEconomics,
  KNODOVIA_VIDEO3_DURATION,
} from '../compositions/KnodoviaVideo3_Economics';
import {
  KnodoviaEconomicsMobile,
  KNODOVIA_VIDEO3_MOBILE_DURATION,
} from '../compositions/KnodoviaVideo3_Mobile';
import { LottieDebugTest } from '../compositions/LottieDebugTest';

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
    knodovia1: {
      component: KnodoviaAccidentalArrival,
      duration: KNODOVIA_VIDEO1_DURATION,
      width: 1920,
      height: 1080,
      fps: 30,
      name: `Knodovia 1: Accidental Arrival (~${Math.round(
        KNODOVIA_VIDEO1_DURATION / 30,
      )}s)`,
    },
    knodovia1Mobile: {
      component: KnodoviaAccidentalArrivalMobile,
      duration: KNODOVIA_VIDEO1_MOBILE_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `📱 Knodovia 1: Mobile (${Math.round(
        KNODOVIA_VIDEO1_MOBILE_DURATION / 30,
      )}s)`,
    },
    knodovia2: {
      component: KnodoviaCultureAnthro,
      duration: KNODOVIA_VIDEO2_DURATION,
      width: 1920,
      height: 1080,
      fps: 30,
      name: `Knodovia 2: Culture (~${Math.round(
        KNODOVIA_VIDEO2_DURATION / 30,
      )}s)`,
    },
    knodovia2Mobile: {
      component: KnodoviaCultureMobile,
      duration: KNODOVIA_VIDEO2_MOBILE_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `📱 Knodovia 2: Culture Mobile (${Math.round(
        KNODOVIA_VIDEO2_MOBILE_DURATION / 30,
      )}s)`,
    },
    knodovia3: {
      component: KnodoviaEconomics,
      duration: KNODOVIA_VIDEO3_DURATION,
      width: 1920,
      height: 1080,
      fps: 30,
      name: `Knodovia 3: Economics (~${Math.round(
        KNODOVIA_VIDEO3_DURATION / 30,
      )}s)`,
    },
    knodovia3Mobile: {
      component: KnodoviaEconomicsMobile,
      duration: KNODOVIA_VIDEO3_MOBILE_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `📱 Knodovia 3: Economics Mobile (${Math.round(
        KNODOVIA_VIDEO3_MOBILE_DURATION / 30,
      )}s)`,
    },
    animations: {
      component: ContinuousAnimationShowcase,
      duration: 900, // 30 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: 'Continuous Animation Showcase (30s)',
    },
    canonShower: {
      component: CanonShowerVideo,
      duration: 3600, // 120 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: '🚿 Canon: Shower Video (2 min)',
    },
    lottieDebug: {
      component: LottieDebugTest,
      duration: 300, // 10 seconds
      width: 1920,
      height: 1080,
      fps: 30,
      name: '🔧 Lottie Debug Test',
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
