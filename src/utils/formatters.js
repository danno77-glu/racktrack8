export const formatCurrency = (value) => {
  if (!value && value !== 0) return 'n/a';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 'n/a';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};
