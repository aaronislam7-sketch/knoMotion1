import React from 'react';

/**
 * Configuration Panel for Challenge13PollQuiz Template
 */

const AccordionSection = ({ title, icon, isOpen, onToggle, children }) => (
  <div style={{
    marginBottom: 16,
    border: '2px solid #E0E0E0',
    borderRadius: 8,
    overflow: 'hidden'
  }}>
    <div
      onClick={onToggle}
      style={{
        padding: '12px 16px',
        backgroundColor: isOpen ? '#E91E63' : '#F5F5F5',
        color: isOpen ? '#FFFFFF' : '#1A1A1A',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: 15,
        transition: 'all 0.2s'
      }}
    >
      <span>{icon} {title}</span>
      <span>{isOpen ? '▼' : '▶'}</span>
    </div>
    {isOpen && (
      <div style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
        {children}
      </div>
    )}
  </div>
);

export const Challenge13Config = ({ scene, onUpdate }) => {
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    answers: true,
    colors: false,
    timing: false
  });
  
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const updateField = (path, value) => {
    const keys = path.split('.');
    const newScene = JSON.parse(JSON.stringify(scene));
    let current = newScene;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onUpdate(newScene);
  };
  
  const updateAnswer = (index, field, value) => {
    const answers = [...(scene.answers || [])];
    answers[index] = { ...answers[index], [field]: value };
    updateField('answers', answers);
  };
  
  const addAnswer = () => {
    const answers = [...(scene.answers || [])];
    if (answers.length < 6) {
      answers.push({
        text: `Option ${answers.length + 1}`,
        correct: false
      });
      updateField('answers', answers);
    }
  };
  
  const removeAnswer = (index) => {
    const answers = [...(scene.answers || [])];
    if (answers.length > 2) {
      answers.splice(index, 1);
      updateField('answers', answers);
    }
  };
  
  return (
    <div>
      <h3 style={{ marginTop: 0, color: '#E91E63' }}>🎯 Poll/Quiz Config</h3>
      
      {/* Basic Settings */}
      <AccordionSection
        title="Basic Settings"
        icon="⚙️"
        isOpen={openSections.basic}
        onToggle={() => toggleSection('basic')}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Title</label>
          <input
            type="text"
            value={scene.title?.text || ''}
            onChange={(e) => updateField('title.text', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Question</label>
          <textarea
            value={scene.question || ''}
            onChange={(e) => updateField('question', e.target.value)}
            rows={3}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Layout</label>
          <select
            value={scene.layout || 'grid'}
            onChange={(e) => updateField('layout', e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 14 }}
          >
            <option value="grid">Grid (2x2, 2x3)</option>
            <option value="vertical">Vertical Stack</option>
            <option value="horizontal">Horizontal Row</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={scene.showTimer !== false}
              onChange={(e) => updateField('showTimer', e.target.checked)}
            />
            <span style={{ fontWeight: 600 }}>Show Timer</span>
          </label>
        </div>
        
        {scene.showTimer !== false && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              Timer Duration: {scene.timerDuration || 10}s
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={scene.timerDuration || 10}
              onChange={(e) => updateField('timerDuration', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </AccordionSection>
      
      {/* Answers */}
      <AccordionSection
        title="Answer Options"
        icon="✅"
        isOpen={openSections.answers}
        onToggle={() => toggleSection('answers')}
      >
        {(scene.answers || []).map((answer, index) => (
          <div key={index} style={{ 
            marginBottom: 12, 
            padding: 12, 
            border: answer.correct ? '2px solid #4CAF50' : '1px solid #E0E0E0',
            borderRadius: 4,
            backgroundColor: answer.correct ? '#E8F5E9' : '#FFFFFF'
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'start', marginBottom: 8 }}>
              <input
                type="text"
                value={answer.text || ''}
                onChange={(e) => updateAnswer(index, 'text', e.target.value)}
                placeholder={`Option ${index + 1}`}
                style={{ flex: 1, padding: 6, fontSize: 13 }}
              />
              <button
                onClick={() => removeAnswer(index)}
                disabled={(scene.answers || []).length <= 2}
                style={{ 
                  padding: '6px 10px', 
                  fontSize: 12,
                  backgroundColor: '#F44336',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  opacity: (scene.answers || []).length <= 2 ? 0.5 : 1
                }}
              >
                ✕
              </button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <input
                type="checkbox"
                checked={answer.correct || false}
                onChange={(e) => updateAnswer(index, 'correct', e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>Correct Answer</span>
            </label>
          </div>
        ))}
        
        <button
          onClick={addAnswer}
          disabled={(scene.answers || []).length >= 6}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: '#E91E63',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            marginTop: 8,
            opacity: (scene.answers || []).length >= 6 ? 0.5 : 1
          }}
        >
          + Add Answer (max 6)
        </button>
        
        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Explanation</label>
          <textarea
            value={scene.explanation || ''}
            onChange={(e) => updateField('explanation', e.target.value)}
            rows={2}
            placeholder="Explain why the answer is correct..."
            style={{ width: '100%', padding: 8, fontSize: 13 }}
          />
        </div>
      </AccordionSection>
      
      {/* Colors */}
      <AccordionSection
        title="Colors"
        icon="🎨"
        isOpen={openSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Background</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.bg || '#F8F9FA'}
              onChange={(e) => updateField('style_tokens.colors.bg', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Accent</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.accent || '#E91E63'}
              onChange={(e) => updateField('style_tokens.colors.accent', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Correct</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.correct || '#4CAF50'}
              onChange={(e) => updateField('style_tokens.colors.correct', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Incorrect</label>
            <input
              type="color"
              value={scene.style_tokens?.colors?.incorrect || '#F44336'}
              onChange={(e) => updateField('style_tokens.colors.incorrect', e.target.value)}
              style={{ width: '100%', height: 36 }}
            />
          </div>
        </div>
      </AccordionSection>
      
      {/* Timing */}
      <AccordionSection
        title="Timing"
        icon="⏱️"
        isOpen={openSections.timing}
        onToggle={() => toggleSection('timing')}
      >
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Answer Stagger: {scene.beats?.answerStagger || 0.15}s
          </label>
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.05"
            value={scene.beats?.answerStagger || 0.15}
            onChange={(e) => updateField('beats.answerStagger', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
            Reveal Delay: {scene.beats?.revealDelay || 0.5}s
          </label>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={scene.beats?.revealDelay || 0.5}
            onChange={(e) => updateField('beats.revealDelay', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </AccordionSection>
    </div>
  );
};
