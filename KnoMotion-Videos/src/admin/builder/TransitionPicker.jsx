/**
 * TransitionPicker - Scene Transition Selection
 * 
 * Displays available transition types (powered by @remotion/transitions)
 * with visual previews and direction options where applicable.
 */
import React from 'react';

const TRANSITION_TYPES = [
  {
    type: 'fade',
    name: 'Fade',
    description: 'Opacity crossfade',
    icon: '◐',
    hasDirection: false,
  },
  {
    type: 'slide',
    name: 'Slide',
    description: 'Push in/out with spring physics',
    icon: '→',
    hasDirection: true,
    directions: ['up', 'down', 'left', 'right'],
  },
  {
    type: 'page-turn',
    name: 'Page Turn',
    description: '3D flip with perspective',
    icon: '📄',
    hasDirection: true,
    directions: ['left', 'right'],
  },
  {
    type: 'clock-wipe',
    name: 'Clock Wipe',
    description: 'Circular reveal like a clock hand',
    icon: '🕐',
    hasDirection: false,
  },
  {
    type: 'iris',
    name: 'Iris',
    description: 'Circular mask expanding from center',
    icon: '⊙',
    hasDirection: false,
  },
];

const DIRECTION_ICONS = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export const TransitionPicker = ({ transition, onChange }) => {
  const currentType = transition?.type || 'fade';
  const currentDirection = transition?.direction || 'right';

  const handleTypeChange = (type) => {
    const typeDef = TRANSITION_TYPES.find(t => t.type === type);
    onChange({
      type,
      ...(typeDef?.hasDirection ? { direction: typeDef.directions[0] } : {})
    });
  };

  const handleDirectionChange = (direction) => {
    onChange({
      ...transition,
      direction
    });
  };

  const currentTypeDef = TRANSITION_TYPES.find(t => t.type === currentType);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Scene Transition</h3>
        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
          @remotion/transitions
        </span>
      </div>
      
      {/* Transition Type Grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {TRANSITION_TYPES.map(t => (
          <button
            key={t.type}
            onClick={() => handleTypeChange(t.type)}
            className={`p-4 rounded-xl transition-all text-center ${
              currentType === t.type
                ? 'bg-orange-500/10 ring-2 ring-orange-500'
                : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <div className="text-3xl mb-2">{t.icon}</div>
            <div className="text-sm font-medium">{t.name}</div>
            <div className="text-xs text-gray-500 mt-1">{t.description}</div>
          </button>
        ))}
      </div>

      {/* Direction Options */}
      {currentTypeDef?.hasDirection && (
        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Direction</h4>
          <div className="flex gap-3">
            {currentTypeDef.directions.map(dir => (
              <button
                key={dir}
                onClick={() => handleDirectionChange(dir)}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  currentDirection === dir
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <span className="text-xl">{DIRECTION_ICONS[dir]}</span>
                <span className="capitalize">{dir}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview Animation */}
      <div className="border-t border-gray-700 pt-6 mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="relative h-24 overflow-hidden rounded-lg bg-gray-800">
            <TransitionPreview type={currentType} direction={currentDirection} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Spring-based transition between scenes
          </p>
        </div>
      </div>

      {/* Technical Info */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Timing</span>
            <span className="text-gray-400">springTiming (damping: 200, 20 frames)</span>
          </div>
          <div className="flex justify-between">
            <span>Remotion presentation</span>
            <span className="text-gray-400 font-mono">
              {currentType === 'fade' && 'fade()'}
              {currentType === 'slide' && `slide({ direction: 'from-${currentDirection}' })`}
              {currentType === 'page-turn' && `flip({ direction: 'from-${currentDirection}' })`}
              {currentType === 'clock-wipe' && 'clockWipe()'}
              {currentType === 'iris' && 'iris()'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransitionPreview = ({ type, direction }) => {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % 3);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const entering = phase === 1;
  const exiting = phase === 2;
  const idle = phase === 0;

  const getSceneAStyle = () => {
    if (type === 'fade') {
      return { opacity: exiting ? 0 : 1 };
    }
    if (type === 'slide') {
      const transforms = {
        up: 'translateY(-100%)',
        down: 'translateY(100%)',
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
      };
      return {
        transform: exiting ? transforms[direction] : 'translate(0)',
        opacity: exiting ? 0.3 : 1,
      };
    }
    if (type === 'page-turn') {
      return {
        transform: exiting
          ? `perspective(500px) rotateY(${direction === 'right' ? -90 : 90}deg)`
          : 'perspective(500px) rotateY(0deg)',
        transformOrigin: direction === 'right' ? 'right center' : 'left center',
        opacity: exiting ? 0 : 1,
      };
    }
    if (type === 'clock-wipe') {
      const deg = exiting ? 360 : 0;
      return {
        clipPath: exiting
          ? `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`
          : `polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)`,
        opacity: exiting ? 0 : 1,
      };
    }
    if (type === 'iris') {
      return {
        clipPath: exiting
          ? 'circle(0% at 50% 50%)'
          : 'circle(75% at 50% 50%)',
        opacity: exiting ? 0 : 1,
      };
    }
    return { opacity: exiting ? 0 : 1 };
  };

  const getSceneBStyle = () => {
    if (type === 'fade') {
      return { opacity: entering || idle ? 0 : 1 };
    }
    if (type === 'slide') {
      const transforms = {
        up: 'translateY(100%)',
        down: 'translateY(-100%)',
        left: 'translateX(100%)',
        right: 'translateX(-100%)',
      };
      return {
        transform: entering || idle ? transforms[direction] : 'translate(0)',
        opacity: entering || idle ? 0.3 : 1,
      };
    }
    if (type === 'page-turn') {
      return {
        transform: entering || idle
          ? `perspective(500px) rotateY(${direction === 'right' ? 90 : -90}deg)`
          : 'perspective(500px) rotateY(0deg)',
        transformOrigin: direction === 'right' ? 'left center' : 'right center',
        opacity: entering || idle ? 0 : 1,
      };
    }
    if (type === 'iris') {
      return {
        clipPath: entering || idle
          ? 'circle(0% at 50% 50%)'
          : 'circle(75% at 50% 50%)',
      };
    }
    if (type === 'clock-wipe') {
      return { opacity: entering || idle ? 0 : 1 };
    }
    return { opacity: entering || idle ? 0 : 1 };
  };

  return (
    <>
      <div
        className="absolute inset-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center transition-all duration-700 ease-out"
        style={getSceneAStyle()}
      >
        <span className="text-white font-bold text-sm">Scene A</span>
      </div>
      <div
        className="absolute inset-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center transition-all duration-700 ease-out"
        style={getSceneBStyle()}
      >
        <span className="text-white font-bold text-sm">Scene B</span>
      </div>
    </>
  );
};

export default TransitionPicker;
