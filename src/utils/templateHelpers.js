// Process conditional blocks in templates
export const processConditionalBlocks = (content, fields) => {
  return content.replace(
    /{{#if\s+(\w+)}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g,
    (_, condition, ifBlock, elseBlock = '') => {
      const field = fields[condition];
      // Show content if field value is "Yes" or if field has a non-empty value
      return (field?.value === 'Yes' || (field?.value && field.value !== 'No')) ? ifBlock : elseBlock;
    }
  );
};

// Replace template variables with actual values
export const replaceTemplateVariables = (content, fields) => {
  let processedContent = content;

  // Replace field labels
  Object.entries(fields).forEach(([key, { label }]) => {
    const labelRegex = new RegExp(`{{\\s*${key}Label\\s*}}`, 'g');
    processedContent = processedContent.replace(labelRegex, label || key);
  });

  // Replace field values
  Object.entries(fields).forEach(([key, { value }]) => {
    if (value === null || value === undefined) return;
    const valueRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    processedContent = processedContent.replace(valueRegex, value);
  });

  return processedContent;
};
