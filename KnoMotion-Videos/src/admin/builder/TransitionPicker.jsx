/**
 * TransitionPicker - Scene Transition Selection
 * 
 * Displays available transition types with visual indicators
 * and direction options where applicable.
 */
import React from 'react';

// Transition type definitions
const TRANSITION_TYPES = [
  {
    type: 'fade',
    name: 'Fade',
    description: 'Simple opacity transition',
    icon: '◐',
    hasDirection: false,
  },
  {
    type: 'slide',
    name: 'Slide',
    description: 'Directional slide',
    icon: '→',
    hasDirection: true,
    directions: ['up', 'down', 'left', 'right'],
  },
  {
    type: 'page-turn',
    name: 'Page Turn',
    description: '3D page flip',
    icon: '📄',
    hasDirection: true,
    directions: ['left', 'right'],
  },
  {
    type: 'doodle-wipe',
    name: 'Doodle Wipe',
    description: 'Hand-drawn wipe effect',
    icon: '✏️',
    hasDirection: true,
    directions: ['left', 'right'],
  },
  {
    type: 'eraser',
    name: 'Eraser',
    description: 'Eraser sweep effect',
    icon: '🧹',
    hasDirection: false,
  },
];

// Direction icons
const DIRECTION_ICONS = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export const TransitionPicker = ({ transition, onChange }) => {
  const currentType = transition?.type || 'fade';
  const currentDirection = transition?.direction || 'up';

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
      <h3 className="text-lg font-semibold mb-4">Scene Transition</h3>
      
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
          <div className="relative h-20 overflow-hidden rounded-lg bg-gray-800">
            <TransitionPreview type={currentType} direction={currentDirection} />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Transition plays between scenes
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple animated preview of transition
const TransitionPreview = ({ type, direction }) => {
  const [animating, setAnimating] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getTransformStyle = () => {
    if (type === 'fade') {
      return { opacity: animating ? 1 : 0 };
    }
    
    if (type === 'slide') {
      const transforms = {
        up: animating ? 'translateY(0)' : 'translateY(-100%)',
        down: animating ? 'translateY(0)' : 'translateY(100%)',
        left: animating ? 'translateX(0)' : 'translateX(-100%)',
        right: animating ? 'translateX(0)' : 'translateX(100%)',
      };
      return { transform: transforms[direction], opacity: animating ? 1 : 0.3 };
    }
    
    if (type === 'page-turn') {
      return {
        transform: animating 
          ? 'perspective(500px) rotateY(0deg)' 
          : `perspective(500px) rotateY(${direction === 'right' ? -30 : 30}deg)`,
        transformOrigin: direction === 'right' ? 'right center' : 'left center',
        opacity: animating ? 1 : 0.5,
      };
    }
    
    if (type === 'doodle-wipe') {
      return {
        clipPath: animating 
          ? 'inset(0 0 0 0)' 
          : direction === 'right' ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
      };
    }
    
    if (type === 'eraser') {
      return {
        clipPath: animating ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
      };
    }
    
    return { opacity: animating ? 1 : 0 };
  };

  return (
    <div 
      className="absolute inset-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center transition-all duration-1000"
      style={getTransformStyle()}
    >
      <span className="text-white font-bold">Scene</span>
    </div>
  );
};

export default TransitionPicker;
