/** Typed pipeline errors. */

export class PipelineError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'PipelineError';
  }
}

/** Thrown by stage stubs that have a named slot but no handler yet (captions, render-check, render). */
export class NotImplementedError extends PipelineError {
  constructor(stage: string) {
    super(`Stage "${stage}" is not implemented yet.`, 'NOT_IMPLEMENTED', { stage });
    this.name = 'NotImplementedError';
  }
}

/** Thrown when a TTS provider call fails (network, auth, malformed response). */
export class TTSProviderError extends PipelineError {
  constructor(message: string, details?: unknown) {
    super(message, 'TTS_PROVIDER', details);
    this.name = 'TTSProviderError';
  }
}

/** Thrown when an LLM response cannot be parsed/validated after retries. */
export class LLMResponseError extends PipelineError {
  constructor(message: string, details?: unknown) {
    super(message, 'LLM_RESPONSE_INVALID', details);
    this.name = 'LLMResponseError';
  }
}

/** Thrown when a stage's input or output fails its Zod contract. */
export class ContractError extends PipelineError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONTRACT_VIOLATION', details);
    this.name = 'ContractError';
  }
}
