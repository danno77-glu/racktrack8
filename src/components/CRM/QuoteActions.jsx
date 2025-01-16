import React, { useState } from 'react';
import QuoteTemplates from '../QuoteTemplates';
import './styles.css';

const QuoteActions = ({ quote }) => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  return (
    <div className="quote-actions">
      <button 
        className="action-button"
        onClick={() => setShowTemplateSelector(true)}
      >
        Generate Quote
      </button>

      {showTemplateSelector && (
        <div className="template-selector-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Generate Quote Document</h3>
              <button 
                className="close-button"
                onClick={() => setShowTemplateSelector(false)}
              >
                ×
              </button>
            </div>
            <QuoteTemplates 
              quote={quote} 
              onClose={() => setShowTemplateSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteActions;
