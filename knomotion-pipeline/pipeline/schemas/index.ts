/**
 * KnoMotion pipeline — contract barrel.
 *
 * Single import surface for every stage's typed input/output contract and Zod
 * schema. Stages import the contracts they need from here; the orchestrator
 * uses these to validate every artifact before and after each handoff.
 *
 * Stage → artifact mapping (file names as written in the job directory):
 *   0  intake                → SourceBundle          00-source-bundle.json
 *   1  content-analysis      → ContentMap            01-content-map.json
 *   2  module-planning       → ModulePlan            02-module-plan.json
 *   3  video-planning        → VideoPlan             videos/<id>/03-video-plan.json
 *   4  script-generation     → NarrationScript       videos/<id>/04-narration-script.json
 *   5  tts                   → TTSManifest           videos/<id>/04a-tts-manifest.json (+ audio/)
 *   6  timing                → SceneTimingArtifact   videos/<id>/04b-scene-timing.json
 *   7  scene-json-generation → KnoMotionVideoConfig  videos/<id>/05-knomotion-video-config.json (renderer coupling point)
 *   8  validation            → ValidationReport      videos/<id>/06-validation-report.json
 *   9  render-check          → QualityReport         (stub; M2)
 *   10 repair                → RepairPatch           videos/<id>/07-repair-<scene>-<attempt>.json
 *   11 assembly              → RenderManifest        videos/<id>/08-render-manifest.json (+ writes audio back into 05)
 *   12 render                → rendered video        (stub; M4)
 *   -- captions              → CaptionsManifest      (stub; M5)
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
export * from './SceneTiming';
export * from './CaptionsManifest';
export * from './RenderManifest';
export * from './QualityReport';
