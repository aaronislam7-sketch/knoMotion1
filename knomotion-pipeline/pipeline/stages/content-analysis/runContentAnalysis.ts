/**
 * Stage 1 — Content Analysis (LLM).
 * SourceBundle -> ContentMap. Extracts concepts, learner problems, misconceptions.
 *
 * NOTE (P0): prompts are minimal placeholders. Real prompt engineering lands in P3
 * (pipeline/prompts/content-analysis.ts).
 */

import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { SourceBundleSchema } from '../../schemas/SourceBundle';
import { ContentMapSchema } from '../../schemas/ContentMap';

const ContentMapPayloadSchema = ContentMapSchema.omit({ meta: true });

export const contentAnalysisStage = defineStage({
  name: 'content-analysis',
  handler: 'llm',
  inputSchema: SourceBundleSchema,
  outputSchema: ContentMapSchema,
  async run(bundle, ctx) {
    const model = modelForStage(ctx.config, 'content-analysis');
    const text = bundle.documents.map((d) => d.content).join('\n\n');
    const title = bundle.documents[0]?.title;

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'ContentMap',
      schema: ContentMapPayloadSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You analyse source material for a learning-video pipeline. Extract concepts, learner problems, ' +
        'difficulty, and misconceptions. Do NOT plan videos or write any video JSON.',
      user: `Analyse this source material${title ? ` titled "${title}"` : ''}:\n\n${text}`,
      input: { title, text, userPrompt: bundle.userPrompt, audienceHint: undefined },
    });

    return {
      meta: ctx.makeMeta('content-analysis', 'ContentMap', { producedBy: 'llm', model: usedModel, inputs: ['SourceBundle'] }),
      ...data,
    };
  },
});
