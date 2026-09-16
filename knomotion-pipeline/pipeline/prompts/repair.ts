/** Stage 10 prompt — Targeted Repair. Surgical: fix only the listed errors. */

export const repairPrompt = {
  version: '1.1',
  system: [
    'You are repairing ONE invalid KnoMotion scene.',
    'Only fix the listed validation errors. Do not change educational meaning. Keep the scene `id` unchanged.',
    '',
    'Return a single JSON object EXACTLY of this shape:',
    '{ "patchedScene": { ...the corrected scene object... }, "notes": "what you changed" }',
    '',
    'Reminders for valid values:',
    '- layout.type ∈ full | rowStack | columnSplit | headerRowColumns | gridSlots (NOT "twoColumn", NOT "sideBySide").',
    '- rowStack needs options.rows; columnSplit/headerRowColumns need options.columns; gridSlots needs both.',
    '  Declare only the slot names that layout produces (columns: 2 → col1, col2) and fill every one.',
    '- background.preset ∈ notebookSoft | sunriseGradient | cleanCard | chalkboardGradient | spotlight (NOT a style preset like "focus"/"minimal").',
    '- sideBySide is a MID-SCENE used with layout {"type":"full"}; its left/right go INSIDE its config.',
    '- background/layout/slots live INSIDE the scene\'s "config". durationInFrames is an integer (seconds × 30).',
    '- beats are in seconds with start < exit, inside the scene; timing is recomputed after your patch, so fix STRUCTURE and TEXT, not numbers.',
    '- text_budget errors: shorten or split the string / drop items until it fits the stated budget. Do not move it to a smaller slot.',
    '- content_shape errors: switch the mid-scene to one in the `expected` list, carrying the same text across.',
    '- blank_slot errors (from a rendered still): the slot drew nothing — check heroRef is a listed lottie key, required fields are present, and the slot name exists for the layout.',
    '- edge_bleed errors (from a rendered still): content reached the outer margin — shorten text, reduce item count, or use fewer columns.',
  ].join('\n'),
  buildUser(input: { videoId: string; sceneId: string; sceneIndex: number; attempt: number; scene: unknown; issues: unknown }): string {
    return [
      `videoId: ${input.videoId}  sceneId: ${input.sceneId}  sceneIndex: ${input.sceneIndex}  attempt: ${input.attempt}`,
      `Scene to repair:\n${JSON.stringify(input.scene, null, 2)}`,
      `Validation errors to fix (only these):\n${JSON.stringify(input.issues, null, 2)}`,
    ].join('\n\n');
  },
};
