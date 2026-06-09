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

/** Thrown by out-of-scope stage stubs (TTS, captions, beat-align, assembly, render). */
export class NotImplementedError extends PipelineError {
  constructor(stage: string) {
    super(`Stage "${stage}" is not implemented (out of MVP scope).`, 'NOT_IMPLEMENTED', { stage });
    this.name = 'NotImplementedError';
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
