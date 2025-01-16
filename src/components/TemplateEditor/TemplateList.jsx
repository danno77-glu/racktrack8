import React from 'react';
import TemplateUpload from './TemplateUpload';
import TemplateListItem from './components/TemplateListItem';

const TemplateList = ({ 
  templates, 
  selectedTemplate, 
  onSelect, 
  onDelete, 
  onCopy, 
  onUpload, 
  onToggleVisibility 
}) => (
  <div className="template-list">
    <div className="list-header">
      <h2>Templates</h2>
      <div className="list-actions">
        <TemplateUpload onUpload={onUpload} />
        <button 
          className="new-template-btn"
          onClick={() => onSelect({ name: '', content: '', hidden: false })}
        >
          New Template
        </button>
      </div>
    </div>

    <div className="template-items">
      {templates.map(template => (
        <TemplateListItem
          key={template.id}
          template={template}
          isSelected={selectedTemplate?.id === template.id}
          onSelect={onSelect}
          onToggleVisibility={onToggleVisibility}
          onCopy={onCopy}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);

export default TemplateList;
