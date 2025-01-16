import React from 'react';
import TemplateList from './TemplateList';
import TemplateForm from './TemplateForm';
import { useTemplates } from './useTemplates';
import { useTemplateVisibility } from './hooks/useTemplateVisibility';
import './styles.css';

const TemplateEditor = () => {
  const { 
    templates, 
    selectedTemplate,
    setSelectedTemplate,
    saveTemplate,
    copyTemplate,
    deleteTemplate,
    uploadTemplate,
    handleTemplateUpdate
  } = useTemplates();

  const { toggleVisibility } = useTemplateVisibility(handleTemplateUpdate);

  return (
    <div className="template-editor">
      <h1>Proposal Templates</h1>
      
      <div className="template-container">
        <TemplateList 
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
          onCopy={copyTemplate}
          onDelete={deleteTemplate}
          onUpload={uploadTemplate}
          onToggleVisibility={toggleVisibility}
        />
        
        {selectedTemplate && (
          <TemplateForm 
            template={selectedTemplate}
            onSave={saveTemplate}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateEditor;
