/**
 * Template Router - Blueprint v5.0
 * 
 * Routes scene JSON to the correct template component based on template_id.
 * Supports both legacy templates (v3/v4) and new Blueprint v5.0 templates.
 */

import React from 'react';
import { SceneIdContext } from '../sdk/SceneIdContext';

// Blueprint v5.0 Templates
import { Hook1AQuestionBurst } from './archive_v5/Hook1AQuestionBurst_V5';
import { Hook1EAmbientMystery } from './archive_v5/Hook1EAmbientMystery_V5';
import { Explain2AConceptBreakdown } from './archive_v5/Explain2AConceptBreakdown_V5';
import { Explain2BAnalogy } from './archive_v5/Explain2BAnalogy_V5';
import { Apply3AMicroQuiz } from './archive_v5/Apply3AMicroQuiz_V5';
import { Apply3BScenarioChoice } from './archive_v5/Apply3BScenarioChoice_V5';
import { Reflect4AKeyTakeaways } from './archive_v5/Reflect4AKeyTakeaways_V5';
import { Reflect4DForwardLink } from './archive_v5/Reflect4DForwardLink_V5';
import { ShowcaseAnimations } from './archive_v5/ShowcaseAnimations_V5';

// Blueprint v5.1 Agnostic Templates
import { Hook1AQuestionBurst_Agnostic } from './archive_v5/Hook1AQuestionBurst_V5_Agnostic';

// Blueprint v6.0 New Intention Templates
import { Reveal9ProgressiveUnveil } from './v6/Reveal9ProgressiveUnveil_V6';
import { Guide10StepSequence } from './v6/Guide10StepSequence_V6';
import { Compare11BeforeAfter } from './v6/Compare11BeforeAfter_V6';

// NEW: Learning Content Pipeline Templates (Nov 2025)
import { Compare12MatrixGrid } from './v6/Compare12MatrixGrid_V6';
import { Challenge13PollQuiz } from './v6/Challenge13PollQuiz_V6';
import { Spotlight14SingleConcept } from './v6/Spotlight14SingleConcept_V6';
import { Connect15AnalogyBridge } from './v6/Connect15AnalogyBridge_V6';
import { Quote16Showcase } from './v6/Quote16Showcase_V6';
import { Progress18Path } from './v6/Progress18Path_V6';

// V5 to V6 Migrations (Nov 2025)
import { Hook1AQuestionBurst as Hook1AQuestionBurst_V6 } from './v6/Hook1AQuestionBurst_V6';
import { Hook1EAmbientMystery as Hook1EAmbientMystery_V6 } from './v6/Hook1EAmbientMystery_V6';
import { Explain2AConceptBreakdown as Explain2AConceptBreakdown_V6 } from './v6/Explain2AConceptBreakdown_V6';
import { Apply3AMicroQuiz as Apply3AMicroQuiz_V6 } from './v6/Apply3AMicroQuiz_V6';
import { Explain2BAnalogy as Explain2BAnalogy_V6 } from './v6/Explain2BAnalogy_V6';
import { Apply3BScenarioChoice as Apply3BScenarioChoice_V6 } from './v6/Apply3BScenarioChoice_V6';
import { Reflect4AKeyTakeaways as Reflect4AKeyTakeaways_V6 } from './v6/Reflect4AKeyTakeaways_V6';
import { Reflect4DForwardLink as Reflect4DForwardLink_V6 } from './v6/Reflect4DForwardLink_V6';

// V7.0 Scene-Shell Templates (Dec 2025)
import { FullFrameScene } from './v7/FullFrameScene';
import { GridLayoutScene } from './v7/GridLayoutScene';
import { StackLayoutScene } from './v7/StackLayoutScene';
import { FlowLayoutScene } from './v7/FlowLayoutScene';
import { SplitLayoutScene } from './v7/SplitLayoutScene';
import { HubSpokeScene } from './v7/HubSpokeScene';

// Schema detection for routing
import { detectSchemaVersion } from '../sdk';

// Legacy Templates (v3/v4) - Removed after v5 migration
// import { HookTemplate } from './HookTemplate';
// import { ExplainTemplate } from './ExplainTemplate';
// import { ApplyTemplate } from './ApplyTemplate';
// import { ReflectTemplate } from './ReflectTemplate';
// import { HookStoryTemplate } from './HookStoryTemplate';
// import { ExplainTimelineTemplate } from './ExplainTimelineTemplate';
// import { ApplyCompareTemplate } from './ApplyCompareTemplate';
// import { ReflectMindMapTemplate } from './ReflectMindMapTemplate';

