/**
 * Remotion Entry Point
 * 
 * This file registers all compositions for rendering via Remotion CLI.
 * 
 * Usage:
 *   npx remotion studio src/remotion/index.ts    # Open Remotion Studio
 *   npx remotion render src/remotion/index.ts CompositionId out/video.mp4
 * 
 * Available compositions:
 *   - TikTokBrainLies (1080x1920, ~66s)
 *   - TikTokADHDOverpowered (1080x1920, ~69s)
 *   - TikTok80msDelay (1080x1920, ~57s)
 *   - Plus all Knodovia videos...
 */

import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
