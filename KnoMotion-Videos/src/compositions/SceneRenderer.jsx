import React from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
} from 'remotion';
import { resolveSceneSlots, detectFormat, isMobileFormat } from '../sdk/scene-layout/sceneLayout';
import { KNODE_THEME } from '../sdk/theme/knodeTheme';
import { resolveBackground } from '../sdk/effects/resolveBackground';

// Mid-scene imports
import { TextRevealSequence } from '../sdk/mid-scenes/TextRevealSequence';
import { IconGrid } from '../sdk/mid-scenes/IconGrid';
import { ChecklistReveal } from '../sdk/mid-scenes/ChecklistReveal';
import { BubbleCalloutSequence } from '../sdk/mid-scenes/BubbleCalloutSequence';
import { SideBySideCompare } from '../sdk/mid-scenes/SideBySideCompare';
import { GridCardReveal } from '../sdk/mid-scenes/GridCardReveal';
import { CardSequence } from '../sdk/mid-scenes/CardSequence';
import { HeroTextEntranceExit } from '../sdk/mid-scenes/HeroTextEntranceExit';
import { BigNumberReveal } from '../sdk/mid-scenes/BigNumberReveal';
import { AnimatedCounter } from '../sdk/mid-scenes/AnimatedCounter';

const MID_SCENE_COMPONENTS = {
  textReveal: TextRevealSequence,
  iconGrid: IconGrid,
  checklist: ChecklistReveal,
  bubbleCallout: BubbleCalloutSequence,
  sideBySide: SideBySideCompare,
  gridCards: GridCardReveal,
  cardSequence: CardSequence,
  heroText: HeroTextEntranceExit,
  bigNumber: BigNumberReveal,
  animatedCounter: AnimatedCounter,
};

/**
 * Renders a single midScene component within a slot
 * 
 * Now format-aware: passes viewport format to mid-scenes for adaptive rendering.
 */
const MidSceneRenderer = ({ slot, slotName, midSceneConfig, index = 0, format = 'desktop', viewport }) => {
  const { midScene, config, stylePreset } = midSceneConfig;
  const Component = MID_SCENE_COMPONENTS[midScene];

  if (!Component) {
    console.warn(`Unknown midScene "${midScene}" in slot "${slotName}"${index > 0 ? ` (item ${index})` : ''}`);
    return null;
  }

  const enhancedConfig = {
    ...config,
    position: {
      left: 0,
      top: 0,
      width: slot.width,
      height: slot.height,
    },
    // Pass format information to mid-scenes
    _format: format,
    _viewport: viewport,
  };

  const isHeader = slotName === 'header';
  const isMobile = format === 'mobile';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: isHeader ? 'flex-end' : 'center',
        justifyContent: 'center',
        paddingBottom: isHeader ? (isMobile ? 8 : 10) : 0,
        boxSizing: 'border-box',
      }}
    >
      <Component config={enhancedConfig} stylePreset={stylePreset} />
    </div>
  );
};

/**
 * SlotRenderer - Renders midScene(s) within a layout slot
 * 
 * Supports both single midScene config (object) and multiple midScenes (array).
 * When an array is provided, each midScene is rendered in the same slot,
 * layered on top of each other. Use beats to control timing/visibility.
 * 
 * Now format-aware: passes format context to all mid-scenes.
 * 
 * @example Single midScene (existing format):
 * slots: {
 *   row1: {
 *     midScene: 'textReveal',
 *     stylePreset: 'focus',
 *     config: { ... }
 *   }
 * }
 * 
 * @example Multiple midScenes (new array format):
 * slots: {
 *   row1: [
 *     { midScene: 'textReveal', config: { beats: { start: 0, exit: 3 } } },
 *     { midScene: 'heroText', config: { beats: { start: 3, exit: 6 } } },
 *     { midScene: 'gridCards', config: { beats: { start: 6, exit: 10 } } }
 *   ]
 * }
 */
const SlotRenderer = ({ slot, slotName, midSceneConfig, format, viewport }) => {
  if (!slot || !midSceneConfig) return null;

  // Support both single object and array of midScenes
  const midSceneConfigs = Array.isArray(midSceneConfig) ? midSceneConfig : [midSceneConfig];

  return (
    <div
      style={{
        position: 'absolute',
        left: slot.left,
        top: slot.top,
        width: slot.width,
        height: slot.height,
        overflow: 'visible',
      }}
    >
      {midSceneConfigs.map((config, index) => (
        <MidSceneRenderer
          key={`${slotName}-midscene-${index}`}
          slot={slot}
          slotName={slotName}
          midSceneConfig={config}
          index={index}
          format={format}
          viewport={viewport}
        />
      ))}
    </div>
  );
};

/**
 * SceneFromConfig - Renders a complete scene from JSON configuration
 * 
 * Now format-aware: automatically detects desktop/mobile from viewport
 * and adjusts layouts accordingly. Layouts like columnSplit automatically
 * convert to rowStack on mobile viewports.
 * 
 * @param {Object} config - Scene configuration
 * @param {Object} config.layout - Layout type and options
 * @param {Object} config.slots - Slot configurations with mid-scenes
 * @param {Object} [config.background] - Background preset
 * @param {string} [config.format] - Explicit format override ('desktop' | 'mobile')
 */
export const SceneFromConfig = ({ config }) => {
  const { width, height } = useVideoConfig();
  const viewport = { width, height };

  // Detect format from viewport or use explicit config
  const format = config.format || detectFormat(viewport);
  const isMobile = format === 'mobile';

  // Resolve slots with format-aware adjustments
  const slots = resolveSceneSlots(config.layout, viewport);
  const configuredSlots = Object.keys(config.slots).filter(
    (slotName) => slots[slotName],
  );

  const background = config.background
    ? resolveBackground(config.background)
    : null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: KNODE_THEME.colors.pageBg,
        ...(background?.style || {}),
      }}
    >
      {background?.overlay}
      {configuredSlots.map((slotName) => (
        <SlotRenderer
          key={slotName}
          slot={slots[slotName]}
          slotName={slotName}
          midSceneConfig={config.slots[slotName]}
          format={format}
          viewport={viewport}
        />
      ))}
    </AbsoluteFill>
  );
};

