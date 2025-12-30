import React from 'react';
import { AbsoluteFill } from 'remotion';
import { 
  LottiePlayer,
  LottieIcon, 
  LottieBackground,
  LottieOverlay 
} from '../sdk/lottie/lottieIntegration';
import { Text, Divider } from '../sdk/elements';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

/**
 * LottieTest - Test composition for URL-based Lottie integration
 * Verifies all Lottie components render correctly with remote URLs
 */
export const LottieTest = () => {
  const theme = KNODE_THEME;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 30,
        overflow: 'auto',
      }}
    >
      {/* Background Lottie (subtle) */}
      <LottieBackground 
        lottieRef="sparkles" 
        opacity={0.1} 
        scale={2}
        position="center"
      />

      {/* Header */}
      <Text text="Lottie Integration Test (URL-Based)" variant="display" size="xl" weight="bold" color="primary" />
      
      <Divider orientation="horizontal" thickness={3} color="primary" />

      {/* Section 1: Basic Lottie Components */}
      <div>
        <Text text="Basic Lottie Components" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 40, marginTop: 20, alignItems: 'center' }}>
          {/* Success Checkmark */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <LottiePlayer lottieRef="success" loop={false} />
            </div>
            <Text text="Success" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Loading Spinner */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <LottiePlayer lottieRef="loading" playbackRate={1.2} />
            </div>
            <Text text="Loading" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Confetti */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <LottiePlayer lottieRef="confetti" loop={false} playbackRate={1.5} />
            </div>
            <Text text="Confetti" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Sparkles */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <LottiePlayer lottieRef="sparkles" playbackRate={0.8} />
            </div>
            <Text text="Sparkles" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 2: Education Animations */}
      <div>
        <Text text="Education Animations" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 40, marginTop: 20, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <LottiePlayer lottieRef="lightbulb" loop={false} />
            </div>
            <Text text="Lightbulb" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <LottiePlayer lottieRef="thinking" />
            </div>
            <Text text="Thinking" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <LottiePlayer lottieRef="brain" />
            </div>
            <Text text="Brain" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <LottiePlayer lottieRef="book" />
            </div>
            <Text text="Book" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 3: Lottie Icons (inline) */}
      <div>
        <Text text="Lottie Icons (inline usage)" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'center' }}>
          <Text text="Small:" variant="body" size="md" />
          <LottieIcon lottieRef="success" size={40} delay={0} loop={false} />
          
          <Text text="Medium:" variant="body" size="md" />
          <LottieIcon lottieRef="loading" size={60} delay={10} />
          
          <Text text="Large:" variant="body" size="md" />
          <LottieIcon lottieRef="sparkles" size={80} delay={20} />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 4: Lottie Overlay (timed) */}
      <div style={{ position: 'relative', minHeight: 200 }}>
        <Text text="Lottie Overlay (appears at frame 90-150)" variant="title" size="lg" weight="bold" />
        
        {/* Overlay appears between frames 90-150 */}
        <LottieOverlay 
          lottieRef="fireworks" 
          startFrame={90} 
          duration={60}
          opacity={0.6}
        />
        
        <div style={{ marginTop: 20 }}>
          <Text 
            text="Watch for a fireworks overlay to appear and disappear!" 
            variant="body" 
            size="md" 
            color="textSecondary"
          />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={3} color="primary" style={{ marginTop: 20 }} />

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Text 
          text="✅ URL-Based Lottie Registry" 
          variant="body" 
          size="sm" 
          color="textSecondary" 
        />
        <Text 
          text="Using @remotion/lottie | LottieFiles CDN | Registry Pattern | Remotion Timeline Sync" 
          variant="body" 
          size="xs" 
          color="textSecondary" 
          style={{ marginTop: 10 }} 
        />
      </div>
    </AbsoluteFill>
  );
};
