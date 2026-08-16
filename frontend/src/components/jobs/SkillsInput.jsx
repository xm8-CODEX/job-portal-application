// src/components/jobs/SkillsInput.jsx
// Tag input component for entering skills

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

export default function SkillsInput({ value = [], onChange, placeholder = 'Add a skill...' }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div
      className="skills-input"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((skill) => (
        <span key={skill} className="tag">
          {skill}
          <button type="button" onClick={() => removeSkill(skill)}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input) addSkill(input); }}
        placeholder={value.length === 0 ? placeholder : ''}
      />
    </div>
  );
}
