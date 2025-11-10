/**
 * COLLISION DETECTION & PREVENTION SYSTEM
 * 
 * Blueprint v5.0 - Pre-runtime layout validation
 * 
 * PURPOSE:
 * - Detect element overlaps before render time
 * - Suggest automatic layout adjustments
 * - Provide warnings/errors for collision issues
 * - Enable programmatic collision prevention
 * 
 * USAGE:
 * 1. Define bounding boxes for all visual elements
 * 2. Run collision detection during scene setup
 * 3. Apply suggested adjustments or warn developers
 * 4. Validate layouts before export
 */

/**
 * Bounding Box representation
 * @typedef {Object} BoundingBox
 * @property {string} id - Unique element identifier
 * @property {string} type - Element type (text, box, connector, timer, etc.)
 * @property {number} x - X position (center or top-left based on anchorMode)
 * @property {number} y - Y position (center or top-left based on anchorMode)
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 * @property {string} [anchorMode='center'] - 'center' or 'topLeft'
 * @property {number} [priority=0] - Higher priority elements win in conflicts
 * @property {number} [startFrame] - When element appears
 * @property {number} [endFrame] - When element disappears
 * @property {number} [padding=0] - Extra padding around element for collision detection
 * @property {boolean} [flexible=false] - Can this element be moved?
 * @property {Object} [constraints] - Movement constraints {minX, maxX, minY, maxY}
 */

/**
 * Collision result
 * @typedef {Object} Collision
 * @property {string} elementA - ID of first element
 * @property {string} elementB - ID of second element
 * @property {number} overlapArea - Area of overlap in pixels²
 * @property {number} overlapX - X overlap distance
 * @property {number} overlapY - Y overlap distance
 * @property {string} severity - 'critical', 'warning', 'minor'
 * @property {Object} suggestedFix - Suggested position adjustments
 */

/**
 * Convert bounding box to absolute coordinates (top-left + dimensions)
 */
export const normalizeBox = (box) => {
  const { x, y, width, height, anchorMode = 'center', padding = 0 } = box;
  
  let left, top;
  
  if (anchorMode === 'center') {
    left = x - width / 2;
    top = y - height / 2;
  } else {
    left = x;
    top = y;
  }
  
  return {
    ...box,
    left: left - padding,
    top: top - padding,
    right: left + width + padding * 2,
    bottom: top + height + padding * 2,
    centerX: left + width / 2,
    centerY: top + height / 2,
    paddedWidth: width + padding * 2,
    paddedHeight: height + padding * 2,
  };
};

/**
 * Check if two bounding boxes overlap
 */
export const checkOverlap = (boxA, boxB) => {
  const a = normalizeBox(boxA);
  const b = normalizeBox(boxB);
  
  // No overlap if boxes are separated
  if (a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom) {
    return null;
  }
  
  // Calculate overlap
  const overlapLeft = Math.max(a.left, b.left);
  const overlapRight = Math.min(a.right, b.right);
  const overlapTop = Math.max(a.top, b.top);
  const overlapBottom = Math.min(a.bottom, b.bottom);
  
  const overlapX = overlapRight - overlapLeft;
  const overlapY = overlapBottom - overlapTop;
  const overlapArea = overlapX * overlapY;
  
  // Calculate severity based on percentage of overlap
  const areaA = a.paddedWidth * a.paddedHeight;
  const areaB = b.paddedWidth * b.paddedHeight;
  const minArea = Math.min(areaA, areaB);
  const overlapPercentage = (overlapArea / minArea) * 100;
  
  let severity = 'minor';
  if (overlapPercentage > 50) {
    severity = 'critical';
  } else if (overlapPercentage > 20) {
    severity = 'warning';
  }
  
  return {
    elementA: boxA.id,
    elementB: boxB.id,
    overlapArea,
    overlapX,
    overlapY,
    overlapPercentage: overlapPercentage.toFixed(1),
    severity,
    boxA: a,
    boxB: b,
  };
};

/**
 * Check for temporal overlap (do elements exist at the same time?)
 */
export const hasTemporalOverlap = (boxA, boxB) => {
  // If no timing info, assume they overlap
  if (!boxA.startFrame && !boxB.startFrame) return true;
  
  const aStart = boxA.startFrame || 0;
  const aEnd = boxA.endFrame || Infinity;
  const bStart = boxB.startFrame || 0;
  const bEnd = boxB.endFrame || Infinity;
  
  // Check if time ranges overlap
  return aStart < bEnd && bStart < aEnd;
};

/**
 * Detect all collisions in a set of bounding boxes
 */
export const detectCollisions = (boxes, options = {}) => {
  const {
    checkTiming = true,
    minSeverity = 'minor', // 'minor', 'warning', 'critical'
  } = options;
  
  const collisions = [];
  
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const boxA = boxes[i];
      const boxB = boxes[j];
      
      // Skip if boxes don't exist at the same time
      if (checkTiming && !hasTemporalOverlap(boxA, boxB)) {
        continue;
      }
      
      const overlap = checkOverlap(boxA, boxB);
      
      if (overlap) {
        // Filter by severity
        const severityLevels = { minor: 0, warning: 1, critical: 2 };
        const minLevel = severityLevels[minSeverity] || 0;
        const overlapLevel = severityLevels[overlap.severity] || 0;
        
        if (overlapLevel >= minLevel) {
          collisions.push(overlap);
        }
      }
    }
  }
  
  return collisions;
};

