export const processVariables = (content, fields) => {
  let processedContent = content;

  // Replace field labels first
  Object.entries(fields).forEach(([key, field]) => {
    if (!field) return;
    
    const labelRegex = new RegExp(`{{\\s*${key}Label\\s*}}`, 'g');
    processedContent = processedContent.replace(labelRegex, field.label || key);
  });

  // Then replace field values
  Object.entries(fields).forEach(([key, field]) => {
    if (!field) return;

    const valueRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    const value = field.value?.toString() || 'n/a';
    
    // Don't append units if value is n/a
    if (value === 'n/a') {
      processedContent = processedContent.replace(valueRegex, 'n/a');
    } else {
      processedContent = processedContent.replace(valueRegex, value);
    }
  });

  return processedContent;
};
