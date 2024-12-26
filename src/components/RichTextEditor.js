// src/pages/ProductPage/components/RichTextEditor.jsx
import React from 'react';

const RichTextEditor = ({ value, onChange }) => {
  return (
    <div className="rich-text-editor">
      <div className="toolbar">
        <button>B</button>
        <button>I</button>
        <button>U</button>
        <select>
          <option>Source Sans Pro</option>
        </select>
        <button>⚠️</button>
        <button>⌘</button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter description..."
      />
    </div>
  );
};

export default RichTextEditor;