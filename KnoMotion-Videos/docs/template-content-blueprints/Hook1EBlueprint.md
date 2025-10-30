##  
## **Template ID: Hook1EAmbientMystery**  
## **Pillar: Hook**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Whisper-led curiosity hook that builds atmosphere with fog + particles, spotlights a single mystery question, then leaves a lingering hint.  **  
## **Best for: intrigue-first cold opens, moodier lesson intros, topics framed as “hidden layers” or “unseen forces.”  **  
## **Avoid if: you need upbeat/bright energy, dense bullet copy, or rapid-fire sequencing (tempo is deliberate and moody).  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Deep gradient background → vignette overlay → rough.js fog layers → ambient particles → whisper line → spotlight glow → primary question → underline → late hint ribbon. Camera push-in adds depth.  **  
##  
**Signature moves:**  
	•	Fog breathes in before text; spotlight glow blooms at beat `spotlight`.    
	•	Question rises with sparkle burst, scales in to land; underline glow fades up.    
	•	Hint drifts from base, vignette settles to close the scene.    
  
## **Duration envelope: 12–18s (beats.exit + 0.5s pad).  **  
##  
## **Named Beats (sec):**  
	•	fogIn: 0.5  
	•	spotlight: 1.5  
	•	whisperText: 2.5  
	•	questionReveal: 4.0  
	•	glow1: 5.0  
	•	glow2: 5.5  
	•	wisps: 5.5  
	•	accentGlow: 7.0  
	•	hint: 8.0  
	•	settle: 9.0  
	•	exit: 12.0  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Text & Copy**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.texts.whisper	string	“In the depths of…”	≤ ~80 chars	Whisper preface	Italic, semi-transparent.  
