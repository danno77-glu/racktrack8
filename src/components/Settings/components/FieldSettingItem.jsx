import React from 'react';
import { FIELD_TYPES } from '../constants';

const FieldSettingItem = ({ fieldName, settings = {}, onUpdate }) => {
  if (!settings) {
    return null;
  }

  const {
    type = FIELD_TYPES.TEXT,
    label = fieldName,
    required = false,
    options = []
  } = settings;

  const handleTypeChange = (e) => {
    onUpdate({ ...settings, type: e.target.value });
  };

  const handleRequiredChange = (e) => {
    onUpdate({ ...settings, required: e.target.checked });
  };

  const handleLabelChange = (e) => {
    onUpdate({ ...settings, label: e.target.value });
  };

  const handleOptionsChange = (newOptions) => {
    onUpdate({ ...settings, options: newOptions });
  };

  const handleOptionAdd = () => {
    handleOptionsChange([...options, '']);
  };

  const handleOptionRemove = (index) => {
    handleOptionsChange(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    handleOptionsChange(newOptions);
  };

  return (
    <div className="field-setting-item">
      <div className="field-header">
        <h3>{label || fieldName}</h3>
      </div>

      <div className="field-content">
        <div className="setting-row">
          <label>Label:</label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            className="setting-input"
          />
        </div>

        <div className="setting-row">
          <label>Type:</label>
          <select 
            value={type}
            onChange={handleTypeChange}
            className="setting-select"
          >
            {Object.entries(FIELD_TYPES).map(([key, value]) => (
              <option key={value} value={value}>
                {key.toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-row">
          <label>Required:</label>
          <input
            type="checkbox"
            checked={required}
            onChange={handleRequiredChange}
            className="setting-checkbox"
          />
        </div>

        {(type === FIELD_TYPES.SELECT || type === FIELD_TYPES.RADIO) && (
          <div className="setting-options">
            <label>Options:</label>
            {options.map((option, index) => (
              <div key={index} className="option-row">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="setting-input"
                />
                <button
                  type="button"
                  onClick={() => handleOptionRemove(index)}
                  className="remove-option"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleOptionAdd}
              className="add-option"
            >
              Add Option
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldSettingItem;
