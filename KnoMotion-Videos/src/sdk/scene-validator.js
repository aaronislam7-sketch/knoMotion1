/**
 * SCENE VALIDATOR - Pre-runtime validation system
 * 
 * Blueprint v5.0 - Catch layout issues before they become runtime problems
 * 
 * PURPOSE:
 * - Validate scene JSON structure
 * - Check for element collisions
 * - Warn about potential layout issues
 * - Provide actionable feedback to developers
 */

import { detectCollisions, generateCollisionReport } from './collision-detection';
import { getExplain2ABoundingBoxes, getApply3ABoundingBoxes } from './layout-resolver';

/**
 * Template-specific layout validators
 * Maps template IDs to their bounding box generators
 */
const TEMPLATE_VALIDATORS = {
  'Explain2AConceptBreakdown': {
    getBoundingBoxes: getExplain2ABoundingBoxes,
    name: 'Explain 2A: Concept Breakdown',
  },
  'Apply3AMicroQuiz': {
    getBoundingBoxes: getApply3ABoundingBoxes,
    name: 'Apply 3A: Micro Quiz',
  },
  // Add more templates here as needed
};

/**
 * Validate a single scene for collisions and layout issues
 */
export const validateScene = (scene, fps = 30, options = {}) => {
  const {
    verbose = true,
    minSeverity = 'warning',
  } = options;
  
  const templateId = scene.template_id;
  const validator = TEMPLATE_VALIDATORS[templateId];
  
  if (!validator) {
    if (verbose) {
      console.log(`ℹ️ No collision validator for template: ${templateId}`);
    }
    return {
      validated: false,
      reason: 'No validator available',
      templateId,
    };
  }
  
  try {
    // Get bounding boxes for this template
    const boxes = validator.getBoundingBoxes(scene, fps);
    
    // Detect collisions
    const collisions = detectCollisions(boxes, { minSeverity });
    
    // Generate report
    const report = generateCollisionReport(collisions, boxes);
    
    if (verbose) {
      console.group(`🔍 Validating: ${validator.name} (${scene.scene_id})`);
      console.log(report.message);
      
      if (report.status === 'ERROR') {
        console.error('❌ Critical collisions detected:', report.details);
      } else if (report.status === 'WARNING') {
        console.warn('⚠️ Collision warnings:', report.details);
      } else {
        console.log('✅ Layout validated - no collisions');
      }
      
      console.groupEnd();
    }
    
    return {
      validated: true,
      valid: report.status === 'OK',
      report,
      collisions,
      boxes,
      templateId,
      templateName: validator.name,
    };
  } catch (error) {
    console.error(`❌ Validation error for ${templateId}:`, error);
    return {
      validated: false,
      error: error.message,
      templateId,
    };
  }
};

/**
 * Validate multiple scenes at once
 */
export const validateScenes = (scenes, fps = 30, options = {}) => {
  const results = scenes.map(scene => validateScene(scene, fps, options));
  
  const summary = {
    total: results.length,
    validated: results.filter(r => r.validated).length,
    valid: results.filter(r => r.valid).length,
    warnings: results.filter(r => r.report?.status === 'WARNING').length,
    errors: results.filter(r => r.report?.status === 'ERROR').length,
  };
  
  return {
    results,
    summary,
    allValid: summary.errors === 0,
  };
};

/**
 * Development-time validator
 * Call this in development to validate all scenes in a project
 */
export const validateAllScenes = async (sceneFiles, fps = 30) => {
  console.group('🔍 SCENE LAYOUT VALIDATION');
  console.log(`Validating ${sceneFiles.length} scenes...`);
  
  const results = validateScenes(sceneFiles, fps, { verbose: false });
  
  console.log('\n📊 VALIDATION SUMMARY:');
  console.log(`Total scenes: ${results.summary.total}`);
  console.log(`Validated: ${results.summary.validated}`);
  console.log(`✅ Valid: ${results.summary.valid}`);
  console.log(`⚠️ Warnings: ${results.summary.warnings}`);
  console.log(`❌ Errors: ${results.summary.errors}`);
  
  // Show details for problematic scenes
  const problematic = results.results.filter(
    r => r.report?.status === 'ERROR' || r.report?.status === 'WARNING'
  );
  
  if (problematic.length > 0) {
    console.log('\n⚠️ SCENES WITH ISSUES:');
    problematic.forEach(result => {
      console.group(`${result.templateName} (${result.report.status})`);
      console.log('Scene ID:', result.templateId);
      console.log('Collisions:', result.report.details);
      console.groupEnd();
    });
  }
  
  console.groupEnd();
  
  return results;
};

/**
 * Register a custom validator for a template
 */
export const registerTemplateValidator = (templateId, validator) => {
  TEMPLATE_VALIDATORS[templateId] = validator;
};

/**
 * Get registered validators
 */
export const getRegisteredValidators = () => {
  return Object.keys(TEMPLATE_VALIDATORS);
};

/**
 * Helper: Validate scene on template mount (React hook)
 */
export const useSceneValidation = (scene, fps) => {
  if (process.env.NODE_ENV === 'development') {
    const result = validateScene(scene, fps, { verbose: true });
    return result;
  }
  return { validated: false, reason: 'Production mode' };
};

export default {
  validateScene,
  validateScenes,
  validateAllScenes,
  registerTemplateValidator,
  getRegisteredValidators,
  useSceneValidation,
};
