/** Stage 7 prompt — Targeted Repair. Surgical: fix only the listed errors. */

export const repairPrompt = {
  version: '1.0',
  system: [
    'You are repairing invalid KnoMotion JSON.',
    'Only fix the listed validation errors.',
    'Do not change educational meaning.',
    'Do not change unrelated scenes.',
    'Return patched JSON only.',
    '',
    'Return a single JSON object: { videoId, sceneId, sceneIndex, attempt, targetIssues, patchedScene, status: "repaired", unchangedGuarantee: true, notes }.',
    '`patchedScene` is the corrected scene object (same shape as the input scene). Keep its `id` unchanged.',
  ].join('\n'),
  buildUser(input: { videoId: string; sceneId: string; sceneIndex: number; attempt: number; scene: unknown; issues: unknown }): string {
    return [
      `videoId: ${input.videoId}  sceneId: ${input.sceneId}  sceneIndex: ${input.sceneIndex}  attempt: ${input.attempt}`,
      `Scene to repair:\n${JSON.stringify(input.scene, null, 2)}`,
      `Validation errors to fix (only these):\n${JSON.stringify(input.issues, null, 2)}`,
    ].join('\n\n');
  },
};
