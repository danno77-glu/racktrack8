import React, { useState, useEffect } from 'react';
    import { supabase } from '../../supabase';
    import './styles.css';

    const AuditorSettings = () => {
      const [auditors, setAuditors] = useState([]);
      const [newAuditor, setNewAuditor] = useState({ name: '', color: '#ffffff' });
      const [loading, setLoading] = useState(true);

      const fetchAuditors = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('auditors')
            .select('*')
            .order('name');

          if (error) throw error;
          setAuditors(data || []);
        } catch (error) {
          console.error('Error fetching auditors:', error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchAuditors();
      }, []);

      const handleAddAuditor = async () => {
        if (!newAuditor.name.trim()) return;

        try {
          console.log('Adding auditor:', newAuditor);
          const { data, error } = await supabase
            .from('auditors')
            .insert(newAuditor)
            .select()
            .single();

          if (error) {
            console.error('Error adding auditor to Supabase:', error);
            alert('Failed to add auditor: ' + error.message);
            return;
          }
          console.log('Auditor added successfully:', data);
          await fetchAuditors();
          setNewAuditor({ name: '', color: '#ffffff' });
        } catch (error) {
          console.error('Error adding auditor:', error);
          alert('Failed to add auditor: ' + error.message);
        }
      };

      const handleRemoveAuditor = async (id) => {
        try {
          console.log('Removing auditor with id:', id);
          const { error } = await supabase
            .from('auditors')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error removing auditor from Supabase:', error);
            alert('Failed to remove auditor: ' + error.message);
            return;
          }
          console.log('Auditor removed successfully');
          await fetchAuditors();
        } catch (error) {
          console.error('Error removing auditor:', error);
          alert('Failed to remove auditor: ' + error.message);
        }
      };

      const handleColorChange = async (e, id) => {
        try {
          console.log('Updating color for auditor with id:', id, 'New color:', e.target.value);
          const { data, error } = await supabase
            .from('auditors')
            .update({ color: e.target.value })
            .eq('id', id)
            .select()
            .single();

          if (error) {
            console.error('Error updating auditor color in Supabase:', error);
            alert('Failed to update auditor color: ' + error.message);
            return;
          }
          console.log('Auditor color updated successfully:', data);
          await fetchAuditors();
        } catch (error) {
          console.error('Error updating auditor color:', error);
          alert('Failed to update auditor color: ' + error.message);
        }
      };

      if (loading) {
        return <div className="settings-loading">Loading auditors...</div>;
      }

      return (
        <div className="settings-group">
          <h2>Manage Auditors</h2>
          <div className="auditor-list">
            {auditors.map((auditor, index) => (
              <div key={auditor.id} className="auditor-item">
                <span style={{ backgroundColor: auditor.color, padding: '0.25rem', borderRadius: '0.25rem', marginRight: '0.5rem' }}>&nbsp;&nbsp;&nbsp;</span>
                <span>{auditor.name}</span>
                <input
                  type="color"
                  value={auditor.color}
                  onChange={(e) => handleColorChange(e, auditor.id)}
                  style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAuditor(auditor.id)}
                  className="remove-option"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="add-auditor">
            <input
              type="text"
              value={newAuditor.name}
              onChange={(e) => setNewAuditor({ ...newAuditor, name: e.target.value })}
              placeholder="New Auditor Name"
              className="setting-input"
            />
            <input
              type="color"
              value={newAuditor.color}
              onChange={(e) => setNewAuditor({ ...newAuditor, color: e.target.value })}
              style={{ marginLeft: '0.5rem' }}
            />
            <button
              type="button"
              onClick={handleAddAuditor}
              className="add-option"
            >
              Add Auditor
            </button>
          </div>
        </div>
      );
    };

    export default AuditorSettings;
