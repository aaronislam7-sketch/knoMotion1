/**
 * MidScenePreview - Visual previews for mid-scene types
 * 
 * Shows a visual representation of what each mid-scene type looks like.
 * These are stylized previews, not actual rendered content.
 */
import React from 'react';

const PreviewContainer = ({ children, className = '' }) => (
  <div className={`bg-gray-700/50 rounded-lg p-3 aspect-video flex items-center justify-center overflow-hidden ${className}`}>
    {children}
  </div>
);

// Text Reveal Preview
const TextRevealPreview = () => (
  <PreviewContainer>
    <div className="space-y-1 text-center w-full px-2">
      <div className="h-3 bg-orange-400 rounded w-4/5 mx-auto opacity-90" />
      <div className="h-2.5 bg-gray-400 rounded w-3/5 mx-auto opacity-70" />
      <div className="h-2.5 bg-gray-500 rounded w-2/5 mx-auto opacity-50" />
    </div>
  </PreviewContainer>
);

// Hero Text Preview
const HeroTextPreview = () => (
  <PreviewContainer>
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 bg-blue-400 rounded-full animate-pulse" />
      <div className="h-2 bg-gray-400 rounded w-16 opacity-70" />
    </div>
  </PreviewContainer>
);

// Grid Cards Preview
const GridCardsPreview = () => (
  <PreviewContainer>
    <div className="grid grid-cols-2 gap-1.5 w-full px-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-gray-600 rounded p-1.5 flex flex-col items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full mb-1" />
          <div className="h-1.5 bg-gray-500 rounded w-3/4" />
        </div>
      ))}
    </div>
  </PreviewContainer>
);

// Checklist Preview
const ChecklistPreview = () => (
  <PreviewContainer>
    <div className="space-y-1.5 w-full px-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${i === 1 ? 'bg-green-400' : 'bg-gray-500'}`}>
            {i === 1 && <span className="text-[8px] text-white flex items-center justify-center">✓</span>}
          </div>
          <div className="h-2 bg-gray-500 rounded flex-1" style={{ opacity: 1 - (i * 0.2) }} />
        </div>
      ))}
    </div>
  </PreviewContainer>
);

// Bubble Callout Preview
const BubbleCalloutPreview = () => (
  <PreviewContainer>
    <div className="relative w-full h-full">
      <div className="absolute top-1 left-1 bg-blue-400 rounded-lg px-2 py-1 text-[8px] transform -rotate-3">
        💡
      </div>
      <div className="absolute top-3 right-2 bg-purple-400 rounded-lg px-2 py-1 text-[8px] transform rotate-2">
        ✨
      </div>
      <div className="absolute bottom-1 left-1/4 bg-green-400 rounded-lg px-2 py-1 text-[8px] transform rotate-1">
        🎯
      </div>
    </div>
  </PreviewContainer>
);

// Side by Side Preview
const SideBySidePreview = () => (
  <PreviewContainer>
    <div className="flex w-full h-full gap-1 px-1">
      <div className="flex-1 bg-red-400/30 rounded flex flex-col items-center justify-center">
        <span className="text-lg">😕</span>
        <div className="h-1.5 bg-gray-500 rounded w-3/4 mt-1" />
      </div>
      <div className="w-4 flex items-center justify-center">
        <div className="w-3 h-3 bg-orange-400 rounded-full text-[6px] flex items-center justify-center text-white font-bold">
          VS
        </div>
      </div>
      <div className="flex-1 bg-green-400/30 rounded flex flex-col items-center justify-center">
        <span className="text-lg">🎉</span>
        <div className="h-1.5 bg-gray-500 rounded w-3/4 mt-1" />
      </div>
    </div>
  </PreviewContainer>
);

// Side by Side Before/After Preview
const SideBySideBeforeAfterPreview = () => (
  <PreviewContainer>
    <div className="relative w-full h-full overflow-hidden rounded">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-400" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-800 border-r-2 border-orange-400" />
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 flex items-center justify-center">
        <div className="w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-[8px]">↔</span>
        </div>
      </div>
      <div className="absolute bottom-1 left-2 text-[8px] text-white bg-black/50 px-1 rounded">Before</div>
      <div className="absolute bottom-1 right-2 text-[8px] text-white bg-black/50 px-1 rounded">After</div>
    </div>
  </PreviewContainer>
);

// Icon Grid Preview
const IconGridPreview = () => (
  <PreviewContainer>
    <div className="grid grid-cols-4 gap-1">
      {['🎯', '🚀', '💡', '✨'].map((icon, i) => (
        <div key={i} className="text-lg">{icon}</div>
      ))}
    </div>
  </PreviewContainer>
);

// Card Sequence Preview
const CardSequencePreview = () => (
  <PreviewContainer>
    <div className="flex gap-1">
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          className="bg-gray-600 rounded p-1 w-8"
          style={{ transform: `translateY(${(i - 2) * 2}px)` }}
        >
          <div className="h-1.5 bg-orange-400 rounded w-full mb-1" />
          <div className="h-1 bg-gray-500 rounded w-3/4" />
        </div>
      ))}
    </div>
  </PreviewContainer>
);

// Big Number Preview
const BigNumberPreview = () => (
  <PreviewContainer>
    <div className="text-center">
      <div className="text-2xl font-bold text-orange-400">100</div>
      <div className="text-[8px] text-gray-400">percent</div>
    </div>
  </PreviewContainer>
);

// Animated Counter Preview
const AnimatedCounterPreview = () => (
  <PreviewContainer>
    <div className="text-center">
      <div className="text-xl font-bold text-blue-400">
        <span className="opacity-30">0</span>
        <span className="mx-0.5">→</span>
        <span>100</span>
      </div>
      <div className="text-[8px] text-gray-400">counting...</div>
    </div>
  </PreviewContainer>
);

// Map of mid-scene types to their preview components
const PREVIEW_COMPONENTS = {
  textReveal: TextRevealPreview,
  heroText: HeroTextPreview,
  gridCards: GridCardsPreview,
  checklist: ChecklistPreview,
  bubbleCallout: BubbleCalloutPreview,
  sideBySide: SideBySidePreview,
  iconGrid: IconGridPreview,
  cardSequence: CardSequencePreview,
  bigNumber: BigNumberPreview,
  animatedCounter: AnimatedCounterPreview,
};

export const MidScenePreview = ({ type, mode }) => {
  // Special case for sideBySide beforeAfter mode
  if (type === 'sideBySide' && mode === 'beforeAfter') {
    return <SideBySideBeforeAfterPreview />;
  }
  
  const PreviewComponent = PREVIEW_COMPONENTS[type];
  
  if (!PreviewComponent) {
    return (
      <PreviewContainer className="text-gray-500 text-xs">
        No preview
      </PreviewContainer>
    );
  }
  
  return <PreviewComponent />;
};

// Compact inline preview for slot list
export const MidScenePreviewCompact = ({ type, mode }) => {
  const iconMap = {
    textReveal: '📝',
    heroText: '🦸',
    gridCards: '🎴',
    checklist: '✓',
    bubbleCallout: '💬',
    sideBySide: mode === 'beforeAfter' ? '↔️' : '⚖️',
    iconGrid: '⬡',
    cardSequence: '🃏',
    bigNumber: '🔢',
    animatedCounter: '⏱️',
  };
  
  return (
    <span className="text-lg" title={type}>
      {iconMap[type] || '?'}
    </span>
  );
};

export default MidScenePreview;
