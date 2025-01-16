import { formatters } from './formatters';

export const processField = (field, value) => {
  if (!field) return { value: 'n/a' };

  // Handle null/undefined values
  if (value === null || value === undefined || value === '') {
    return { value: 'n/a' };
  }

  // Get the appropriate formatter
  const formatter = formatters[field.type] || formatters.text;

  // Handle radio/select fields
  if (field.type === 'radio' || field.type === 'select') {
    return { value: formatter(value) };
  }

  // Handle number fields with units
  if (field.type === 'number') {
    const formattedValue = formatter(value);
    if (formattedValue === 'n/a') return { value: 'n/a' };
    
    // Don't append units here - they're handled in the template
    return { value: formattedValue };
  }

  // Default processing
  return { value: value ? formatter(value) : 'n/a' };
};
