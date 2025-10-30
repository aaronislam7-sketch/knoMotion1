##   
## **Template ID: Hook1AQuestionBurst**  
## **Pillar: Hook**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  
  
⸻  
##   
**1) Intent & Fit**  
##   
## **Purpose: Two-part question reveal that spikes attention, wipes the stage, teases a stylised “map” motif, then lands a branded welcome + subtitle.  **  
## **Best for: cold opens; intrigue-led hooks; short, punchy lesson intros (15–18s).  **  
## **Avoid if: you need dense body copy, interaction, or sober/neutral tone (sparkles + shimmer are part of the vibe).  **  
  
⸻  
##   
**2) Visual & Motion Overview**  
##   
## **Layout: BG gradient → ambient particles (back) → liquid blob (behind map) → rough/SVG text questions → map SVG → welcome (shimmer) → subtitle. Subtle camera drift across layers.  **  
##   
**Signature moves:**  
	•	Entrances: fade-up for Q1/Q2; sparkle bursts on each; map draws in; welcome fades with shimmer.    
	•	Mid-scene: Q1 shifts upward; both questions pulse; coordinated wipe-left clears space; map later shrinks to corner.    
	•	Exit: gentle settle fade post exit.    
  
## **Duration envelope: 15–18s (derived from beats).  **  
##   
## **Named Beats (sec) (JSON-authored; seconds → frames in code):**  
	•	questionPart1: 0.6  
	•	moveUp: 2.0  
	•	questionPart2: 2.8  
	•	emphasis: 4.2  
	•	wipeQuestions: 5.5  
	•	mapReveal: 6.5  
	•	transformMap: 9.0  
	•	welcome: 10.0  
	•	subtitle: 12.0  
	•	breathe: 13.5  
	•	exit: 15.0     
  
⸻  
##   
**3) Dynamic Controls Map (what’s adjustable)**  
##   
**Text & Copy**  
  
**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.texts.questionPart1	string	“What if geography”	≤ ~30–36 chars/line	Q1 header	Long strings wrap poorly; keep to ~1 line.    
fill.texts.questionPart2	string	“was measured in mindsets?”	≤ ~30–36 chars/line	Q2 header	Accent color applied.    
fill.texts.welcome	string	“Welcome to Knodovia”	short	Welcome title	Shimmer gradient fill.    
fill.texts.subtitle	string	“A place where your perspective…”	≤ ~90 chars	Subtitle	Permanent Marker body.    
  
**Timing (Beats in seconds)**  
  
**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.questionPart1	number	0.6	0.2–1.5	Q1 entrance	  
beats.moveUp	number	2.0	>Q1	Q1 shift	  
beats.questionPart2	number	2.8	>moveUp	Q2 entrance	  
beats.emphasis	number	4.2	>Q2	Pulses	  
beats.wipeQuestions	number	5.5	>emphasis	Q wipe	  
beats.mapReveal	number	6.5	>wipe	Map in	  
beats.transformMap	number	9.0	>reveal	Shrink to corner	  
beats.welcome	number	10.0	>transform	Welcome	  
beats.subtitle	number	12.0	>welcome	Subtitle	  
beats.breathe	number	13.5	>subtitle	Idle loop	  
beats.exit	number	15.0	≥12–18	Settle fade	Duration derives here (+0.5s pad).    
  
**Style Tokens**  
  
**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FFF9F0	any	BG + settle	Warm baseline.    
style_tokens.colors.ink	color	#1A1A1A	any	Text	  
style_tokens.colors.accent	color	#FF6B35	any	Q2 stroke/fill	  
style_tokens.colors.accent2	color	#9B59B6	any	Map details, shimmer	  
style_tokens.fonts.header	font	Cabin Sketch	any	Q1/Q2/Welcome	Rendered via SVG <text>.    
style_tokens.fonts.secondary	font	Permanent Marker	any	Subtitle	  
style_tokens.fonts.body	font	Inter	any	N/A here	  
style_tokens.fonts.size_*	number	title 76 / q 92 / welcome 72 / subtitle 32	sensible	Text sizing	Long strings need manual size tweaks.    
  
**Effects & Counts (Performance knobs)**  
  
**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
Ambient particles count	number (SDK)	20	8–24	BG motion	Generated deterministically; opacity ~0.6.    
Sparkles (Q1/Q2/Welcome)	number each (SDK)	8 / 10 / 12	4–14	Reveal emphasis	Window ≈ 50–60 frames post-beat.    
Liquid blob opacity	number	0.15	0.08–0.18	Map backdrop	Keep subtle to avoid “busy”.    
Breathe amount	number	0.02	0.01–0.03	Welcome idle	Starts at beats.breathe.    
  
