export const rhythm = (w = 1920) => ({

  title: Math.round(w * 0.028), // ~54 at 1920

  h2:    Math.round(w * 0.022),

  body:  Math.round(w * 0.016),

  small: Math.round(w * 0.014),

});



export const clampPx = (v: number, min: number, max: number) =>

  Math.max(min, Math.min(max, v));
