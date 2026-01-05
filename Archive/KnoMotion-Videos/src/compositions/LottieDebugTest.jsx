/**
 * LottieDebugTest - Test URL-based Lottie Integration
 * 
 * Tests the new URL-based registry approach where all animations
 * are fetched from LottieFiles or other CDN sources.
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { 
  LottiePlayer, 
  LottieIcon,
  LOTTIE_REGISTRY,
  getAvailableLottieKeys,
  searchLottieByTag 
} from '../sdk/lottie';

export const LottieDebugTest = () => {
  const frame = useCurrentFrame();

  // Log registry info at frame 0
  if (frame === 0) {
    console.log('=== LOTTIE DEBUG TEST ===');
    console.log('Available keys:', getAvailableLottieKeys());
    console.log('UI animations:', searchLottieByTag('ui'));
    console.log('Education animations:', searchLottieByTag('education'));
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f0f23',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,
        fontFamily: 'system-ui, sans-serif',
        padding: 30,
        overflow: 'auto',
      }}
    >
      <div style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
        Lottie URL Registry Test
      </div>
      <div style={{ color: '#888', fontSize: 14 }}>
        Frame: {frame} | All animations fetched from LottieFiles CDN
      </div>

      {/* Test 1: UI Feedback Animations */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#50fa7b', fontSize: 16, marginBottom: 10 }}>
          Test 1: UI Feedback
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimationBox label="success" lottieRef="success" loop={false} />
          <AnimationBox label="loading" lottieRef="loading" />
          <AnimationBox label="error" lottieRef="error" loop={false} />
        </div>
      </div>

      {/* Test 2: Education Animations */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#8be9fd', fontSize: 16, marginBottom: 10 }}>
          Test 2: Education
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimationBox label="lightbulb" lottieRef="lightbulb" loop={false} />
          <AnimationBox label="thinking" lottieRef="thinking" />
          <AnimationBox label="brain" lottieRef="brain" />
          <AnimationBox label="book" lottieRef="book" />
        </div>
      </div>

      {/* Test 3: Celebrations */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f1fa8c', fontSize: 16, marginBottom: 10 }}>
          Test 3: Celebrations
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimationBox label="confetti" lottieRef="confetti" loop={false} />
          <AnimationBox label="fireworks" lottieRef="fireworks" />
          <AnimationBox label="sparkles" lottieRef="sparkles" />
        </div>
      </div>

      {/* Test 4: Science */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#ff79c6', fontSize: 16, marginBottom: 10 }}>
          Test 4: Science
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimationBox label="atom" lottieRef="atom" />
          <AnimationBox label="dna" lottieRef="dna" />
          <AnimationBox label="planet" lottieRef="planet" />
          <AnimationBox label="rocket" lottieRef="rocket" loop={false} />
        </div>
      </div>

      {/* Test 5: Direct URL */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#bd93f9', fontSize: 16, marginBottom: 10 }}>
          Test 5: Direct URL (bypassing registry)
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <AnimationBox 
            label="balloon (direct URL)" 
            lottieRef="https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json" 
          />
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        color: '#6272a4', 
        fontSize: 12, 
        marginTop: 20,
        maxWidth: 700,
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        <strong>How to add new animations:</strong><br/>
        1. Browse <a href="https://lottiefiles.com" style={{ color: '#8be9fd' }}>lottiefiles.com</a><br/>
        2. Find an animation you like<br/>
        3. Click "..." → "Copy Lottie JSON URL"<br/>
        4. Add to LOTTIE_REGISTRY in registry.ts with a descriptive key
      </div>
    </AbsoluteFill>
  );
};

/**
 * Reusable animation box component
 */
const AnimationBox = ({ label, lottieRef, loop = true }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ color: 'white', fontSize: 11, marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ 
        width: 80, 
        height: 80, 
        border: '2px solid #444',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#1a1a2e',
      }}>
        <LottiePlayer 
          lottieRef={lottieRef} 
          loop={loop}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default LottieDebugTest;
