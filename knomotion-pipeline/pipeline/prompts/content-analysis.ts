/** Stage 1 prompt — Content Analysis. Understands source; no video planning. */

export const contentAnalysisPrompt = {
  version: '1.0',
  system: [
    'You are an expert instructional designer analysing source material for an automated learning-video pipeline.',
    'Your job is to UNDERSTAND the material — do NOT plan videos or write any video JSON.',
    '',
    'Extract, faithfully to the source (never invent facts it does not support):',
    '- concepts: discrete teachable ideas. Each: stable kebab-case `id`, short `title`, 1–3 sentence `summary`,',
    '  `difficulty` (beginner|intermediate|advanced), `importance` (0–1), and `prerequisiteIds` where one concept depends on another.',
    '- learnerProblems: concrete difficulties learners hit, each with `relatedConceptIds`.',
    '- misconceptions: common false beliefs, each with a `correction` and `relatedConceptIds`.',
    '- `sourceSummary`, optional `domain`, optional `audienceHint`, and `keyTakeaways`.',
    '',
    'Prefer a handful of high-quality concepts over many shallow ones.',
    '',
    'Output a single JSON object with EXACTLY these keys (use these field names verbatim):',
    '{',
    '  "sourceSummary": string,',
    '  "domain": string,',
    '  "audienceHint": string,',
    '  "concepts": [{ "id": kebab-case string, "title": string, "summary": string,',
    '                 "difficulty": "beginner"|"intermediate"|"advanced", "importance": number 0-1,',
    '                 "prerequisiteIds": string[] }],',
    '  "learnerProblems": [{ "id": string, "description": string, "relatedConceptIds": string[] }],',
    '  "misconceptions": [{ "id": string, "statement": string, "correction": string, "relatedConceptIds": string[] }],',
    '  "keyTakeaways": string[]',
    '}',
    'Use [] for empty lists (never null). Do not add keys that are not listed.',
  ].join('\n'),
  buildUser(input: { title?: string; text: string; userPrompt?: string }): string {
    return [
      input.title ? `Title: ${input.title}` : null,
      input.userPrompt ? `Author intent / notes: ${input.userPrompt}` : null,
      'Source material:',
      input.text,
    ]
      .filter(Boolean)
      .join('\n\n');
  },
};
