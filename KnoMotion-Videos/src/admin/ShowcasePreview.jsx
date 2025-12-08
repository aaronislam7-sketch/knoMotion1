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
// TikTok Viral Videos
import {
  TikTok_BrainLies,
  TIKTOK_BRAINLIES_DURATION,
} from '../compositions/TikTok_BrainLies';
import {
  TikTok_ADHDOverpowered,
  TIKTOK_ADHDOVERPOWERED_DURATION,
} from '../compositions/TikTok_ADHDOverpowered';
import {
  TikTok_80msDelay,
  TIKTOK_80MSDELAY_DURATION,
} from '../compositions/TikTok_80msDelay';

// Mapping from ShowcasePreview keys to Remotion composition IDs
const COMPOSITION_ID_MAP = {
  tiktokBrainLies: 'TikTokBrainLies',
  tiktokADHD: 'TikTokADHDOverpowered',
  tiktok80ms: 'TikTok80msDelay',
  knodovia1: 'KnodoviaAccidentalArrival',
  knodovia2: 'KnodoviaCulture',
  knodovia3: 'KnodoviaEconomics',
  knodovia1Mobile: 'KnodoviaAccidentalArrivalMobile',
  knodovia2Mobile: 'KnodoviaCultureMobile',
  knodovia3Mobile: 'KnodoviaEconomicsMobile',
};

/**
 * Render Command Box Component
 * Shows the CLI command to render the current composition
 */
const RenderCommandBox = ({ compositionKey, compositions }) => {
  const [copied, setCopied] = React.useState(false);
  
  const compositionId = COMPOSITION_ID_MAP[compositionKey];
  const comp = compositions[compositionKey];
  
  if (!compositionId) {
    return (
      <div style={{
        background: '#333',
        padding: 12,
        borderRadius: 6,
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#888',
      }}>
        Rendering not available for this composition
      </div>
    );
  }
  
  const outputFile = `out/${compositionId.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}.mp4`;
  const command = `npx remotion render KnoMotion-Videos/src/remotion/index.ts ${compositionId} ${outputFile}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: '#1e1e1e',
        padding: 14,
        borderRadius: 6,
        fontFamily: 'ui-monospace, monospace',
        fontSize: 13,
        color: '#4ade80',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ color: '#888' }}>$</span> {command}
      </div>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '6px 12px',
          background: copied ? '#22c55e' : '#444',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12,
          transition: 'background 0.2s',
        }}
      >
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
      <div style={{ 
        marginTop: 10, 
        fontSize: 12, 
        color: '#666',
        display: 'flex',
        gap: 20,
      }}>
        <span>📐 {comp.width}×{comp.height}</span>
        <span>⏱️ {Math.round(comp.duration / comp.fps)}s</span>
        <span>📁 {outputFile}</span>
      </div>
    </div>
  );
};

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
    // =========================================================================
    // TIKTOK VIRAL VIDEOS
    // =========================================================================
    tiktokBrainLies: {
      component: TikTok_BrainLies,
      duration: TIKTOK_BRAINLIES_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `🎬 TikTok: Brain Lies (~${Math.round(TIKTOK_BRAINLIES_DURATION / 30)}s)`,
    },
    tiktokADHD: {
      component: TikTok_ADHDOverpowered,
      duration: TIKTOK_ADHDOVERPOWERED_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `🎬 TikTok: ADHD Overpowered (~${Math.round(TIKTOK_ADHDOVERPOWERED_DURATION / 30)}s)`,
    },
    tiktok80ms: {
      component: TikTok_80msDelay,
      duration: TIKTOK_80MSDELAY_DURATION,
      width: 1080,
      height: 1920,
      fps: 30,
      name: `🎬 TikTok: 80ms Delay (~${Math.round(TIKTOK_80MSDELAY_DURATION / 30)}s)`,
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

        {/* Download Panel */}
        <div style={{
          marginTop: 40,
          padding: 20,
          backgroundColor: '#1a3a1a',
          borderRadius: 8,
          border: '1px solid #2d5a2d',
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 15, color: '#4ade80' }}>
            📥 Download as MP4
          </h3>
          <p style={{ color: '#aaa', marginBottom: 15, fontSize: 14 }}>
            Render the current composition locally (no cloud costs). Run in terminal:
          </p>
          <RenderCommandBox compositionKey={selectedComp} compositions={compositions} />
          <p style={{ color: '#666', marginTop: 15, fontSize: 12 }}>
            First time? Run <code style={{ background: '#333', padding: '2px 6px', borderRadius: 4 }}>npm install</code> to install render dependencies.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 20,
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
