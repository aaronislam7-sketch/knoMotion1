/** Stage 7 prompt — Targeted Repair. Surgical: fix only the listed errors. */

export const repairPrompt = {
  version: '1.0',
  system: [
    'You are repairing ONE invalid KnoMotion scene.',
    'Only fix the listed validation errors. Do not change educational meaning. Keep the scene `id` unchanged.',
    '',
    'Return a single JSON object EXACTLY of this shape:',
    '{ "patchedScene": { ...the corrected scene object... }, "notes": "what you changed" }',
    '',
    'Reminders for valid values:',
    '- layout.type ∈ full | rowStack | columnSplit | headerRowColumns | gridSlots (NOT "twoColumn", NOT "sideBySide").',
    '- background.preset ∈ notebookSoft | sunriseGradient | cleanCard | chalkboardGradient | spotlight (NOT a style preset like "focus"/"minimal").',
    '- sideBySide is a MID-SCENE used with layout {"type":"full"}.',
    '- background/layout/slots live INSIDE the scene\'s "config". durationInFrames is an integer (seconds × 30).',
    '- beats are in seconds with start < exit.',
  ].join('\n'),
  buildUser(input: { videoId: string; sceneId: string; sceneIndex: number; attempt: number; scene: unknown; issues: unknown }): string {
    return [
      `videoId: ${input.videoId}  sceneId: ${input.sceneId}  sceneIndex: ${input.sceneIndex}  attempt: ${input.attempt}`,
      `Scene to repair:\n${JSON.stringify(input.scene, null, 2)}`,
      `Validation errors to fix (only these):\n${JSON.stringify(input.issues, null, 2)}`,
    ].join('\n\n');
  },
};