/**
 * Template registry mapping template_id to component
 * Supports both v5.0 (legacy) and v5.1 (agnostic) templates
 */
const TEMPLATE_REGISTRY = {
  // Blueprint v5.0 templates (legacy format only)
  'Hook1AQuestionBurst': Hook1AQuestionBurst,
  'Hook1EAmbientMystery': Hook1EAmbientMystery,
  'Explain2AConceptBreakdown': Explain2AConceptBreakdown,
  'Explain2BAnalogy': Explain2BAnalogy,
  'Apply3AMicroQuiz': Apply3AMicroQuiz,
  'Apply3BScenarioChoice': Apply3BScenarioChoice,
  'Reflect4AKeyTakeaways': Reflect4AKeyTakeaways,
  'Reflect4DForwardLink': Reflect4DForwardLink,
  'ShowcaseAnimations': ShowcaseAnimations,  // ✨ Creative Effects Showcase
};

/**
 * Agnostic template registry (v5.1)
 * These templates support BOTH v5.0 and v5.1 formats
 */
const AGNOSTIC_TEMPLATE_REGISTRY = {
  'Hook1AQuestionBurst': Hook1AQuestionBurst_Agnostic,
  // Future: Add more agnostic templates here
  // 'Explain2AConceptBreakdown': Explain2AConceptBreakdown_Agnostic,
  // 'Apply3AMicroQuiz': Apply3AMicroQuiz_Agnostic,
  // etc.
};

/**
 * V6.0 New Intention Templates Registry
 * Fully configurable, no hardcoded values, action-based intentions
 */
const V6_TEMPLATE_REGISTRY = {
  // Original V6 Templates
  'Reveal9ProgressiveUnveil': Reveal9ProgressiveUnveil,
  'Guide10StepSequence': Guide10StepSequence,
  'Compare11BeforeAfter': Compare11BeforeAfter,
  
  // Learning Content Pipeline (Nov 2025)
  'Compare12MatrixGrid': Compare12MatrixGrid,
  'Challenge13PollQuiz': Challenge13PollQuiz,
  'Spotlight14SingleConcept': Spotlight14SingleConcept,
  'Connect15AnalogyBridge': Connect15AnalogyBridge,
  'Quote16Showcase': Quote16Showcase,
  'Progress18Path': Progress18Path,
  
  // V5 to V6 Migrations (Nov 2025)
  'Hook1AQuestionBurst_V6': Hook1AQuestionBurst_V6,
  'Hook1EAmbientMystery_V6': Hook1EAmbientMystery_V6,
  'Explain2AConceptBreakdown_V6': Explain2AConceptBreakdown_V6,
  'Apply3AMicroQuiz_V6': Apply3AMicroQuiz_V6,
  'Explain2BAnalogy_V6': Explain2BAnalogy_V6,
  'Apply3BScenarioChoice_V6': Apply3BScenarioChoice_V6,
  'Reflect4AKeyTakeaways_V6': Reflect4AKeyTakeaways_V6,
  'Reflect4DForwardLink_V6': Reflect4DForwardLink_V6,
  
  // TEST: Revised Templates for Broadcast Quality (Nov 2025)
  'TEST_Explain2AConceptBreakdown_V6': Explain2AConceptBreakdown_V6,
  'TEST_Guide10StepSequence_V6': Guide10StepSequence,
  
  // STAGING: Templates Under Review (use existing components with upgraded scenes)
  'STAGING_Hook1AQuestionBurst_V6_Upgraded': Hook1AQuestionBurst_V6,
  'STAGING_Reflect4AKeyTakeaways_V6_Enhanced': Reflect4AKeyTakeaways_V6
};

/**
 * V7.0 Scene-Shell Templates Registry
 * Abstract layout patterns with flexible content structures
 * Migration from content-shell to scene-shell architecture
 */
const V7_TEMPLATE_REGISTRY = {
  // Core Scene Templates (Dec 2025)
  'FullFrameScene': FullFrameScene,
  'GridLayoutScene': GridLayoutScene,
  'StackLayoutScene': StackLayoutScene,
  'FlowLayoutScene': FlowLayoutScene,
  'SplitLayoutScene': SplitLayoutScene,
  'HubSpokeScene': HubSpokeScene
};

