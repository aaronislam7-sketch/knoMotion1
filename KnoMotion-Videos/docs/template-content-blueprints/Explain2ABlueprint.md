##  
## **Template ID: Explain2AConceptBreakdown**  
## **Pillar: Explain**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Dynamic hub-and-spoke teach-in that anchors one core concept then cascades 2–8 supporting parts with animated connections and glow emphasis.  **  
## **Best for: conceptual frameworks, product pillars, multi-part processes where relationships matter as much as the parts.  **  
## **Avoid if: you only have one supporting point, need heavy body copy, or require literal media embeds (layout is text-forward).  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Gradient background → ambient particles → kinetic title at top → center concept frame → adaptive grid of part cards → rough.js connectors → subtle camera drift.  **  
##  
**Signature moves:**  
	•	Title waves in word-by-word (kinetic text) before settling.    
	•	Center concept pops with glow, parts fade up in adaptive rows (2–7+).    
	•	Connections draw with collision-safe curves, then pulse; confetti burst hits on first connection.    
  
## **Duration envelope: 20–40s (beats.exit + 0.5s, scales with part count).  **  
##  
## **Named Beats (sec):**  
	•	title: 0.8  
	•	centerConcept: 2.0  
	•	parts: 3.5  
	•	connections: 3.5 + parts×0.6  
	•	pulseConnections: 4.0 + parts×0.7  
	•	settle: 5.5 + parts  
	•	exit: 6.0 + parts  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Concept Content**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.concept.title	string	“Breaking It Down”	≤ ~36 chars	Title	Wave animation splits by word.  
fill.concept.concept	string	“Main Concept”	≤ ~32 chars	Center node	Glow accent color.  
fill.concept.parts[]	array of {label, description}	See JSON	2–8 items	Part cards	Descriptions wrap within 320px.  
parts[i].label	string	“Part n”	≤ ~24 chars	Card header	Cycling accent colors.  
parts[i].description	string	“…”	≤ ~140 chars	Card body	Inter font, multi-line allowed.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.title	number	0.8	0.4–1.4	Title entrance	Must precede centerConcept.  
beats.centerConcept	number	2.0	>title	Center pop	Controls glow start.  
beats.parts	number	3.5	>centerConcept	Part cascade	Additional parts staggered via index.  
beats.connections	number	3.5 + parts×0.6	≥parts	Connector draw	Auto-fallback scales with count.  
beats.pulseConnections	number	4.0 + parts×0.7	≥connections	Pulse loop	Avoid < connections to prevent jump.  
beats.settle	number	5.5 + parts	≥pulseConnections	Scene settle	Used for camera drift ease-out.  
beats.exit	number	6.0 + parts	≥settle	Scene end	Duration derives here (+0.5s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FFF9F0	any	Background	Light parchment baseline.  
style_tokens.colors.accent	color	#FF6B35	any	Center glow / connectors	Primary highlight.  
style_tokens.colors.accent2	color	#2ECC71	any	Part color cycle 1	Used for card frame.  
style_tokens.colors.accent3	color	#9B59B6	any	Part color cycle 2	Used for card frame.  
style_tokens.colors.ink	color	#1A1A1A	any	Text	High-contrast copy.  
style_tokens.fonts.primary	font	Permanent Marker	any	Title + concept	SVG text; keep bold.  
style_tokens.fonts.secondary	font	Inter	any	Card body	System fallback friendly.  
style_tokens.fonts.size_title	number	56	42–68	Title size	Impacts kinetic amplitude.  
style_tokens.fonts.size_concept	number	48	36–60	Center size	Affects glow scale.  
style_tokens.fonts.size_part_label	number	30	24–36	Card header	Keep within card width.  
style_tokens.fonts.size_part_desc	number	22	18–26	Card body	Wrap automatically.  

**Effects & Layout Controls**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
ambientParticles.count	number	15	8–24	BG motion	Seed 142, tinted by accent palette.  
connectionBurst.count	number	20	12–32	Confetti nodes	Triggers at `connections`.  
titleKinetic.effect	string	“wave”	wave|bounce|none	Title motion	Enum in SDK.  
layout.cardWidth	px	340	280–380	Part width	Changing width affects spacing math.  
layout.padding	px	80	60–120	Scene gutters	Impacts safe zone.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook / Whiteboard supported; particle palette swaps via tokens.    
	•	**Typography:** Permanent Marker for headings, Inter for body; both set in tokens.    
	•	**Colors:** accent/2/3 rotate across parts; ensure contrast against bg.    
	•	**Textures:** RoughJS hachure fills on frames; camera drift adds parallax.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: ambient_particles, confetti_burst, kinetic_text, glow, connector_pulse.**  
**Defaults:**  
	•	Ambient particles: 15 nodes, slow drift, 0.5 opacity cap.  
	•	Confetti burst: single 90f burst at first connection, palette cycles accent colors.  
	•	Center glow: intensity 8, pulseSpeed 0.04.  
	•	Connector pulse: 3 → 5px stroke oscillation keyed off `pulseConnections`.  

## **Rules: avoid stacking extra glow on parts, limit confetti to ≤ 2 bursts, keep kinetic effect consistent across title words.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Parts array expects ≥2 entries; layout handles up to 8 gracefully (rows auto-balance).  
	•	Descriptions > ~200 chars overflow card; author should trim or swap to bullet list with `\n`.    
	•	Connector path relies on bounding boxes; avoid manually overriding box dimensions without updating collision config.    
	•	FPS-sensitive durations derived via `toFrames`; ensure beats use seconds.    
	•	Camera drift amplitude is subtle; increasing requires edits in JSX (not exposed yet).    

⸻
##  
**7) QA Checklist**  
	•	Kinetic title segments stay aligned (no baseline jitter).    
	•	Part cards respect adaptive layout, never overlap with center frame.    
	•	Connectors ease in without clipping card edges; arrowheads appear post 80% draw.    
	•	Confetti burst ends before exit; no lingering particles on settle.    
	•	Pulse animation starts after all connectors drawn (check `beats.pulseConnections`).    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Explain2AConceptBreakdown  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, popInSpring, pulseEmphasis  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true }  
	•	**Duration calc:** beats.exit + 0.5s pad (scales with part count)  
	•	**Poster frame:** beats.connections  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:explain, pattern:concept-breakdown, structure:hub-and-spoke, complexity:high, supports:[16:9], uses:[svg,roughjs], effects:[ambient_particles,confetti,glow]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 2 (layout auto-adapts; copy + part count flexible, but relies on rectangular cards).**  
**Extension points:**  
	•	Expose alternate node shapes (circle/diamond) while maintaining safe connector logic.    
	•	Allow optional “chapter” groupings for 8+ parts (clustered pulses).    
	•	Surface confetti palette + intensity in JSON for tone control.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Explain2AConceptBreakdown",
  "fill": {
    "concept": {
      "title": "Decode The System",
      "concept": "Core Loop",
      "parts": [
        { "label": "Signal", "description": "What kicks off the process." },
        { "label": "State", "description": "How we hold context between steps." },
        { "label": "Feedback", "description": "The loop that improves outcomes." }
      ]
    }
  },
  "beats": {
    "title": 0.7,
    "centerConcept": 1.8,
    "parts": 3.0,
    "connections": 4.2,
    "pulseConnections": 4.8,
    "exit": 9.5
  }
}

```


⸻
