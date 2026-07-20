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

/** Recursively delete object properties whose value is `null`. */
const pruneNullProps = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(pruneNullProps);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (val === null) continue;
      out[k] = pruneNullProps(val);
    }
    return out;
  }
  return v;
};

export interface OpenAIClientOptions {
  apiKey: string;
  defaultModel: string;
  temperature: number;
  logger: Logger;
}

export class OpenAIClient implements LLMClient {
  readonly name = 'openai';
  private readonly client: OpenAI;
  /** Some newer models only allow the default temperature; once detected we stop sending it. */
  private omitTemperature = false;

  constructor(private readonly opts: OpenAIClientOptions) {
    this.client = new OpenAI({ apiKey: opts.apiKey });
  }

  private async createCompletion(
    model: string,
    temperature: number,
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
  ) {
    const params = (): OpenAI.Chat.ChatCompletionCreateParamsNonStreaming => ({
      model,
      response_format: { type: 'json_object' },
      messages,
      ...(this.omitTemperature ? {} : { temperature }),
    });
    try {
      return await this.client.chat.completions.create(params());
    } catch (e: any) {
      if (!this.omitTemperature && /temperature/i.test(String(e?.message ?? ''))) {
        this.omitTemperature = true;
        this.opts.logger.warn(`model "${model}" rejected a custom temperature; retrying without it`);
        return await this.client.chat.completions.create(params());
      }
      throw e;
    }
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
      const completion = await this.createCompletion(model, temperature, messages);
      const raw = completion.choices[0]?.message?.content ?? '';
      const usage = completion.usage
        ? { promptTokens: completion.usage.prompt_tokens, completionTokens: completion.usage.completion_tokens, totalTokens: completion.usage.total_tokens }
        : undefined;

      let json: unknown;
      try {
        // Prune null-valued properties: LLMs often emit `null` for "none", which
        // breaks optional/defaulted fields. Removing them lets defaults/optionals apply.
        json = pruneNullProps(JSON.parse(raw));
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

      const issues = parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      lastError = new LLMResponseError(`"${req.schemaName}" response failed schema validation`, issues);
      this.opts.logger.warn(
        `LLM output for "${req.schemaName}" failed validation (attempt ${attempt + 1}/${maxRetries + 1})`,
        { issues },
      );
      messages.push({ role: 'assistant', content: raw });
      messages.push({
        role: 'user',
        content: `Your JSON failed validation at these paths:\n${JSON.stringify(issues, null, 2)}\nFix ONLY these issues and return the corrected, complete JSON object.`,
      });
    }

    throw lastError instanceof Error ? lastError : new LLMResponseError(`"${req.schemaName}" failed after retries`);
  }
}