/**
 * Suggest position adjustments to resolve collisions
 * Strategy: Move lower-priority or flexible elements
 */
export const suggestAdjustments = (collision, boxes) => {
  const boxA = boxes.find(b => b.id === collision.elementA);
  const boxB = boxes.find(b => b.id === collision.elementB);
  
  if (!boxA || !boxB) return null;
  
  // Determine which element should move
  const movableElement = determineMovableElement(boxA, boxB);
  const fixedElement = movableElement === boxA ? boxB : boxA;
  
  if (!movableElement.flexible) {
    return {
      canResolve: false,
      reason: 'Neither element is marked as flexible',
      recommendation: 'Manually adjust positions in JSON or mark an element as flexible',
    };
  }
  
  // Calculate suggested new position
  const suggestions = calculatePositionSuggestions(
    movableElement,
    fixedElement,
    collision
  );
  
  return {
    canResolve: true,
    elementToMove: movableElement.id,
    currentPosition: { x: movableElement.x, y: movableElement.y },
    suggestions,
  };
};

/**
 * Determine which element should move in a collision
 * Priority: flexible flag > priority value > smaller element
 */
const determineMovableElement = (boxA, boxB) => {
  // Prefer flexible elements
  if (boxA.flexible && !boxB.flexible) return boxA;
  if (boxB.flexible && !boxA.flexible) return boxB;
  
  // Use priority (higher priority stays put)
  const priorityA = boxA.priority || 0;
  const priorityB = boxB.priority || 0;
  
  if (priorityA > priorityB) return boxB;
  if (priorityB > priorityA) return boxA;
  
  // Move smaller element by default
  const areaA = boxA.width * boxA.height;
  const areaB = boxB.width * boxB.height;
  
  return areaA < areaB ? boxA : boxB;
};

/**
 * Calculate suggested new positions to resolve collision
 */
const calculatePositionSuggestions = (movable, fixed, collision) => {
  const suggestions = [];
  
  const normMovable = normalizeBox(movable);
  const normFixed = normalizeBox(fixed);
  
  // Strategy 1: Move vertically (up or down)
  const moveUp = {
    direction: 'up',
    x: movable.x,
    y: movable.y - (collision.overlapY + 10), // 10px extra margin
    distance: collision.overlapY + 10,
  };
  
  const moveDown = {
    direction: 'down',
    x: movable.x,
    y: movable.y + (collision.overlapY + 10),
    distance: collision.overlapY + 10,
  };
  
  // Strategy 2: Move horizontally (left or right)
  const moveLeft = {
    direction: 'left',
    x: movable.x - (collision.overlapX + 10),
    y: movable.y,
    distance: collision.overlapX + 10,
  };
  
  const moveRight = {
    direction: 'right',
    x: movable.x + (collision.overlapX + 10),
    y: movable.y,
    distance: collision.overlapX + 10,
  };
  
  // Add all valid suggestions (respecting constraints)
  [moveUp, moveDown, moveLeft, moveRight].forEach(suggestion => {
    if (isWithinConstraints(suggestion, movable.constraints)) {
      suggestions.push(suggestion);
    }
  });
  
  // Sort by smallest distance (prefer minimal movement)
  suggestions.sort((a, b) => a.distance - b.distance);
  
  return suggestions;
};

/**
 * Check if a position is within element constraints
 */
const isWithinConstraints = (position, constraints) => {
  if (!constraints) return true;
  
  const { minX, maxX, minY, maxY } = constraints;
  
  if (minX !== undefined && position.x < minX) return false;
  if (maxX !== undefined && position.x > maxX) return false;
  if (minY !== undefined && position.y < minY) return false;
  if (maxY !== undefined && position.y > maxY) return false;
  
  return true;
};

/**
 * Automatically resolve collisions by applying suggested adjustments
 * Returns a new set of boxes with adjusted positions
 */
