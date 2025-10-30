/**
 * Scene Compatibility Helper
 * Handles backward compatibility between v5.0 and v5.1 schemas
 * 
 * @module sceneCompatibility
 * @category SDK
 * @subcategory Validation
 */

import { SceneSchema, detectSchemaVersion } from './scene.schema';

/**
 * Validate scene with helpful error messages
 * 
 * @param {Object} scene - Scene data to validate
 * @returns {Object} Validation result {valid, errors, warnings, version}
 */
export const validateSceneCompat = (scene) => {
  const version = detectSchemaVersion(scene);
  const result = {
    valid: false,
    version,
    errors: [],
    warnings: [],
    info: []
  };

  // Try Zod validation
  try {
    SceneSchema.parse(scene);
    result.valid = true;
    
    // Add info based on version
    if (version === '5.0') {
      result.info.push('Using legacy v5.0 format (fill.texts)');
      result.warnings.push('Consider migrating to v5.1 agnostic format for better flexibility');
    } else if (version === '5.1') {
      result.info.push('Using v5.1 agnostic format (question/hero)');
    }
    
    return result;
  } catch (error) {
    // Parse Zod errors into friendly messages
    if (error.errors) {
      error.errors.forEach(err => {
        const path = err.path.join('.');
        const message = err.message;
        
        // Provide context-specific error messages
        if (path === '' && message.includes('fill') && message.includes('question')) {
          result.errors.push(
            'Missing required fields. Scene must have either:\n' +
            '  - v5.0 format: "fill": { "texts": {...} }\n' +
            '  - v5.1 format: "question": { "lines": [...] } and/or "hero": { "type": "..." }'
          );
        } else {
          result.errors.push(`${path}: ${message}`);
        }
      });
    } else {
      result.errors.push(error.message || 'Unknown validation error');
    }
    
    return result;
  }
};

/**
 * Validate and provide migration hints
 * 
 * @param {Object} scene - Scene data
 * @returns {Object} Result with migration suggestions
 */
export const validateWithMigrationHints = (scene) => {
  const validation = validateSceneCompat(scene);
  
  if (!validation.valid && validation.version === 'unknown') {
    validation.warnings.push(
      'Unable to detect schema version. Add "schema_version": "5.0" or "5.1" to your JSON.'
    );
  }
  
  // Check for common migration issues
  if (scene.fill && scene.fill.texts) {
    const hasQuestionParts = 
      scene.fill.texts.questionPart1 || 
      scene.fill.texts.questionPart2;
    
    if (hasQuestionParts && !scene.question) {
      validation.info.push(
        'MIGRATION TIP: Convert questionPart1/questionPart2 to question.lines array:\n' +
        '  "question": {\n' +
        '    "lines": [\n' +
        '      { "text": "' + (scene.fill.texts.questionPart1 || '') + '", "emphasis": "normal" },\n' +
        '      { "text": "' + (scene.fill.texts.questionPart2 || '') + '", "emphasis": "high" }\n' +
        '    ]\n' +
        '  }'
      );
    }
  }
  
  return validation;
};

/**
 * Check if scene is ready for agnostic template
 * 
 * @param {Object} scene - Scene data
 * @returns {Object} Compatibility check result
 */
export const checkAgnosticCompatibility = (scene) => {
  const version = detectSchemaVersion(scene);
  
  const result = {
    compatible: false,
    version,
    issues: [],
    recommendations: []
  };
  
  if (version === '5.1') {
    result.compatible = true;
    result.recommendations.push('Scene is already using v5.1 agnostic format');
    return result;
  }
  
  if (version === '5.0') {
    result.compatible = false;
    result.issues.push('Scene uses legacy v5.0 format');
    
    // Check what needs to be migrated
    if (scene.fill?.texts?.questionPart1 || scene.fill?.texts?.questionPart2) {
      result.recommendations.push('Migrate questionPart1/2 to question.lines array');
    }
    
    result.recommendations.push('Add hero configuration if using visual elements');
    result.recommendations.push('Use position tokens instead of hardcoded positions');
    
    return result;
  }
  
  result.issues.push('Unknown schema version');
  result.recommendations.push('Add schema_version field and update to v5.0 or v5.1');
  
  return result;
};

/**
 * Auto-migrate v5.0 scene to v5.1 format
 * 
 * @param {Object} scene - Legacy v5.0 scene
 * @returns {Object} Migrated v5.1 scene
 */
export const autoMigrateToV51 = (scene) => {
  const version = detectSchemaVersion(scene);
  
  if (version === '5.1') {
    return { ...scene }; // Already v5.1
  }
  
  if (version !== '5.0') {
    throw new Error('Can only auto-migrate v5.0 scenes');
  }
  
  const migrated = {
    ...scene,
    schema_version: '5.1'
  };
  
  // Migrate question parts
  if (scene.fill?.texts?.questionPart1 || scene.fill?.texts?.questionPart2) {
    const lines = [];
    
    if (scene.fill.texts.questionPart1) {
      lines.push({
        text: scene.fill.texts.questionPart1,
        emphasis: 'normal'
      });
    }
    
    if (scene.fill.texts.questionPart2) {
      lines.push({
        text: scene.fill.texts.questionPart2,
        emphasis: 'high'
      });
    }
    
    migrated.question = {
      lines,
      layout: {
        arrangement: 'stacked',
        stagger: 0.3,
        verticalSpacing: 80,
        basePosition: 'center',
        centerStack: true
      },
      animation: {
        entrance: 'fadeUp',
        entranceDuration: 0.9,
        movePattern: 'firstMoves'
      }
    };
  }
  
  // Add default hero if not present
  if (!migrated.hero) {
    migrated.hero = {
      type: 'roughSVG',
      asset: 'default',
      position: 'center'
    };
  }
  
  // Migrate welcome/subtitle
  if (scene.fill?.texts?.welcome) {
    migrated.welcome = {
      text: scene.fill.texts.welcome,
      position: 'center',
      effects: ['shimmer']
    };
  }
  
  if (scene.fill?.texts?.subtitle) {
    migrated.subtitle = {
      text: scene.fill.texts.subtitle,
      position: 'bottom-center'
    };
  }
  
  // Keep fill for backward compatibility
  // migrated.fill = scene.fill;
  
  return migrated;
};

/**
 * Get friendly validation message
 * 
 * @param {Object} scene - Scene data
 * @returns {string} User-friendly message
 */
export const getValidationMessage = (scene) => {
  const validation = validateWithMigrationHints(scene);
  
  if (validation.valid) {
    return `✅ Scene validated successfully (${validation.version})`;
  }
  
  let message = '❌ Scene validation failed:\n\n';
  
  validation.errors.forEach(err => {
    message += `  • ${err}\n`;
  });
  
  if (validation.warnings.length > 0) {
    message += '\n⚠️ Warnings:\n';
    validation.warnings.forEach(warn => {
      message += `  • ${warn}\n`;
    });
  }
  
  if (validation.info.length > 0) {
    message += '\nℹ️ Migration Tips:\n';
    validation.info.forEach(info => {
      message += `  ${info}\n`;
    });
  }
  
  return message;
};

export default {
  validateSceneCompat,
  validateWithMigrationHints,
  checkAgnosticCompatibility,
  autoMigrateToV51,
  getValidationMessage
};
