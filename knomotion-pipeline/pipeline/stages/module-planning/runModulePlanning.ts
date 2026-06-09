/**
 * Stage 2 — Module Planning (LLM).
 * ContentMap -> ModulePlan. Groups concepts into videos, defines objectives + sequence.
 */

import { defineStage } from '../../core/stage';
import { modelForStage } from '../../core/config';
import { ContentMapSchema } from '../../schemas/ContentMap';
import { ModulePlanSchema } from '../../schemas/ModulePlan';

const ModulePlanPayloadSchema = ModulePlanSchema.omit({ meta: true });

export const modulePlanningStage = defineStage({
  name: 'module-planning',
  handler: 'llm',
  inputSchema: ContentMapSchema,
  outputSchema: ModulePlanSchema,
  async run(contentMap, ctx) {
    const model = modelForStage(ctx.config, 'module-planning');
    const compressed = {
      sourceSummary: contentMap.sourceSummary,
      audienceHint: contentMap.audienceHint,
      concepts: contentMap.concepts.map((c) => ({ id: c.id, title: c.title, difficulty: c.difficulty, importance: c.importance })),
      learnerProblems: contentMap.learnerProblems,
    };

    const { data, model: usedModel } = await ctx.llm.complete({
      schemaName: 'ModulePlan',
      schema: ModulePlanPayloadSchema,
      model,
      maxRetries: ctx.config.llmMaxRetries,
      system:
        'You plan a learning module from analysed content. Group concepts into videos, define learning ' +
        'objectives, and sequence the journey. Output only ids/summaries — no video JSON.',
      user: `Plan a module from this ContentMap:\n\n${JSON.stringify(compressed, null, 2)}`,
      input: compressed,
    });

    return {
      meta: ctx.makeMeta('module-planning', 'ModulePlan', { producedBy: 'llm', model: usedModel, inputs: ['ContentMap'] }),
      ...data,
    };
  },
});
