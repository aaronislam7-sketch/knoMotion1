/**
 * Remotion Root Component
 * 
 * Registers all video compositions for rendering.
 */

import React from 'react';
import { Composition } from 'remotion';

// TikTok Viral Videos
import { TikTok_BrainLies, TIKTOK_BRAINLIES_DURATION } from '../compositions/TikTok_BrainLies';
import { TikTok_ADHDOverpowered, TIKTOK_ADHDOVERPOWERED_DURATION } from '../compositions/TikTok_ADHDOverpowered';
import { TikTok_80msDelay, TIKTOK_80MSDELAY_DURATION } from '../compositions/TikTok_80msDelay';

// Knodovia Desktop Videos
import { KnodoviaAccidentalArrival, KNODOVIA_VIDEO1_DURATION } from '../compositions/KnodoviaVideo1_AccidentalArrival';
import { KnodoviaCultureAnthro, KNODOVIA_VIDEO2_DURATION } from '../compositions/KnodoviaVideo2_Culture';
import { KnodoviaEconomics, KNODOVIA_VIDEO3_DURATION } from '../compositions/KnodoviaVideo3_Economics';

// Knodovia Mobile Videos
import { KnodoviaAccidentalArrivalMobile, KNODOVIA_VIDEO1_MOBILE_DURATION } from '../compositions/KnodoviaVideo1_Mobile';
import { KnodoviaCultureMobile, KNODOVIA_VIDEO2_MOBILE_DURATION } from '../compositions/KnodoviaVideo2_Mobile';
import { KnodoviaEconomicsMobile, KNODOVIA_VIDEO3_MOBILE_DURATION } from '../compositions/KnodoviaVideo3_Mobile';

const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* ================================================================= */}
      {/* TIKTOK VIRAL VIDEOS (1080x1920 Mobile) */}
      {/* ================================================================= */}
      <Composition
        id="TikTokBrainLies"
        component={TikTok_BrainLies}
        durationInFrames={TIKTOK_BRAINLIES_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="TikTokADHDOverpowered"
        component={TikTok_ADHDOverpowered}
        durationInFrames={TIKTOK_ADHDOVERPOWERED_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="TikTok80msDelay"
        component={TikTok_80msDelay}
        durationInFrames={TIKTOK_80MSDELAY_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />

      {/* ================================================================= */}
      {/* KNODOVIA DESKTOP VIDEOS (1920x1080) */}
      {/* ================================================================= */}
      <Composition
        id="KnodoviaAccidentalArrival"
        component={KnodoviaAccidentalArrival}
        durationInFrames={KNODOVIA_VIDEO1_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaCulture"
        component={KnodoviaCultureAnthro}
        durationInFrames={KNODOVIA_VIDEO2_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaEconomics"
        component={KnodoviaEconomics}
        durationInFrames={KNODOVIA_VIDEO3_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* ================================================================= */}
      {/* KNODOVIA MOBILE VIDEOS (1080x1920) */}
      {/* ================================================================= */}
      <Composition
        id="KnodoviaAccidentalArrivalMobile"
        component={KnodoviaAccidentalArrivalMobile}
        durationInFrames={KNODOVIA_VIDEO1_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaCultureMobile"
        component={KnodoviaCultureMobile}
        durationInFrames={KNODOVIA_VIDEO2_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="KnodoviaEconomicsMobile"
        component={KnodoviaEconomicsMobile}
        durationInFrames={KNODOVIA_VIDEO3_MOBILE_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