export const autoResolveCollisions = (boxes, options = {}) => {
  const {
    maxIterations = 10,
    onProgress = () => {},
  } = options;
  
  let currentBoxes = [...boxes];
  let iteration = 0;
  
  while (iteration < maxIterations) {
    const collisions = detectCollisions(currentBoxes, { minSeverity: 'warning' });
    
    if (collisions.length === 0) {
      onProgress({ iteration, resolved: true, message: 'All collisions resolved' });
      return {
        success: true,
        boxes: currentBoxes,
        iterations: iteration,
        message: 'All collisions resolved',
      };
    }
    
    onProgress({ 
      iteration, 
      collisionsRemaining: collisions.length,
      message: `Resolving ${collisions.length} collision(s)...`,
    });
    
    // Resolve the most severe collision
    const mostSevere = collisions.sort((a, b) => {
      const severity = { critical: 2, warning: 1, minor: 0 };
      return severity[b.severity] - severity[a.severity];
    })[0];
    
    const adjustment = suggestAdjustments(mostSevere, currentBoxes);
    
    if (!adjustment || !adjustment.canResolve || adjustment.suggestions.length === 0) {
      onProgress({ 
        iteration, 
        resolved: false, 
        message: 'Cannot auto-resolve remaining collisions',
      });
      return {
        success: false,
        boxes: currentBoxes,
        iterations: iteration,
        unresolvedCollisions: collisions,
        message: 'Some collisions could not be auto-resolved',
      };
    }
    
    // Apply the best suggestion
    const bestSuggestion = adjustment.suggestions[0];
    currentBoxes = currentBoxes.map(box => {
      if (box.id === adjustment.elementToMove) {
        return {
          ...box,
          x: bestSuggestion.x,
          y: bestSuggestion.y,
        };
      }
      return box;
    });
    
    iteration++;
  }
  
  return {
    success: false,
    boxes: currentBoxes,
    iterations: iteration,
    message: 'Max iterations reached, some collisions may remain',
    unresolvedCollisions: detectCollisions(currentBoxes, { minSeverity: 'warning' }),
  };
};

/**
 * Generate a collision report for logging/debugging
 */
export const generateCollisionReport = (collisions, boxes) => {
  if (collisions.length === 0) {
    return {
      status: 'OK',
      message: '✅ No collisions detected',
      summary: { critical: 0, warning: 0, minor: 0 },
    };
  }
  
  const summary = {
    critical: collisions.filter(c => c.severity === 'critical').length,
    warning: collisions.filter(c => c.severity === 'warning').length,
    minor: collisions.filter(c => c.severity === 'minor').length,
  };
  
  const details = collisions.map(c => ({
    elementA: c.elementA,
    elementB: c.elementB,
    severity: c.severity,
    overlap: `${c.overlapPercentage}%`,
    suggestion: suggestAdjustments(c, boxes),
  }));
  
  return {
    status: summary.critical > 0 ? 'ERROR' : summary.warning > 0 ? 'WARNING' : 'INFO',
    message: `Found ${collisions.length} collision(s): ${summary.critical} critical, ${summary.warning} warnings, ${summary.minor} minor`,
    summary,
    details,
  };
};

/**
 * Helper: Create bounding box from text element
 * Uses canvas measurement for accurate text dimensions
 */
export const createTextBoundingBox = (textConfig, options = {}) => {
  const {
    id,
    text,
    x,
    y,
    fontSize,
    fontFamily = 'Inter',
    maxWidth,
    lineHeight = 1.3,
    padding = 10,
    anchorMode = 'center',
    priority = 0,
    flexible = false,
  } = { ...textConfig, ...options };
  
  // Estimate text dimensions (rough calculation)
  // For more accuracy, use canvas.measureText() in browser
  const avgCharWidth = fontSize * 0.5; // Rough estimate
  const estimatedWidth = Math.min(text.length * avgCharWidth, maxWidth || 1000);
  const lines = Math.ceil((text.length * avgCharWidth) / (maxWidth || 1000));
  const estimatedHeight = fontSize * lineHeight * Math.max(lines, 1);
  
  return {
    id,
    type: 'text',
    x,
    y,
    width: estimatedWidth,
    height: estimatedHeight,
    anchorMode,
    padding,
    priority,
    flexible,
  };
};

/**
 * Helper: Create bounding box from shape/box element
 */
export const createShapeBoundingBox = (shapeConfig, options = {}) => {
  const {
    id,
    x,
    y,
    width,
    height,
    anchorMode = 'center',
    padding = 0,
    priority = 0,
    flexible = false,
  } = { ...shapeConfig, ...options };
  
  return {
    id,
    type: 'shape',
    x,
    y,
    width,
    height,
    anchorMode,
    padding,
    priority,
    flexible,
  };
};

/**
 * Validation function for scene layouts
 * Call this during development to catch collisions early
 */
export const validateSceneLayout = (scene, templateLayoutConfig) => {
  console.group(`🔍 Collision Detection: ${scene.scene_id}`);
  
  const boxes = templateLayoutConfig.getBoundingBoxes(scene);
  const collisions = detectCollisions(boxes, { minSeverity: 'warning' });
  const report = generateCollisionReport(collisions, boxes);
  
  console.log(report.message);
  
  if (report.status !== 'OK') {
    console.warn('⚠️ Collision Details:', report.details);
  }
  
  console.groupEnd();
  
  return {
    valid: report.status === 'OK',
    report,
    collisions,
  };
};

export default {
  normalizeBox,
  checkOverlap,
  hasTemporalOverlap,
  detectCollisions,
  suggestAdjustments,
  autoResolveCollisions,
  generateCollisionReport,
  createTextBoundingBox,
  createShapeBoundingBox,
  validateSceneLayout,
};
