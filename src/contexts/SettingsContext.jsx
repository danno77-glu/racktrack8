import React, { createContext, useContext } from 'react';
import { useFieldSettings } from '../components/Settings/hooks/useFieldSettings';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { settings, loading, error, updateField } = useFieldSettings();

  return (
    <SettingsContext.Provider value={{ settings, loading, error, updateField }}>
      {children}
    </SettingsContext.Provider>
  );
};
