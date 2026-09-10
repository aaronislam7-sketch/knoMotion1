/**
 * MockLLMClient — deterministic, input-aware stand-in for a real LLM.
 *
 * Lets the whole pipeline run end-to-end (and in tests) with no API calls.
 * It resolves a response by `schemaName` from a builder map, synthesizing a
 * minimal VALID payload from the structured `req.input`. Builders return the
 * artifact PAYLOAD (without meta); the stage adds meta afterwards.
 */

import type { LLMClient, LLMRequest, LLMResult } from './client';
import { LLMResponseError } from '../errors';
import { secondsToFrames } from '../fps';

type Builder = (input: any) => unknown;

/**
 * Builds one slot for a planned scene. Like the real Stage-7 model it mirrors
 * the narration's onScreenText into the visuals in order; the beats it writes
 * are placeholders that the stage's timing post-process overwrites.
 */
const buildSlot = (scene: any, onScreenText: string[] | undefined, durSec: number) => {
  const mid = (scene?.suggestedMidScenes && scene.suggestedMidScenes[0]) || 'textReveal';
  const exit = Math.max(0.6, durSec - 0.3);
  const texts: string[] = onScreenText?.length ? onScreenText : scene?.keyPoints?.length ? scene.keyPoints : [scene?.title ?? 'Title'];
  if (mid === 'checklist') {
    const items = texts.map((t: string) => ({ text: t, checked: true }));
    return {
      midScene: 'checklist',
      stylePreset: 'educational',
      config: { items, revealType: 'pop', icon: 'check', beats: { start: 0.5, exit } },
    };
  }
  return {
    midScene: 'textReveal',
    stylePreset: 'educational',
    config: {
      lines: texts.map((t, i) => ({ text: t, emphasis: i === 0 ? 'high' : 'normal', beats: { start: 0.3 + i * 0.4, exit } })),
      revealType: 'fade',
      beats: { start: 0.3, exit },
    },
  };
};

