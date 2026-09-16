# M1 acceptance demo — narrated video

Rendered artifact from the **PR #75** M1 acceptance run (`cursor/m1-tts-timing-25fd`), so the
pipeline output can be watched with narration without re-running the pipeline.

## What this is

- **`champions-and-the-trophy-narrated.mp4`** — the `champions-and-the-trophy` video from job
  `job-20260915-htdpv2`, generated with `--provider openai --tts elevenlabs`, rendered through the
  `PipelinePreview` Remotion composition (`GenericVideoPlayer`, the production code path).
  - 1920×1080, 30fps, ~74s, H.264 video + AAC audio.
  - Audio is the per-scene ElevenLabs narration wired by the assembly stage
    (`scene.audio.narration`, `startFromSeconds: 0.4` lead-in), one clip per scene, 5 scenes / 5 clips.
- **`scene2-preview.png`** — still of scene 2 (`champion-leaderboard`) with content visible.

## How it was produced

```bash
# from knomotion-pipeline/  (OPENAI_API_KEY + ELEVENLABS_API_KEY set)
npm run run -- --source worldcup --provider openai --tts elevenlabs
npm run run -- preview                      # stages champions-and-the-trophy

# from the repo root
npx remotion render KnoMotion-Videos/src/remotion/index.ts PipelinePreview \
  demo/champions-and-the-trophy-narrated.mp4
```

To re-watch interactively: `npx remotion studio KnoMotion-Videos/src/remotion/index.ts` → select the
**PipelinePreview** composition.
