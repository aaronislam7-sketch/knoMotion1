/** Stage registry — single import surface for the orchestrator. */

export { intakeStage, IntakeInputSchema } from './intake/runIntake';
export { contentAnalysisStage } from './content-analysis/runContentAnalysis';
export { modulePlanningStage } from './module-planning/runModulePlanning';
export { videoPlanningStage, VideoPlanningInputSchema } from './video-planning/runVideoPlanning';
export { scriptGenerationStage, ScriptGenerationInputSchema } from './script-generation/runScriptGeneration';
export { ttsStage, TTSInputSchema } from './tts/generateTTS';
export { timingStage, TimingInputSchema } from './timing/computeTiming';
export { sceneJsonGenerationStage, SceneJsonInputSchema } from './scene-json-generation/runSceneJsonGeneration';
export { validationStage, ValidationInputSchema } from './validation/runValidation';
export { repairStage, RepairInputSchema } from './repair/runRepair';
export { assemblyStage, AssemblyInputSchema, PUBLIC_AUDIO_DIR } from './assembly/buildRenderProps';

// Stubs (throw NotImplementedError)
export { captionsStage } from './captions/generateCaptions';
export { renderStage } from './render/triggerRender';
