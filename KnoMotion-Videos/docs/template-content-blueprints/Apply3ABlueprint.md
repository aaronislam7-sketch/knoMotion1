##  
## **Template ID: Apply3AMicroQuiz**  
## **Pillar: Apply**  
## **Status: in-prod**  
## **Last Updated: 2025-10-30**  

⸻
##  
**1) Intent & Fit**  
##  
## **Purpose: Micro-quiz moment that tests recall with a timed countdown, emphasises the correct answer, and provides instant rationale.  **  
## **Best for: midway retention checks, lesson exits with an answer reveal, or playful knowledge pulses (≤4 options).  **  
## **Avoid if: you need branching logic, open-ended responses, or more than four answer choices.  **  

⸻
##  
**2) Visual & Motion Overview**  
##  
## **Layout: Bright gradient background → centered question → countdown badge (collision-safe) → vertical option stack → celebration burst + explanation footer.  **  
##  
**Signature moves:**  
	•	Question and options pop in with sparkles and spring easing.    
	•	Circular countdown animates with arc draw + large numeral.    
	•	Correct option glows, pulses, gains checkmark, and fires confetti.    
	•	Explanation fades up to close the loop.    
  
## **Duration envelope: 12–15s (beats.exit + 1.0s pad).  **  
##  
## **Named Beats (sec):**  
	•	question: 0.6  
	•	options: 1.8  
	•	countdown: 3.5  
	•	reveal: 8.5  
	•	celebration: 9.0  
	•	explanation: 9.5  
	•	exit: 12.0  

⸻
##  
**3) Dynamic Controls Map (what’s adjustable)**  
##  
**Quiz Content**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
fill.quiz.question	string	—	≤ ~120 chars	Headline	Centered, Permanent Marker.  
fill.quiz.options[]	array<string>	[]	2–4 entries	Answer list	Displayed A–D.  
fill.quiz.correctIndex	number	0	0–3	Correct answer index	Zero-based; ensure within options length.  
fill.quiz.explanation	string	—	≤ ~260 chars	Rationale	Optional but recommended.  
fill.quiz.countdownDuration	number	5.0	3–10	Timer seconds	Must align with beats.countdown window.  

**Timing (Beats in seconds)**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
beats.question	number	0.6	0.4–1.2	Question reveal	Sparkles fire here.  
beats.options	number	1.8	>question	Option cascade	Each option staggers +0.3s.  
beats.countdown	number	3.5	≥options	Timer start	CountdownDuration adds runtime.  
beats.reveal	number	8.5	>countdown	Correct highlight	Confetti + glow start.  
beats.celebration	number	9.0	≥reveal	Confetti burst	Also draws star lines.  
beats.explanation	number	9.5	≥reveal	Rationale	Hold until confetti clears.  
beats.exit	number	12.0	≥explanation	Scene end	Duration derives here (+1.0s).  

**Style Tokens**  

**Key**	**Type**	**Default**	**Range/Enum**	**Affects**	**Notes**  
style_tokens.colors.bg	color	#FAFBFC	any	Background	Light neutral.  
style_tokens.colors.accent	color	#27AE60	any	Correct state	Glow + confetti palette.  
style_tokens.colors.accent2	color	#FF6B35	any	Timer warning / sparkles	Warm highlight.  
style_tokens.colors.wrong	color	#E74C3C	any	Incorrect styling	Used for X marks.  
style_tokens.colors.ink	color	#1A1A1A	any	Text	Primary copy color.  
style_tokens.fonts.primary	font	Permanent Marker	any	Question + numerals	SVG text.  
style_tokens.fonts.secondary	font	Inter	any	Options + explanation	Readable body copy.  
style_tokens.fonts.size_question	number	52	42–64	Question size	Keep ≤2 lines.  
style_tokens.fonts.size_option	number	26	22–30	Options	Multi-line wrap ok.  
style_tokens.fonts.size_timer	number	64	50–80	Countdown numeral	Centers inside badge.  
style_tokens.fonts.size_explanation	number	24	20–30	Explanation	Wrap width 700px.  

**Effects & Behaviour**  