export const DEFAULT_BUILDERS: Record<string, Builder> = {
  ContentMap: (input) => ({
    sourceSummary: `Summary of ${input?.title ?? 'the source material'}.`,
    domain: 'general',
    audienceHint: 'general learners',
    concepts: [
      { id: 'concept-1', title: 'Core idea', summary: 'The central concept of the material.', difficulty: 'beginner', importance: 0.9 },
      { id: 'concept-2', title: 'Supporting idea', summary: 'A concept that builds on the core idea.', difficulty: 'intermediate', importance: 0.6, prerequisiteIds: ['concept-1'] },
    ],
    learnerProblems: [{ id: 'problem-1', description: 'Learners conflate the two ideas.', relatedConceptIds: ['concept-1', 'concept-2'] }],
    misconceptions: [{ id: 'misc-1', statement: 'The ideas are the same.', correction: 'They are related but distinct.', relatedConceptIds: ['concept-2'] }],
    keyTakeaways: ['Understand the core idea', 'See how the supporting idea extends it'],
  }),

  ModulePlan: (input) => {
    const conceptIds: string[] = (input?.concepts ?? []).map((c: any) => c.id);
    const ids = conceptIds.length ? conceptIds : ['concept-1'];
    return {
      moduleTitle: 'Learning Module',
      moduleSummary: 'A short module covering the source material.',
      targetAudience: input?.audienceHint ?? 'general learners',
      objectives: [{ id: 'obj-1', statement: 'Explain the core idea and how it extends.', conceptIds: ids }],
      videos: [
        { id: 'video-1', order: 0, title: 'Introducing the core idea', summary: 'Hooks the learner and explains the core idea.', objectiveIds: ['obj-1'], conceptIds: ids, difficulty: 'beginner', estimatedDurationSeconds: 20 },
      ],
      sequenceRationale: 'A single introductory video for the MVP.',
    };
  },

  VideoPlan: (input) => {
    const brief = input?.brief ?? {};
    const videoId = brief.id ?? 'video-1';
    return {
      videoId,
      title: brief.title ?? 'Video',
      narrativeArc: 'Hook the learner, explain the core idea, recap the takeaway.',
      audience: 'general learners',
      difficulty: brief.difficulty ?? 'beginner',
      targetDurationSeconds: brief.estimatedDurationSeconds ?? 20,
      scenes: [
        { id: `${videoId}-s1`, order: 0, purpose: 'hook', title: 'Why this matters', beat: 'Open with a hook.', keyPoints: ['This matters because...'], visualIntent: 'Bold animated title', suggestedMidScenes: ['textReveal'], suggestedLayout: 'full', suggestedStylePreset: 'playful', estimatedDurationSeconds: 5 },
        { id: `${videoId}-s2`, order: 1, purpose: 'concept', title: 'The core idea', beat: 'Explain the core idea in steps.', keyPoints: ['First point', 'Second point', 'Third point'], visualIntent: 'A checklist building up', suggestedMidScenes: ['checklist'], suggestedLayout: 'full', suggestedStylePreset: 'educational', estimatedDurationSeconds: 10 },
        { id: `${videoId}-s3`, order: 2, purpose: 'summary', title: 'Takeaway', beat: 'Recap the takeaway.', keyPoints: ['Remember this'], visualIntent: 'Single bold takeaway', suggestedMidScenes: ['textReveal'], suggestedLayout: 'full', suggestedStylePreset: 'mentor', estimatedDurationSeconds: 5 },
      ],
    };
  },

  NarrationScript: (input) => {
    const vp = input?.videoPlan ?? {};
    const scenes = (vp.scenes ?? []).map((s: any, i: number) => ({
      sceneId: s.id,
      order: s.order ?? i,
      narration: `${s.beat ?? 'Narration.'} ${(s.keyPoints ?? []).join(' ')}`.trim(),
      onScreenText: s.keyPoints ?? [],
      emphasisPhrases: (s.keyPoints ?? []).slice(0, 1),
      estimatedDurationSeconds: s.estimatedDurationSeconds ?? 5,
    }));
    return {
      videoId: vp.videoId ?? 'video-1',
      title: vp.title ?? 'Video',
      voice: { style: 'warm', tone: 'encouraging', pace: 'medium' },
      scenes: scenes.length ? scenes : [{ sceneId: 'video-1-s1', order: 0, narration: 'Hello.', onScreenText: ['Hello'], emphasisPhrases: [], estimatedDurationSeconds: 5 }],
    };
  },

  // NOTE: scene-json output is the renderer config (no meta envelope).
  KnoMotionVideoConfig: (input) => {
    const vp = input?.videoPlan ?? {};
    const narrationByScene = new Map<string, any>((input?.narrationScript?.scenes ?? []).map((n: any) => [n.sceneId, n]));
    const timingByScene = new Map<string, any>((input?.sceneTiming?.scenes ?? []).map((t: any) => [t.sceneId, t]));
    const scenes = (vp.scenes ?? []).map((s: any, i: number) => {
      const timing = timingByScene.get(s.id);
      const durSec = timing?.durationSeconds ?? s.estimatedDurationSeconds ?? 5;
      return {
        id: s.id ?? `scene-${i + 1}`,
        durationInFrames: timing?.durationInFrames ?? secondsToFrames(durSec),
        transition: i === 0 ? undefined : { type: 'fade' },
        config: {
          background: { preset: 'sunriseGradient' },
          layout: { type: 'full' },
          slots: { full: buildSlot(s, narrationByScene.get(s.id)?.onScreenText, durSec) },
        },
      };
    });
    return {
      scenes: scenes.length ? scenes : [{ id: 'scene-1', durationInFrames: 150, config: { background: { preset: 'cleanCard' }, layout: { type: 'full' }, slots: { full: buildSlot({ title: 'Hello' }, undefined, 5) } } }],
      format: vp?.format ?? input?.format ?? 'desktop',
    };
  },

  RepairPatch: (input) => ({
    videoId: input?.videoId ?? 'video-1',
    sceneId: input?.sceneId ?? 'scene-1',
    sceneIndex: input?.sceneIndex ?? 0,
    attempt: input?.attempt ?? 1,
    targetIssues: input?.issues ?? [],
    patchedScene: input?.scene,
    status: 'repaired',
    unchangedGuarantee: true,
    notes: 'mock repair: echoed scene unchanged',
  }),
};

export class MockLLMClient implements LLMClient {
  readonly name = 'mock';
  constructor(private readonly builders: Record<string, Builder> = DEFAULT_BUILDERS) {}

  async complete<T>(req: LLMRequest<T>): Promise<LLMResult<T>> {
    const builder = this.builders[req.schemaName];
    if (!builder) {
      throw new LLMResponseError(`MockLLMClient has no builder for schema "${req.schemaName}"`);
    }
    const payload = builder(req.input);
    const parsed = req.schema.safeParse(payload);
    if (!parsed.success) {
      throw new LLMResponseError(`Mock payload for "${req.schemaName}" failed schema`, parsed.error.flatten());
    }
    return { data: parsed.data, raw: JSON.stringify(payload), model: req.model ?? 'mock' };
  }
}
