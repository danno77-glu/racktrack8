import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const FormField = ({ name, value = '', onChange }) => {
  const { settings } = useSettings();
  const fieldSettings = settings?.[name] || {};

  const {
    type = 'text',
    label = name,
    required = false,
    options = []
  } = fieldSettings;

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="radio-group">
            {options.map((option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={onChange}
                  required={required}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            min="0"
            step="any"
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          />
        );
    }
  };

  return (
    <div className="form-field">
      <label>{label}</label>
      {renderField()}
    </div>
  );
};

export default FormField;
