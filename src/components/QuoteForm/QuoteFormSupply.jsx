import React from 'react';
import FormField from './FormField';

const QuoteFormSupply = ({ formData, onChange }) => (
  <div className="form-section">
    <h2>Supply Details</h2>
    <div className="form-grid">
      <FormField
        name="supplyType"
        value={formData.supplyType}
        onChange={onChange}
      />
      <FormField
        name="totalPrice"
        value={formData.totalPrice}
        onChange={onChange}
      />
    </div>
  </div>
);

export default QuoteFormSupply;
