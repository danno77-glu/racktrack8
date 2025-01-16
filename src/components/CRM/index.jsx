import React from 'react';
import { useCRM } from './useCRM';
import QuoteList from './QuoteList';
import './styles.css';

const CRM = () => {
  const { quotes, loading, handleStatusChange } = useCRM();

  if (loading) {
    return <div className="loading">Loading quotes...</div>;
  }

  return (
    <div className="crm">
      <h1>Quote Management</h1>
      <QuoteList quotes={quotes} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default CRM;
