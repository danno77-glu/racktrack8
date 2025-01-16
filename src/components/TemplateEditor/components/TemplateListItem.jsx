import React from 'react';

const TemplateListItem = ({ 
  template, 
  isSelected, 
  onSelect, 
  onToggleVisibility, 
  onCopy, 
  onDelete 
}) => (
  <div 
    className={`template-item ${isSelected ? 'selected' : ''} ${!template.hidden ? 'visible' : 'hidden'}`}
  >
    <div 
      className="template-info"
      onClick={() => onSelect(template)}
    >
      <h3>{template.name}</h3>
      <p>Last modified: {new Date(template.updatedAt).toLocaleDateString()}</p>
    </div>
    <div className="template-actions">
      <button 
        className={`visibility-btn ${template.hidden ? 'show' : 'hide'}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility(template);
        }}
      >
        {template.hidden ? 'Show' : 'Hide'}
      </button>
      <button 
        className="copy-btn"
        onClick={(e) => {
          e.stopPropagation();
          onCopy(template);
        }}
      >
        Copy
      </button>
      <button 
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(template.id);
        }}
      >
        Delete
      </button>
    </div>
  </div>
);

export default TemplateListItem;
