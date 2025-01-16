export const formatDate = (date) => {
  if (!date) return '';
  
  // Handle Firestore Timestamp
  if (date?.toDate) {
    date = date.toDate();
  }
  
  // Handle string dates
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  // Ensure we have a valid date
  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }

  // Format date as DD/MM/YYYY
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
