import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const defaultSettings = {
  deckingType: {
    type: 'dropdown',
    options: ['22mm Particleboard', '25mm Structural Ply']
  },
  staircase: {
    type: 'radio',
    options: ['yes', 'no']
  },
  handrailType: {
    type: 'dropdown',
    options: ['standard', 'balustrading']
  },
  accessGateType: {
    type: 'dropdown',
    options: ['sliding', 'upAndOver']
  },
  supplyType: {
    type: 'dropdown',
    options: ['supplyOnly', 'supplyWithDelivery', 'deliveredAndInstalled']
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'formFields'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        } else {
          // Initialize with default settings if none exist
          await setDoc(doc(db, 'settings', 'formFields'), defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const updateFieldType = (fieldName, type) => {
    setSettings(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        type,
        options: prev[fieldName]?.options || []
      }
    }));
  };

  const updateDropdownOptions = (fieldName, options) => {
    setSettings(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        options
      }
    }));
  };

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, 'settings', 'formFields'), settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + error.message);
    }
  };

  return {
    settings,
    updateFieldType,
    updateDropdownOptions,
    saveSettings
  };
};
