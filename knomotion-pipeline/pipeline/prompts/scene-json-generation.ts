/**
 * Stage 7 prompt — Scene JSON Generation (the constrained compiler).
 *
 * Behaves as a COMPILER: translates the approved plan + narration into valid
 * KnoMotion JSON using ONLY manifest-supported capabilities. The system prompt
 * embeds a compact capability summary derived from the renderer manifest.
 *
 * Timing is NOT authored here. Stage 6 has already computed every scene's
 * duration and line windows from the narration audio; the prompt states them
 * as fixed facts and the stage's post-process overwrites whatever the model
 * writes for `durationInFrames` / `beats`. The model's job is WHAT is on
 * screen and HOW it looks — never WHEN.
 */

import type { RendererCapabilities } from '../core/capabilities/renderer-capabilities';
import type { SceneTimingArtifact } from '../schemas/SceneTiming';
import { resolveSlots } from '../core/geometry';
import { computeTextBudget, describeBudget, effectiveColumns, metricsFor } from '../core/text-budget';
import { allowedMidScenesFor } from '../core/content-shapes';

/**
 * Text budgets for the slots the model most often uses (full, a 2-column
 * column, a 2-row row, header), derived from the manifest's geometry + font
 * metrics. Stage 8 enforces the exact budget for whatever layout is chosen.
 */
export const summariseTextBudgets = (caps: RendererCapabilities, format: 'desktop' | 'mobile' = 'desktop'): string => {
  if (!caps.textMetrics) return '';
  const g = caps.layoutGeometry;
  const slotsFull = resolveSlots({ type: 'full' }, format, g);
  const slotsCol = resolveSlots({ type: 'columnSplit', options: { columns: 2 } }, format, g);
  const slotsRow = resolveSlots({ type: 'rowStack', options: { rows: 2 } }, format, g);
  const limits: Record<string, number> = { ...caps.constraints };
  const lines: string[] = [];
  lines.push('TEXT BUDGETS (hard limits — Stage 8 rejects anything longer; write short, then shorter):');
  for (const key of caps.canonicalMidSceneKeys) {
    const m = metricsFor(caps.textMetrics, key);
    if (!m) continue;
    // Grids are budgeted at their typical column count (6 items → 3 columns for gridCards, 4 for iconGrid).
    const cols = (slot: { width: number; height: number; left: number; top: number }) => effectiveColumns(key, {}, slot, 6);
    lines.push(`- ${describeBudget('full', computeTextBudget(key, slotsFull.full, m, limits, caps.textMetrics, cols(slotsFull.full)))}`);
    lines.push(`  ${describeBudget('col1/col2', computeTextBudget(key, slotsCol.col1, m, limits, caps.textMetrics, cols(slotsCol.col1)))}`);
    lines.push(`  ${describeBudget('row1/row2', computeTextBudget(key, slotsRow.row1, m, limits, caps.textMetrics, cols(slotsRow.row1)))}`);
  }
  const headerMetrics = metricsFor(caps.textMetrics, 'textReveal');
  if (headerMetrics) {
    lines.push(`- header slot (title strip, ${Math.round(slotsFull.header.width)}×${Math.round(slotsFull.header.height)}px): ONE textReveal line ≤ ${computeTextBudget('textReveal', slotsFull.header, headerMetrics, limits, caps.textMetrics).fields[0].maxChars} chars, or leave it out.`);
  }
  return lines.join('\n');
};

/** Per-scene "you may use these mid-scenes" block from the plan's contentShape tags. */
export const summariseShapes = (videoPlan: unknown, caps: RendererCapabilities): string => {
  const scenes: any[] = (videoPlan as any)?.scenes ?? [];
  const out: string[] = [];
  for (const s of scenes) {
    const allowed = allowedMidScenesFor(s?.contentShape, caps);
    if (!allowed) continue;
    out.push(`scene "${s.id}": contentShape=${s.contentShape} → content slots may ONLY use: ${allowed.join(' | ')}`);
  }
  if (!out.length) return '';
  return ['ALLOWED MID-SCENES PER SCENE (from the plan; the header slot may always be a one-line textReveal title):', ...out].join('\n');
};

