/**
 * Template Router - Blueprint v5.0
 * 
 * Routes scene JSON to the correct template component based on template_id.
 * Supports both legacy templates (v3/v4) and new Blueprint v5.0 templates.
 */

import React from 'react';
import { SceneIdContext } from '../sdk/SceneIdContext';
import { MagicLayer } from '../magic/MagicLayer';

// Blueprint v5.0 Templates
import { Hook1AQuestionBurst } from './Hook1AQuestionBurst_V5';
import { Hook1EAmbientMystery } from './Hook1EAmbientMystery_V5';
import { Explain2AConceptBreakdown } from './Explain2AConceptBreakdown_V5';
import { Explain2BAnalogy } from './Explain2BAnalogy_V5';
import { Apply3AMicroQuiz } from './Apply3AMicroQuiz_V5';
import { Apply3BScenarioChoice } from './Apply3BScenarioChoice_V5';
import { Reflect4AKeyTakeaways } from './Reflect4AKeyTakeaways_V5';
import { Reflect4DForwardLink } from './Reflect4DForwardLink_V5';

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
 * Blueprint v5.0 only - legacy templates removed
 */
const TEMPLATE_REGISTRY = {
  // Blueprint v5.0 templates
  'Hook1AQuestionBurst': Hook1AQuestionBurst,
  'Hook1EAmbientMystery': Hook1EAmbientMystery,
  'Explain2AConceptBreakdown': Explain2AConceptBreakdown,
  'Explain2BAnalogy': Explain2BAnalogy,
  'Apply3AMicroQuiz': Apply3AMicroQuiz,
  'Apply3BScenarioChoice': Apply3BScenarioChoice,
  'Reflect4AKeyTakeaways': Reflect4AKeyTakeaways,
  'Reflect4DForwardLink': Reflect4DForwardLink,
  
  // Legacy templates - Removed after v5 migration
  // 'hook': HookTemplate,
  // 'hook_story': HookStoryTemplate,
  // 'explain': ExplainTemplate,
  // 'explain_timeline': ExplainTimelineTemplate,
  // 'apply': ApplyTemplate,
  // 'apply_compare': ApplyCompareTemplate,
  // 'reflect': ReflectTemplate,
  // 'reflect_mindmap': ReflectMindMapTemplate,
};

/**
 * Get template component from template_id with fallback logic
 */
const getTemplateComponent = (templateId, pillar) => {
  if (!templateId) {
    console.warn('No template_id found, using default v5 template');
    return Hook1AQuestionBurst; // Default v5 fallback
  }
  
  // Direct match
  if (TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId];
  }
  
  // Try pillar fallback (not used in v5, kept for compatibility)
  const pillarFromId = templateId.split('_')[0]?.toLowerCase();
  if (TEMPLATE_REGISTRY[pillarFromId]) {
    return TEMPLATE_REGISTRY[pillarFromId];
  }
  
  // Final fallback to default v5 template
  console.warn(`Template "${templateId}" not found, using Hook1AQuestionBurst as fallback`);
  return Hook1AQuestionBurst;
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
  const pillar = scene.pillar;
  
  const TemplateComponent = getTemplateComponent(templateId, pillar);
  
  // Check if this is a v5.0 template (has required exports)
  const isV5Template = TemplateComponent.TEMPLATE_VERSION?.startsWith('5.');
  
  if (isV5Template) {
    // v5.0 templates require SceneIdContext wrapper
    return (
      <SceneIdContext.Provider value={sceneId}>
        <>
          <TemplateComponent 
            scene={scene}
            styles={styles}
            presets={presets}
            easingMap={easingMap}
            transitions={transitions}
          />
          {/* MagicLayer: On-brand polish without changing layout/timing */}
          <MagicLayer 
            scene={scene} 
            tokens={{
              paper: scene?.style_tokens?.texture?.paper ?? true,
              vignette: true,
              motifs: [],
            }}
          />
        </>
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
 * Export template registry for external use
 */
export { TEMPLATE_REGISTRY };
