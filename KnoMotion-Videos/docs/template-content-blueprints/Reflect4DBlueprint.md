##  
## **Template ID: Reflect4DForwardLink**  
## **Pillar: Reflect**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Celebrate the current learning milestone, show progression markers, then tee up what’s coming next with a motivating CTA.  **  
## **Best for: chapter hand-offs, module completions, onboarding journeys that need to bridge to the next experience.  **  
## **Avoid if: there’s no defined “next” step, you need interactive branching, or the vibe should stay introspective (scene shifts energy forward).  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Title → central “current learning” panel → achievement checks → mini-map stepping stones → next journey panel → CTA ribbon.  **  
##  
**Signature moves:**  
	•	Current achievement frame pulses, then shrinks to completed badge in top-left.    
	•	Stepping stones animate along a curved path signalling momentum.    
	•	Next module frame draws on with energy burst, followed by CTA arrow sweep.    
  
## **Duration envelope: 18–28s (beats.exit + 0.5s pad).  **  
##  
## **Named Beats (sec):**  
	•	title: 0.5  
	•	current: 1.5  
	•	celebrate: 3.0  
	•	moveToComplete: 4.5  
	•	steppingStones: 5.5  
	•	nextReveal: 7.0  
	•	cta: 8.5  
	•	exit: 10.5  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Journey Copy**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.forward.title	string	“Your Learning Journey”	≤ ~42 chars	Scene header	Permanent Marker.  
fill.forward.current.label	string	“You learned:”	≤ ~32 chars	Current section title	Accent color.  
fill.forward.current.summary	string	—	≤ ~200 chars	Current summary	Center body copy.  
fill.forward.next.label	string	“Coming up:”	≤ ~32 chars	Next section title	Accent2 color.  
fill.forward.next.teaser	string	—	≤ ~200 chars	Next teaser	Right panel body.  
fill.forward.cta	string	“Let’s keep going!”	≤ ~60 chars	CTA ribbon	Permanent Marker.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.title	number	0.5	0.3–1.0	Title entrance	Sets timeline.  
beats.current	number	1.5	>title	Current panel	Controls frame draw.  
beats.celebrate	number	3.0	≥current	Checkmarks pulse	Time celebration hits.  
beats.moveToComplete	number	4.5	≥celebrate	Shrink animation	Moves panel to corner.  
beats.steppingStones	number	5.5	≥move	Stepping stones	Path draw.  
beats.nextReveal	number	7.0	≥stepping	Next panel draw	Glow + burst start.  
beats.cta	number	8.5	≥next	CTA arrow	Arrow sweep begins.  
beats.exit	number	10.5	≥cta	Scene end	Duration derives here (+0.5s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FFF9F0	any	Background	Warm neutral.  
style_tokens.colors.accent	color	#27AE60	any	Current + checks	Symbolises completion.  
style_tokens.colors.accent2	color	#9B59B6	any	Next panel + CTA arrow	Sets future tone.  
style_tokens.colors.accent3	color	#FF6B35	any	Stepping stones	Momentum hue.  
style_tokens.colors.ink	color	#1A1A1A	any	Body text.  
style_tokens.fonts.primary	font	Permanent Marker	any	Headers/CTA.  
style_tokens.fonts.secondary	font	Inter	any	Body copy.  
style_tokens.fonts.size_title	number	48	40–58	Header size.  
style_tokens.fonts.size_section	number	38	30–46	Section titles.  
style_tokens.fonts.size_body	number	24	20–30	Summaries.  
style_tokens.fonts.size_cta	number	44	34–52	CTA line.  

**Effects & Motion Controls**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
current.shrink.scale	number	0.7	0.6–0.8	Completed badge size	Applied at moveToComplete.  
steppingStones.count	number	3	2–4	Stone nodes	Positions hard-coded; adjust via code for more.  
energyBurst.sparks	number	6	4–8	Next reveal burst	RoughJS circles.  
cta.arrowLength	px	180	140–220	Forward arrow sweep	Controls CTA underline.  
cameraDrift.amplitude	number	2px	0–4px	Parallax drift	Affects whole scene.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook / Whiteboard supported; rely on global token swap.    
	•	**Typography:** Permanent Marker for titles, Inter for body; CTA inherits primary font.    
	•	**Colors:** accent = achieved, accent2 = upcoming, accent3 = path energy.    
	•	**Textures:** RoughJS frames, curved connectors, energy spark circles; subtle camera drift.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: frame_draw, checkmark_draw, stepping_stones, energy_burst, forward_arrow.**  
**Defaults:**  
	•	Achievement checks stagger at 0.3s intervals after `beats.celebrate`.  
	•	Stepping stones scale up with curve interpolation, dotted path draws between nodes.  
	•	Next panel bursts spawn 6 sparks with fade-out over 25f.  
	•	CTA arrow sweeps from left to right with easing once `beats.cta` fires.  

## **Rules: keep sparks ≤ 8 to avoid clutter, ensure shrink animation completes before stones begin, arrow head must land inside safe margins.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Current + next summaries best ≤ 200 chars for readability.  
	•	Stepping stones count fixed at 3 in code; more requires layout adjustments.    
	•	CTA line assumes positive, action-oriented phrasing; tone shift may require color changes.    
	•	No alternate layout for vertical video yet.    
	•	Scene assumes a “next step” exists; omit template if journey ends here.    

⸻
##  
**7) QA Checklist**  
	•	Current frame pulses then shrinks cleanly (no jitter, scale hits target).    
	•	Checkmarks appear at all three positions before moveToComplete finishes.    
	•	Stepping stones draw without intersecting frames; path easing feels smooth.    
	•	Next panel burst opacity falls to 0 before CTA arrow begins.    
	•	CTA arrow + copy remain centered and within safe bounds.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Reflect4DForwardLink  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, pulseEmphasis, shrinkToCorner  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true }  
	•	**Duration calc:** beats.exit + 0.5s pad  
	•	**Poster frame:** beats.nextReveal  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:reflect, pattern:forward-link, journey:progression, complexity:high, supports:[16:9], uses:[svg,roughjs], effects:[checkmark_draw,stepping_stones,energy_burst]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 3 (panels + path positions fixed; copy/tones adjustable).**  
**Extension points:**  
	•	Expose stepping-stone coordinates + count for alternate journey shapes.    
	•	Allow optional progress metrics (percent complete) near completed badge.    
	•	Surface CTA button variant with click target metadata.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Reflect4DForwardLink",
  "fill": {
    "forward": {
      "title": "Your Learning Journey",
      "current": {
        "label": "You mastered:",
        "summary": "How to unblock projects with async rituals and clear owners."
      },
      "next": {
        "label": "Next up:",
        "teaser": "Scaling the same practices across teams without losing momentum."
      },
      "cta": "Grab the next playbook →"
    }
  },
  "beats": {
    "current": 1.4,
    "celebrate": 2.8,
    "moveToComplete": 4.2,
    "steppingStones": 5.4,
    "nextReveal": 6.8,
    "cta": 8.2,
    "exit": 10.6
  }
}

```


⸻
