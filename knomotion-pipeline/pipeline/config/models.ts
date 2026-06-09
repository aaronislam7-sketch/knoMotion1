/**
 * Model routing — EDIT HERE to change which model each stage uses.
 *
 * Policy (set by product): default to a fast/cheap "mini" model for most stages,
 * and escalate to a higher-quality model for stages that need strong judgement
 * (content understanding, planning) or careful escalation (repair).
 *
 * These are the *defaults*; they can be overridden at runtime via:
 *   - env: KNOMOTION_MODEL (changes the default model)
 *   - code: loadConfig({ defaultModel, stageModels: { 'video-planning': '…' } })
 *
 * Provider is selected separately (config.provider: 'openai' | 'mock').
 * NOTE: model ids are passed through verbatim to the OpenAI API — update the
 * strings here if the available model names change.
 */

import type { PipelineStage } from '../schemas/common';

/** Fast/cheap default for most stages. */
export const DEFAULT_MODEL = 'gpt-5.4-mini';

/** Higher-quality model for escalation / high-quality planning. */
export const ESCALATION_MODEL = 'gpt-5.5';

/**
 * Per-stage overrides. Any stage not listed uses DEFAULT_MODEL.
 * Escalated to ESCALATION_MODEL: deep content understanding, module/video
 * planning (the quality of these cascades through everything downstream), and
 * repair (where a stronger model fixes what the cheaper one got wrong).
 */
export const STAGE_MODELS: Partial<Record<PipelineStage, string>> = {
  'content-analysis': ESCALATION_MODEL,
  'module-planning': ESCALATION_MODEL,
  'video-planning': ESCALATION_MODEL,
  'repair': ESCALATION_MODEL,
  // 'script-generation': DEFAULT_MODEL,        // mini
  // 'scene-json-generation': DEFAULT_MODEL,    // mini (constrained compiler; validated + repaired)
};
