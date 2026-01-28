/**
 * KnoSlides Animation Variants
 * 
 * Reusable Framer Motion animation variants for templates.
 * Designed to match the feel of KnoMotion's Remotion animations.
 */

import { Variants, Transition } from 'framer-motion';

// =============================================================================
// ENTRANCE ANIMATIONS
// =============================================================================

/**
 * Fade in with upward movement - the workhorse entrance
 */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  }
};

/**
 * Fade in with scale - for cards and emphasis elements
 */
export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.92 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  }
};

/**
 * Simple fade - for subtle elements
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

/**
 * Slide in from direction
 */
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'up'): Variants => {
  const offset = 40;
  const getInitial = () => {
    switch (direction) {
      case 'left': return { x: -offset, opacity: 0 };
      case 'right': return { x: offset, opacity: 0 };
      case 'up': return { y: offset, opacity: 0 };
      case 'down': return { y: -offset, opacity: 0 };
    }
  };

  return {
    hidden: getInitial(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 }
    }
  };
};

// =============================================================================
// CONTAINER ANIMATIONS (for staggered children)
// =============================================================================

/**
 * Container for staggered children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

/**
 * Container with faster stagger
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    }
  }
};

/**
 * Container with slower, more dramatic stagger
 */
export const staggerContainerDramatic: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

// =============================================================================
// INTERACTIVE ANIMATIONS
// =============================================================================

/**
 * Card hover/tap states
 */
export const cardInteractive: Variants = {
  initial: { 
    scale: 1,
    boxShadow: '0 14px 30px rgba(0,0,0,0.08)',
  },
  hover: { 
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
  }
};

/**
 * Button hover/tap states
 */
export const buttonInteractive: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    }
  },
  tap: { scale: 0.95 }
};

/**
 * Subtle hover lift for clickable items
 */
export const hoverLift: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -2,
    transition: { duration: 0.2 }
  }
};

// =============================================================================
// ACCORDION / EXPAND ANIMATIONS
// =============================================================================

/**
 * Accordion expand/collapse
 */
export const accordionContent: Variants = {
  collapsed: { 
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 }
    }
  },
  expanded: { 
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.3, delay: 0.1 }
    }
  }
};

/**
 * Expand icon rotation
 */
export const expandIcon: Variants = {
  collapsed: { rotate: 0 },
  expanded: { 
    rotate: 180,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

// =============================================================================
// SPECIAL EFFECTS
// =============================================================================

/**
 * Pulse attention - for elements that need to draw focus
 */
export const pulseAttention: Variants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

/**
 * Gentle float animation
 */
export const gentleFloat: Variants = {
  initial: { y: 0 },
  float: {
    y: [-4, 4, -4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

/**
 * Glow pulse for highlighted elements
 */
export const glowPulse: Variants = {
  idle: {
    boxShadow: '0 0 0 0 rgba(255, 107, 53, 0)',
  },
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(255, 107, 53, 0.4)',
      '0 0 0 10px rgba(255, 107, 53, 0)',
      '0 0 0 0 rgba(255, 107, 53, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeOut',
    }
  }
};

/**
 * Draw SVG path
 */
export const drawPath: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0 
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: 'easeInOut' },
      opacity: { duration: 0.2 }
    }
  }
};

/**
 * Node connection line draw
 */
export const drawLine: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0 
  },
  visible: (custom: { delay?: number } = {}) => ({ 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        duration: 0.6, 
        ease: 'easeInOut',
        delay: custom.delay || 0 
      },
      opacity: { duration: 0.2, delay: custom.delay || 0 }
    }
  })
};

// =============================================================================
// SELECTION STATES
// =============================================================================

/**
 * Selected/active state for nodes or items
 */
export const selectedState: Variants = {
  unselected: { 
    scale: 1,
    opacity: 1,
  },
  selected: { 
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    }
  },
  dimmed: {
    opacity: 0.4,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
};

/**
 * Completion celebration
 */
export const celebrationBurst: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
      ease: 'easeOut',
    }
  }
};
