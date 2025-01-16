import React from 'react';
import FormField from './FormField';

const QuoteFormFeatures = ({ formData, onChange }) => {
  const showHandrailLength = formData.handrailType && formData.handrailType !== 'No Handrail';

  return (
    <div className="form-section">
      <h2>Additional Features</h2>
      <div className="form-grid">
        <FormField
          name="staircase"
          value={formData.staircase}
          onChange={onChange}
        />
        <FormField
          name="handrailType"
          value={formData.handrailType}
          onChange={onChange}
        />
        {showHandrailLength && (
          <FormField
            name="handrailLength"
            value={formData.handrailLength}
            onChange={onChange}
          />
        )}
        <FormField
          name="accessGate"
          value={formData.accessGate}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default QuoteFormFeatures;
