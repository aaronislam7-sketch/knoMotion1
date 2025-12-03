/**
 * LottieDebugTest - Minimal test of Lottie integration
 * 
 * This test helps diagnose Lottie rendering issues by testing:
 * 1. Remote URL from LottieFiles (known working)
 * 2. Inline animation data from our registry
 * 3. Static file from public folder
 */

import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender } from 'remotion';
import { Lottie } from '@remotion/lottie';
import { 
  lightbulbAnimation, 
  checkmarkAnimation, 
  sparkleAnimation,
  resolveLottieSource,
  LOTTIE_REGISTRY
} from '../sdk/lottie/registry';

// Known working Lottie URL from LottieFiles (balloon animation)
const LOTTIE_FILES_URL = 'https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json';

/**
 * Test 1: Raw hardcoded animation data (simplest possible case)
 * 
 * Key fields that lottie-web REQUIRES:
 * - Root: v, fr, ip, op, w, h, nm, ddd, assets, layers
 * - Layer: ddd, ind, ty, nm, sr, ks, ip, op, st, bm
 */
const RawLottieTest = () => {
  // Minimal inline animation - just a circle that pulses
  // CRITICAL: Keyframes MUST include proper easing data (h, i, o) for smooth animation
  // See: https://lottiefiles.github.io/lottie-docs/concepts/#keyframe
  const simpleAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: "Simple Circle",
    ddd: 0,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { 
          a: 1, 
          k: [
            // Each keyframe needs: t (time), s (value), and either h:1 or easing curves (i, o)
            { t: 0, s: [100, 100, 100], o: { x: [0.33], y: [0] }, i: { x: [0.67], y: [1] } }, 
            { t: 30, s: [120, 120, 100], o: { x: [0.33], y: [0] }, i: { x: [0.67], y: [1] } },
            { t: 60, s: [100, 100, 100] }  // Last keyframe doesn't need easing
          ] 
        }
      },
      ao: 0,
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [60, 60] } },
          { ty: "fl", c: { a: 0, k: [0.2, 0.8, 0.4, 1] }, o: { a: 0, k: 100 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ],
        nm: "Circle Group"
      }]
    }],
    markers: []
  };

  return (
    <div style={{ width: 100, height: 100, border: '2px solid lime' }}>
      <Lottie 
        animationData={simpleAnimation} 
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

/**
 * Test: Fetched URL with delayRender pattern (Remotion official pattern)
 */
const FetchedLottieTest = ({ url, label }) => {
  const [handle] = useState(() => delayRender(`Loading: ${label || url}`));
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    console.log(`[FetchedLottie:${label}] Fetching: ${url}`);
    
    fetch(url)
      .then((res) => {
        console.log(`[FetchedLottie:${label}] Response status: ${res.status}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log(`[FetchedLottie:${label}] Loaded successfully, keys:`, Object.keys(json));
        setAnimationData(json);
        setStatus('loaded');
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`[FetchedLottie:${label}] Error:`, err);
        setError(err.message);
        setStatus('error');
        continueRender(handle); // Continue anyway to show error state
      });
  }, [handle, url, label]);

  const boxStyle = {
    width: 100, 
    height: 100, 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (status === 'error') {
    return (
      <div style={{ 
        ...boxStyle,
        border: '2px solid red', 
        color: 'red', 
        fontSize: 10, 
        textAlign: 'center', 
        padding: 4
      }}>
        Error: {error}
      </div>
    );
  }

  if (status === 'loading' || !animationData) {
    return (
      <div style={{ 
        ...boxStyle,
        border: '2px dashed yellow', 
        color: 'yellow', 
        fontSize: 10
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ ...boxStyle, border: '2px solid lime' }}>
      <Lottie 
        animationData={animationData} 
        loop={true}
        style={{ width: 80, height: 80 }}
      />
    </div>
  );
};

export const LottieDebugTest = () => {
  const frame = useCurrentFrame();

  // Debug: Check what staticFile returns
  const staticFileResult = staticFile('lotties/success-checkmark.json');
  
  // Debug: Check what's in the registry
  const checkmarkSource = resolveLottieSource('checkmark');
  const lightbulbSource = resolveLottieSource('education/lightbulb');

  // Log once at frame 0
  if (frame === 0) {
    console.log('=== LOTTIE DEBUG TEST ===');
    console.log('staticFile result:', staticFileResult);
    console.log('checkmark source:', checkmarkSource);
    console.log('lightbulb source:', lightbulbSource);
    console.log('Registry keys:', Object.keys(LOTTIE_REGISTRY));
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f0f23',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 15,
        fontFamily: 'system-ui, sans-serif',
        padding: 30,
        overflow: 'auto',
      }}
    >
      <div style={{ color: 'white', fontSize: 20 }}>Frame: {frame}</div>

      {/* Debug Info */}
      <div style={{ 
        backgroundColor: '#1a1a2e', 
        padding: 15, 
        borderRadius: 8, 
        fontSize: 12,
        color: '#888',
        maxWidth: 800,
        textAlign: 'left',
      }}>
        <div><strong>staticFile('lotties/success-checkmark.json'):</strong> {staticFileResult}</div>
        <div><strong>checkmark source kind:</strong> {checkmarkSource?.kind || 'null'}</div>
        <div><strong>lightbulb source kind:</strong> {lightbulbSource?.kind || 'null'}</div>
      </div>
      
      {/* Test 1: Raw Lottie component with hardcoded data */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#50fa7b', fontSize: 14, marginBottom: 5 }}>
          Test 1: Raw Lottie (hardcoded simple animation)
        </div>
        <RawLottieTest />
      </div>

      {/* Test 2: Registry inline animations (direct import) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#8be9fd', fontSize: 14, marginBottom: 5 }}>
          Test 2: Registry Inline Data (direct import)
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>lightbulb</div>
            <div style={{ width: 80, height: 80, border: '2px solid #8be9fd' }}>
              <Lottie 
                animationData={lightbulbAnimation} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>checkmark</div>
            <div style={{ width: 80, height: 80, border: '2px solid #8be9fd' }}>
              <Lottie 
                animationData={checkmarkAnimation} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>sparkle</div>
            <div style={{ width: 80, height: 80, border: '2px solid #8be9fd' }}>
              <Lottie 
                animationData={sparkleAnimation} 
                loop={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test 3: Remote URL (LottieFiles - known working) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f1fa8c', fontSize: 14, marginBottom: 5 }}>
          Test 3: Remote URL (LottieFiles)
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>lottiefiles.com</div>
          <FetchedLottieTest url={LOTTIE_FILES_URL} label="lottiefiles" />
        </div>
      </div>

      {/* Test 4: Fetched from static file URL */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#ff79c6', fontSize: 14, marginBottom: 5 }}>
          Test 4: Local Static Files
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>staticFile()</div>
            <FetchedLottieTest url={staticFileResult} label="staticFile" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontSize: 10, marginBottom: 3 }}>direct /path</div>
            <FetchedLottieTest url="/lotties/success-checkmark.json" label="direct" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        color: '#6272a4', 
        fontSize: 11, 
        marginTop: 10,
        maxWidth: 700,
        textAlign: 'center',
        lineHeight: 1.5,
      }}>
        <strong>Expected Results:</strong><br/>
        - Test 1: Green pulsing circle (raw hardcoded)<br/>
        - Test 2: Lightbulb, checkmark, sparkle (inline registry data)<br/>
        - Test 3: Balloon animation (remote LottieFiles URL)<br/>
        - Test 4: Checkmark (local static file)<br/>
        <br/>
        <strong>Diagnosis:</strong><br/>
        If Test 1 works → @remotion/lottie is functional<br/>
        If Test 2 fails → Issue with registry animation format<br/>
        If Test 3 fails → Issue with fetch/delayRender pattern<br/>
        If Test 4 fails → Issue with staticFile/Vite serving
      </div>
    </AbsoluteFill>
  );
};

export default LottieDebugTest;
