/**
 * ElevenLabs TTS via the with-timestamps endpoint.
 *
 *   POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps
 *   -> { audio_base64, alignment: { characters[], character_start_times_seconds[], character_end_times_seconds[] } }
 *
 * Character alignment is folded into word timings here so the rest of the
 * pipeline only ever sees words. Uses the global fetch (Node 18+); no SDK.
 */

import type { WordTiming } from '../../schemas/TTSManifest';
import { TTSProviderError } from '../errors';
import type { SynthesisResult, TTSProviderClient } from './provider';

export interface ElevenLabsOptions {
  apiKey: string;
  voiceId: string;
  modelId: string;
  /** codec_sampleRate_bitrate; mp3_44100_128 is available on the free tier. */
  outputFormat?: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

interface CharacterAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

interface WithTimestampsResponse {
  audio_base64: string;
  alignment?: CharacterAlignment | null;
  normalized_alignment?: CharacterAlignment | null;
}

/** Groups character-level alignment into whitespace-delimited words. Exported for tests. */
export const alignmentToWordTimings = (a: CharacterAlignment): WordTiming[] => {
  const out: WordTiming[] = [];
  let word = '';
  let start: number | undefined;
  let end = 0;
  const flush = () => {
    if (word && start !== undefined) {
      out.push({ word, startMs: Math.round(start * 1000), endMs: Math.round(end * 1000) });
    }
    word = '';
    start = undefined;
  };
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { flush(); return; }
    if (start === undefined) start = a.character_start_times_seconds[i];
    end = a.character_end_times_seconds[i];
    word += ch;
  });
  flush();
  return out;
};

export class ElevenLabsTTS implements TTSProviderClient {
  readonly name = 'elevenlabs' as const;
  readonly cacheScope: string;
  private readonly opts: Required<Omit<ElevenLabsOptions, 'fetchImpl'>> & { fetchImpl: typeof fetch };

  constructor(options: ElevenLabsOptions) {
    if (!options.apiKey) {
      throw new TTSProviderError('ElevenLabs API key missing — set ELEVENLABS_API_KEY or use --tts mock');
    }
    this.opts = {
      outputFormat: 'mp3_44100_128',
      baseUrl: 'https://api.elevenlabs.io',
      timeoutMs: 60_000,
      fetchImpl: globalThis.fetch,
      ...options,
    };
    this.cacheScope = `elevenlabs|${this.opts.voiceId}|${this.opts.modelId}|${this.opts.outputFormat}`;
  }

  async synthesize(text: string): Promise<SynthesisResult> {
    const { apiKey, voiceId, modelId, outputFormat, baseUrl, timeoutMs, fetchImpl } = this.opts;
    const url = `${baseUrl}/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=${encodeURIComponent(outputFormat)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res: Response;
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ text, model_id: modelId }),
        signal: controller.signal,
      });
    } catch (err) {
      throw new TTSProviderError(`ElevenLabs request failed: ${(err as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new TTSProviderError(`ElevenLabs returned HTTP ${res.status}`, { status: res.status, body: body.slice(0, 500) });
    }
    const json = (await res.json()) as WithTimestampsResponse;
    if (!json.audio_base64) throw new TTSProviderError('ElevenLabs response had no audio_base64');

    const alignment = json.alignment ?? json.normalized_alignment ?? null;
    const wordTimings = alignment ? alignmentToWordTimings(alignment) : [];
    const lastEnd = alignment?.character_end_times_seconds.at(-1) ?? 0;

    return {
      audio: Buffer.from(json.audio_base64, 'base64'),
      audioExt: outputFormat.startsWith('mp3') ? 'mp3' : outputFormat.split('_')[0],
      // Alignment ends at the last spoken character; the file carries a little trailing silence.
      durationSeconds: Math.round((lastEnd + 0.1) * 100) / 100,
      wordTimings,
      voiceId,
      modelId,
    };
  }
}
