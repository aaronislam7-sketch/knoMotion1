/**
 * SceneIdContext - Context-based ID Factory
 * 
 * Provides deterministic, namespaced IDs for SVG elements
 * to prevent collisions in multi-scene compositions.
 * 
 * Usage:
 * 
 * // Parent wraps scene with provider:
 * <SceneIdContext.Provider value="hook1a">
 *   <TemplateComponent scene={scene} />
 * </SceneIdContext.Provider>
 * 
 * // In template:
 * const id = useSceneId();
 * <clipPath id={id('highlighter-clip')}>...</clipPath>
 * // Output: s-hook1a-highlighter-clip
 */

import { createContext, useContext } from 'react';

export const SceneIdContext = createContext('default-scene');

/**
 * Hook to generate deterministic, namespaced IDs
 * 
 * @returns Function that takes a key and returns a namespaced ID
 * 
 * @example
 * const id = useSceneId();
 * const clipId = id('text-mask'); // Returns: s-hook1a-text-mask
 */
export const useSceneId = () => {
  const sceneId = useContext(SceneIdContext);
  
  return (key) => `s-${sceneId}-${key}`;
};

/**
 * Direct ID generator (for use outside React components)
 * 
 * @param sceneId - Scene identifier
 * @param key - Element key
 * @returns Namespaced ID
 */
export const generateSceneId = (sceneId, key) => {
  return `s-${sceneId}-${key}`;
};