**Key**	**Type**	**Default**	**Range**	**Affects**	**Notes**  
confettiBurst.count	number	30	16–40	Celebration nodes	Seeded by correctIndex.  
sparkles.perOption	number	4	2–6	Option reveal	Each generated with offset.  
timer.arcStroke	number	4	3–6	Countdown arc thickness	Color flips on completion.  
correctGlow.intensity	number	12	6–16	Glow filter strength	High values bloom heavily.  
option.padding	px	24	20–32	Option padding	Changing requires layout check.  

⸻
##  
**4) Style & Modes**  
	•	**Modes:** Notebook / Whiteboard supported; countdown and sparkles recolor from tokens.    
	•	**Typography:** Permanent Marker for headline + timer, Inter for options/explanation.    
	•	**Colors:** accent for “correct”, accent2 for urgency, wrong for subtle X overlays.    
	•	**Textures:** Radial background gradient + rough.js bursts; no paper grain by default.    

⸻
##  
**5) Creative Effects (**✨** Magic)**  
##  
## **Allowed: sparkles, confetti_burst, glow, pulse_emphasis, countdown_arc.**  
**Defaults:**  
	•	Sparkles: 6 around question, 4 per option (50f lifespan).  
	•	Confetti: single burst at `beats.celebration`, tinted with accent palette.  
	•	Glow: correct option filter intensity 12, pulse amplitude 1.08.  
	•	Countdown arc: full sweep over `fill.quiz.countdownDuration` seconds.  

## **Rules: keep confetti ≤ 40 nodes for perf, ensure only correct option glows post reveal, timer must reach 0 before reveal beat.  **  

⸻
##  
**6) Constraints & Limits**  
	•	Options limited to four; extras ignored.    
	•	Correct index must reference an existing option or reveal animation breaks.    
	•	Question text above ~140 chars risks three-line stack; shorten or reduce font via tokens.    
	•	Countdown duration lower than 3s feels rushed; higher than 10s drags pacing.    
	•	Explanation optional; omit to shorten scene but keep `beats.exit` aligned.    

⸻
##  
**7) QA Checklist**  
	•	Countdown numerals decrement exactly once per second (check fps).    
	•	Timer arc hits full circle when countdown reaches 0.    
	•	Correct option border + checkmark appear simultaneously at `beats.reveal`.    
	•	Confetti and glow stop before exit overlay fades.    
	•	Sparkles do not persist beyond 60f after each reveal.    

⸻
##  
**8) Implementation Bindings**  
	•	TEMPLATE_ID: Apply3AMicroQuiz  
	•	TEMPLATE_VERSION: 5.0.0  
	•	**Required presets:** fadeUpIn, popInSpring, pulseEmphasis  
	•	**Capabilities:** { usesSVG: true, usesRoughJS: true, usesLottie: false, requiresAudio: false, supportsTransitions: true, hasInteractiveElements: true }  
	•	**Duration calc:** beats.exit + 1.0s pad  
	•	**Poster frame:** beats.countdown + ~1.0s (all options visible with timer)  

⸻
##  
**9) Coverage Tags**  
##  
```
tags: [pillar:apply, pattern:micro-quiz, interaction:single-choice, complexity:medium, supports:[16:9], uses:[svg,roughjs], effects:[sparkles,confetti,glow]]

```

⸻
##  
**10) Extension Points & Rigidity Index**  
##  
## **Rigidity (0–5): 4 (option stack + timer placement hard-coded; copy/timing flexible but layout fixed).**  
**Extension points:**  
	•	Expose option alignment presets (two-column, grid) for longer answers.    
	•	Allow alternate reveal types (tick + explanation overlay) via JSON flag.    
	•	Surface countdown badge position + size tokens for mobile variants.    

⸻
##  
**11) Minimal JSON (for authors)**  
  
```
{
  "template_id": "Apply3AMicroQuiz",
  "fill": {
    "quiz": {
      "question": "Which step locks in the learning?",
      "options": [
        "Skim the notes",
        "Re-teach it to someone",
        "Screenshot the slides",
        "Leave it for later"
      ],
      "correctIndex": 1,
      "explanation": "Explaining it forces retrieval and clarifies any fuzzy gaps.",
      "countdownDuration": 5
    }
  },
  "beats": {
    "question": 0.5,
    "options": 1.6,
    "countdown": 3.2,
    "reveal": 8.0,
    "explanation": 9.2,
    "exit": 12.4
  }
}

```


⸻