/** Builds a compact, model-friendly capability summary from the renderer manifest. */
export const summariseCapabilities = (caps: RendererCapabilities): string => {
  const midScenes = caps.raw?.midScenes ?? {};
  const lines: string[] = [];
  lines.push('MID-SCENES (use ONLY these canonical keys; aliases are NOT rendered):');
  for (const key of caps.canonicalMidSceneKeys) {
    const m = midScenes[key] ?? {};
    const required = (m.requiredFields ?? []).join(', ');
    const opts = m.keyConfig ? Object.entries(m.keyConfig).map(([k, v]) => `${k}: ${v}`).join('; ') : '';
    lines.push(`- ${key}  required: [${required}]${opts ? `  | ${opts}` : ''}`);
  }
  lines.push('');
  lines.push(`LAYOUTS: ${caps.layoutTypes.join(', ')} (slots must match the layout: full→full/header, rowStack→row1..rowN, columnSplit→col1..colN, gridSlots→cellA.., headerRowColumns→row/col1..)`);
  lines.push(`BACKGROUNDS: ${caps.backgroundPresets.join(', ')}`);
  lines.push(`TRANSITIONS: ${caps.transitionTypes.join(', ')}`);
  lines.push(`STYLE PRESETS: ${caps.stylePresets.join(', ')}`);
  lines.push(`LOTTIE KEYS (for heroText heroType:"lottie"): ${[...caps.lottieKeys].join(', ')}`);
  lines.push(
    `LIMITS: maxTextLines ${caps.constraints.maxTextLines}, maxChecklistItems ${caps.constraints.maxChecklistItems}, ` +
      `maxCardsInGrid ${caps.constraints.maxCardsInGrid}, maxCallouts ${caps.constraints.maxCallouts}, fps ${caps.constraints.fpsFixed}`,
  );
  const budgets = summariseTextBudgets(caps);
  if (budgets) {
    lines.push('');
    lines.push(budgets);
  }
  return lines.join('\n');
};

/** Renders the fixed timing facts for the user message — one block per scene. */
export const summariseTiming = (timing: SceneTimingArtifact): string => {
  const out: string[] = [];
  out.push(`fps: ${timing.fps}. All beats are SECONDS from the start of the scene.`);
  for (const s of timing.scenes) {
    out.push(`scene "${s.sceneId}": durationInFrames ${s.durationInFrames} (${s.durationSeconds}s). Narration ${s.narrationStart}s–${s.narrationEnd}s. Content exits at ${s.contentExit}s.`);
    s.lineWindows.forEach((w, i) => {
      out.push(`  line ${i + 1} "${w.text}": visible ${w.start}s → ${w.exit}s`);
    });
  }
  return out.join('\n');
};

