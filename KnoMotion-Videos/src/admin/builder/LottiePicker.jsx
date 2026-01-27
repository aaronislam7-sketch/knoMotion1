/**
 * LottiePicker - Lottie Animation Browser
 * 
 * Displays all available Lottie animations from the registry
 * with animated previews and category filtering.
 * 
 * IMPORTANT: Uses the existing LOTTIE_REGISTRY from the SDK.
 */
import React, { useState, useMemo } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { LOTTIE_REGISTRY } from '../../sdk/lottie/registry';

// Extract categories from registry tags
const getCategories = () => {
  const categorySet = new Set();
  categorySet.add('all');
  
  Object.values(LOTTIE_REGISTRY).forEach(entry => {
    if (entry.tags) {
      entry.tags.forEach(tag => categorySet.add(tag));
    }
  });
  
  return Array.from(categorySet);
};

// Lottie preview component with lazy loading
const LottiePreview = ({ lottieKey, entry, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-3 rounded-xl transition-all text-left ${
        isSelected
          ? 'bg-orange-500/20 ring-2 ring-orange-500'
          : 'bg-gray-700/50 hover:bg-gray-700'
      }`}
    >
      {/* Lottie Preview */}
      <div className="w-full aspect-square bg-gray-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
        {hasError ? (
          <div className="text-gray-500 text-xs text-center p-2">
            Failed to load
          </div>
        ) : (
          <Player
            autoplay={isHovered || isSelected}
            loop={entry.loop !== false}
            src={entry.url}
            style={{ width: '80%', height: '80%' }}
            onEvent={(event) => {
              if (event === 'error') setHasError(true);
            }}
          />
        )}
      </div>
      
      {/* Info */}
      <div className="text-sm font-medium truncate" title={lottieKey}>
        {lottieKey}
      </div>
      {entry.description && (
        <div className="text-xs text-gray-500 truncate" title={entry.description}>
          {entry.description}
        </div>
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
};

export const LottiePicker = ({ value, onChange, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = useMemo(() => getCategories(), []);
  
  const filteredLotties = useMemo(() => {
    return Object.entries(LOTTIE_REGISTRY).filter(([key, entry]) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        entry.tags?.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelect = (lottieKey) => {
    onChange(lottieKey);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Select Lottie Animation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search animations..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:border-orange-500 focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {categories.slice(0, 12).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Lottie Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-4">
            {filteredLotties.map(([key, entry]) => (
              <LottiePreview
                key={key}
                lottieKey={key}
                entry={entry}
                isSelected={value === key}
                onClick={() => handleSelect(key)}
              />
            ))}
          </div>
          
          {filteredLotties.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No animations found matching your criteria
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredLotties.length} animations available
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {value && (
                <div className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg">
                  Selected: <span className="font-mono">{value}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for inline use
export const LottiePickerInline = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const entry = value ? LOTTIE_REGISTRY[value] : null;

  return (
    <div>
      <div 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
      >
        {entry ? (
          <>
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
              <Player
                autoplay
                loop={entry.loop !== false}
                src={entry.url}
                style={{ width: '90%', height: '90%' }}
              />
            </div>
            <div className="flex-1">
              <div className="font-medium">{value}</div>
              <div className="text-xs text-gray-500">{entry.description}</div>
            </div>
          </>
        ) : (
          <div className="flex-1 text-gray-500">
            Click to select a Lottie animation
          </div>
        )}
        <span className="text-gray-400">→</span>
      </div>
      
      {isOpen && (
        <LottiePicker
          value={value}
          onChange={onChange}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LottiePicker;
