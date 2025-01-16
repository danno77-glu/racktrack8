export const processConditionals = (content, fields) => {
  return content.replace(
    /{{#if\s+(\w+)}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g,
    (_, condition, ifBlock, elseBlock = '') => {
      const field = fields[condition];
      
      // If field doesn't exist, return else block or empty string
      if (!field) return elseBlock || '';

      // For handrail type
      if (condition === 'handrailType') {
        const hasValue = field.value && field.value !== 'No Handrail';
        return hasValue ? ifBlock : (elseBlock || '');
      }

      // For handrail length
      if (condition === 'handrailLength') {
        const hasLength = field.value && field.value !== '0' && field.value !== 'n/a';
        return hasLength ? ifBlock : (elseBlock || '');
      }

      // For access gate
      if (condition === 'accessGateType') {
        const hasValue = field.value && field.value !== 'No Gate';
        return hasValue ? ifBlock : (elseBlock || '');
      }

      // For Yes/No fields
      if (field.value === 'Yes' || field.value === 'No') {
        return field.value === 'Yes' ? ifBlock : (elseBlock || '');
      }

      // For other fields, check if they have a non-empty value
      return field.value && field.value !== 'n/a' ? ifBlock : (elseBlock || '');
    }
  );
};
