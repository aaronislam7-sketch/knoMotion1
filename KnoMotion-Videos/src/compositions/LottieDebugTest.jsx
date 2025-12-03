/**
 * LottieDebugTest - Minimal test of Lottie integration
 * 
 * This tests the exact pattern from Remotion docs.
 */

import React, { useEffect, useState } from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender, cancelRender } from 'remotion';
import { Lottie } from '@remotion/lottie';
import { lightbulbAnimation, checkmarkAnimation, sparkleAnimation } from '../sdk/lottie/registry';

/**
 * Test 1: Direct inline data (no fetch needed)
 * This should work immediately
 */
const InlineLottieTest = ({ data, label }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: 'white', marginBottom: 10, fontSize: 14 }}>{label}</div>
      <div style={{ 
        width: 120, 
        height: 120, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Lottie
          animationData={data}
          loop={true}
          style={{ width: 100, height: 100 }}
        />
      </div>
    </div>
  );
};

/**
 * Test 2: Fetch from static file (following Remotion docs exactly)
 */
const FetchedLottieTest = ({ path, label }) => {
  const [handle] = useState(() => delayRender(`Loading: ${path}`));
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = staticFile(path);
    console.log(`[FetchedLottie] Fetching ${url}`);
    
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log(`[FetchedLottie] Loaded ${path}`);
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`[FetchedLottie] Error loading ${path}:`, err);
        setError(err.message);
        // Don't cancel render for this test - just show error
        continueRender(handle);
      });
  }, [handle, path]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: 'white', marginBottom: 10, fontSize: 14 }}>{label}</div>
      <div style={{ 
        width: 120, 
        height: 120, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {error ? (
          <div style={{ color: 'red', fontSize: 12 }}>{error}</div>
        ) : animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <div style={{ color: 'gray', fontSize: 12 }}>Loading...</div>
        )}
      </div>
    </div>
  );
};

export const LottieDebugTest = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1e1e2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ color: 'white', fontSize: 24 }}>Lottie Debug Test - Frame: {frame}</div>

      {/* Inline animations - these should definitely work */}
      <div style={{ color: '#8be9fd', fontSize: 16 }}>Inline Data (from registry)</div>
      <div style={{ display: 'flex', gap: 30 }}>
        <InlineLottieTest data={lightbulbAnimation} label="lightbulb" />
        <InlineLottieTest data={checkmarkAnimation} label="checkmark" />
        <InlineLottieTest data={sparkleAnimation} label="sparkle" />
      </div>

      {/* Static file animations - test fetch pattern */}
      <div style={{ color: '#8be9fd', fontSize: 16, marginTop: 20 }}>Static Files (fetched)</div>
      <div style={{ display: 'flex', gap: 30 }}>
        <FetchedLottieTest path="lotties/success-checkmark.json" label="checkmark" />
        <FetchedLottieTest path="lotties/celebration-stars.json" label="celebration" />
        <FetchedLottieTest path="lotties/loading-spinner.json" label="loading" />
      </div>
    </AbsoluteFill>
  );
};

export default LottieDebugTest;
