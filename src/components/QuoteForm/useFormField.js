import { useSettings } from '../../contexts/SettingsContext';

export const useFormField = (fieldName) => {
  const { settings } = useSettings();
  const fieldSettings = settings[fieldName] || {};

  return {
    label: fieldSettings.label || fieldName,
    type: fieldSettings.type || 'text',
    required: fieldSettings.required || false,
    options: fieldSettings.options || [],
  };
};
