import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { 
  EZ, 
  toFrames, 
  renderHero,
  mergeHeroConfig
} from '../sdk';

/**
 * TEMPLATE #18: PROGRESS PATH - v6.0
 * 
 * PRIMARY INTENTION: GUIDE
 * SECONDARY INTENTIONS: INSPIRE, CONNECT
 * 
 * PURPOSE: Visualize learning journeys, goal progress, and pathways
 * 
 * VISUAL PATTERN:
 * - Horizontal or vertical path with milestones
 * - Progress indicator showing current position
 * - 3-7 waypoints/checkpoints
 * - Visual connection between stages
 * - Optional icons/visuals for each milestone
 * 
 * AGNOSTIC PRINCIPALS:
 * ✓ Type-Based Polymorphism (hero registry for milestone visuals)
 * ✓ Data-Driven Structure (dynamic waypoints array)
 * ✓ Token-Based Positioning (semantic layout)
 * ✓ Separation of Concerns (independent layers)
 * ✓ Progressive Configuration (simple defaults)
 * ✓ Registry Pattern (extensible milestone types)
 */

// DEFAULT CONFIGURATION
const DEFAULT_CONFIG = {
  title: {
    text: 'Your Learning Journey',
    position: 'top-center',
    offset: { x: 0, y: 60 }
  },
  
  waypoints: [
    {
      label: 'Start',
      description: 'Begin your journey',
      icon: '🚀',
      status: 'completed' // completed | current | locked
    },
    {
      label: 'Learn Basics',
      description: 'Master fundamentals',
      icon: '📚',
      status: 'completed'
    },
    {
      label: 'Practice',
      description: 'Apply knowledge',
      icon: '💪',
      status: 'current'
    },
    {
      label: 'Build Projects',
      description: 'Create real solutions',
      icon: '🛠️',
      status: 'locked'
    },
    {
      label: 'Master',
      description: 'Achieve expertise',
      icon: '🏆',
      status: 'locked'
    }
  ],
  
  direction: 'horizontal', // horizontal | vertical
  showProgress: true,
  
  style_tokens: {
    colors: {
      bg: '#0F1419',
      path: '#2C3E50',
      pathActive: '#4CAF50',
      title: '#FFFFFF',
      completed: '#4CAF50',
      current: '#FFC107',
      locked: '#5A6C7D',
      text: '#FFFFFF'
    },
    fonts: {
      size_title: 56,
      size_label: 28,
      size_description: 18,
      weight_title: 800,
      weight_label: 700
    }
  },
  
  beats: {
    entrance: 0.4,
    titleEntry: 0.8,
    waypointInterval: 0.6,
    progressAnimation: 1.0,
    hold: 2.0,
    exit: 1.0
  },
  
  animation: {
    entrance: 'fade-up',
    waypointReveal: 'pop', // pop | slide | fade
    easing: 'power3Out'
  }
};

