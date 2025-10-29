import React, { useState } from 'react';

/**
 * DEBUG OVERLAY
 * 
 * Provides instant debugging info for scene feedback.
 * Click anywhere to copy scene context to clipboard.
 */

const DebugOverlay = ({ scene, templateId }) => {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState('');

  const fps = scene.fps || 30;
  const durationInFrames = scene.duration_s * fps;
  const totalTime = scene.duration_s;
  
  // Parse timestamp input
  const currentTime = timestamp || '0.00';
  const frame = Math.round(parseFloat(currentTime) * fps);
  const percentage = ((parseFloat(currentTime) / totalTime) * 100).toFixed(1);

  const debugInfo = {
    timestamp: `${currentTime}s / ${totalTime}s (${percentage}%)`,
    frame: `${frame} / ${durationInFrames}`,
    template: templateId,
    scene_id: scene.meta?.title || 'Unknown',
    colors: scene.style_tokens?.colors || {},
    content: scene.fill || {},
    duration: scene.duration_s,
    fps: scene.fps,
  };

  const copyDebugInfo = () => {
    const text = `
🐛 SCENE DEBUG INFO (Frame ${frame} / ${currentTime}s)

Template: ${templateId}
Scene: ${scene.meta?.title || 'Unknown'}
Time: ${currentTime}s / ${totalTime}s (${percentage}%)

Colors:
${JSON.stringify(scene.style_tokens?.colors, null, 2)}

Content:
${JSON.stringify(scene.fill, null, 2)}

Full Scene JSON:
${JSON.stringify(scene, null, 2)}

---
Issue: [Describe what looks wrong at this timestamp]
Expected: [What it should look like]
`.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 10000,
          padding: '8px 16px',
          background: visible ? '#E74C3C' : '#2ECC71',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {visible ? '❌ Hide Debug' : '🐛 Debug Mode'}
      </button>

      {/* Debug overlay */}
      {visible && (
        <div
          onClick={copyDebugInfo}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.05)',
            cursor: 'copy',
            pointerEvents: 'all',
          }}
        >
          {/* Debug panel */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              right: 10,
              width: 380,
              maxHeight: 'calc(100vh - 80px)',
              overflow: 'auto',
              background: '#1A1A1A',
              color: '#FFFFFF',
              padding: 20,
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              fontFamily: 'monospace',
              fontSize: 11,
              lineHeight: 1.6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: 14,
                color: '#2ECC71',
                fontWeight: 'bold',
              }}
            >
              🐛 Debug Info
            </h3>

            {/* Timestamp input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#F39C12', fontWeight: 'bold', display: 'block', marginBottom: 6 }}>
                ⏱️ Enter Timestamp (seconds):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={totalTime}
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g. 2.5"
                style={{
                  width: '100%',
                  padding: 8,
                  background: '#2C2C2C',
                  border: '1px solid #555',
                  borderRadius: 4,
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  fontSize: 14,
                }}
              />
              {timestamp && (
                <div style={{ marginTop: 6, padding: 8, background: '#2C2C2C', borderRadius: 4 }}>
                  <div style={{ color: '#2ECC71', fontSize: 10 }}>
                    Frame {frame} / {durationInFrames} ({percentage}%)
                  </div>
                </div>
              )}
            </div>

            {/* Template info */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#3498DB', fontWeight: 'bold' }}>Template:</div>
              <div style={{ color: '#ECF0F1' }}>{templateId}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#3498DB', fontWeight: 'bold' }}>Scene:</div>
              <div style={{ color: '#ECF0F1' }}>{scene.meta?.title || 'Unknown'}</div>
            </div>

            {/* Colors */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#9B59B6', fontWeight: 'bold', marginBottom: 6 }}>Colors:</div>
              {Object.entries(scene.style_tokens?.colors || {}).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      background: value,
                      border: '1px solid #555',
                      borderRadius: 3,
                    }}
                  />
                  <div style={{ color: '#BDC3C7', fontSize: 10 }}>
                    {key}: {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Content preview */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#E67E22', fontWeight: 'bold', marginBottom: 6 }}>Content:</div>
              <pre
                style={{
                  color: '#95A5A6',
                  fontSize: 9,
                  overflow: 'auto',
                  maxHeight: 200,
                  padding: 8,
                  background: '#2C2C2C',
                  borderRadius: 4,
                  margin: 0,
                }}
              >
                {JSON.stringify(scene.fill, null, 2)}
              </pre>
            </div>

            {/* Copy instructions */}
            <div
              style={{
                padding: 12,
                background: copied ? '#27AE60' : '#34495E',
                borderRadius: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={copyDebugInfo}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                {copied ? '✅ Copied!' : '📋 Click to Copy Debug Info'}
              </div>
              <div style={{ fontSize: 9, color: '#BDC3C7' }}>
                {copied ? 'Ready to paste!' : 'Click here or anywhere to copy full context'}
              </div>
            </div>

            {/* Feedback template */}
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: '#2C2C2C',
                borderRadius: 4,
                fontSize: 9,
                color: '#7F8C8D',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: 6, color: '#ECF0F1' }}>
                💬 Feedback Template:
              </div>
              <div>• Issue: [what's wrong at {currentTime}s]</div>
              <div>• Expected: [what it should be]</div>
              <div>• Element: [specific element name]</div>
              <div>• Target: [desired change]</div>
            </div>
          </div>

          {/* Click hint */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 24px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: 6,
              fontSize: 12,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
            }}
          >
            💡 Click anywhere to copy debug info for feedback
          </div>
        </div>
      )}

      {/* Copied notification */}
      {copied && !visible && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            right: 10,
            zIndex: 10000,
            padding: '12px 20px',
            background: '#27AE60',
            color: 'white',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 'bold',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            fontFamily: 'monospace',
          }}
        >
          ✅ Debug info copied to clipboard!
        </div>
      )}
    </>
  );
};

export { DebugOverlay };