**Layout/Transforms**  
  
**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
shrinkToCorner.targetScale	number	0.4	0.3–0.6	Map size	Preset-driven.    
shrinkToCorner.targetPos.x	px	600	viewport	Map pos	Relative to center.    
shrinkToCorner.targetPos.y	px	-300	viewport	Map pos	Negative = up.    
  
  
⸻  
##   
**4) Style & Modes**  
	•	**Modes:** Notebook (warm, textured) and Whiteboard (clean) supported via tokens; no behavior change.    
	•	**Typography:** Cabin Sketch (SVG text) for headers; Permanent Marker for subtitle; Inter fallback. Sizes configurable.    
	•	**Colors used:** bg, ink, accent, accent2; shimmer introduces gold mid-stop.    
	•	**Textures:** BG radial tints; paper grain optional at global layer.    
  
⸻  
##   
**5) Creative Effects (**✨** Magic)**  
##   
## **Allowed: ambient_particles, sparkles, liquid_blob, shimmer.**  
**Defaults:**  
	•	Sparkles: 50–60f windows at questionPart1, questionPart2, welcome.  
	•	Blob: opacity ≤ 0.15; sits *behind* map, active mapReveal → transformMap+60f.  
	•	Shimmer: welcome text only; animated gradient sweep.    
  
## **Rules: keep particles ≤ ~20; don’t run sparkles continuously; keep blob subtle to respect “zero wobble” aesthetic.  **  
  
⸻  
##   
**6) Constraints & Limits**  
	•	**Text length:** aim ≤ 36 chars/line for Q1/Q2 to avoid awkward wraps.  
	•	**Zero wobble discipline:** roughness=0, bowing=0 on all RoughJS shapes. Blob may wobble but must remain low-opacity.    
	•	**Export:** 16:9 baseline; poster frame at emphasis.    
  
⸻  
##   
**7) QA Checklist**  
	•	Sparkles trigger and end within windows for Q1, Q2, Welcome.    
	•	Map draw-on completes, then shrink-to-corner hits target (scale/pos).    
	•	RoughJS paths show **no** wobble; markers appear after 50% map progress.    
	•	Welcome shimmer gradient ID is deterministic via scene ID factory.    
	•	Subtitle appears after welcome; ≤ 800px width; readable opacity.    
	•	Settle fade ramps to ~0.15 opacity after exit.    
  
⸻  
##   
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Hook1AQuestionBurst  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, pulseEmphasis, breathe, shrinkToCorner  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true }  
	•	**Duration calc:** beats.exit + 0.5s pad  
	•	**Poster frame:** beats.emphasis     
  
⸻  
##   
**9) Coverage Tags**  
##   
```
tags: [pillar:hook, pattern:question-reveal, pattern:map-tease, pattern:brand-welcome, complexity:medium, supports:[16:9], uses:[svg,roughjs], effects:[sparkles,blob,shimmer]]

```
  
⸻  
##   
**10) Extension Points & Rigidity Index**  
##   
## **Rigidity (0–5): 3 (layout is fairly prescribed; copy, beats, colors, intensities are flexible).**  
**Extension points:**  
	•	Swap map motif for another central SVG (chart, diagram) with same draw→shrink beats.  
	•	Add optional **highlightSwipe** on the welcome (keep shimmer OR highlight, not both).  
	•	Allow mobile variant with reduced particle count and larger subtitle size.    
  
⸻  
##   
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Hook1AQuestionBurst",
  "style_tokens": {
    "mode": "notebook",
    "colors": { "accent": "#FF6B35", "accent2": "#9B59B6" }
  },
  "fill": {
    "texts": {
      "questionPart1": "What if geography",
      "questionPart2": "was measured in mindsets?",
      "welcome": "Welcome to Knodovia",
      "subtitle": "A place where your perspective shapes the landscape..."
    }
  },
  "beats": {
    "questionPart1": 0.6,
    "moveUp": 2.0,
    "questionPart2": 2.8,
    "emphasis": 4.2,
    "wipeQuestions": 5.5,
    "mapReveal": 6.5,
    "transformMap": 9.0,
    "welcome": 10.0,
    "subtitle": 12.0,
    "breathe": 13.5,
    "exit": 15.0
  }
}

```
  
  
⸻  
