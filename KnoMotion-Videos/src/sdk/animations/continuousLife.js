/**
 * CONTINUOUS LIFE ANIMATIONS
 * 
 * Subtle, ongoing animations that maintain visual interest during hold states.
 * These animations should be barely noticeable but prevent "dead" moments.
 * 
 * Reference: Polish.md Principle XI - "Animation Should Have Purpose"
 * Reference: Polish.md Principle XIV - "Animation Lifecycle Management"
 * 
 * Key Principles:
 * - Frequency: 0.02-0.04 for subtle, gentle movement
 * - Amplitude: 2-7px/units maximum (barely noticeable but adds life)
 * - Phase shift: Offset different elements for variety
 * - Configurable: Always allow toggling via config
 */

/**
 * Get continuous breathing animation (subtle scale pulse)
 * 
 * Creates a gentle scale oscillation that makes elements feel "alive"
 * during long hold periods.
 * 
 * @param {number} frame - Current frame
 * @param {object} config - Configuration
 * @param {number} config.startFrame - When breathing starts
 * @param {number} config.frequency - Pulse speed (0.02 = slow, 0.04 = medium)
 * @param {number} config.amplitude - Scale range (0.03 = ±3% scale)
 * @param {number} config.phaseOffset - Phase offset for variety (0 to 2*PI)
 * @param {boolean} config.enabled - Whether breathing is active
 * @returns {number} - Scale multiplier (e.g., 1.0 to 1.03)
 * 
 * @example
 * const breathing = getContinuousBreathing(frame, {
 *   startFrame: 60,
 *   frequency: 0.03,
 *   amplitude: 0.03,
 *   phaseOffset: 0,
 *   enabled: true
 * });
 * // Returns: 1.015 (scale between 1.0 and 1.03)
 * 
 * <div style={{ transform: `scale(${breathing})` }}>
 *   Content
 * </div>
 */
export const getContinuousBreathing = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.03,
    amplitude = 0.03,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 1.0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  
  // Scale oscillates: 1.0 → (1.0 + amplitude) → 1.0 → (1.0 - amplitude/2) → 1.0
  // We use asymmetric range so baseline is 1.0 (not 0.985 ↔ 1.015)
  const scaleVariation = (wave * amplitude) / 2;
  
  return 1.0 + Math.abs(scaleVariation); // Always >= 1.0
};

/**
 * Get continuous floating animation (subtle Y position drift)
 * 
 * Creates a gentle vertical oscillation that simulates natural floating.
 * Often combined with breathing for richer life.
 * 
 * @param {number} frame - Current frame
 * @param {object} config - Configuration
 * @param {number} config.startFrame - When floating starts
 * @param {number} config.frequency - Float speed (0.015 = slow, 0.025 = medium)
 * @param {number} config.amplitude - Vertical distance in pixels (3-7px typical)
 * @param {number} config.phaseOffset - Phase offset for variety
 * @param {boolean} config.enabled - Whether floating is active
 * @returns {number} - Y offset in pixels (e.g., -4 to +4)
 * 
 * @example
 * const floating = getContinuousFloating(frame, {
 *   startFrame: 60,
 *   frequency: 0.02,
 *   amplitude: 5,
 *   phaseOffset: Math.PI / 2,
 *   enabled: true
 * });
 * // Returns: 2.5 (Y offset between -5 and +5)
 * 
 * <div style={{ transform: `translateY(${floating}px)` }}>
 *   Content
 * </div>
 */
export const getContinuousFloating = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.02,
    amplitude = 5,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  
  return wave * amplitude;
};

/**
 * Get continuous subtle rotation (gentle wobble)
 * 
 * Creates a very subtle rotation oscillation for organic feel.
 * Use sparingly - works best on icons, badges, small elements.
 * 
 * @param {number} frame - Current frame
 * @param {object} config - Configuration
 * @param {number} config.startFrame - When rotation starts
 * @param {number} config.frequency - Rotation speed (0.02 typical)
 * @param {number} config.amplitude - Max rotation in degrees (2-5deg typical)
 * @param {number} config.phaseOffset - Phase offset for variety
 * @param {boolean} config.enabled - Whether rotation is active
 * @returns {number} - Rotation in degrees (e.g., -3 to +3)
 * 
 * @example
 * const rotation = getContinuousRotation(frame, {
 *   startFrame: 60,
 *   frequency: 0.025,
 *   amplitude: 3,
 *   enabled: true
 * });
 * // Returns: 1.5 (rotation between -3 and +3 degrees)
 * 
 * <div style={{ transform: `rotate(${rotation}deg)` }}>
 *   🎯
 * </div>
 */
