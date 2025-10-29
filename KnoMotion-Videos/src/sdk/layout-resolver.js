/**
 * LAYOUT RESOLVER - Smart Layout Algorithms
 * 
 * Blueprint v5.0 - Intelligent positioning to prevent collisions
 * 
 * PURPOSE:
 * - Calculate safe positions for dynamic elements
 * - Ensure spacing between elements
 * - Provide template-specific layout strategies
 */

import {
  createTextBoundingBox,
  createShapeBoundingBox,
  detectCollisions,
  autoResolveCollisions,
} from './collision-detection';

/**
 * Calculate safe position for an element that avoids collisions with existing elements
 */
export const findSafePosition = (element, existingElements, options = {}) => {
  const {
    preferredPosition = { x: element.x, y: element.y },
    searchRadius = 200,
    stepSize = 20,
    constraints = {},
  } = options;
  
  // Create bounding box for the element at preferred position
  let testBox = {
    ...element,
    x: preferredPosition.x,
    y: preferredPosition.y,
  };
  
  // Check if preferred position is collision-free
  const collisions = detectCollisions([testBox, ...existingElements]);
  if (collisions.length === 0) {
    return preferredPosition;
  }
  
  // Search in expanding circles for a safe position
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  for (let radius = stepSize; radius <= searchRadius; radius += stepSize) {
    for (let angle of angles) {
      const radian = (angle * Math.PI) / 180;
      const testX = preferredPosition.x + Math.cos(radian) * radius;
      const testY = preferredPosition.y + Math.sin(radian) * radius;
      
      // Check constraints
      if (constraints.minX && testX < constraints.minX) continue;
      if (constraints.maxX && testX > constraints.maxX) continue;
      if (constraints.minY && testY < constraints.minY) continue;
      if (constraints.maxY && testY > constraints.maxY) continue;
      
      testBox = { ...element, x: testX, y: testY };
      const testCollisions = detectCollisions([testBox, ...existingElements]);
      
      if (testCollisions.length === 0) {
        return { x: testX, y: testY };
      }
    }
  }
  
  // If no safe position found, return preferred position with warning
  console.warn(`⚠️ Could not find collision-free position for ${element.id}`);
  return preferredPosition;
};

/**
 * EXPLAIN 2A: Safe connector layout calculator
 * Ensures connectors don't overlap with text boxes
 */
export const calculateSafeConnectorPath = (centerBox, targetBox, options = {}) => {
  const {
    padding = 20, // Extra padding around boxes
    curveIntensity = 0.5,
  } = options;
  
  // Calculate connection points on the edges of boxes (not centers)
  const centerNorm = {
    left: centerBox.x - centerBox.width / 2,
    right: centerBox.x + centerBox.width / 2,
    top: centerBox.y - centerBox.height / 2,
    bottom: centerBox.y + centerBox.height / 2,
    centerX: centerBox.x,
    centerY: centerBox.y,
  };
  
  const targetNorm = {
    left: targetBox.x - targetBox.width / 2,
    right: targetBox.x + targetBox.width / 2,
    top: targetBox.y - targetBox.height / 2,
    bottom: targetBox.y + targetBox.height / 2,
    centerX: targetBox.x,
    centerY: targetBox.y,
  };
  
  // Determine best connection points based on relative positions
  let startX, startY, endX, endY;
  
  // Target is below center
  if (targetNorm.centerY > centerNorm.bottom) {
    startX = centerNorm.centerX;
    startY = centerNorm.bottom + padding;
    endX = targetNorm.centerX;
    endY = targetNorm.top - padding;
  }
  // Target is above center
  else if (targetNorm.centerY < centerNorm.top) {
    startX = centerNorm.centerX;
    startY = centerNorm.top - padding;
    endX = targetNorm.centerX;
    endY = targetNorm.bottom + padding;
  }
  // Target is to the right
  else if (targetNorm.centerX > centerNorm.right) {
    startX = centerNorm.right + padding;
    startY = centerNorm.centerY;
    endX = targetNorm.left - padding;
    endY = targetNorm.centerY;
  }
  // Target is to the left
  else {
    startX = centerNorm.left - padding;
    startY = centerNorm.centerY;
    endX = targetNorm.right + padding;
    endY = targetNorm.centerY;
  }
  
  // Create curved path using quadratic bezier
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Control point for curve (slightly offset for smooth arc)
  const dx = endX - startX;
  const dy = endY - startY;
  const controlX = midX - dy * curveIntensity * 0.2;
  const controlY = midY + dx * curveIntensity * 0.2;
  
  return {
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    control: { x: controlX, y: controlY },
    pathData: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    length: Math.sqrt(dx * dx + dy * dy),
  };
};

