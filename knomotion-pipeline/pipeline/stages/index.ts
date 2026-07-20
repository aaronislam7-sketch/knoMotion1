/** Stage registry — single import surface for the orchestrator. */

export { intakeStage, IntakeInputSchema } from './intake/runIntake';
export { contentAnalysisStage } from './content-analysis/runContentAnalysis';
export { modulePlanningStage } from './module-planning/runModulePlanning';
export { videoPlanningStage, VideoPlanningInputSchema } from './video-planning/runVideoPlanning';
export { scriptGenerationStage, ScriptGenerationInputSchema } from './script-generation/runScriptGeneration';
export { sceneJsonGenerationStage, SceneJsonInputSchema } from './scene-json-generation/runSceneJsonGeneration';
export { validationStage, ValidationInputSchema } from './validation/runValidation';
export { repairStage, RepairInputSchema } from './repair/runRepair';

// Out-of-scope stubs (throw NotImplementedError)
export { ttsStage } from './tts/generateTTS';
export { captionsStage } from './captions/generateCaptions';
export { beatAlignmentStage } from './beat-alignment/alignBeats';
export { assemblyStage } from './assembly/buildRenderProps';
export { renderStage } from './render/triggerRender';