fill.texts.question	string	“What lies beneath the surface?”	≤ ~70 chars	Main question	Center aligned; long strings reduce legibility.  
fill.texts.hint	string	“Trace the glow to discover more.”	≤ ~120 chars	Bottom hint	Optional; remove to skip final beat.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.fogIn	number	0.5	0.2–1.5	Fog draw	Delays fog clouds.  
beats.spotlight	number	1.5	>fogIn	Spotlight bloom	Also triggers glow pulse.  
beats.whisperText	number	2.5	>spotlight	Whisper entrance	Set < question for staging.  
beats.questionReveal	number	4.0	>whisper	Main reveal	Sparkles + underline sync here.  
beats.glow1 / glow2	number	5.0 / 5.5	>questionReveal	Glow pulses	Use for layered intensity.  
beats.wisps	number	5.5	≥glow1	Wispy lines	Adds parallax depth.  
beats.accentGlow	number	7.0	≥glow2	Accent orbs	Controls halo timing.  
beats.hint	number	8.0	>questionReveal	Hint reveal	Skip or push later for quieter outro.  
beats.settle	number	9.0	≥hint	Settle fade	Starts scene wrap.  
beats.exit	number	12.0	≥settle	Scene end	Duration derives here (+0.5s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#1A1F2E	any	Background	Dark base wash.  
style_tokens.colors.fog	color	#4A5568	any	Fog fills	Higher values overpower.  
style_tokens.colors.accent	color	#8E44AD	any	Glows + underline	Rich violet.  
style_tokens.colors.accent2	color	#6C7A89	any	Wisps / particles	Secondary cool tone.  
style_tokens.colors.ink	color	#E8F4FD	any	Text	High-contrast ink.  
style_tokens.colors.spotlight	color	#F39C12	any	Spotlight + glow	Warm focus color.  
style_tokens.fonts.primary	font	Cabin Sketch	any	Question	SVG rendered; keep legible.  
style_tokens.fonts.secondary	font	Inter	any	Whisper + hint	Fallback safe fonts ok.  
style_tokens.fonts.size_whisper	number	42	32–56	Whisper size	Adjust to avoid wrap.  
style_tokens.fonts.size_question	number	78	60–96	Question size	Long copy may need downscale.  
style_tokens.fonts.size_hint	number	32	24–40	Hint size	Subtitle style.  

**Effects & Counts (Performance knobs)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
ambientParticles.count	number	18	8–28	BG motion	Generated with seed 542.  
sparkles.question	number	8	4–12	Question reveal	Region centered on text.  
sparkles.duration	frames	50	30–80	Sparkle lifespan	Starts at question beat.  
glow.spotlight.intensity	number	15	8–20	Spotlight pulse	High values clip if background too dark.  
breathingAmplitude	number	0.008	0.004–0.012	Atmospheric pulse	Affects scaling overlay.  

**Layout / Camera**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
cameraZoom.start	number	1.08	1.0–1.12	Initial push	Interpolated down to 1.0.  
cameraZoom.mid	number	1.0	—	Spotlight moment	Holds at beat spotlight.  
cameraZoom.end	number	1.02	—	Settle	Adds micro drift.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Supports `notebook` and `whiteboard`; tokens swap textures only.    
	•	**Typography:** Cabin Sketch headline, Inter secondary; both configurable.    
	•	**Colors:** Uses bg, fog, accent, accent2, ink, spotlight tokens; vignette auto-adjusts alpha.    
	•	**Textures:** RoughJS fog/lines, radial gradient background, optional grain inherited globally.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: ambient_particles, sparkles, glow, fog_draw, vignette.**  
**Defaults:**  
	•	Ambient particles: 18 nodes, slow sinusoidal drift, opacity ≤ 0.25.  
	•	Sparkles: 8 bursts around question, 50f lifespan, seeded for determinism.  
	•	Spotlight glow: intensity 15, pulseSpeed 0.03 once beat `spotlight` hits.  
	•	Fog clouds: 4 zero-wobble ellipses with blur(40px); delay offsets 0–25f.  

## **Rules: keep fog opacity ≤ 0.2, avoid layering additional glow effects on hint, limit particles < 30 for perf.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Question copy works best ≤ 2 short lines (~70 chars).  
	•	Zero wobble discipline on all rough.js shapes (roughness=0, bowing=0).    
	•	Single question format—no native line splitting; manual `\n` required for multi-line.    
	•	Hint optional; omit key to skip final beat (scene still needs exit timings).    
	•	Target runtime 12–18s; extend by spacing beats not by adding static hold > 3s.    

⸻
##  
**7) QA Checklist**  
	•	Fog draws on smoothly with no flicker at beat `fogIn`.    
	•	Sparkles trigger within ±6f of `questionReveal` and end before `hint`.    
	•	Spotlight glow respects color tokens and clamps intensity (no banding).    
	•	Hint respects opacity easing and stays inside 16:9 safe zone.    
	•	Settle overlay ramps to ~0.15 opacity by `exit`.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Hook1EAmbientMystery  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, fadeDownOut, pulseEmphasis  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true }  
	•	**Duration calc:** beats.exit + 0.5s pad  
	•	**Poster frame:** beats.questionReveal  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:hook, pattern:mystery-open, motif:spotlight, mood:moody, complexity:medium, supports:[16:9], uses:[svg,roughjs], effects:[ambient_particles,sparkles,glow]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 3 (atmosphere/layout fixed, but copy, beats, colors, effect densities configurable).**  
**Extension points:**  
	•	Expose particle spawn regions & seeds to support off-center focal points.    
	•	Allow configurable underline styles (swap glow bar for sketch underline).    
	•	Parameterise fog cloud positions/count for alternate framing or negative space.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Hook1EAmbientMystery",
  "style_tokens": {
    "colors": {
      "bg": "#1A1F2E",
      "accent": "#8E44AD",
      "spotlight": "#F39C12"
    },
    "fonts": {
      "size_question": 78,
      "size_hint": 32
    }
  },
  "fill": {
    "texts": {
      "whisper": "In the depths of forgotten labs...",
      "question": "What signal is still echoing?",
      "hint": "Follow the glow to uncover it."
    }
  },
  "beats": {
    "fogIn": 0.6,
    "spotlight": 1.6,
    "whisperText": 2.6,
    "questionReveal": 4.1,
    "hint": 8.5,
    "exit": 12.2
  }
}

```


⸻
