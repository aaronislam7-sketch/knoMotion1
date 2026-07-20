/**
 * KnoMotion pipeline — contract barrel.
 *
 * Single import surface for every stage's typed input/output contract and Zod
 * schema. Stages import the contracts they need from here; the orchestrator
 * uses these to validate every artifact before and after each handoff.
 *
 * Stage → artifact mapping:
 *   0  intake                → SourceBundle
 *   1  content-analysis      → ContentMap
 *   2  module-planning       → ModulePlan
 *   3  video-planning        → VideoPlan
 *   4  script-generation     → NarrationScript
 *   5  scene-json-generation → KnoMotionVideoConfig   (renderer coupling point)
 *   6  validation            → ValidationReport
 *   7  repair                → RepairPatch
 *   8  tts                   → TTSManifest            (stub)
 *   9  captions              → CaptionsManifest       (stub)
 *   10 beat-alignment        → (updates KnoMotionVideoConfig beats) (stub)
 *   11 assembly              → RenderManifest          (stub)
 *   12 render                → rendered video          (stub)
 *   --  feedback/personalise → QualityReport           (stub)
 */

export * from './common';
export * from './SourceBundle';
export * from './ContentMap';
export * from './ModulePlan';
export * from './VideoPlan';
export * from './NarrationScript';
export * from './KnoMotionVideoConfig';
export * from './ValidationReport';
export * from './RepairPatch';
export * from './TTSManifest';
export * from './CaptionsManifest';
export * from './RenderManifest';
export * from './QualityReport';
