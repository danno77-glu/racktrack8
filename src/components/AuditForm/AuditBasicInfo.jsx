import React from 'react';
import FormField from '../QuoteForm/FormField'; // Corrected import path

const AuditBasicInfo = ({ data, onChange, damageRecords, auditors }) => {
  // Calculate risk counts
  const riskCounts = damageRecords.reduce((acc, record) => {
    const key = record.risk_level.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, { red: 0, amber: 0, green: 0 });

  return (
    <div className="form-section">
      <h2>Basic Information</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>Auditor Name</label>
          <select
            name="auditor_name"
            value={data.auditor_name}
            onChange={onChange}
            required
          >
            <option value="">Select Auditor</option>
            {auditors.map(auditor => (
              <option key={auditor.id} value={auditor.name} style={{ backgroundColor: auditor.color }}>
                {auditor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Site Name</label>
          <input
            type="text"
            name="site_name"
            value={data.site_name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={data.company_name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Audit Date</label>
          <input
            type="date"
            name="audit_date"
            value={data.audit_date}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field full-width">
          <label>Notes</label>
          <textarea
            name="notes"
            value={data.notes}
            onChange={onChange}
            rows={3}
          />
        </div>
      </div>

      <div className="risk-summary">
        <div className="risk-count red">
          <span className="count">{riskCounts.red}</span>
          <span className="label">Red Risks</span>
        </div>
        <div className="risk-count amber">
          <span className="count">{riskCounts.amber}</span>
          <span className="label">Amber Risks</span>
        </div>
        <div className="risk-count green">
          <span className="count">{riskCounts.green}</span>
          <span className="label">Green Risks</span>
        </div>
      </div>
    </div>
  );
};

export default AuditBasicInfo;
