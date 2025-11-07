import React from 'react';

/**
 * Progress18 Configuration Panel
 * 
 * Interactive UI for configuring Progress18Path template
 */

export const Progress18Config = ({ scene, onUpdate }) => {
  const handleChange = (path, value) => {
    const keys = path.split('.');
    const updated = { ...scene };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(updated);
  };
  
  const waypoints = scene.waypoints || [];
  const colors = scene.style_tokens?.colors || {};
  const fonts = scene.style_tokens?.fonts || {};
  
  const addWaypoint = () => {
    const newWaypoint = {
      label: 'New Milestone',
      description: 'Description',
      icon: '⭐',
      status: 'locked'
    };
    onUpdate({ ...scene, waypoints: [...waypoints, newWaypoint] });
  };
  
  const removeWaypoint = (index) => {
    const updated = waypoints.filter((_, i) => i !== index);
    onUpdate({ ...scene, waypoints: updated });
  };
  
  const updateWaypoint = (index, field, value) => {
    const updated = [...waypoints];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...scene, waypoints: updated });
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Title */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          📝 Title
        </h3>
        <input
          type="text"
          value={scene.title?.text || ''}
          onChange={(e) => handleChange('title.text', e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 14,
            border: '2px solid #E0E0E0',
            borderRadius: 6
          }}
          placeholder="Journey title"
        />
      </section>
      
      {/* Waypoints */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#2C3E50' }}>
            🎯 Waypoints ({waypoints.length})
          </h3>
          <button
            onClick={addWaypoint}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13
            }}
          >
            + Add
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {waypoints.map((waypoint, index) => (
            <div
              key={index}
              style={{
                padding: 12,
                backgroundColor: '#F8F9FA',
                borderRadius: 8,
                border: '2px solid #E0E0E0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: '#2C3E50' }}>Waypoint {index + 1}</strong>
                <button
                  onClick={() => removeWaypoint(index)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#E74C3C',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600
                  }}
                >
                  Remove
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  type="text"
                  value={waypoint.label}
                  onChange={(e) => updateWaypoint(index, 'label', e.target.value)}
                  placeholder="Label"
                  style={{
                    padding: 8,
                    fontSize: 13,
                    border: '1px solid #DDD',
                    borderRadius: 4
                  }}
                />
                <input
                  type="text"
                  value={waypoint.icon}
                  onChange={(e) => updateWaypoint(index, 'icon', e.target.value)}
                  placeholder="Icon"
                  style={{
                    padding: 8,
                    fontSize: 13,
                    border: '1px solid #DDD',
                    borderRadius: 4
                  }}
                />
              </div>
              
              <input
                type="text"
                value={waypoint.description}
                onChange={(e) => updateWaypoint(index, 'description', e.target.value)}
                placeholder="Description"
                style={{
                  width: '100%',
                  padding: 8,
                  fontSize: 13,
                  border: '1px solid #DDD',
                  borderRadius: 4,
                  marginTop: 8
                }}
              />
              
              <select
                value={waypoint.status}
                onChange={(e) => updateWaypoint(index, 'status', e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  fontSize: 13,
                  border: '1px solid #DDD',
                  borderRadius: 4,
                  marginTop: 8
                }}
              >
                <option value="completed">Completed</option>
                <option value="current">Current</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          ))}
        </div>
      </section>
      
      {/* Settings */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          ⚙️ Settings
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Direction
            </label>
            <select
              value={scene.direction || 'horizontal'}
              onChange={(e) => handleChange('direction', e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                fontSize: 14,
                border: '2px solid #E0E0E0',
                borderRadius: 6
              }}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={scene.showProgress !== false}
              onChange={(e) => handleChange('showProgress', e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <label style={{ fontSize: 14, fontWeight: 600, color: '#2C3E50' }}>
              Show Progress Indicator
            </label>
          </div>
        </div>
      </section>
      
      {/* Colors */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#2C3E50' }}>
          🎨 Colors
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Background
            </label>
            <input
              type="color"
              value={colors.bg || '#0F1419'}
              onChange={(e) => handleChange('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Title
            </label>
            <input
              type="color"
              value={colors.title || '#FFFFFF'}
              onChange={(e) => handleChange('style_tokens.colors.title', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Completed
            </label>
            <input
              type="color"
              value={colors.completed || '#4CAF50'}
              onChange={(e) => handleChange('style_tokens.colors.completed', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#5A6C7D', display: 'block', marginBottom: 4 }}>
              Current
            </label>
            <input
              type="color"
              value={colors.current || '#FFC107'}
              onChange={(e) => handleChange('style_tokens.colors.current', e.target.value)}
              style={{ width: '100%', height: 40, border: 'none', borderRadius: 6, cursor: 'pointer' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
