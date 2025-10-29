/**
 * SCENE VALIDATION UTILITY
 * 
 * Run this script to validate all scenes for collision issues
 * 
 * Usage:
 *   import { validateAllProjectScenes } from './utils/validate-scenes';
 *   validateAllProjectScenes();
 */

import { validateScene, validateScenes } from '../sdk/scene-validator';

// Import scene JSON files
import explain2aScene from '../scenes/explain_2a_breakdown_v5.json';
import apply3aScene from '../scenes/apply_3a_quiz_v5.json';
import explain2bScene from '../scenes/explain_2b_analogy_v5.json';
import apply3bScene from '../scenes/apply_3b_scenario_v5.json';
import hook1aScene from '../scenes/hook_1a_knodovia_map_v5.json';
import hook1eScene from '../scenes/hook_1e_mystery_v5.json';
import reflect4aScene from '../scenes/reflect_4a_takeaways_v5.json';
import reflect4dScene from '../scenes/reflect_4d_forward_v5.json';

/**
 * Validate all project scenes
 */
export const validateAllProjectScenes = (fps = 30) => {
  console.log('🔍 VALIDATING ALL SCENES FOR COLLISIONS\n');
  console.log('=' .repeat(60));
  
  const scenes = [
    explain2aScene,
    apply3aScene,
    explain2bScene,
    apply3bScene,
    hook1aScene,
    hook1eScene,
    reflect4aScene,
    reflect4dScene,
  ];
  
  const results = validateScenes(scenes, fps, { verbose: false });
  
  console.log('\n📊 VALIDATION SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total scenes: ${results.summary.total}`);
  console.log(`✅ Valid (no collisions): ${results.summary.valid}`);
  console.log(`⚠️ Warnings: ${results.summary.warnings}`);
  console.log(`❌ Errors (critical): ${results.summary.errors}`);
  console.log(`Not validated: ${results.summary.total - results.summary.validated}`);
  
  // Show individual results
  console.log('\n📋 INDIVIDUAL RESULTS');
  console.log('=' .repeat(60));
  
  results.results.forEach(result => {
    if (!result.validated) {
      console.log(`⚪ ${result.templateId}: ${result.reason || 'No validator available'}`);
      return;
    }
    
    const icon = result.valid ? '✅' : result.report.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${icon} ${result.templateName || result.templateId}`);
    
    if (!result.valid && result.report?.details) {
      result.report.details.forEach(detail => {
        console.log(`   - ${detail.severity.toUpperCase()}: ${detail.elementA} ↔ ${detail.elementB} (${detail.overlap} overlap)`);
        if (detail.suggestion?.canResolve && detail.suggestion.suggestions?.length > 0) {
          const best = detail.suggestion.suggestions[0];
          console.log(`     💡 Suggestion: Move ${detail.suggestion.elementToMove} ${best.direction} by ${Math.round(best.distance)}px`);
        }
      });
    }
  });
  
  console.log('\n' + '=' .repeat(60));
  
  if (results.allValid) {
    console.log('✅ ALL SCENES PASSED VALIDATION!');
  } else {
    console.log('⚠️ SOME SCENES HAVE COLLISION ISSUES - See details above');
  }
  
  return results;
};

/**
 * Validate specific scene (for development testing)
 */
export const validateSpecificScene = (sceneId, fps = 30) => {
  const sceneMap = {
    'explain2a': explain2aScene,
    'apply3a': apply3aScene,
    'explain2b': explain2bScene,
    'apply3b': apply3bScene,
    'hook1a': hook1aScene,
    'hook1e': hook1eScene,
    'reflect4a': reflect4aScene,
    'reflect4d': reflect4dScene,
  };
  
  const scene = sceneMap[sceneId];
  
  if (!scene) {
    console.error(`❌ Scene not found: ${sceneId}`);
    return null;
  }
  
  console.log(`\n🔍 Validating: ${sceneId}`);
  console.log('=' .repeat(60));
  
  const result = validateScene(scene, fps, { verbose: true });
  
  console.log('=' .repeat(60));
  
  return result;
};

/**
 * Test the two fixed scenes (Explain2A and Apply3A)
 */
export const testFixedScenes = (fps = 30) => {
  console.log('🧪 TESTING COLLISION FIXES\n');
  console.log('=' .repeat(60));
  
  console.log('\n1️⃣ Testing Explain2A (connector overlaps fix)...\n');
  const explain2aResult = validateSpecificScene('explain2a', fps);
  
  console.log('\n2️⃣ Testing Apply3A (timer overlap fix)...\n');
  const apply3aResult = validateSpecificScene('apply3a', fps);
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('=' .repeat(60));
  
  const explain2aStatus = explain2aResult?.valid ? '✅ PASS' : explain2aResult?.validated ? '❌ FAIL' : '⚪ SKIPPED';
  const apply3aStatus = apply3aResult?.valid ? '✅ PASS' : apply3aResult?.validated ? '❌ FAIL' : '⚪ SKIPPED';
  
  console.log(`Explain2A: ${explain2aStatus}`);
  console.log(`Apply3A: ${apply3aStatus}`);
  
  const allPassed = explain2aResult?.valid && apply3aResult?.valid;
  
  if (allPassed) {
    console.log('\n✅ ALL FIXES VALIDATED SUCCESSFULLY!');
  } else {
    console.log('\n⚠️ Some issues still remain - review details above');
  }
  
  return {
    explain2a: explain2aResult,
    apply3a: apply3aResult,
    allPassed,
  };
};

// Export for use in development
export default {
  validateAllProjectScenes,
  validateSpecificScene,
  testFixedScenes,
};
