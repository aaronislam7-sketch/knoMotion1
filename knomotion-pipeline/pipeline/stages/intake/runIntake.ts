/**
 * Stage 0 — Intake & Normalisation (deterministic).
 * MVP: wraps raw text/markdown into a single-document SourceBundle.
 */

import { z } from 'zod';
import { defineStage } from '../../core/stage';
import { SourceBundleSchema, SourceInputTypeSchema } from '../../schemas/SourceBundle';

export const IntakeInputSchema = z.object({
  inputType: SourceInputTypeSchema.default('markdown'),
  text: z.string().min(1).describe('Raw pasted text or markdown'),
  title: z.string().optional(),
  userPrompt: z.string().optional(),
  language: z.string().optional(),
});
export type IntakeInput = z.infer<typeof IntakeInputSchema>;

const countWords = (s: string) => (s.trim().match(/\S+/g) ?? []).length;

export const intakeStage = defineStage({
  name: 'intake',
  handler: 'deterministic',
  inputSchema: IntakeInputSchema,
  outputSchema: SourceBundleSchema,
  async run(input, ctx) {
    const content = input.text.trim();
    return {
      meta: ctx.makeMeta('intake', 'SourceBundle', { producedBy: 'deterministic' }),
      jobId: ctx.jobId,
      inputType: input.inputType,
      documents: [
        {
          id: 'doc-1',
          type: input.inputType,
          title: input.title,
          content,
          wordCount: countWords(content),
        },
      ],
      language: input.language,
      userPrompt: input.userPrompt,
    };
  },
});
