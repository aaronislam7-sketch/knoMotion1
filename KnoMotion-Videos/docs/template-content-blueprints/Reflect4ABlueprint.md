##  
## **Template ID: Reflect4AKeyTakeaways**  
## **Pillar: Reflect**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Calm end-cap that surfaces 2–4 key takeaways with numbered highlights and an optional closing message.  **  
## **Best for: lesson recaps, workshop sign-offs, “remember these points” segments where clarity > spectacle.  **  
## **Avoid if: you need dense paragraphs, interactive prompts, or high-energy endings (motion is subtle and deliberate).  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Soft gradient background → ambient particles → title → vertically stacked takeaways with numbered chips → optional exit message.  **  
##  
**Signature moves:**  
	•	Takeaways fade up sequentially with light pulse and underline draw for numbers.    
	•	Number accents rotate across accent colors (green, blue, orange).    
	•	Exit message glides in once all points have landed.    
  
## **Duration envelope: 8–12s (beats.exit + 1.0s pad; extends with more takeaways).  **  
##  
## **Named Beats (sec):**  
	•	title: 0.8  
	•	takeaway1: 2.2  
	•	takeaway2: 3.4  
	•	takeaway3: 4.6  
	•	takeaway4: 5.8  
	•	exit: 8.0  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Reflection Copy**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.reflection.title	string	“Key Takeaways”	≤ ~40 chars	Header	Permanent Marker.  
fill.reflection.takeaways[]	array<{main, sub?}>	[]	2–4 items	List entries	Ordered list.  
takeaways[i].main	string	—	≤ ~90 chars	Primary line	Bold, sized 32px default.  
takeaways[i].sub	string|null	—	≤ ~140 chars	Supporting text	Optional; Inter font.  
fill.reflection.exitMessage	string|null	—	≤ ~120 chars	Closing message	Italicised, optional.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.title	number	0.8	0.5–1.2	Title reveal	Precedes list.  
beats.takeawayN	number	2.2 + (N-1)*1.2	Editable per index	Takeaway entrance	Set via `beats.takeaway1`, `takeaway2`, etc.  
beats.exit	number	8.0	≥ last takeaway	Exit message	Duration derives here (+1.0s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FAFBFC	any	Background	Soft canvas.  
style_tokens.colors.accent	color	#27AE60	any	Number 1 + underline	Also exit italics.  
style_tokens.colors.accent2	color	#2E7FE4	any	Number 2 color	Used when index %3 == 1.  
style_tokens.colors.accent3	color	#FF6B35	any	Number 3 color	Cycle repeats.  
style_tokens.colors.ink	color	#1A1A1A	any	Text	Global copy color.  
style_tokens.fonts.primary	font	Permanent Marker	any	Title + mains.  
style_tokens.fonts.secondary	font	Inter	any	Subs + exit.  
style_tokens.fonts.size_title	number	54	44–64	Header size	Center aligned.  
style_tokens.fonts.size_oneliner	number	32	26–36	Takeaway main	Multiple lines allowed.  
style_tokens.fonts.size_subtext	number	22	18–26	Supporting copy	Optional.  

**Effects & Styling**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
ambientParticles.count	number	8	4–12	Background motion	Low-opacity drift.  
takeaway.pulse.scale	number	1.02	1.0–1.05	Post-entrance emphasis	Subtle bounce.  
underline.drawDuration	seconds	0.5	0.3–0.8	Number underline	Uses `getCircleDrawOn`.  
layout.gap	px	40	24–56	Spacing between takeaways	Impacts stack height.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook / Whiteboard supported; only token swaps required.    
	•	**Typography:** Permanent Marker mains, Inter subs/exit; both adjustable via tokens.    
	•	**Colors:** Accent cycle gives each takeaway a unique hue; ensure accessibility.    
	•	**Textures:** Subtle ambient particles and optional global grain; otherwise clean lines.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: ambient_particles, underline_draw, pulse_emphasis.**  
**Defaults:**  
	•	Underline draw begins 0.4s after each takeaway beat.  
	•	Pulse scale 1.02 for 0.6s to reinforce attention.  
	•	Particles opacity capped at 0.15 for minimal distraction.  

## **Rules: keep particle count low (≤12), avoid additional sparkles, maintain zero wobble on underline SVG.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Designed for 2–4 takeaways; fewer leaves extra vertical space, more requires layout edits.  
	•	Main lines > ~100 chars may wrap twice; consider manual line breaks.    
	•	Exit message optional; if omitted, ensure outro still hits `beats.exit`.    
	•	No multi-column mode; keep copy concise for readability.    
	•	Background particles rely on shared SDK—seed is fixed for deterministic look.    

⸻
##  
**7) QA Checklist**  
	•	Takeaway count matches JSON; numbering increments correctly.    
	•	Underline draw completes before exit message entrance.    
	•	Pulse never exceeds 1.05 scale (avoid jitter).    
	•	Particles animate but remain under 0.2 opacity.    
	•	Exit message stays within safe margins and respects italics style.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Reflect4AKeyTakeaways  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, pulseEmphasis  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true, dynamicDuration: true }  
	•	**Duration calc:** beats.exit + 1.0s pad  
	•	**Poster frame:** last takeaway beat  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:reflect, pattern:key-takeaways, pacing:staggered, complexity:low, supports:[16:9], uses:[svg,roughjs], effects:[ambient_particles,pulse]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 2 (stack count + beats configurable; layout linear but copy highly flexible).**  
**Extension points:**  
	•	Expose optional icon slots per takeaway (SVG or emoji).    
	•	Allow two-column variant for 5–6 shorter bullets.    
	•	Surface exit message tone presets (quote, CTA, reflection) with style tweaks.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Reflect4AKeyTakeaways",
  "fill": {
    "reflection": {
      "title": "Remember These",
      "takeaways": [
        { "main": "Anchor every sprint with a user insight", "sub": "Keeps priorities customer-led." },
        { "main": "Ship a visible improvement weekly" },
        { "main": "Celebrate micro-wins", "sub": "Momentum beats massive drops." }
      ],
      "exitMessage": "Pause, note your next micro-win, then close the tab." 
    }
  },
  "beats": {
    "takeaway1": 2.0,
    "takeaway2": 3.1,
    "takeaway3": 4.4,
    "exit": 8.2
  }
}

```


⸻
