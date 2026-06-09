/**
 * OpenAIClient — structured-output LLM client.
 *
 * Uses Chat Completions in JSON mode, then parses + validates against the
 * stage's Zod schema. On invalid JSON it issues up to `maxRetries` corrective
 * follow-ups before failing. Prompt construction lives in the stages; this
 * client only handles transport, JSON parsing, validation, and retries.
 */

import OpenAI from 'openai';
import type { LLMClient, LLMRequest, LLMResult } from './client';
import { LLMResponseError } from '../errors';
import type { Logger } from '../logger';

export interface OpenAIClientOptions {
  apiKey: string;
  defaultModel: string;
  temperature: number;
  logger: Logger;
}

export class OpenAIClient implements LLMClient {
  readonly name = 'openai';
  private readonly client: OpenAI;

  constructor(private readonly opts: OpenAIClientOptions) {
    this.client = new OpenAI({ apiKey: opts.apiKey });
  }

  async complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>> {
    const model = req.model ?? this.opts.defaultModel;
    const temperature = req.temperature ?? this.opts.temperature;
    const maxRetries = req.maxRetries ?? 1;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: `${req.system}\n\nRespond with a single JSON object only. No prose, no markdown.` },
      { role: 'user', content: req.user },
    ];

    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const completion = await this.client.chat.completions.create({
        model,
        temperature,
        response_format: { type: 'json_object' },
        messages,
      });
      const raw = completion.choices[0]?.message?.content ?? '';
      const usage = completion.usage
        ? { promptTokens: completion.usage.prompt_tokens, completionTokens: completion.usage.completion_tokens, totalTokens: completion.usage.total_tokens }
        : undefined;

      let json: unknown;
      try {
        json = JSON.parse(raw);
      } catch {
        lastError = new LLMResponseError(`"${req.schemaName}" response was not valid JSON`);
        messages.push({ role: 'assistant', content: raw });
        messages.push({ role: 'user', content: 'That was not valid JSON. Return a single valid JSON object only.' });
        continue;
      }

      const parsed = req.schema.safeParse(json);
      if (parsed.success) {
        return { data: parsed.data, raw, model, usage };
      }

      lastError = new LLMResponseError(`"${req.schemaName}" response failed schema validation`, parsed.error.flatten());
      this.opts.logger.warn(`LLM output for "${req.schemaName}" failed validation (attempt ${attempt + 1}/${maxRetries + 1}); retrying`);
      messages.push({ role: 'assistant', content: raw });
      messages.push({
        role: 'user',
        content: `Your JSON failed validation:\n${JSON.stringify(parsed.error.flatten())}\nFix ONLY these issues and return the corrected JSON object.`,
      });
    }

    throw lastError instanceof Error ? lastError : new LLMResponseError(`"${req.schemaName}" failed after retries`);
  }
}
