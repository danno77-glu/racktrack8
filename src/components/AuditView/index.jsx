import React, { useState } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useAuditView } from './useAuditView';
    import DamageRecordForm from '../AuditForm/DamageRecordForm';
    import PrintableAudit from './PrintableAudit';
    import RepairQuoteModal from './RepairQuoteModal';
    import './styles.css';

    const AuditView = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const {
        audit,
        damageRecords,
        loading,
        isEditing,
        editedAudit,
        setIsEditing,
        handleAuditChange,
        handleSaveAudit,
        handleAddDamageRecord,
        handleDeleteDamageRecord,
        handlePrint
      } = useAuditView(id);

      const [showDamageForm, setShowDamageForm] = useState(false);
      const [showPrintPreview, setShowPrintPreview] = useState(false);
      const [showRepairQuote, setShowRepairQuote] = useState(false);

      if (loading) {
        return <div className="loading">Loading audit details...</div>;
      }

      if (!audit) {
        return <div className="error">Audit not found</div>;
      }

      const displayData = isEditing ? editedAudit : audit;

      if (showPrintPreview) {
        return (
          <PrintableAudit 
            audit={audit} 
            damageRecords={damageRecords}
            onClose={() => setShowPrintPreview(false)}
            onPrint={handlePrint}
          />
        );
      }

      return (
        <div className="audit-view">
          <div className="view-header">
            <div className="header-content">
              <h1>{displayData.site_name}</h1>
              <span className="reference">{displayData.reference_number}</span>
            </div>
            <div className="header-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSaveAudit} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-btn">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowPrintPreview(true)} className="print-btn">
                    Print Audit
                  </button>
                  <button onClick={() => setIsEditing(true)} className="edit-btn">
                    Edit Audit
                  </button>
                  <button onClick={() => setShowRepairQuote(true)} className="repair-btn">
                    Create Repair Quote
                  </button>
                  <button onClick={() => navigate('/audits')} className="back-btn">
                    Back to List
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="audit-content">
            <div className="audit-section">
              <h2>Basic Information</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label>Auditor Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="auditor_name"
                      value={editedAudit.auditor_name}
                      onChange={handleAuditChange}
                    />
                  ) : (
                    <div className="field-value">{audit.auditor_name}</div>
                  )}
                </div>

                <div className="form-field">
                  <label>Site Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="site_name"
                      value={editedAudit.site_name}
                      onChange={handleAuditChange}
                    />
                  ) : (
                    <div className="field-value">{audit.site_name}</div>
                  )}
                </div>

                <div className="form-field">
                  <label>Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company_name"
                      value={editedAudit.company_name}
                      onChange={handleAuditChange}
                    />
                  ) : (
                    <div className="field-value">{audit.company_name}</div>
                  )}
                </div>

                <div className="form-field">
                  <label>Audit Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="audit_date"
                      value={editedAudit.audit_date}
                      onChange={handleAuditChange}
                    />
                  ) : (
                    <div className="field-value">
                      {new Date(audit.audit_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="risk-summary">
                <div className="risk-count red">
                  <span className="count">{audit.red_risks || 0}</span>
                  <span className="label">Red Risks</span>
                </div>
                <div className="risk-count amber">
                  <span className="count">{audit.amber_risks || 0}</span>
                  <span className="label">Amber Risks</span>
                </div>
                <div className="risk-count green">
                  <span className="count">{audit.green_risks || 0}</span>
                  <span className="label">Green Risks</span>
                </div>
              </div>
            </div>

            <div className="audit-section">
              <div className="section-header">
                <h2>Damage Records</h2>
                {!isEditing && (
                  <button 
                    onClick={() => setShowDamageForm(true)}
                    className="add-damage-btn"
                  >
                    Add Damage Record
                  </button>
                )}
              </div>

              {showDamageForm && (
                <DamageRecordForm
                  onSubmit={(record) => {
                    handleAddDamageRecord(record);
                    setShowDamageForm(false);
                  }}
                  onCancel={() => setShowDamageForm(false)}
                />
              )}

              <div className="damage-list">
                {damageRecords.map((record) => (
                  <div key={record.id} className={`damage-record ${record.risk_level.toLowerCase()}`}>
                    <div className="damage-header">
                      <h3>{record.damage_type}</h3>
                      <span className={`risk-badge ${record.risk_level.toLowerCase()}`}>
                        {record.risk_level}
                      </span>
                    </div>
                    
                    <div className="damage-content">
                      <div className="damage-details">
                        <p><strong>Location:</strong> {record.location_details}</p>
                        <p><strong>Recommendation:</strong> {record.recommendation}</p>
                        {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                      </div>

                      {record.photo_url && (
                        <div className="damage-photo">
                          <img src={record.photo_url} alt="Damage" />
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        onClick={() => handleDeleteDamageRecord(record.id)}
                        className="remove-record-btn"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {showRepairQuote && (
            <RepairQuoteModal
              audit={audit}
              damageRecords={damageRecords}
              onClose={() => setShowRepairQuote(false)}
            />
          )}
        </div>
      );
    };

    export default AuditView;
