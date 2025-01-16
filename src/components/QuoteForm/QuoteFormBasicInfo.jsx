import React from 'react';
import FormField from './FormField';

const QuoteFormBasicInfo = ({ formData, onChange }) => (
  <div className="form-section">
    <h2>Basic Information</h2>
    <div className="form-grid">
      <FormField
        name="consultantName"
        value={formData.consultantName}
        onChange={onChange}
      />
      <FormField
        name="customerName"
        value={formData.customerName}
        onChange={onChange}
      />
      <FormField
        name="companyName"
        value={formData.companyName}
        onChange={onChange}
      />
      <FormField
        name="email"
        value={formData.email}
        onChange={onChange}
      />
    </div>
  </div>
);

export default QuoteFormBasicInfo;
