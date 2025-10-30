##  
## **Template ID: Explain2BAnalogy**  
## **Pillar: Explain**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Side-by-side analogy that maps a familiar reference to a new concept, then collapses both into a shared takeaway and explanation.  **  
## **Best for: reframing abstract topics using concrete comparisons, onboarding metaphors, persuasive “X is like Y” framing.  **  
## **Avoid if: content relies on more than one comparison path, needs multimedia embeds, or requires fast pacing (scene breathes through a central reveal).  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Split gradient background → centered title → left/right analogy cards → shrink-to-corner move → central connection statement → explanation footer.  **  
##  
**Signature moves:**  
	•	Familiar and new concept cards fade up sequentially with rough-framed accents.    
	•	Both cards shrink and slide to top corners (shrinkToCorner preset) to make space.    
	•	Central connection headline lands with emphasis rings; explanation follows.    
  
## **Duration envelope: 12–15s (beats.exit + 1.0s pad).  **  
##  
## **Named Beats (sec):**  
	•	entrance/title: 0.8  
	•	familiar: 2.0  
	•	newConcept: 3.5  
	•	moveAway: 6.0  
	•	connection: 7.5  
	•	explanation: 9.0  
	•	exit: 12.0  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Analogy Copy**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.analogy.title	string	“Think of it like this...”	≤ ~48 chars	Scene title	Centered, Permanent Marker.  
fill.analogy.familiar.label	string	“Familiar”	≤ ~28 chars	Left card header	Accent color #1.  
fill.analogy.familiar.description	string	—	≤ ~220 chars	Left card body	Wraps inside 500px card.  
fill.analogy.newConcept.label	string	“New Concept”	≤ ~28 chars	Right card header	Accent color #2.  
fill.analogy.newConcept.description	string	—	≤ ~220 chars	Right card body	Mirror layout.  
fill.analogy.connection	string	“They work the same way!”	≤ ~80 chars	Central statement	Large question-style lettering.  
fill.analogy.explanation	string	—	≤ ~240 chars	Bottom explanation	Optional; omit for shorter outro.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.title	number	0.8	0.4–1.2	Title reveal	Shares default with entrance.  
beats.familiar	number	2.0	>title	Left card	Stagger sets stage.  
beats.newConcept	number	3.5	>familiar	Right card	Should trail left card by ≥0.6s.  
beats.moveAway	number	6.0	≥newConcept	Shrink moment	Controls start of corner move.  
beats.connection	number	7.5	>moveAway	Center headline	Ensure cards have shrunk before.  
beats.explanation	number	9.0	≥connection	Footer copy	Optional; skip to tighten runtime.  
beats.exit	number	12.0	≥explanation	Scene end	Duration derives here (+1.0s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FFF9F0	any	Background	Dual radial wash.  
style_tokens.colors.accent	color	#FF6B35	any	Left card + rings	Warm tone.  
style_tokens.colors.accent2	color	#2E7FE4	any	Right card + rings	Cool contrast.  
style_tokens.colors.ink	color	#1A1A1A	any	Text	High contrast copy.  
style_tokens.fonts.primary	font	Permanent Marker	any	Titles + headers	SVG rendering; keep bold.  
style_tokens.fonts.secondary	font	Inter	any	Body copy	Supports italics.  
style_tokens.fonts.size_title	number	52	40–64	Scene title	Adjust for length.  
style_tokens.fonts.size_label	number	36	28–42	Card headers	Stay under 2 lines.  
style_tokens.fonts.size_connection	number	56	42–68	Central statement	Impacts ring radius.  
style_tokens.fonts.size_explanation	number	28	22–34	Explanation	Wrap aware.  

**Motion / Layout Controls**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
shrinkToCorner.targetScale	number	0.35	0.28–0.42	Corner scale	Applied to both cards.  
shrinkToCorner.targetPos.left	px	{x:-500,y:-280}	±80px	Left corner position	Relative to card center.  
shrinkToCorner.targetPos.right	px	{x:500,y:-280}	±80px	Right corner position	Symmetric placements.  
decorativeRings.radius	px	180	120–220	Connection emphasis	Set via rough.js.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook & Whiteboard supported; background gradients adapt via tokens.    
	•	**Typography:** Permanent Marker for display text, Inter for paragraphs; sizes in tokens.    
	•	**Colors:** Accent and accent2 define card borders, spark rings, decorative arrows.    
	•	**Textures:** RoughJS frames + ring accents; no grain by default.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: rough_frames, dual_arrows, shrink_to_corner, emphasis_rings.**  
**Defaults:**  
	•	Center arrows draw on before shrink (30f).  
	•	Double ring pulses at connection beat (radius 180/220).  
	•	Shrink preset eases over 1.2s for both cards.  

## **Rules: keep ring opacity ≤ 0.6, avoid layering extra sparkles (template is intentionally clean), ensure shrink targets remain inside safe margins.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Card descriptions longer than ~220 chars harm readability; prefer concise analogies.  
	•	Template assumes exactly two cards; supporting more requires structural change.    
	•	Connection statement expects ≤ 2 lines; wrap manually with `\n` if needed.    
	•	Explanation optional but recommended; removing shortens scene by ~3s.    
	•	No image slots beyond textual content (consider 2A if visuals required).    

⸻
##  
**7) QA Checklist**  
	•	Both cards stay vertically aligned pre-shrink (check flex container gap).    
	•	Shrink animation completes before connection headline enters.    
	•	RoughJS arrows render with zero wobble; arrowheads scale with progress.    
	•	Emphasis rings stop animating before exit overlay fades.    
	•	Explanation stays centered within 900px width and avoids cropping.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Explain2BAnalogy  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, shrinkToCorner  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true, hasSideBySideLayout: true }  
	•	**Duration calc:** beats.exit + 1.0s pad  
	•	**Poster frame:** beats.connection + ~0.7s  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:explain, pattern:analogy-bridge, layout:split, complexity:medium, supports:[16:9], uses:[svg,roughjs], effects:[shrink_to_corner,emphasis_rings]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 3 (structure is fixed to dual cards + central takeaway; beats and copy flexible).**  
**Extension points:**  
	•	Expose shrink target positions/scales per card for asymmetrical layouts.    
	•	Allow optional imagery slots (static or Lottie) inside each card.    
	•	Parameterise emphasis rings (count, color per side) for tonal variation.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Explain2BAnalogy",
  "fill": {
    "analogy": {
      "title": "Think of APIs like Restaurants",
      "familiar": {
        "label": "Restaurant Menu",
        "description": "You browse options, place an order, and receive a meal without seeing the kitchen." 
      },
      "newConcept": {
        "label": "Public API",
        "description": "Clients call documented endpoints, get structured responses, and never touch internal code." 
      },
      "connection": "Both hide complexity while serving requests",
      "explanation": "APIs provide a consistent interface so teams can build faster without reinventing every system." 
    }
  },
  "beats": {
    "familiar": 1.8,
    "newConcept": 3.0,
    "moveAway": 5.8,
    "connection": 7.4,
    "explanation": 8.8,
    "exit": 11.8
  }
}

```


⸻
