import React, { useRef } from 'react';

const TemplateUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      onUpload({
        name: file.name.replace('.html', ''),
        content,
        updatedAt: new Date().toISOString()
      });
      fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="template-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".html"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button 
        className="upload-btn"
        onClick={() => fileInputRef.current.click()}
      >
        Upload Template
      </button>
    </div>
  );
};

export default TemplateUpload;
