// Format number values
const formatNumber = (value) => {
  if (!value && value !== 0) return '';
  return value.toString().replace(/[^\d.-]/g, '');
};

// Format currency values
const formatCurrency = (value) => {
  if (!value && value !== 0) return '';
  const numValue = parseFloat(value);
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

// Format field values based on type and metadata
export const formatFieldValue = (field, value) => {
  if (!value && value !== 0) return '';

  // Handle price fields
  if (field?.label?.toLowerCase().includes('price')) {
    return formatCurrency(value);
  }

  // Handle radio buttons and selects
  if (field?.type === 'radio' || field?.type === 'select') {
    return value;
  }

  // Handle numbers
  if (field?.type === 'number') {
    return formatNumber(value);
  }

  // Default handling
  return value.toString();
};
