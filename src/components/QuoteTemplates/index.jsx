import React from 'react';
import QuoteTemplateSelector from './QuoteTemplateSelector';
import QuotePreview from './QuotePreview';
import { useQuoteTemplates } from './useQuoteTemplates';
import './styles.css';

const QuoteTemplates = ({ quote }) => {
  const {
    templates,
    selectedTemplateId,
    selectedTemplate,
    setSelectedTemplateId,
    handlePrint,
    handleDownload
  } = useQuoteTemplates(quote);

  return (
    <div className="quote-templates">
      <QuoteTemplateSelector
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onSelect={setSelectedTemplateId}
      />
      
      <QuotePreview 
        template={selectedTemplate}
        quote={quote}
      />

      {selectedTemplate && (
        <div className="preview-actions">
          <button onClick={handlePrint} className="print">
            Print Quote
          </button>
          <button onClick={handleDownload} className="download">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteTemplates;
