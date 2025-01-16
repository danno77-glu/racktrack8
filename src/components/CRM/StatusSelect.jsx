import React from 'react';
import { STATUS_OPTIONS } from './constants';

const StatusSelect = ({ currentStatus, onChange }) => (
  <select
    value={currentStatus}
    onChange={(e) => onChange(e.target.value)}
  >
    {STATUS_OPTIONS.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default StatusSelect;
