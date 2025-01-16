import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditList } from './useAuditList';
import './styles.css';

const AuditList = () => {
  const navigate = useNavigate();
  const { audits, loading } = useAuditList();

  if (loading) {
    return <div className="loading">Loading audits...</div>;
  }

  return (
    <div className="audit-list">
      <div className="list-header">
        <h1>Rack Audits</h1>
        <button onClick={() => navigate('/')} className="new-audit-btn">
          New Audit
        </button>
      </div>

      <div className="audit-grid">
        {audits.map(audit => (
          <div key={audit.id} className="audit-card">
            <div className="audit-header">
              <h3>{audit.site_name}</h3>
              <span className="reference">{audit.reference_number}</span>
            </div>
            
            <div className="audit-details">
              <p><strong>Company:</strong> {audit.company_name}</p>
              <p><strong>Date:</strong> {new Date(audit.audit_date).toLocaleDateString()}</p>
              <p><strong>Auditor:</strong> {audit.auditor_name}</p>
            </div>

            <div className="risk-counts">
              <span className="risk red">{audit.red_risks || 0}</span>
              <span className="risk amber">{audit.amber_risks || 0}</span>
              <span className="risk green">{audit.green_risks || 0}</span>
            </div>

            <div className="audit-actions">
              <button onClick={() => navigate(`/audits/${audit.id}`)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditList;
