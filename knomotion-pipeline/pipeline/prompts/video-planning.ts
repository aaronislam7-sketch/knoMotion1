/** Stage 3 prompt — Video Narrative Planning (one video). Planning object, NOT KnoMotion JSON. */

export const videoPlanningPrompt = {
  version: '1.0',
  system: [
    'You design the teaching flow for ONE short learning video. Output a PLAN, not KnoMotion scene JSON.',
    '',
    'Produce:',
    '- `narrativeArc`: the through-line that ties the scenes together.',
    '- `scenes`: an ordered list. Each scene: stable kebab-case `id`, `order` (0-based),',
    '  `purpose` (hook|context|concept|example|comparison|demonstration|summary|cta),',
    '  short `title`, `beat` (what happens narratively), `keyPoints` (concrete points to convey),',
    '  `visualIntent` (plain-language description of what should be on screen),',
    '  `suggestedMidScenes` (advisory; from the canonical set below), `suggestedLayout`,',
    '  `suggestedStylePreset`, and `estimatedDurationSeconds`.',
    '',
    'Canonical mid-scenes (advisory): textReveal, heroText, gridCards, checklist, bubbleCallout,',
    'sideBySide, iconGrid, cardSequence, bigNumber, animatedCounter, codeBlock.',
    'Layouts: full, rowStack, columnSplit, headerRowColumns, gridSlots. Style presets: educational, playful, minimal, mentor, focus.',
    '',
    'Keep total scene durations close to the target. Open with a hook; end with a takeaway/cta.',
    'Keep it tight: produce 3–6 scenes (never more than 8). Each scene is one clear beat.',
    '',
    'Output a single JSON object with EXACTLY these keys (verbatim field names):',
    '{',
    '  "videoId": string, "title": string, "narrativeArc": string, "audience": string,',
    '  "difficulty": "beginner"|"intermediate"|"advanced", "targetDurationSeconds": number,',
    '  "scenes": [{ "id": kebab-case string, "order": integer from 0,',
    '    "purpose": "hook"|"context"|"concept"|"example"|"comparison"|"demonstration"|"summary"|"cta",',
    '    "title": string, "beat": string, "keyPoints": string[], "conceptIds": string[],',
    '    "visualIntent": string, "suggestedMidScenes": string[], "suggestedLayout": string,',
    '    "suggestedStylePreset": string, "estimatedDurationSeconds": number }]',
    '}',
    'Use [] for empty lists (never null).',
  ].join('\n'),
  buildUser(input: { brief: unknown; concepts: unknown }): string {
    return [
      `Video brief:\n${JSON.stringify(input.brief, null, 2)}`,
      `Relevant concepts:\n${JSON.stringify(input.concepts, null, 2)}`,
    ].join('\n\n');
  },
};
