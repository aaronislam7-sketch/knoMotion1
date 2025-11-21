import React from 'react';
import { AbsoluteFill } from 'remotion';
import { 
  RemotionLottie, 
  AnimatedLottie, 
  LottieIcon, 
  LottieBackground,
  LottieOverlay 
} from '../sdk/lottie/lottieIntegration';
import { Text, Divider } from '../sdk/elements';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';

/**
 * LottieTest - Test composition for @remotion/lottie migration
 * Verifies all Lottie components render correctly with local files
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
        lottieRef="particles" 
        opacity={0.1} 
        scale={2}
        position="center"
      />

      {/* Header */}
      <Text text="Lottie Integration Test (@remotion/lottie)" variant="display" size="xl" weight="bold" color="primary" />
      
      <Divider orientation="horizontal" thickness={3} color="primary" />

      {/* Section 1: Basic Lottie Components */}
      <div>
        <Text text="Basic Lottie Components" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 40, marginTop: 20, alignItems: 'center' }}>
          {/* Success Checkmark */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <RemotionLottie lottieRef="success" loop={false} />
            </div>
            <Text text="Success" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Loading Spinner */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <RemotionLottie lottieRef="loading" loop playbackRate={1.2} />
            </div>
            <Text text="Loading" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Particle Burst */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <RemotionLottie lottieRef="burst" loop={false} playbackRate={1.5} />
            </div>
            <Text text="Burst" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Celebration Stars */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 120, height: 120 }}>
              <RemotionLottie lottieRef="celebration" loop playbackRate={0.8} />
            </div>
            <Text text="Celebration" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 2: Animated Lottie with Entrance */}
      <div>
        <Text text="Animated Lottie (with entrance effects)" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 40, marginTop: 20, alignItems: 'center' }}>
          {/* Entrance with delay */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <AnimatedLottie 
                lottieRef="stars" 
                entranceDelay={0} 
                entranceDuration={30}
                loop
              />
            </div>
            <Text text="Delayed Entrance" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>

          {/* Fast entrance */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100 }}>
              <AnimatedLottie 
                lottieRef="success" 
                entranceDelay={15} 
                entranceDuration={20}
                loop={false}
              />
            </div>
            <Text text="Fast Entrance" variant="body" size="sm" style={{ marginTop: 10 }} />
          </div>
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 3: Lottie Icons (inline) */}
      <div>
        <Text text="Lottie Icons (inline usage)" variant="title" size="lg" weight="bold" />
        
        <div style={{ display: 'flex', gap: 20, marginTop: 20, alignItems: 'center' }}>
          <Text text="Small icon:" variant="body" size="md" />
          <LottieIcon lottieRef="success" size={40} delay={0} />
          
          <Text text="Medium icon:" variant="body" size="md" />
          <LottieIcon lottieRef="spinner" size={60} delay={10} />
          
          <Text text="Large icon:" variant="body" size="md" />
          <LottieIcon lottieRef="stars" size={80} delay={20} />
        </div>
      </div>

      <Divider orientation="horizontal" thickness={2} style={{ margin: '20px 0' }} />

      {/* Section 4: Lottie Overlay (timed) */}
      <div style={{ position: 'relative', minHeight: 200 }}>
        <Text text="Lottie Overlay (appears at frame 90-150)" variant="title" size="lg" weight="bold" />
        
        {/* Overlay appears between frames 90-150 */}
        <LottieOverlay 
          lottieRef="celebration" 
          startFrame={90} 
          duration={60}
          opacity={0.6}
        />
        
        <div style={{ marginTop: 20 }}>
          <Text 
            text="Watch for a celebration overlay to appear and disappear!" 
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
          text="✅ Lottie Migration Complete!" 
          variant="body" 
          size="sm" 
          color="textSecondary" 
        />
        <Text 
          text="Using @remotion/lottie | Local Files | Standardized lottieRef Props | Proper Timeline Sync" 
          variant="body" 
          size="xs" 
          color="textSecondary" 
          style={{ marginTop: 10 }} 
        />
      </div>
    </AbsoluteFill>
  );
};