/**
 * APPLY 3A: Calculate safe timer position
 * Ensures timer doesn't overlap with question text
 */
export const calculateSafeTimerPosition = (questionBox, options = {}) => {
  const {
    defaultPosition = { x: 960, y: 200 },
    minSpacing = 40,
    canvasWidth = 1920,
    canvasHeight = 1080,
  } = options;
  
  // Create bounding box for timer
  const timerBox = {
    id: 'timer',
    type: 'timer',
    x: defaultPosition.x,
    y: defaultPosition.y,
    width: 160,
    height: 160,
    anchorMode: 'center',
    padding: minSpacing,
  };
  
  // Check collision with question
  const boxes = [questionBox, timerBox];
  const collisions = detectCollisions(boxes);
  
  if (collisions.length === 0) {
    return defaultPosition;
  }
  
  // Try alternative positions
  const alternatives = [
    // Top center (higher up)
    { x: canvasWidth / 2, y: 120 },
    // Top right corner
    { x: canvasWidth - 150, y: 150 },
    // Top left corner
    { x: 150, y: 150 },
  ];
  
  for (let altPos of alternatives) {
    const testTimer = { ...timerBox, x: altPos.x, y: altPos.y };
    const testCollisions = detectCollisions([questionBox, testTimer]);
    
    if (testCollisions.length === 0) {
      return altPos;
    }
  }
  
  // If all positions collide, move question down instead and keep timer at top
  console.warn('⚠️ Timer position conflicts - consider adjusting question position');
  return { x: canvasWidth / 2, y: 120 }; // Force timer to top
};

/**
 * Calculate safe positions for multiple elements with mutual avoidance
 */
export const calculateSafeLayout = (elements, options = {}) => {
  const {
    canvas = { width: 1920, height: 1080 },
    minSpacing = 20,
    maxIterations = 5,
  } = options;
  
  // Start with initial positions
  let currentElements = elements.map(el => ({
    ...el,
    flexible: el.flexible !== false, // Default to flexible
  }));
  
  // Iteratively resolve collisions
  const result = autoResolveCollisions(currentElements, {
    maxIterations,
    onProgress: ({ iteration, collisionsRemaining, message }) => {
      if (collisionsRemaining > 0) {
        console.log(`Layout iteration ${iteration}: ${message}`);
      }
    },
  });
  
  return {
    success: result.success,
    elements: result.boxes,
    iterations: result.iterations,
    message: result.message,
  };
};

/**
 * Validate and adjust element spacing
 * Ensures minimum spacing between all elements
 */
export const enforceMinimumSpacing = (elements, minSpacing = 20) => {
  const adjusted = [];
  
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const others = adjusted; // Only check against already placed elements
    
    const safePos = findSafePosition(element, others, {
      preferredPosition: { x: element.x, y: element.y },
      searchRadius: 300,
      stepSize: minSpacing,
    });
    
    adjusted.push({
      ...element,
      x: safePos.x,
      y: safePos.y,
    });
  }
  
  return adjusted;
};

/**
 * Calculate grid-based safe layout (for Apply 3A quiz options)
 */
export const calculateGridLayout = (items, options = {}) => {
  const {
    containerWidth = 800,
    containerHeight = 600,
    itemWidth = 400,
    itemHeight = 80,
    gap = 30,
    startY = 400,
    centerX = 960,
  } = options;
  
  const positions = [];
  
  items.forEach((item, index) => {
    const y = startY + index * (itemHeight + gap);
    
    positions.push({
      ...item,
      x: centerX,
      y: y,
      width: itemWidth,
      height: itemHeight,
      anchorMode: 'center',
    });
  });
  
  return positions;
};

/**
 * Get bounding boxes for Explain2A template
 */