export const getContinuousRotation = (frame, config) => {
  const {
    startFrame = 0,
    frequency = 0.025,
    amplitude = 3,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  if (!enabled || frame < startFrame) {
    return 0;
  }
  
  const progress = frame - startFrame;
  const wave = Math.sin(progress * frequency + phaseOffset);
  
  return wave * amplitude;
};

/**
 * Get multi-property continuous life (breathing + floating combined)
 * 
 * Convenience function that combines breathing and floating for richer animation.
 * Returns object with both scale and Y offset.
 * 
 * @param {number} frame - Current frame
 * @param {object} config - Configuration
 * @param {number} config.startFrame - When animation starts
 * @param {number} config.breathingFrequency - Breathing speed
 * @param {number} config.breathingAmplitude - Scale range
 * @param {number} config.floatingFrequency - Floating speed
 * @param {number} config.floatingAmplitude - Y distance
 * @param {number} config.phaseOffset - Phase offset
 * @param {boolean} config.enabled - Whether animation is active
 * @returns {object} - { scale, y }
 * 
 * @example
 * const life = getContinuousLife(frame, {
 *   startFrame: 60,
 *   breathingFrequency: 0.03,
 *   breathingAmplitude: 0.03,
 *   floatingFrequency: 0.02,
 *   floatingAmplitude: 4,
 *   phaseOffset: Math.PI / 4,
 *   enabled: true
 * });
 * 
 * <div style={{
 *   transform: `translateY(${life.y}px) scale(${life.scale})`
 * }}>
 *   Content
 * </div>
 */
export const getContinuousLife = (frame, config) => {
  const {
    startFrame = 0,
    breathingFrequency = 0.03,
    breathingAmplitude = 0.03,
    floatingFrequency = 0.02,
    floatingAmplitude = 4,
    phaseOffset = 0,
    enabled = true
  } = config;
  
  const scale = getContinuousBreathing(frame, {
    startFrame,
    frequency: breathingFrequency,
    amplitude: breathingAmplitude,
    phaseOffset,
    enabled
  });
  
  const y = getContinuousFloating(frame, {
    startFrame,
    frequency: floatingFrequency,
    amplitude: floatingAmplitude,
    phaseOffset: phaseOffset + Math.PI / 4, // Slightly offset for complexity
    enabled
  });
  
  return { scale, y };
};

/**
 * USAGE PATTERNS:
 * 
 * 1. SIMPLE BREATHING (most common):
 * ```javascript
 * const breathing = getContinuousBreathing(frame, {
 *   startFrame: itemVisibleFrame,
 *   enabled: config.animation.continuousBreathing
 * });
 * 
 * <div style={{ transform: `scale(${breathing})` }}>...</div>
 * ```
 * 
 * 2. COMBINED LIFE (rich animation):
 * ```javascript
 * const life = getContinuousLife(frame, {
 *   startFrame: itemVisibleFrame,
 *   phaseOffset: index * Math.PI / 3, // Stagger by index
 *   enabled: config.animation.continuousLife
 * });
 * 
 * <div style={{
 *   transform: `translateY(${life.y}px) scale(${life.scale})`
 * }}>...</div>
 * ```
 * 
 * 3. PHASE-SHIFTED GROUP:
 * ```javascript
 * items.map((item, i) => {
 *   const life = getContinuousLife(frame, {
 *     startFrame: itemVisibleFrame,
 *     phaseOffset: i * (Math.PI / items.length), // Distribute phases evenly
 *     enabled: true
 *   });
 *   // Each item breathes/floats slightly out of sync → organic feel
 * });
 * ```
 * 
 * 4. PAUSE DURING TRANSITIONS:
 * ```javascript
 * const breathing = getContinuousBreathing(frame, {
 *   startFrame: itemVisibleFrame,
 *   enabled: config.animation.continuousBreathing && exitProgress < 0.1
 *   // ↑ Stop breathing when exit starts
 * });
 * ```
 */
