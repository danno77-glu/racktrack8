import React, { useState } from 'react';
    import FieldSettings from './FieldSettings';
    import { useFieldSettings } from './hooks/useFieldSettings';
    import AuditorSettings from './AuditorSettings';
    import DamagePriceSettings from './DamagePriceSettings';
    import './styles.css';
    import ReportSettings from './ReportSettings';

    const Settings = () => {
      const { settings, loading, error, updateField, resetToDefaults, updateDamagePrices } = useFieldSettings();
      const [activeTab, setActiveTab] = useState('form');

      if (loading) {
        return <div className="settings-loading">Loading settings...</div>;
      }

      if (error) {
        return <div className="settings-error">Error: {error}</div>;
      }

      return (
        <div className="settings">
          <div className="settings-header">
            <h1>Settings</h1>
            <button onClick={resetToDefaults} className="reset-button">
              Reset to Defaults
            </button>
          </div>

          <div className="settings-tabs">
            <button
              className={activeTab === 'form' ? 'active' : ''}
              onClick={() => setActiveTab('form')}
            >
              Form Fields
            </button>
            <button
              className={activeTab === 'auditors' ? 'active' : ''}
              onClick={() => setActiveTab('auditors')}
            >
              Auditors
            </button>
            <button
              className={activeTab === 'prices' ? 'active' : ''}
              onClick={() => setActiveTab('prices')}
            >
              Damage Prices
            </button>
            <button
              className={activeTab === 'reports' ? 'active' : ''}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </div>

          {activeTab === 'form' && (
            <FieldSettings
              settings={settings}
              onUpdate={updateField}
            />
          )}
          {activeTab === 'auditors' && <AuditorSettings />}
          {activeTab === 'prices' && (
            <DamagePriceSettings
              damagePrices={settings.damagePrices}
              onUpdate={updateDamagePrices}
            />
          )}
          {activeTab === 'reports' && <ReportSettings />}
        </div>
      );
    };

    export default Settings;
