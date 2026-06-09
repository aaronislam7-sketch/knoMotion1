import { describe, it, expect, afterAll } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { ArtifactStore } from '../core/artifact-store';
import { ContractError } from '../core/errors';

const tmpRoot = path.join(os.tmpdir(), `km-store-${Date.now()}`);
afterAll(async () => { await fs.rm(tmpRoot, { recursive: true, force: true }); });

const Schema = z.object({ a: z.string(), n: z.number().int() });

describe('ArtifactStore', () => {
  it('writes then reads back a validated artifact', async () => {
    const store = new ArtifactStore(tmpRoot, 'job-1');
    await store.writeArtifact('thing.json', Schema, { a: 'x', n: 3 });
    const read = await store.readArtifact('thing.json', Schema);
    expect(read).toEqual({ a: 'x', n: 3 });
  });

  it('rejects an artifact that violates its schema on write', async () => {
    const store = new ArtifactStore(tmpRoot, 'job-2');
    await expect(store.writeArtifact('bad.json', Schema, { a: 'x', n: 1.5 })).rejects.toBeInstanceOf(ContractError);
  });

  it('records manifest entries', async () => {
    const store = new ArtifactStore(tmpRoot, 'job-3');
    await store.appendManifest({ stage: 'intake', artifact: 'a.json', path: 'a.json', status: 'ok', at: new Date().toISOString() });
    await store.appendManifest({ stage: 'validation', artifact: 'b.json', path: 'b.json', status: 'ok', at: new Date().toISOString() });
    const manifest = JSON.parse(await fs.readFile(path.join(tmpRoot, 'job-3', 'job.json'), 'utf8'));
    expect(manifest.entries).toHaveLength(2);
    expect(manifest.entries.map((e: any) => e.stage)).toEqual(['intake', 'validation']);
  });
});
