/**
 * ============================================================================
 * MOBILE RENDERING GUIDE
 * ============================================================================
 * 
 * Reference guide for creating mobile-optimized (1080x1920) scenes.
 * This file serves as inline documentation for LLMs and developers.
 * 
 * FORMAT: Mobile = 1080x1920 (9:16 portrait) for TikTok, Reels, Shorts
 *         Desktop = 1920x1080 (16:9 landscape) for YouTube, web
 * 
 * @module layout/mobileRenderingGuide
 */

// ============================================================================
// MOBILE DOS - RECOMMENDED PATTERNS
// ============================================================================

/**
 * ✅ DO: Recommended patterns for mobile rendering
 * 
 * These patterns work well on portrait 1080x1920 viewports.
 */
export const MOBILE_DOS = Object.freeze({
  
  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUTS
  // ─────────────────────────────────────────────────────────────────────────
  
  layouts: {
    /**
     * ✅ DO: Use 'full' layout for hero moments
     * 
     * Full layout gives maximum impact on mobile - the entire
     * viewport becomes your canvas for one powerful message.
     */
    useFull: {
      pattern: { type: 'full', options: { padding: 50 } },
      reason: 'Maximum impact, single focus point',
      example: 'Hero text, CTA scenes, emotional moments',
    },

    /**
     * ✅ DO: Use 'rowStack' with 2-3 rows max
     * 
     * Vertical stacking is natural for portrait orientation.
     * Keep rows to 2-3 to maintain readability.
     */
    useRowStack: {
      pattern: { type: 'rowStack', options: { rows: 2, padding: 40 } },
      reason: 'Natural vertical flow, good content density',
      maxRows: 3,
      example: 'Header + content, title + cards + footer',
    },

    /**
     * ✅ DO: Use larger padding than desktop
     * 
     * Mobile screens need breathing room. Default 40-60px padding
     * ensures content doesn't feel cramped.
     */
    useLargerPadding: {
      recommended: { min: 40, optimal: 50, max: 70 },
      reason: 'Prevents cramped feeling, thumb-safe zones',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MID-SCENES
  // ─────────────────────────────────────────────────────────────────────────

  midScenes: {
    /**
     * ✅ DO: Use textReveal for key messages
     * 
     * Text reveals stack vertically and scale well.
     * Use 2-3 lines max for readability.
     */
    textReveal: {
      recommended: true,
      maxLines: 3,
      config: {
        lineSpacing: 'relaxed', // More space between lines
        revealType: 'typewriter', // Engaging on mobile
        staggerDelay: 0.4, // Slightly slower for mobile attention
      },
    },

    /**
     * ✅ DO: Use heroText for visual anchors
     * 
     * Hero + text combo works great vertically.
     * Keep text short and punchy.
     */
    heroText: {
      recommended: true,
      textMaxLength: 40, // Characters
      reason: 'Strong visual anchor, works in both orientations',
    },

    /**
     * ✅ DO: Use checklist for step-by-step content
     * 
     * Vertical checklists are perfect for mobile.
     * Limit to 4-5 items for screen fit.
     */
    checklist: {
      recommended: true,
      maxItems: 5,
      config: {
        staggerDelay: 0.8, // Slower reveal for engagement
      },
    },

    /**
     * ✅ DO: Use gridCards with 2 columns max
     * 
     * Grids still work on mobile but must be constrained.
     * 2 columns gives ~480px per card - readable.
     */
    gridCards: {
      recommended: true,
      maxColumns: 2,
      maxCards: 6,
      config: {
        columns: 2,
        animation: 'cascade',
        gap: 16, // Tighter gap for mobile
      },
    },

    /**
     * ✅ DO: Use bubbleCallout for single insights
     * 
     * One callout at a time, centered, with emphasis.
     */
    bubbleCallout: {
      recommended: true,
      maxCallouts: 2, // Show one at a time ideally
      reason: 'Focused attention, works well centered',
    },

    /**
     * ✅ DO: Use iconGrid with 2-3 columns
     * 
     * Icons are compact and work well in grids.
     */
    iconGrid: {
      recommended: true,
      maxColumns: 3,
      config: {
        columns: 2,
        iconSize: 'lg', // Larger icons for touch targets
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONTENT GUIDELINES
  // ─────────────────────────────────────────────────────────────────────────

  content: {
    /**
     * ✅ DO: Keep text concise
     * 
     * Mobile viewers scan quickly. Short, punchy text wins.
     */
    textLength: {
      headline: { max: 30, ideal: 15 }, // Characters
      body: { max: 80, ideal: 50 },
      bullet: { max: 40, ideal: 25 },
    },

    /**
     * ✅ DO: Use BOLD font sizes
     * 
     * Scale up 20%+ from desktop for maximum impact.
     * Mobile viewers scroll fast - text needs to pop!
     */
    fontSize: {
      scaleUp: 1.2, // 20% larger than desktop
      minReadable: 28, // Pixels - never go smaller
      headlines: { min: 56, ideal: 72 }, // Big, bold headlines
      body: { min: 36, ideal: 42 }, // Readable body text
    },

    /**
     * ✅ DO: Use high-contrast colors
     * 
     * Mobile screens vary in quality. High contrast ensures readability.
     */
    contrast: {
      preferDarkText: true,
      avoidSubtleGradients: true,
    },

    /**
     * ✅ DO: Stack content vertically
     * 
     * Left-to-right flows become top-to-bottom on mobile.
     */
    flow: {
      direction: 'vertical',
      alignment: 'center', // Center-align works best
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIMING & ANIMATION
  // ─────────────────────────────────────────────────────────────────────────

  timing: {
    /**
     * ✅ DO: Use slightly slower animations
     * 
     * Mobile viewers often watch without sound - give them
     * time to read and absorb.
     */
    animationDuration: {
      scaleUp: 1.2, // 20% slower than desktop
      minDuration: 0.5, // Seconds
    },

    /**
     * ✅ DO: Increase stagger delays
     * 
     * More time between elements appearing helps comprehension.
     */
    staggerDelay: {
      recommended: 0.4, // Seconds between items
      range: { min: 0.3, max: 0.6 },
    },

    /**
     * ✅ DO: Keep scenes shorter
     * 
     * Mobile attention spans are shorter. 5-10s per scene ideal.
     */
    sceneDuration: {
      recommended: { min: 150, optimal: 240, max: 360 }, // Frames at 30fps
      seconds: { min: 5, optimal: 8, max: 12 },
    },
  },
});

// ============================================================================
// MOBILE DON'TS - PATTERNS TO AVOID
// ============================================================================

/**
 * ❌ DON'T: Patterns that break or look bad on mobile
 * 
 * These patterns should be avoided or converted when rendering for mobile.
 */
export const MOBILE_DONTS = Object.freeze({

  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUTS TO AVOID
  // ─────────────────────────────────────────────────────────────────────────

  layouts: {
    /**
     * ❌ DON'T: Use columnSplit on mobile
     * 
     * 2 columns = 540px each = too narrow for text.
     * System auto-converts to rowStack, but avoid in mobile configs.
     */
    avoidColumnSplit: {
      reason: 'Columns become too narrow (540px) for readable text',
      alternative: 'rowStack',
      autoConverted: true, // System handles this
    },

    /**
     * ❌ DON'T: Use headerRowColumns
     * 
     * This complex layout doesn't translate well to portrait.
     */
    avoidHeaderRowColumns: {
      reason: 'Complex nested layout becomes chaotic on mobile',
      alternative: 'rowStack with 3 rows',
    },

    /**
     * ❌ DON'T: Use more than 3 rows in rowStack
     * 
     * Too many rows = tiny slivers that can't hold content.
     */
    avoidManyRows: {
      maxRows: 3,
      reason: 'Each row becomes too short to be useful',
    },

    /**
     * ❌ DON'T: Use small padding (<30px)
     * 
     * Content will feel cramped and touch edges.
     */
    avoidSmallPadding: {
      minimum: 30,
      reason: 'Content feels cramped, hard to read',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MID-SCENES TO AVOID
  // ─────────────────────────────────────────────────────────────────────────

  midScenes: {
    /**
     * ❌ DON'T: Use sideBySide compare on mobile
     * 
     * Left/right split becomes unusable on portrait.
     * Exception: beforeAfter mode with vertical slider could work.
     */
    avoidSideBySide: {
      reason: 'Each side becomes ~480px wide - too narrow',
      alternative: 'Use rowStack with sequential reveals',
      exception: 'beforeAfter mode with vertical slider',
    },

    /**
     * ❌ DON'T: Use gridCards with 3+ columns
     * 
     * 3 columns = 320px cards = too small for text/icons.
     */
    avoidWideGrids: {
      maxColumns: 2,
      reason: 'Cards become too small (<400px) for content',
    },

    /**
     * ❌ DON'T: Use dense text blocks
     * 
     * More than 3-4 lines of text is overwhelming on mobile.
     */
    avoidDenseText: {
      maxLines: 4,
      reason: 'Mobile viewers skim - too much text loses attention',
    },

    /**
     * ❌ DON'T: Use tiny icons in iconGrid
     * 
     * Icons smaller than 'md' become hard to see.
     */
    avoidSmallIcons: {
      minSize: 'md',
      reason: 'Small icons hard to see and tap',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CONTENT TO AVOID
  // ─────────────────────────────────────────────────────────────────────────

  content: {
    /**
     * ❌ DON'T: Use long text strings
     * 
     * Text that works on 1920px will overflow or wrap badly on 1080px.
     */
    avoidLongText: {
      maxHeadline: 30, // Characters
      maxBody: 80,
      reason: 'Text wraps awkwardly or becomes too small',
    },

    /**
     * ❌ DON'T: Use horizontal layouts in mid-scenes
     * 
     * Left-to-right arrangements fight the portrait format.
     */
    avoidHorizontalArrangements: {
      reason: 'Portrait format naturally flows top-to-bottom',
      example: 'Cards side-by-side, icons in a row',
    },

    /**
     * ❌ DON'T: Use font sizes below 28px
     * 
     * Anything smaller won't have impact - be bold!
     */
    avoidSmallFonts: {
      minimum: 28, // Pixels - raised for impact
      reason: 'Small text gets lost, lacks punch',
    },

    /**
     * ❌ DON'T: Rely on subtle color differences
     * 
     * Mobile screens vary - strong contrast is essential.
     */
    avoidLowContrast: {
      reason: 'Mobile screens have varying color accuracy',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIMING TO AVOID
  // ─────────────────────────────────────────────────────────────────────────

  timing: {
    /**
     * ❌ DON'T: Use fast animations
     * 
     * Mobile viewers need more time to track movement.
     */
    avoidFastAnimations: {
      minDuration: 0.4, // Seconds
      reason: 'Too fast to follow on small screen',
    },

    /**
     * ❌ DON'T: Use tight stagger delays
     * 
     * Elements appearing too quickly feels chaotic.
     */
    avoidTightStagger: {
      minDelay: 0.25, // Seconds
      reason: 'Multiple elements at once is overwhelming',
    },

    /**
     * ❌ DON'T: Use very long scenes
     * 
     * Mobile attention spans are short - keep it punchy.
     */
    avoidLongScenes: {
      maxFrames: 450, // 15 seconds at 30fps
      reason: 'Mobile viewers scroll/swipe quickly',
    },
  },
});

// ============================================================================
// QUICK REFERENCE CHEATSHEET
// ============================================================================

/**
 * Quick reference for mobile scene configuration
 * 
 * Copy-paste friendly defaults for common mobile patterns.
 */
export const MOBILE_CHEATSHEET = Object.freeze({
  
  /**
   * Standard mobile scene shell
   */
  sceneShell: {
    format: 'mobile',
    layout: {
      type: 'rowStack',
      options: {
        rows: 2,
        padding: 50,
        titleHeight: 100,
      },
    },
  },

  /**
   * Hero moment (full screen)
   */
  heroScene: {
    format: 'mobile',
    layout: {
      type: 'full',
      options: {
        padding: 50,
        titleHeight: 0,
      },
    },
  },

  /**
   * Text reveal settings for mobile
   */
  textRevealConfig: {
    lineSpacing: 'relaxed',
    staggerDelay: 0.4,
    animationDuration: 1.0,
    revealType: 'typewriter',
  },

  /**
   * Grid cards settings for mobile
   */
  gridCardsConfig: {
    columns: 2,
    animation: 'cascade',
    staggerDelay: 0.15,
    gap: 16,
  },

  /**
   * Checklist settings for mobile
   */
  checklistConfig: {
    staggerDelay: 0.6,
    animationDuration: 0.5,
  },

  /**
   * Transition recommendations
   */
  transitions: {
    recommended: ['fade', 'slide', 'doodle-wipe'],
    avoid: ['page-turn'], // Can feel disorienting on mobile
    defaultDuration: 18, // Frames
  },

  /**
   * Beat timing multipliers
   * 
   * Apply these multipliers to desktop beats for mobile pacing.
   */
  beatMultipliers: {
    start: 1.0, // Same start time
    stagger: 1.3, // 30% more time between elements
    exit: 1.2, // 20% more hold time before exit
  },
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate a scene config for mobile compatibility
 * 
 * Returns warnings and suggestions for improvement.
 * 
 * @param {Object} config - Scene configuration
 * @returns {Object} { valid: boolean, warnings: [], suggestions: [] }
 */
export function validateMobileConfig(config) {
  const warnings = [];
  const suggestions = [];

  // Check layout
  if (config.layout?.type === 'columnSplit') {
    warnings.push('columnSplit layout will be auto-converted to rowStack on mobile');
  }

  if (config.layout?.type === 'headerRowColumns') {
    warnings.push('headerRowColumns is not recommended for mobile');
    suggestions.push('Consider using rowStack with 3 rows instead');
  }

  if (config.layout?.options?.rows > 3) {
    warnings.push(`${config.layout.options.rows} rows may be too many for mobile`);
    suggestions.push('Limit to 3 rows max for mobile');
  }

  // Check slots for problematic mid-scenes
  if (config.slots) {
    Object.entries(config.slots).forEach(([slotName, slotConfig]) => {
      const configs = Array.isArray(slotConfig) ? slotConfig : [slotConfig];
      
      configs.forEach((c) => {
        if (c.midScene === 'sideBySide' && c.config?.mode !== 'beforeAfter') {
          warnings.push(`sideBySide in ${slotName} may not work well on mobile`);
          suggestions.push('Consider using rowStack layout with separate slots');
        }

        if (c.midScene === 'gridCards' && c.config?.columns > 2) {
          warnings.push(`gridCards in ${slotName} has ${c.config.columns} columns - max 2 recommended`);
        }

        if (c.midScene === 'textReveal' && c.config?.lines?.length > 4) {
          warnings.push(`textReveal in ${slotName} has ${c.config.lines.length} lines - max 4 recommended`);
        }
      });
    });
  }

  return {
    valid: warnings.length === 0,
    warnings,
    suggestions,
  };
}

/**
 * Get mobile-optimized config suggestions
 * 
 * @param {Object} desktopConfig - Original desktop config
 * @returns {Object} Suggested mobile config adjustments
 */
export function getMobileSuggestions(desktopConfig) {
  const suggestions = {};

  // Layout suggestions
  if (desktopConfig.layout?.type === 'columnSplit') {
    suggestions.layout = {
      type: 'rowStack',
      options: {
        rows: desktopConfig.layout.options?.columns || 2,
        padding: 50,
      },
    };
  }

  // Grid column suggestions
  if (desktopConfig.slots) {
    suggestions.slotAdjustments = {};
    
    Object.entries(desktopConfig.slots).forEach(([slotName, slotConfig]) => {
      const c = Array.isArray(slotConfig) ? slotConfig[0] : slotConfig;
      
      if (c.midScene === 'gridCards' && c.config?.columns > 2) {
        suggestions.slotAdjustments[slotName] = {
          columns: 2,
          reason: 'Reduced from ' + c.config.columns + ' for mobile',
        };
      }
    });
  }

  return suggestions;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  MOBILE_DOS,
  MOBILE_DONTS,
  MOBILE_CHEATSHEET,
  validateMobileConfig,
  getMobileSuggestions,
};
