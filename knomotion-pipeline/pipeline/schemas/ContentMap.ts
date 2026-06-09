/**
 * Stage 1 — Content Analysis (LLM).
 *
 * Input:  SourceBundle.json
 * Output: ContentMap.json
 *
 * Understands the source material. Extracts concepts, identifies learner
 * problems, tags difficulty, and surfaces misconceptions. It does NOT plan
 * videos or write any KnoMotion JSON — that is the job of later stages.
 */

import { z } from 'zod';
import { DifficultySchema, withMeta } from './common';

/** A single teachable idea extracted from the source. */
export const ConceptSchema = z.object({
  id: z.string().min(1).describe('Stable concept id (kebab-case), referenced by later stages'),
  title: z.string().min(1).describe('Short concept name'),
  summary: z.string().min(1).describe('1–3 sentence explanation of the concept'),
  difficulty: DifficultySchema.describe('Estimated difficulty for the target learner'),
  importance: z
    .number()
    .min(0)
    .optional()
    .describe('Relative importance to the overall material (ideally 0–1) for sequencing/pruning'),
  keywords: z.array(z.string()).optional().describe('Salient terms associated with the concept'),
  prerequisiteIds: z
    .array(z.string())
    .optional()
    .describe('Ids of concepts that should be understood first'),
  sourceRefs: z
    .array(z.string())
    .optional()
    .describe('Pointers back into the source (document id, heading, quote) for traceability'),
});
export type Concept = z.infer<typeof ConceptSchema>;

/** A difficulty or pain point a learner is likely to hit. */
export const LearnerProblemSchema = z.object({
  id: z.string().min(1).describe('Stable problem id'),
  description: z.string().min(1).describe('What the learner struggles with'),
  relatedConceptIds: z
    .array(z.string())
    .describe('Concepts this problem relates to'),
});
export type LearnerProblem = z.infer<typeof LearnerProblemSchema>;

/** A common false belief, paired with its correction. */
export const MisconceptionSchema = z.object({
  id: z.string().min(1).describe('Stable misconception id'),
  statement: z.string().min(1).describe('The incorrect belief, stated plainly'),
  correction: z.string().min(1).describe('The accurate replacement understanding'),
  relatedConceptIds: z.array(z.string()).describe('Concepts this misconception touches'),
});
export type Misconception = z.infer<typeof MisconceptionSchema>;

export const ContentMapSchema = withMeta({
  sourceSummary: z.string().min(1).describe('Concise summary of what the source material covers'),
  domain: z.string().optional().describe('Subject domain, e.g. "neuroscience", "TypeScript"'),
  audienceHint: z
    .string()
    .optional()
    .describe('Inferred target audience / level, if discernible from the source'),
  concepts: z.array(ConceptSchema).min(1).describe('Extracted teachable concepts'),
  learnerProblems: z
    .array(LearnerProblemSchema)
    .default([])
    .describe('Identified learner difficulties'),
  misconceptions: z
    .array(MisconceptionSchema)
    .default([])
    .describe('Surfaced misconceptions to address'),
  keyTakeaways: z
    .array(z.string())
    .optional()
    .describe('Headline takeaways the learner must leave with'),
});
export type ContentMap = z.infer<typeof ContentMapSchema>;
