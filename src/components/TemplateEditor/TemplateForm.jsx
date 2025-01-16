import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './styles.css';

const TemplateForm = ({ template, onSave }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setContent(template.content);
    }
  }, [template]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      await onSave({ ...template, name, content });
      alert('Template saved successfully!');
    } catch (error) {
      alert('Error saving template: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!template) {
    return (
      <div className="no-template">
        <p>Select a template to edit or create a new one</p>
        <p className="hint">Available variables:</p>
        <ul className="variable-list">
          <li><code>{{reference_number}}</code> - Audit reference number</li>
          <li><code>{{audit_date}}</code> - Date of audit</li>
          <li><code>{{auditor_name}}</code> - Name of auditor</li>
          <li><code>{{site_name}}</code> - Site name</li>
          <li><code>{{company_name}}</code> - Company name</li>
          <li><code>{{red_risks}}</code> - Number of red risks</li>
          <li><code>{{amber_risks}}</code> - Number of amber risks</li>
          <li><code>{{green_risks}}</code> - Number of green risks</li>
          <li><code>{{notes}}</code> - Audit notes</li>
        </ul>
        <p className="hint">Damage record fields (in loop):</p>
        <ul className="variable-list">
          <li><code>{{damage_type}}</code> - Type of damage</li>
          <li><code>{{risk_level}}</code> - Risk level (RED/AMBER/GREEN)</li>
          <li><code>{{location_details}}</code> - Location details</li>
          <li><code>{{recommendation}}</code> - Recommended action</li>
          <li><code>{{notes}}</code> - Additional notes</li>
          <li><code>{{photo_url}}</code> - URL of damage photo</li>
        </ul>
      </div>
    );
  }

  return (
    <form className="template-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Template Name"
          required
          className="template-name-input"
        />
        <button 
          type="submit" 
          className="save-button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      <Editor
        height="70vh"
        language="html"
        value={content}
        onChange={setContent}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          lineNumbers: 'on',
          formatOnPaste: true,
          formatOnType: true,
          renderWhitespace: 'boundary',
          suggest: {
            showVariables: true,
            showFunctions: true
          }
        }}
      />
    </form>
  );
};

export default TemplateForm;
