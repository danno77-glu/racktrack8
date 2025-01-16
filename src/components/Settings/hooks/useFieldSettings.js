import { useState, useEffect } from 'react';
    import { supabase } from '../../../supabase';
    import { DEFAULT_SETTINGS } from '../constants';

    export const useFieldSettings = () => {
      const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, damagePrices: {} });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchSettings = async () => {
          try {
            setLoading(true);
            const { data, error } = await supabase
              .from('settings')
              .select('*')
              .in('key', ['formFields', 'damagePrices']);

            if (error && error.code !== 'PGRST116') throw error;

            let fetchedSettings = {};
            data.forEach(item => {
              fetchedSettings[item.key] = item.value;
            });

            const mergedSettings = {
              ...DEFAULT_SETTINGS,
              ...fetchedSettings.formFields,
              damagePrices: fetchedSettings.damagePrices || {}
            };

            setSettings(mergedSettings);
          } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchSettings();
      }, []);

      const updateField = async (fieldName, updates) => {
        if (!fieldName || !settings[fieldName]) {
          console.error('Invalid field name:', fieldName);
          return false;
        }

        try {
          const updatedSettings = {
            ...settings,
            [fieldName]: {
              ...settings[fieldName],
              ...updates
            }
          };
          
          const { error } = await supabase
            .from('settings')
            .upsert({ 
              key: 'formFields', 
              value: updatedSettings,
              updated_at: new Date().toISOString()
            });

          if (error) throw error;
          setSettings(updatedSettings);
          return true;
        } catch (err) {
          console.error('Error updating field:', err);
          setError(err.message);
          return false;
        }
      };

      const updateDamagePrices = async (newPrices) => {
        try {
          const { error } = await supabase
            .from('settings')
            .upsert({
              key: 'damagePrices',
              value: newPrices,
              updated_at: new Date().toISOString()
            });

          if (error) throw error;
          setSettings(prev => ({ ...prev, damagePrices: newPrices }));
          return true;
        } catch (err) {
          console.error('Error updating damage prices:', err);
          setError(err.message);
          return false;
        }
      };

      const resetToDefaults = async () => {
        try {
          const { error } = await supabase
            .from('settings')
            .upsert({ 
              key: 'formFields', 
              value: DEFAULT_SETTINGS,
              updated_at: new Date().toISOString()
            });

          if (error) throw error;
          setSettings(prev => ({ ...DEFAULT_SETTINGS, damagePrices: prev.damagePrices }));
          return true;
        } catch (err) {
          console.error('Error resetting settings:', err);
          setError(err.message);
          return false;
        }
      };

      return {
        settings,
        loading,
        error,
        updateField,
        resetToDefaults,
        updateDamagePrices
      };
    };
