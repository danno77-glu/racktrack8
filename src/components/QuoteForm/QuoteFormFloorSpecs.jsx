import React from 'react';
import FormField from './FormField';

const QuoteFormFloorSpecs = ({ formData, onChange }) => (
  <div className="form-section">
    <h2>Floor Specifications</h2>
    <div className="form-grid">
      <FormField
        name="floorSize"
        value={formData.floorSize}
        onChange={onChange}
      />
      <FormField
        name="floorFinishHeight"
        value={formData.floorFinishHeight}
        onChange={onChange}
      />
      <FormField
        name="floorCapacity"
        value={formData.floorCapacity}
        onChange={onChange}
      />
      <FormField
        name="deckingType"
        value={formData.deckingType}
        onChange={onChange}
      />
      <FormField
        name="steelFinish"
        value={formData.steelFinish}
        onChange={onChange}
      />
    </div>
  </div>
);

export default QuoteFormFloorSpecs;
