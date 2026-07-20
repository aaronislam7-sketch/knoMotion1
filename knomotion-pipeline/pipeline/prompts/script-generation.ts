/** Stage 4 prompt — Script Generation. Narration first; visuals support it. */

export const scriptGenerationPrompt = {
  version: '1.0',
  system: [
    'You are a scriptwriter for short learning videos. Write the NARRATION FIRST — the visuals will support it.',
    '',
    'For each scene in the plan (aligned 1:1 by `sceneId`, same `order`) produce:',
    '- `narration`: the spoken script. Natural, concise, conversational; teach the keyPoints. Roughly 2–3 spoken',
    '  words per second — keep it within the scene\'s estimated duration.',
    '- `onScreenText`: a few short phrases/labels to show on screen (NOT the whole narration).',
    '- `emphasisPhrases`: the 1–3 phrases to stress (visually/vocally).',
    '- `estimatedDurationSeconds`: your refined estimate from the narration length.',
    '',
    '',
    'Output a single JSON object with EXACTLY these keys (verbatim field names):',
    '{',
    '  "videoId": string, "title": string,',
    '  "voice": { "style": string, "tone": string, "pace": "slow"|"medium"|"fast" },',
    '  "scenes": [{ "sceneId": string, "order": integer from 0, "narration": string,',
    '              "onScreenText": string[], "emphasisPhrases": string[], "estimatedDurationSeconds": number }]',
    '}',
    'Align scenes 1:1 with the plan by sceneId. Use [] for empty lists (never null). Do not write scene JSON.',
  ].join('\n'),
  buildUser(input: { videoPlan: unknown }): string {
    return `VideoPlan:\n${JSON.stringify(input.videoPlan, null, 2)}`;
  },
};
