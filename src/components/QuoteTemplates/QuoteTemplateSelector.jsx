import React from 'react';
import './styles.css';

const QuoteTemplateSelector = ({ templates, selectedTemplateId, onSelect }) => (
  <div className="template-selector">
    <label htmlFor="template-select">Select Template:</label>
    <select 
      id="template-select"
      value={selectedTemplateId}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Choose a template</option>
      {templates.map(template => (
        <option key={template.id} value={template.id}>
          {template.name}
        </option>
      ))}
    </select>
  </div>
);

export default QuoteTemplateSelector;
