/**
 * KnoSlides Templates
 * 
 * Behaviour-driven templates for guided construction learning:
 * - BuildAndVerifySlide: teaches how something works + how to do it
 * - FlowSimulatorSlide: teaches systems, processes, causality
 * - RepairTheModelSlide: teaches debugging, judgement, common mistakes
 * 
 * All templates implement the 4-phase progression model:
 * 1. Explain - introduce concept visually/textually
 * 2. Guided Interaction - manipulate with heavy support
 * 3. Constrained Construction - complete structure with bounded input
 * 4. Outcome/Reflection - see consequences of actions
 */

// New behaviour-driven templates
export { BuildAndVerifySlide } from './BuildAndVerify';
export { FlowSimulatorSlide } from './FlowSimulator';
export { RepairTheModelSlide } from './RepairTheModel';

// Re-export types
export type {
  BuildAndVerifyProps,
  BuildAndVerifyData,
  FlowSimulatorProps,
  FlowSimulatorData,
  RepairTheModelProps,
  RepairTheModelData,
} from '../types/templates';

// ============================================================================
// LEGACY TEMPLATES (deprecated - kept for reference)
// These templates do not meet the new guided construction requirements.
// They are passive/exploratory rather than requiring meaningful engagement.
// ============================================================================

// export { LayeredDeepDive } from './LayeredDeepDive';
// export { AnatomyExplorer } from './AnatomyExplorer';
// export { RelationshipMap } from './RelationshipMap';
// export { ScenarioSandbox } from './ScenarioSandbox';