export const sceneJsonGenerationPrompt = {
  version: '2.1',
  system: [
    'You are a COMPILER, not a writer. Translate the approved VideoPlan + NarrationScript into VALID KnoMotion',
    'scene JSON. Do not invent components, add new content, or rewrite the lesson.',
    '',
    'HARD RULES:',
    '- Output a single JSON object exactly of shape { "scenes": [...], "format": "desktop"|"mobile" }. Nothing else.',
    '- Use ONLY the canonical mid-scene keys and documented config keys listed below. Never invent keys.',
    '- One scene per planned scene, in order. Reuse the plan\'s scene `id`s. Put the matching narration\'s',
    '  on-screen text / emphasis into the visuals (e.g. textReveal lines, checklist items), IN THE SAME ORDER as',
    '  the NarrationScript.onScreenText list, one element per on-screen line.',
    '- TIMING IS FIXED. The SceneTiming block gives each scene\'s durationInFrames and each line\'s visible window.',
    '  Copy those values exactly into `durationInFrames` and `beats.start` / `beats.exit`. Do not choose your own.',
    '  (Anything you write for timing is overwritten by the computed values anyway.)',
    '- CONTENT SHAPE IS FIXED. Each scene\'s allowed mid-scenes are listed in the user message; choose the best fit',
    '  from that subset for every content slot (header may be a one-line textReveal title). Anything else is rejected.',
    '- TEXT BUDGETS ARE HARD LIMITS. Every string must fit the budget for its slot (see TEXT BUDGETS). Split or',
    '  shorten long lines; never exceed the count of lines/items/cards for the slot.',
    '- LAYOUT OPTIONS ARE REQUIRED. rowStack needs options.rows, columnSplit/headerRowColumns need options.columns,',
    '  gridSlots needs both. Declare only slot names that layout produces (e.g. columns: 2 → col1, col2), and fill',
    '  every one of them.',
    '- heroText: beats need entrance and exit; heroRef must be a listed lottie key or a URL.',
    '- sideBySide MUST use layout { "type": "full" } (it makes its own columns). Fill every declared slot.',
    '- Do NOT include an `audio` block. Narration audio is attached by the assembly stage after validation.',
    '- Respect the listed LIMITS.',
    '',
    'VOCABULARY — these are SEPARATE lists; do not mix them up:',
    '- background.preset ∈ notebookSoft | sunriseGradient | cleanCard | chalkboardGradient | spotlight. NEVER a style-preset name.',
    '- stylePreset (on a SLOT) ∈ educational | playful | minimal | mentor | focus. It goes on the slot, NOT in background.',
    '- layout.type ∈ full | rowStack | columnSplit | headerRowColumns | gridSlots. "twoColumn" and "sideBySide" are NOT layouts.',
    '- sideBySide is a MID-SCENE (use it in a slot with layout {"type":"full"}), never a layout.type.',
    '- Every element of "scenes" MUST be a complete scene object — never a bare string or number.',
    '- Emit exactly ONE scene per planned scene; do not split or invent extra scenes.',
    '',
    'NESTING — follow this shape EXACTLY. background/layout/slots go INSIDE "config".',
    'background is an OBJECT { "preset": "<preset>" } (never a string). layout is { "type": "<layout>" }.',
    '',
    'EXAMPLE (one scene whose SceneTiming said: durationInFrames 165, line 1 visible 0.4s → 5.0s; copy this structure):',
    '{',
    '  "scenes": [',
    '    {',
    '      "id": "hook",',
    '      "durationInFrames": 165,',
    '      "transition": { "type": "fade" },',
    '      "config": {',
    '        "background": { "preset": "sunriseGradient" },',
    '        "layout": { "type": "full" },',
    '        "slots": {',
    '          "full": {',
    '            "midScene": "textReveal",',
    '            "stylePreset": "playful",',
    '            "config": {',
    '              "lines": [{ "text": "Your line", "emphasis": "high", "beats": { "start": 0.4, "exit": 5.0 } }],',
    '              "revealType": "fade",',
    '              "beats": { "start": 0.4, "exit": 5.0 }',
    '            }',
    '          }',
    '        }',
    '      }',
    '    }',
    '  ],',
    '  "format": "desktop"',
    '}',
    '',
    'CAPABILITIES:',
    '{{CAPABILITIES}}',
  ].join('\n'),

  buildSystem(capabilitySummary: string): string {
    return this.system.replace('{{CAPABILITIES}}', capabilitySummary);
  },

  buildUser(input: { videoPlan: unknown; narrationScript: unknown; sceneTiming?: SceneTimingArtifact }, caps?: RendererCapabilities): string {
    const parts = [
      `VideoPlan:\n${JSON.stringify(input.videoPlan, null, 2)}`,
      `NarrationScript:\n${JSON.stringify(input.narrationScript, null, 2)}`,
    ];
    if (caps) {
      const shapes = summariseShapes(input.videoPlan, caps);
      if (shapes) parts.push(shapes);
    }
    if (input.sceneTiming) parts.push(`SceneTiming (FIXED — copy these values):\n${summariseTiming(input.sceneTiming)}`);
    return parts.join('\n\n');
  },
};