export const getExplain2ABoundingBoxes = (scene, fps) => {
  const data = scene.fill?.concept || {};
  const parts = data.parts || [];
  const beats = scene.beats || {};
  
  const boxes = [];
  
  // Title box
  boxes.push(
    createTextBoundingBox({
      id: 'title',
      text: data.title || 'Breaking It Down',
      x: 960,
      y: 100,
      fontSize: 56,
      maxWidth: 1200,
      padding: 20,
      anchorMode: 'center',
      priority: 10, // High priority - don't move
      flexible: false,
    })
  );
  
  // Center concept box
  boxes.push(
    createShapeBoundingBox({
      id: 'centerConcept',
      x: 960,
      y: 460,
      width: 400,
      height: 160,
      padding: 20,
      priority: 10, // High priority - don't move
      flexible: false,
    })
  );
  
  // Part boxes (dynamic layout)
  const partPositions = calculatePartPositions(parts.length);
  parts.forEach((part, i) => {
    const pos = partPositions[i];
    boxes.push(
      createShapeBoundingBox({
        id: `part-${i}`,
        x: pos.x,
        y: pos.y,
        width: 340,
        height: 160,
        padding: 10,
        priority: 5,
        flexible: false,
      })
    );
  });
  
  return boxes;
};

/**
 * Calculate part positions for Explain2A (helper)
 */
const calculatePartPositions = (count) => {
  const boxWidth = 340;
  const totalWidth = 1920;
  const margin = 80;
  
  if (count <= 4) {
    const availableWidth = totalWidth - margin * 2;
    const spacing = (availableWidth - boxWidth * count) / Math.max(count - 1, 1);
    
    return Array.from({ length: count }, (_, i) => ({
      x: margin + (boxWidth + spacing) * i + boxWidth / 2,
      y: 750,
    }));
  }
  
  // Two rows for 5+ items
  const row1Count = Math.ceil(count / 2);
  const row2Count = count - row1Count;
  const positions = [];
  
  // Row 1
  const availableWidth1 = totalWidth - margin * 2;
  const spacing1 = (availableWidth1 - boxWidth * row1Count) / Math.max(row1Count - 1, 1);
  for (let i = 0; i < row1Count; i++) {
    positions.push({
      x: margin + (boxWidth + spacing1) * i + boxWidth / 2,
      y: 650,
    });
  }
  
  // Row 2
  const availableWidth2 = totalWidth - margin * 2;
  const spacing2 = (availableWidth2 - boxWidth * row2Count) / Math.max(row2Count - 1, 1);
  const offsetX = (totalWidth - (boxWidth * row2Count + spacing2 * (row2Count - 1))) / 2;
  for (let i = 0; i < row2Count; i++) {
    positions.push({
      x: offsetX + (boxWidth + spacing2) * i + boxWidth / 2,
      y: 850,
    });
  }
  
  return positions;
};

/**
 * Get bounding boxes for Apply3A template
 */
export const getApply3ABoundingBoxes = (scene, fps) => {
  const data = scene.fill?.quiz || {};
  const options = data.options || [];
  
  const boxes = [];
  
  // Question box (dynamic height based on text length)
  const questionText = data.question || '';
  boxes.push(
    createTextBoundingBox({
      id: 'question',
      text: questionText,
      x: 960,
      y: 180,
      fontSize: 52,
      maxWidth: 900,
      lineHeight: 1.3,
      padding: 20,
      anchorMode: 'center',
      priority: 10,
      flexible: false,
    })
  );
  
  // Timer box (needs to avoid question)
  const questionBox = boxes[0];
  const safeTimerPos = calculateSafeTimerPosition(questionBox, {
    defaultPosition: { x: 960, y: 200 },
    minSpacing: 40,
  });
  
  boxes.push(
    createShapeBoundingBox({
      id: 'timer',
      x: safeTimerPos.x,
      y: safeTimerPos.y,
      width: 160,
      height: 160,
      padding: 20,
      priority: 8,
      flexible: true,
    })
  );
  
  // Quiz options (grid layout)
  const optionPositions = calculateGridLayout(options, {
    itemHeight: 80,
    gap: 30,
    startY: 450,
  });
  
  optionPositions.forEach((pos, i) => {
    boxes.push(
      createShapeBoundingBox({
        id: `option-${i}`,
        x: pos.x,
        y: pos.y,
        width: 760,
        height: 80,
        padding: 10,
        priority: 5,
        flexible: false,
      })
    );
  });
  
  return boxes;
};

export default {
  findSafePosition,
  calculateSafeConnectorPath,
  calculateSafeTimerPosition,
  calculateSafeLayout,
  enforceMinimumSpacing,
  calculateGridLayout,
  getExplain2ABoundingBoxes,
  getApply3ABoundingBoxes,
};