/**
 * Get template component from template_id with v5.0/v5.1/v6.0/v7.0 detection
 */
const getTemplateComponent = (templateId, scene) => {
  if (!templateId) {
    console.warn('No template_id found, using default v5 template');
    return Hook1AQuestionBurst;
  }
  
  // Check v7 templates first (scene-shell architecture)
  if (V7_TEMPLATE_REGISTRY[templateId]) {
    console.info(`🎨 Using v7.0 scene-shell template for ${templateId}`);
    return V7_TEMPLATE_REGISTRY[templateId];
  }
  
  // Check v6 templates (new intention-based system)
  if (V6_TEMPLATE_REGISTRY[templateId]) {
    console.info(`🚀 Using v6.0 template for ${templateId}`);
    return V6_TEMPLATE_REGISTRY[templateId];
  }
  
  // Detect schema version
  const schemaVersion = detectSchemaVersion(scene);
  const isAgnostic = schemaVersion === '5.1';
  
  // If v5.1 scene, try agnostic template first
  if (isAgnostic && AGNOSTIC_TEMPLATE_REGISTRY[templateId]) {
    console.info(`🎯 Using agnostic template for ${templateId} (v5.1 format)`);
    return AGNOSTIC_TEMPLATE_REGISTRY[templateId];
  }
  
  // Direct match in standard registry
  if (TEMPLATE_REGISTRY[templateId]) {
    if (isAgnostic) {
      console.warn(`⚠️ Using v5.0 template for v5.1 scene. Consider using agnostic template.`);
    }
    return TEMPLATE_REGISTRY[templateId];
  }
  
  // Try pillar fallback (not used in v5, kept for compatibility)
  const pillarFromId = templateId.split('_')[0]?.toLowerCase();
  if (TEMPLATE_REGISTRY[pillarFromId]) {
    return TEMPLATE_REGISTRY[pillarFromId];
  }
  
  // Final fallback
  console.warn(`Template "${templateId}" not found, using Hook1AQuestionBurst as fallback`);
  return isAgnostic && AGNOSTIC_TEMPLATE_REGISTRY['Hook1AQuestionBurst'] 
    ? AGNOSTIC_TEMPLATE_REGISTRY['Hook1AQuestionBurst']
    : Hook1AQuestionBurst;
};

/**
 * Template Router Component
 * 
 * Wraps templates with SceneIdContext and routes to correct component
 * 
 * Props:
 * - scene: Scene JSON data
 * - styles: Global style tokens (optional)
 * - presets: Animation presets (optional)
 * - easingMap: EZ easing map (optional)
 * - transitions: Transition config (optional)
 */
export const TemplateRouter = ({ scene, styles, presets, easingMap, transitions }) => {
  const templateId = scene.template_id;
  const sceneId = scene.scene_id || 'default-scene';
  
  const TemplateComponent = getTemplateComponent(templateId, scene);
  
  // Check if this is a v5.x, v6.x, or v7.x template (has required exports)
  const isV5Template = TemplateComponent.TEMPLATE_VERSION?.startsWith('5.');
  const isV6Template = TemplateComponent.TEMPLATE_VERSION?.startsWith('6.');
  const isV7Template = TemplateComponent.TEMPLATE_VERSION?.startsWith('7.');
  
  if (isV5Template || isV6Template || isV7Template) {
    // v5.x, v6.x, and v7.x templates require SceneIdContext wrapper
    return (
      <SceneIdContext.Provider value={sceneId}>
        <TemplateComponent 
          scene={scene}
          styles={styles}
          presets={presets}
          easingMap={easingMap}
          transitions={transitions}
        />
      </SceneIdContext.Provider>
    );
  }
  
  // Legacy templates don't need wrapper
  return <TemplateComponent scene={scene} />;
};

/**
 * Export for convenience - check if template is v5.0
 */
export const isV5Template = (templateId) => {
  const component = TEMPLATE_REGISTRY[templateId];
  return component?.TEMPLATE_VERSION?.startsWith('5.');
};

/**
 * Export template registries for external use
 */
export { TEMPLATE_REGISTRY, AGNOSTIC_TEMPLATE_REGISTRY, V6_TEMPLATE_REGISTRY, V7_TEMPLATE_REGISTRY };
