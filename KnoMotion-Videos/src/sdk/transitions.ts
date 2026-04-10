// Backward compatibility shim + TransitionSeries helpers (see ./transitions/index.ts)
export * from './core/transitions';
export {
  resolvePresentation,
  resolveTransitionTiming,
  calculateTransitionSeriesDuration,
} from './transitions/index';
export type { SceneTransition } from './transitions/index';
