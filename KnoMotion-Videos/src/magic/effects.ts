import { interpolate, Easing } from 'remotion';

export const ez = {
  linear: (t: number) => t,
  easeInOut: (t: number) => Easing.inOut(Easing.quad)(t),
};

export const paperGrainCSS = (opacity = 0.08) => ({
  backgroundImage: `radial-gradient(circle at 30% 40%, rgba(0,0,0,${opacity}) 0.25px, transparent 0.25px), radial-gradient(circle at 70% 60%, rgba(0,0,0,${opacity}) 0.25px, transparent 0.25px)`,
  backgroundSize: '3px 3px, 3px 3px',
  mixBlendMode: 'multiply' as const,
});

export const vignetteCSS = (strength = 0.25) => ({
  backgroundImage: `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,${strength}) 100%)`,
});

export const breatheScale = (
  frame: number,
  fps: number,
  range: [number, number] = [0.99, 1.01]
): number => {
  const t = (frame % Math.round(3 * fps)) / (3 * fps); // 3s loop
  const p = (1 - Math.cos(2 * Math.PI * t)) / 2; // cosine ease-in-out
  return interpolate(p, [0, 1], [range[0], range[1]]);
};

export const parallaxOffset = (
  frame: number,
  amp = 6
): { x: number; y: number } => {
  const x = Math.sin(frame * 0.01) * amp;
  const y = Math.cos(frame * 0.009) * amp * 0.6;
  return { x, y };
};
