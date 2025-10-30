##  
## **Template ID: Apply3BScenarioChoice**  
## **Pillar: Apply**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Scenario-based decision moment that frames a situation, offers 2–3 possible responses, then highlights the recommended path and why it works.  **  
## **Best for: practical application stories, scenario drills, decision-making skills with explicit “correct” guidance.  **  
## **Avoid if: you need branching follow-ups, equal-weight options (no winner), or more than 3 choices.  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Warm background → title → scenario panel (visual + description) → prompt question → choice tiles (2 or 3) → reveal celebration → explanation wrap.  **  
##  
**Signature moves:**  
	•	Scenario frame draws on with hachure fill; optional Lottie/Image sits atop copy.    
	•	Choices fade up in row (positions adapt for 2 or 3 entries).    
	•	At reveal the correct choice gains bold stroke, checkmark, and particle burst while others fade.    
	•	Explanation slides up anchored to bottom, tying decision back to lesson.    
  
## **Duration envelope: 22–35s (beats.exit + 0.5s pad; scales with choice count).  **  
##  
## **Named Beats (sec):**  
	•	title: 0.5  
	•	scenario: 1.5  
	•	question: 3.5  
	•	choices: 5.0  
	•	reveal: 6.0 + choices×0.5  
	•	explanation: 7.5 + choices×0.5  
	•	settle: 9.0 + choices×0.5  
	•	exit: 9.5 + choices×0.5  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Scenario Data**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.scenario.title	string	“Real-World Application”	≤ ~40 chars	Scene title	Permanent Marker.  
fill.scenario.scenario	string	—	≤ ~220 chars	Context description	Centered block.  
fill.scenario.lottie	url|null	—	Lottie JSON	Optional; loops at 120px tall.  
fill.scenario.image	url|null	—	Static image	Used if lottie absent.  
fill.scenario.question	string	“How would you apply what you learned?”	≤ ~110 chars	Prompt headline	Permanent Marker.  
fill.scenario.choices[]	array<string>	[]	2–3 entries	Choice tiles	Displayed left→right.  
fill.scenario.correctIndex	number	0	0–2	Winning choice	Zero-based.  
fill.scenario.explanation	string	—	≤ ~260 chars	Wrap-up	Appears post reveal.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.title	number	0.5	0.3–1.0	Title entrance	Ease-out pop.  
beats.scenario	number	1.5	>title	Scenario frame	Controls draw-on start.  
beats.question	number	3.5	>scenario	Prompt reveal	Sync with camera drift.  
beats.choices	number	5.0	≥question	Choice entrance	Each tile offsets by 8f.  
beats.reveal	number	6.0 + choices×0.5	≥choices	Correct emphasis	Set later to extend deliberation.  
beats.explanation	number	7.5 + choices×0.5	≥reveal	Rationale onset	Keep ≥0.5s after reveal.  
beats.exit	number	9.5 + choices×0.5	≥explanation	Scene end	Duration derives here (+0.5s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FFF9F0	any	Background	Warm parchment.  
style_tokens.colors.accent	color	#27AE60	any	Correct highlight	Frame + check marks.  
style_tokens.colors.accent2	color	#2E7FE4	any	Scenario frame	Used for header/boxes.  
style_tokens.colors.accent3	color	#FF6B35	any	Prompt + neutral choices	Pre-reveal styling.  
style_tokens.colors.wrong	color	#E74C3C	any	Incorrect marks	Subtle X overlay.  
style_tokens.colors.ink	color	#1A1A1A	any	Body text.  
style_tokens.fonts.primary	font	Permanent Marker	any	Title/question labels.  
style_tokens.fonts.secondary	font	Inter	any	Scenario + choices + explanation.  
style_tokens.fonts.size_title	number	48	38–60	Title size.  
style_tokens.fonts.size_question	number	38	32–48	Prompt size.  
style_tokens.fonts.size_choice	number	24	20–28	Choice copy.  
style_tokens.fonts.size_explanation	number	26	20–32	Wrap-up body.  

**Layout & Motion Controls**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
choiceLayout.mode	string	auto	2 | 3 choices	Choice positions	Auto: 2-col / 3-col.  
cameraDrift.amount	number	2px	0–4px	Global drift amplitude	Minor parallax.  
reveal.fadeOutIncorrect	number	0.3	0.2–0.5	Opacity floor for losing choices	Interpolated.  
celebration.burstRadius	number	140	100–180	Spark halo distance	RoughJS circles.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook / Whiteboard supported; backgrounds swap via tokens.    
	•	**Typography:** Permanent Marker for headings, Inter for narrative text.    
	•	**Colors:** accent = success, accent3 = neutral/pre-reveal, accent2 = scenario frame.    
	•	**Textures:** RoughJS frames, hachure fills, optional Lottie embed for scenario.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: rough_frames, celebration_burst, checkmark_draw, x_mark_draw, camera_drift.**  
**Defaults:**  
	•	Scenario frame draw-on ~35f with hachure fill.  
	•	Choices gain check/X marks 15f after reveal start.  
	•	Celebration burst rings animate around correct tile (8 sparks).  
	•	Incorrect tiles fade to 30% opacity while correct pulses.  

## **Rules: limit burst to one event, keep drift ≤ 4px to avoid motion sickness, ensure check/X animations complete before explanation enters.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Choices array trimmed to first three entries; ensure correctIndex matches trimmed list.  
	•	Scenario copy > ~240 chars risks overflow; tighten or reduce font via tokens.    
	•	Lottie asset should be lightweight (<1MB); fallback image should use transparent background if possible.    
	•	Explanation optional but blank JSON still reserves beat; remove to tighten timeline.    
	•	Template assumes landscape 16:9; mobile variant would require reposition logic.    

⸻
##  
**7) QA Checklist**  
	•	Scenario frame renders with zero wobble and completes before question beat.    
	•	Choice layout matches array length (2-wide vs 3-wide).    
	•	Correct tile stroke width increases and checkmark draws fully at reveal.    
	•	Incorrect tiles fade down but remain legible (opacity ≥ 0.3).    
	•	Explanation stays within 1000px width, no collision with bottom padding.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Apply3BScenarioChoice  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, popInSpring, pulseEmphasis  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: true, requiresAudio: false, supportsTransitions: true }  
	•	**Duration calc:** beats.exit + 0.5s pad (depends on choice count)  
	•	**Poster frame:** beats.reveal  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:apply, pattern:scenario-choice, interaction:multi-option, complexity:high, supports:[16:9], uses:[svg,roughjs,lottie], effects:[celebration_burst,checkmark_draw]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 4 (tiles + scenario framing hard-coded; reveals flexible but layout fixed).**  
**Extension points:**  
	•	Expose per-choice positions/widths to support stacked mobile configurations.    
	•	Add optional “why others fall short” subcopy slots below incorrect tiles.    
	•	Allow CTA button variant after explanation (leveraging existing footer space).    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Apply3BScenarioChoice",
  "fill": {
    "scenario": {
      "title": "Real-World Application",
      "scenario": "A customer writes in about a failed deployment five minutes before launch.",
      "question": "Which action keeps the rollout on track?",
      "choices": [
        "Ignore and ship to avoid delays",
        "Pause launch, run quick diagnostics, loop in support",
        "Forward the email and hope someone else handles it"
      ],
      "correctIndex": 1,
      "explanation": "Taking a short pause to diagnose prevents wider failure and shows customers you care."
    }
  },
  "beats": {
    "scenario": 1.4,
    "question": 3.2,
    "choices": 4.8,
    "reveal": 6.8,
    "explanation": 8.2,
    "exit": 10.4
  }
}

```


⸻
