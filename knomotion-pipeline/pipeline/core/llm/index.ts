/** LLM client factory — selects provider from config. */

import type { PipelineConfig } from '../config';
import type { Logger } from '../logger';
import type { LLMClient } from './client';
import { MockLLMClient } from './mock';
import { OpenAIClient } from './openai';
import { PipelineError } from '../errors';

export const createLLMClient = (config: PipelineConfig, logger: Logger): LLMClient => {
  switch (config.provider) {
    case 'mock':
      return new MockLLMClient();
    case 'openai':
      if (!config.openaiApiKey) {
        throw new PipelineError(
          'provider="openai" requires an API key. Set OPENAI_API_KEY (Cloud Agents → Secrets) or use provider="mock".',
          'MISSING_API_KEY',
        );
      }
      return new OpenAIClient({
        apiKey: config.openaiApiKey,
        defaultModel: config.defaultModel,
        temperature: config.temperature,
        logger,
      });
    default:
      throw new PipelineError(`Unknown provider "${config.provider}"`, 'UNKNOWN_PROVIDER');
  }
};

export type { LLMClient, LLMRequest, LLMResult } from './client';
