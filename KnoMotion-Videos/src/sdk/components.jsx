import React from 'react';
import { fadeSlide, pulse } from './animations';

/**
 * Template SDK - Reusable Components
 * Common UI components for all templates
 */

/**
 * Animated Text Component
 */
export const AnimatedText = ({ 
  text, 
  frame, 
  startFrame, 
  style = {}, 
  animation = 'fadeSlide',
  direction = 'up',
  duration = 30,
  className = ''
}) => {
  const animations = {
    fadeSlide: fadeSlide(frame, startFrame, duration, direction)
  };
  
  const animStyle = animations[animation] || animations.fadeSlide;
  
  return (
    <div style={{ ...animStyle, ...style }} className={className}>
      {text}
    </div>
  );
};

/**
 * Sketch Box Component
 */
export const SketchBox = ({ 
  children, 
  style = {}, 
  borderColor = '#2d3436',
  backgroundColor = '#ffffff',
  padding = 20,
  animated = false,
  frame = 0
}) => {
  const pulseScale = animated ? pulse(frame, 0.02, 0.05) : 1;
  
  return (
    <div style={{
      padding,
      border: `3px solid ${borderColor}`,
      borderRadius: 8,
      backgroundColor,
      position: 'relative',
      transform: `scale(${pulseScale})`,
      boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
      ...style
    }}>
      {children}
    </div>
  );
};

/**
 * Icon Circle Component
 */
export const IconCircle = ({ 
  icon, 
  size = 80, 
  backgroundColor = '#4a9c3b',
  color = '#ffffff',
  style = {},
  animated = false,
  frame = 0
}) => {
  const pulseScale = animated ? pulse(frame, 0.1, 0.08) : 1;
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      transform: `scale(${pulseScale})`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      ...style
    }}>
      {icon}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ 
  progress, 
  width = 200, 
  height = 8,
  backgroundColor = '#e0e0e0',
  fillColor = '#4a9c3b',
  style = {}
}) => {
  return (
    <div style={{
      width,
      height,
      backgroundColor,
      borderRadius: height / 2,
      overflow: 'hidden',
      ...style
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        backgroundColor: fillColor,
        transition: 'width 0.3s ease',
        borderRadius: height / 2
      }} />
    </div>
  );
};

/**
 * Badge Component
 */
export const Badge = ({ 
  text, 
  backgroundColor = '#4a9c3b',
  color = '#ffffff',
  style = {}
}) => {
  return (
    <div style={{
      padding: '8px 16px',
      backgroundColor,
      color,
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      display: 'inline-block',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      ...style
    }}>
      {text}
    </div>
  );
};

/**
 * Connector Line Component
 */
export const ConnectorLine = ({ 
  progress, 
  horizontal = true,
  width = 100,
  height = 4,
  color = '#4a9c3b',
  arrow = true,
  style = {}
}) => {
  return (
    <div style={{
      position: 'relative',
      width: horizontal ? width : height,
      height: horizontal ? height : width,
      ...style
    }}>
      <div style={{
        width: horizontal ? '100%' : height,
        height: horizontal ? height : '100%',
        backgroundColor: color,
        transformOrigin: horizontal ? 'left center' : 'top center',
        transform: horizontal ? `scaleX(${progress})` : `scaleY(${progress})`,
        borderRadius: height / 2
      }} />
      
      {arrow && progress > 0.9 && (
        <div style={{
          position: 'absolute',
          [horizontal ? 'right' : 'bottom']: -8,
          [horizontal ? 'top' : 'left']: '50%',
          transform: horizontal ? 'translateY(-50%)' : 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: horizontal ? `12px solid ${color}` : '8px solid transparent',
          borderRight: horizontal ? 'none' : '8px solid transparent',
          borderTop: horizontal ? '8px solid transparent' : `12px solid ${color}`,
          borderBottom: horizontal ? '8px solid transparent' : 'none'
        }} />
      )}
    </div>
  );
};

/**
 * Checkmark Component
 */
export const Checkmark = ({ 
  size = 40,
  color = '#4a9c3b',
  strokeWidth = 4,
  progress = 1
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ opacity: progress }}
    >
      <path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        strokeDashoffset={24 * (1 - progress)}
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
};

/**
 * Thought Bubble Component
 */
export const ThoughtBubble = ({ 
  children,
  style = {},
  backgroundColor = '#ffffff',
  borderColor = '#2d3436'
}) => {
  return (
    <div style={{
      position: 'relative',
      ...style
    }}>
      <div style={{
        padding: '20px 30px',
        backgroundColor,
        border: `3px solid ${borderColor}`,
        borderRadius: 30,
        boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
      }}>
        {children}
      </div>
      
      {/* Small bubble */}
      <div style={{
        position: 'absolute',
        bottom: -15,
        left: 30,
        width: 15,
        height: 15,
        backgroundColor,
        border: `3px solid ${borderColor}`,
        borderRadius: '50%'
      }} />
      
      {/* Smaller bubble */}
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: 15,
        width: 8,
        height: 8,
        backgroundColor,
        border: `3px solid ${borderColor}`,
        borderRadius: '50%'
      }} />
    </div>
  );
};

/**
 * Number Badge Component
 */
export const NumberBadge = ({ 
  number,
  size = 50,
  backgroundColor = '#4a9c3b',
  color = '#ffffff',
  style = {}
}) => {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      fontWeight: 700,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      ...style
    }}>
      {number}
    </div>
  );
};