// MAIN COMPONENT
export const Progress18Path = ({ scene, styles, presets, easingMap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Merge config
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const colors = { ...DEFAULT_CONFIG.style_tokens.colors, ...(scene.style_tokens?.colors || {}) };
  const fonts = { ...DEFAULT_CONFIG.style_tokens.fonts, ...(scene.style_tokens?.fonts || {}) };
  const anim = { ...DEFAULT_CONFIG.animation, ...(scene.animation || {}) };
  const waypoints = scene.waypoints || DEFAULT_CONFIG.waypoints;
  
  // Convert beats to frames
  const f_entrance = toFrames(beats.entrance, fps);
  const f_titleEntry = toFrames(beats.titleEntry, fps);
  const f_waypointStart = toFrames(beats.titleEntry + 0.3, fps);
  const f_waypointInterval = toFrames(beats.waypointInterval, fps);
  const f_hold = toFrames(
    beats.titleEntry + 0.3 + (waypoints.length * beats.waypointInterval) + beats.hold,
    fps
  );
  const f_exit = toFrames(
    beats.titleEntry + 0.3 + (waypoints.length * beats.waypointInterval) + beats.hold + beats.exit,
    fps
  );
  
  // Title animation
  const titleOpacity = interpolate(
    frame,
    [f_entrance, f_titleEntry],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  const titleY = interpolate(
    frame,
    [f_entrance, f_titleEntry],
    [30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: easingMap?.[anim.easing] || EZ.power3Out
    }
  );
  
  // Exit animation
  const exitProgress = interpolate(
    frame,
    [f_hold, f_exit],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: EZ.power3In
    }
  );
  
  // Calculate progress percentage
  const currentIndex = waypoints.findIndex(w => w.status === 'current');
  const progressPercent = currentIndex >= 0 
    ? (currentIndex / (waypoints.length - 1)) * 100 
    : 0;
  
  // Render waypoints
  const isHorizontal = config.direction === 'horizontal';
  const pathLength = isHorizontal ? 1200 : 600;
  const pathStart = isHorizontal 
    ? { x: (1920 - pathLength) / 2, y: 540 }
    : { x: 960, y: (1080 - pathLength) / 2 + 150 };
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity * (1 - exitProgress),
          transform: `translateY(${titleY}px)`
        }}
      >
        <h1
          style={{
            fontSize: fonts.size_title,
            fontWeight: fonts.weight_title,
            color: colors.title,
            margin: 0,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}
        >
          {config.title.text}
        </h1>
      </div>
      
      {/* Path Background Line */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 1 - exitProgress
        }}
      >
        {/* Base path */}
        <line
          x1={isHorizontal ? pathStart.x : pathStart.x}
          y1={isHorizontal ? pathStart.y : pathStart.y}
          x2={isHorizontal ? pathStart.x + pathLength : pathStart.x}
          y2={isHorizontal ? pathStart.y : pathStart.y + pathLength}
          stroke={colors.path}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Active progress path */}
        {config.showProgress && (
          <line
            x1={isHorizontal ? pathStart.x : pathStart.x}
            y1={isHorizontal ? pathStart.y : pathStart.y}
            x2={isHorizontal ? pathStart.x + (pathLength * progressPercent / 100) : pathStart.x}
            y2={isHorizontal ? pathStart.y : pathStart.y + (pathLength * progressPercent / 100)}
            stroke={colors.pathActive}
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.6))'
            }}
          />
        )}
      </svg>
      
      {/* Waypoints */}
      {waypoints.map((waypoint, index) => {
        const waypointFrame = f_waypointStart + (index * f_waypointInterval);
        const waypointProgress = interpolate(
          frame,
          [waypointFrame, waypointFrame + toFrames(0.4, fps)],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: EZ.power3Out
          }
        );
        
        const t = index / (waypoints.length - 1);
        const x = isHorizontal 
          ? pathStart.x + (pathLength * t)
          : pathStart.x;
        const y = isHorizontal 
          ? pathStart.y
          : pathStart.y + (pathLength * t);
        
        const statusColor = waypoint.status === 'completed' 
          ? colors.completed
          : waypoint.status === 'current'
          ? colors.current
          : colors.locked;
        
        const scale = anim.waypointReveal === 'pop'
          ? interpolate(waypointProgress, [0, 1], [0.5, 1])
          : 1;
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${scale * (1 - exitProgress * 0.5)})`,
              opacity: waypointProgress * (1 - exitProgress),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12
            }}
          >
            {/* Waypoint Circle */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: statusColor,
                border: `4px solid ${colors.bg}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                boxShadow: `0 4px 12px ${statusColor}80`,
                position: 'relative'
              }}
            >
              {waypoint.icon}
              
              {/* Pulse effect for current waypoint */}
              {waypoint.status === 'current' && frame % 60 < 30 && (
                <div
                  style={{
                    position: 'absolute',
                    width: '120%',
                    height: '120%',
                    borderRadius: '50%',
                    border: `3px solid ${colors.current}`,
                    opacity: 0.5
                  }}
                />
              )}
            </div>
            
            {/* Label */}
            <div
              style={{
                textAlign: 'center',
                maxWidth: isHorizontal ? 180 : 250
              }}
            >
              <div
                style={{
                  fontSize: fonts.size_label,
                  fontWeight: fonts.weight_label,
                  color: statusColor,
                  marginBottom: 4,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {waypoint.label}
              </div>
              <div
                style={{
                  fontSize: fonts.size_description,
                  color: colors.text,
                  opacity: 0.7,
                  lineHeight: 1.3
                }}
              >
                {waypoint.description}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Progress Indicator */}
      {config.showProgress && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 24,
            fontWeight: 700,
            color: colors.current,
            opacity: titleOpacity * (1 - exitProgress),
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}
        >
          {Math.round(progressPercent)}% Complete
        </div>
      )}
    </AbsoluteFill>
  );
};

// DURATION CALCULATION
export const getDuration = (scene, fps) => {
  const config = { ...DEFAULT_CONFIG, ...scene };
  const beats = { ...DEFAULT_CONFIG.beats, ...(scene.beats || {}) };
  const waypoints = scene.waypoints || DEFAULT_CONFIG.waypoints;
  
  const totalDuration = 
    beats.titleEntry + 
    0.3 + 
    (waypoints.length * beats.waypointInterval) + 
    beats.hold + 
    beats.exit +
    0.5;
  
  return toFrames(totalDuration, fps);
};

// METADATA
export const TEMPLATE_VERSION = '6.0';
export const TEMPLATE_ID = 'Progress18Path';
export const PRIMARY_INTENTION = 'GUIDE';
export const SECONDARY_INTENTIONS = ['INSPIRE', 'CONNECT'];

// CONFIG SCHEMA
export const CONFIG_SCHEMA = {
  title: {
    text: { type: 'text', label: 'Title' }
  },
  waypoints: {
    type: 'array',
    label: 'Waypoints',
    itemSchema: {
      label: { type: 'text', label: 'Label' },
      description: { type: 'text', label: 'Description' },
      icon: { type: 'text', label: 'Icon (emoji)' },
      status: { type: 'select', label: 'Status', options: ['completed', 'current', 'locked'] }
    }
  },
  direction: {
    type: 'select',
    label: 'Path Direction',
    options: ['horizontal', 'vertical']
  },
  showProgress: {
    type: 'checkbox',
    label: 'Show Progress Indicator'
  }
};
