/**
 * Stage 0 — Intake & Normalisation (deterministic).
 *
 * Output: SourceBundle.json
 *
 * Normalises arbitrary source material (PDF, URL, document, prompt, markdown)
 * into a uniform bundle the rest of the pipeline can consume.
 *
 * MVP: only `text` and `markdown` inputs are implemented — raw content is
 * passed through into a single normalised document. The PDF / URL / document
 * extractors are out of scope; their input types exist here so the slot is
 * reserved and downstream contracts do not change when they land.
 */

import { z } from 'zod';
import { withMeta } from './common';

/** The kind of raw material that entered the pipeline. */
export const SourceInputTypeSchema = z.enum([
  'text', // MVP — plain text paste
  'markdown', // MVP — markdown paste/upload
  'pdf', // out of scope — extractor stub
  'url', // out of scope — extractor stub
  'document', // out of scope — extractor stub (docx, etc.)
]);
export type SourceInputType = z.infer<typeof SourceInputTypeSchema>;

/**
 * A single normalised document within the bundle. In MVP there is exactly one
 * document (the pasted text/markdown). The array shape leaves room for
 * multi-document intake (e.g. a PDF that splits into sections) later.
 */
export const SourceDocumentSchema = z.object({
  id: z.string().min(1).describe('Stable id for this document within the bundle'),
  type: SourceInputTypeSchema.describe('Original input type this document came from'),
  title: z.string().optional().describe('Document title, if detectable'),
  content: z
    .string()
    .min(1)
    .describe('Normalised plain text or markdown content for downstream LLM stages'),
  sourceUri: z.string().optional().describe('Original location (file path / URL), if any'),
  wordCount: z.number().int().min(0).optional().describe('Approximate word count'),
  metadata: z
    .record(z.unknown())
    .optional()
    .describe('Extractor-specific metadata (page count, headings, etc.)'),
});
export type SourceDocument = z.infer<typeof SourceDocumentSchema>;

export const SourceBundleSchema = withMeta({
  jobId: z.string().min(1).describe('Run identifier (mirrors meta.jobId for convenience)'),
  inputType: SourceInputTypeSchema.describe('Primary input type for this run'),
  documents: z
    .array(SourceDocumentSchema)
    .min(1)
    .describe('Normalised documents extracted from the source material'),
  language: z.string().optional().describe('Detected primary language (BCP-47), e.g. "en"'),
  userPrompt: z
    .string()
    .optional()
    .describe('Optional free-form instruction from the user about intent/audience/tone'),
});
export type SourceBundle = z.infer<typeof SourceBundleSchema>;
