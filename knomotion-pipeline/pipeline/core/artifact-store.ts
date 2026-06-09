/**
 * ArtifactStore — validated, replayable artifact I/O for a single job.
 *
 * Every artifact is validated against its Zod schema on write AND on read, so
 * a job directory is always a trustworthy, replayable record. Artifacts are
 * written as pretty JSON under  <artifactsDir>/<jobId>/ , with per-video
 * artifacts nested under  videos/<videoId>/ .
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import { ContractError } from './errors';
import type { ArtifactMeta } from '../schemas/common';

export interface JobManifestEntry {
  stage: string;
  artifact: string;
  path: string;
  status: 'ok' | 'failed' | 'skipped';
  producedBy?: ArtifactMeta['producedBy'];
  model?: string;
  videoId?: string;
  durationMs?: number;
  at: string;
}

export class ArtifactStore {
  readonly jobDir: string;

  constructor(
    private readonly rootDir: string,
    readonly jobId: string,
  ) {
    this.jobDir = path.join(rootDir, jobId);
  }

  videoDir(videoId: string): string {
    return path.join('videos', videoId);
  }

  private abs(relPath: string): string {
    return path.join(this.jobDir, relPath);
  }

  async exists(relPath: string): Promise<boolean> {
    try {
      await fs.access(this.abs(relPath));
      return true;
    } catch {
      return false;
    }
  }

  /** Validate `data` against `schema`, then write it as pretty JSON. Returns the parsed data. */
  async writeArtifact<T>(relPath: string, schema: z.ZodType<T>, data: unknown): Promise<T> {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new ContractError(`Artifact "${relPath}" failed its output contract`, parsed.error.flatten());
    }
    await this.writeJson(relPath, parsed.data);
    return parsed.data;
  }

  /** Read + validate an existing artifact (used for resume/replay). */
  async readArtifact<T>(relPath: string, schema: z.ZodType<T>): Promise<T> {
    const raw = await fs.readFile(this.abs(relPath), 'utf8');
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      throw new ContractError(`Artifact "${relPath}" failed its contract on read`, parsed.error.flatten());
    }
    return parsed.data;
  }

  /** Write arbitrary JSON (used for the job manifest). */
  async writeJson(relPath: string, data: unknown): Promise<void> {
    const target = this.abs(relPath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  async appendManifest(entry: JobManifestEntry): Promise<void> {
    const manifestPath = 'job.json';
    let manifest: { jobId: string; entries: JobManifestEntry[] } = { jobId: this.jobId, entries: [] };
    if (await this.exists(manifestPath)) {
      manifest = JSON.parse(await fs.readFile(this.abs(manifestPath), 'utf8'));
    }
    manifest.entries.push(entry);
    await this.writeJson(manifestPath, manifest);
  }
}
