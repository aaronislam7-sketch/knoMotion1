import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { HookTemplate } from '../templates/HookTemplate';
import { ExplainTemplate } from '../templates/ExplainTemplate';
import { ApplyTemplate } from '../templates/ApplyTemplate';
import { ReflectTemplate } from '../templates/ReflectTemplate';
import { SceneTransition } from './SceneTransition';

/**
 * Multi-Scene Video Composition
 * 
 * Combines multiple scenes (Hook, Explain, Apply, Reflect) into one cohesive video
 * with smooth transitions between scenes
 * 
 * @param {object} props
 * @param {object} props.scenes - Object containing scene data for each pillar
 * @param {number} props.transitionDuration - Frames for transition (default: 20)
 */
export const MultiSceneVideo = ({ scenes, transitionDuration = 20 }) => {
  const { fps } = useVideoConfig();

  // Debug log
  console.log('MultiSceneVideo rendering with scenes:', scenes);

  // Template mapping
  const templateMap = {
    'hook': HookTemplate,
    'explain': ExplainTemplate,
    'apply': ApplyTemplate,
    'reflect': ReflectTemplate
  };

  // Get scenes in order
  const sceneOrder = ['hook', 'explain', 'apply', 'reflect'];
  const orderedScenes = sceneOrder
    .map(pillar => scenes[pillar])
    .filter(Boolean); // Remove any missing scenes

  console.log('Ordered scenes:', orderedScenes.length, 'scenes');

  // Calculate timing for each scene
  let currentFrame = 0;
  const sceneTimings = orderedScenes.map((scene, index) => {
    const sceneDuration = scene.duration_s * fps;
    const start = currentFrame;
    
    // Account for transition overlap (transition starts before scene ends)
    const transitionStart = index < orderedScenes.length - 1 
      ? start + sceneDuration - transitionDuration 
      : null;
    
    currentFrame += sceneDuration - (index < orderedScenes.length - 1 ? transitionDuration : 0);
    
    return {
      scene,
      start,
      duration: sceneDuration,
      transitionStart,
      pillar: scene.pillar
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#fafafa' }}>
      {sceneTimings.map((timing, index) => {
        const Component = templateMap[timing.pillar] || HookTemplate;
        
        return (
          <React.Fragment key={`scene-${timing.pillar}-${index}`}>
            {/* Scene */}
            <Sequence
              from={timing.start}
              durationInFrames={timing.duration}
            >
              <Component scene={timing.scene} />
            </Sequence>

            {/* Transition to next scene */}
            {timing.transitionStart !== null && (
              <Sequence
                from={timing.transitionStart}
                durationInFrames={transitionDuration}
              >
                <SceneTransition 
                  durationInFrames={transitionDuration}
                  type="erase"
                  color={orderedScenes[index + 1]?.style_tokens?.colors?.bg || '#fafafa'}
                />
              </Sequence>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export default MultiSceneVideo;
