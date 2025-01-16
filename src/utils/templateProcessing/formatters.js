// Value formatters for different field types
export const formatters = {
  number: (value, unit = '') => {
    if (!value && value !== 0) return 'n/a';
    // Remove any existing units and clean the value
    const cleanValue = value.toString().replace(/[^\d.-]/g, '');
    return `${cleanValue}${unit ? ` ${unit}` : ''}`;
  },

  currency: (value) => {
    if (!value && value !== 0) return 'n/a';
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.toString().replace(/[^\d.-]/g, '');
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return 'n/a';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(numValue);
  },

  text: (value) => {
    if (!value && value !== 0) return 'n/a';
    return value.toString();
  },
  
  select: (value) => value || 'n/a',
  
  radio: (value) => {
    if (!value) return 'n/a';
    // Ensure proper case for Yes/No values
    if (typeof value === 'string') {
      const normalized = value.toLowerCase();
      if (normalized === 'yes') return 'Yes';
      if (normalized === 'no') return 'No';
    }
    return value;
  }
};
