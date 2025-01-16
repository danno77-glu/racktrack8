import React from 'react';
import './styles.css';

const DamageList = ({ records, onRemove }) => {
  if (!records.length) {
    return (
      <div className="no-damages">
        No damage records added yet
      </div>
    );
  }

  return (
    <div className="damage-list">
      {records.map((record, index) => (
        <div key={index} className={`damage-record ${record.risk_level.toLowerCase()}`}>
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
                <div className="photo-container">
                  <img src={record.photo_url} alt="Damage" />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="remove-record-btn"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default DamageList;
