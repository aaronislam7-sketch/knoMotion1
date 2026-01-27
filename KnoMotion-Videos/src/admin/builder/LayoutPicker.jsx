/**
 * LayoutPicker - Visual Layout Selection
 * 
 * Displays visual diagrams of available layouts with their slot configurations.
 * Allows configuration of layout options (rows, columns, ratios, padding).
 */
import React from 'react';

// Layout type definitions with visual representations
const LAYOUT_TYPES = [
  {
    type: 'full',
    name: 'Full',
    description: 'Single content area',
    slots: ['header', 'full'],
    defaultOptions: { padding: 60 },
  },
  {
    type: 'rowStack',
    name: 'Row Stack',
    description: 'Horizontal rows (top to bottom)',
    slots: ['header', 'row1', 'row2', '...'],
    defaultOptions: { rows: 2, padding: 50 },
    configurable: ['rows'],
  },
  {
    type: 'columnSplit',
    name: 'Column Split',
    description: 'Vertical columns (left to right)',
    slots: ['header', 'col1', 'col2', '...'],
    defaultOptions: { columns: 2, padding: 60 },
    configurable: ['columns'],
  },
  {
    type: 'gridSlots',
    name: 'Grid',
    description: 'Grid layout (rows × columns)',
    slots: ['header', 'cellA', 'cellB', '...'],
    defaultOptions: { rows: 2, columns: 2, padding: 40 },
    configurable: ['rows', 'columns'],
  },
  {
    type: 'headerRowColumns',
    name: 'Header + Row + Cols',
    description: 'Header, row strip, columns below',
    slots: ['header', 'row', 'col1', 'col2'],
    defaultOptions: { columns: 2, rowHeightRatio: 0.35, padding: 50 },
    configurable: ['columns', 'rowHeightRatio'],
  },
];

// Visual layout diagram component
const LayoutDiagram = ({ type, options = {}, isSelected, isMobile }) => {
  const rows = options.rows || 2;
  const cols = options.columns || 2;
  const aspectRatio = isMobile ? '9/16' : '16/9';
  
  const baseClasses = `
    relative overflow-hidden rounded-lg border-2 transition-all
    ${isSelected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-600'}
  `;
  
  const slotClasses = 'bg-gray-600/50 border border-gray-500/50 rounded flex items-center justify-center text-[10px] text-gray-400';
  const headerClasses = 'bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center text-[10px] text-orange-400';
  
  return (
    <div className={baseClasses} style={{ aspectRatio, width: isMobile ? 60 : 100 }}>
      <div className="absolute inset-1 flex flex-col gap-0.5">
        {/* Header */}
        <div className={`${headerClasses} h-3 shrink-0`}>H</div>
        
        {/* Content area based on type */}
        <div className="flex-1 flex flex-col gap-0.5 min-h-0">
          {type === 'full' && (
            <div className={`${slotClasses} flex-1`}>full</div>
          )}
          
          {type === 'rowStack' && (
            <>
              {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
                <div key={i} className={`${slotClasses} flex-1`}>r{i + 1}</div>
              ))}
            </>
          )}
          
          {type === 'columnSplit' && (
            <div className="flex-1 flex gap-0.5">
              {Array.from({ length: Math.min(cols, 4) }).map((_, i) => (
                <div key={i} className={`${slotClasses} flex-1`}>c{i + 1}</div>
              ))}
            </div>
          )}
          
          {type === 'gridSlots' && (
            <div className="flex-1 flex flex-col gap-0.5">
              {Array.from({ length: Math.min(rows, 3) }).map((_, r) => (
                <div key={r} className="flex-1 flex gap-0.5">
                  {Array.from({ length: Math.min(cols, 3) }).map((_, c) => (
                    <div key={c} className={`${slotClasses} flex-1 text-[8px]`}>
                      {String.fromCharCode(65 + r * cols + c)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {type === 'headerRowColumns' && (
            <>
              <div className={`${slotClasses} h-1/3`}>row</div>
              <div className="flex-1 flex gap-0.5">
                {Array.from({ length: Math.min(cols, 4) }).map((_, i) => (
                  <div key={i} className={`${slotClasses} flex-1`}>c{i + 1}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const LayoutPicker = ({ layout, format, onChange }) => {
  const isMobile = format === 'mobile';
  const currentType = layout?.type || 'full';
  const currentOptions = layout?.options || {};

  const handleTypeChange = (newType) => {
    const layoutDef = LAYOUT_TYPES.find(l => l.type === newType);
    onChange({
      type: newType,
      options: { ...layoutDef.defaultOptions }
    });
  };

  const handleOptionChange = (key, value) => {
    onChange({
      ...layout,
      options: {
        ...currentOptions,
        [key]: value
      }
    });
  };

  const currentLayoutDef = LAYOUT_TYPES.find(l => l.type === currentType);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Layout</h3>
      
      {/* Layout Type Grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {LAYOUT_TYPES.map(layoutDef => (
          <button
            key={layoutDef.type}
            onClick={() => handleTypeChange(layoutDef.type)}
            className={`p-4 rounded-xl transition-all text-left ${
              currentType === layoutDef.type
                ? 'bg-orange-500/10 ring-2 ring-orange-500'
                : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <div className="flex justify-center mb-3">
              <LayoutDiagram 
                type={layoutDef.type} 
                options={currentType === layoutDef.type ? currentOptions : layoutDef.defaultOptions}
                isSelected={currentType === layoutDef.type}
                isMobile={isMobile}
              />
            </div>
            <div className="text-sm font-medium text-center">{layoutDef.name}</div>
            <div className="text-xs text-gray-500 text-center mt-1">{layoutDef.description}</div>
          </button>
        ))}
      </div>

      {/* Layout Options */}
      {currentLayoutDef?.configurable && (
        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-4">Layout Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentLayoutDef.configurable.includes('rows') && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={currentOptions.rows || 2}
                  onChange={(e) => handleOptionChange('rows', Math.max(1, Math.min(6, parseInt(e.target.value) || 2)))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}
            
            {currentLayoutDef.configurable.includes('columns') && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={currentOptions.columns || 2}
                  onChange={(e) => handleOptionChange('columns', Math.max(1, Math.min(6, parseInt(e.target.value) || 2)))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}

            {currentLayoutDef.configurable.includes('rowHeightRatio') && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Row Height Ratio</label>
                <input
                  type="number"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={currentOptions.rowHeightRatio || 0.35}
                  onChange={(e) => handleOptionChange('rowHeightRatio', parseFloat(e.target.value) || 0.35)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Padding (px)</label>
              <input
                type="number"
                min="0"
                max="200"
                value={currentOptions.padding || 50}
                onChange={(e) => handleOptionChange('padding', parseInt(e.target.value) || 50)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Title Height (px)</label>
              <input
                type="number"
                min="0"
                max="300"
                value={currentOptions.titleHeight || 100}
                onChange={(e) => handleOptionChange('titleHeight', parseInt(e.target.value) || 100)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Slots Preview */}
      <div className="border-t border-gray-700 pt-6 mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Available Slots</h4>
        <div className="flex flex-wrap gap-2">
          {currentLayoutDef?.slots?.map((slot, i) => (
            <span 
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-mono ${
                slot === 'header' 
                  ? 'bg-orange-500/20 text-orange-400' 
                  : slot === '...'
                    ? 'bg-gray-700 text-gray-500'
                    : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {slot}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Slots are named regions where mid-scenes are rendered. Configure slot content in the Slots tab.
        </p>
      </div>
    </div>
  );
};

export default LayoutPicker;
