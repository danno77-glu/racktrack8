import React from 'react';
import QuoteFormBasicInfo from './QuoteFormBasicInfo';
import QuoteFormFloorSpecs from './QuoteFormFloorSpecs';
import QuoteFormFeatures from './QuoteFormFeatures';
import QuoteFormSupply from './QuoteFormSupply';
import { useQuoteForm } from './useQuoteForm';
import './styles.css';

const QuoteForm = () => {
  const { formData, handleChange, handleSubmit } = useQuoteForm();

  return (
    <form onSubmit={handleSubmit}>
      <h1>Mezzanine Quote Form</h1>
      <QuoteFormBasicInfo formData={formData} onChange={handleChange} />
      <QuoteFormFloorSpecs formData={formData} onChange={handleChange} />
      <QuoteFormFeatures formData={formData} onChange={handleChange} />
      <QuoteFormSupply formData={formData} onChange={handleChange} />
      <button type="submit">Submit Proposal</button>
    </form>
  );
};

export default QuoteForm;
