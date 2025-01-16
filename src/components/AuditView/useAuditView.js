import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export const useAuditView = (auditId) => {
  const [audit, setAudit] = useState(null);
  const [damageRecords, setDamageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAudit, setEditedAudit] = useState(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      if (!auditId) return;

      try {
        setLoading(true);
        
        // Fetch audit details
        const { data: auditData, error: auditError } = await supabase
          .from('audits')
          .select('*')
          .eq('id', auditId)
          .single();

        if (auditError) throw auditError;

        // Fetch damage records with explicit columns
        const { data: records, error: recordsError } = await supabase
          .from('damage_records')
          .select(`
            id,
            audit_id,
            damage_type,
            risk_level,
            location_details,
            photo_url,
            notes,
            recommendation,
            created_at,
            updated_at
          `)
          .eq('audit_id', auditId)
          .order('created_at', { ascending: true });

        if (recordsError) throw recordsError;

        console.log('Fetched audit:', auditData);
        console.log('Fetched damage records:', records);

        setAudit(auditData);
        setEditedAudit(auditData);
        setDamageRecords(records || []);
      } catch (error) {
        console.error('Error fetching audit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [auditId]);

  const refreshDamageRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('damage_records')
        .select(`
          id,
          audit_id,
          damage_type,
          risk_level,
          location_details,
          photo_url,
          notes,
          recommendation,
          created_at,
          updated_at
        `)
        .eq('audit_id', auditId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      console.log('Refreshed damage records:', data);
      setDamageRecords(data || []);
      return data;
    } catch (error) {
      console.error('Error refreshing damage records:', error);
      return [];
    }
  };

  // Rest of the code remains the same...
  const handleAuditChange = (e) => {
    const { name, value } = e.target;
    setEditedAudit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAudit = async () => {
    try {
      const { error } = await supabase
        .from('audits')
        .update(editedAudit)
        .eq('id', auditId);

      if (error) throw error;
      
      setAudit(editedAudit);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating audit:', error);
      alert('Failed to save changes: ' + error.message);
    }
  };

  const handleAddDamageRecord = async (record) => {
    try {
      const { data, error } = await supabase
        .from('damage_records')
        .insert({
          ...record,
          audit_id: auditId
        })
        .select()
        .single();

      if (error) throw error;

      // Update risk counts
      const riskKey = `${record.risk_level.toLowerCase()}_risks`;
      const updatedAudit = {
        ...audit,
        [riskKey]: (audit[riskKey] || 0) + 1
      };

      const { error: updateError } = await supabase
        .from('audits')
        .update(updatedAudit)
        .eq('id', auditId);

      if (updateError) throw updateError;
      
      setAudit(updatedAudit);
      setEditedAudit(updatedAudit);
      await refreshDamageRecords();
    } catch (error) {
      console.error('Error adding damage record:', error);
      alert('Failed to add damage record: ' + error.message);
    }
  };

  const handleDeleteDamageRecord = async (recordId) => {
    try {
      const record = damageRecords.find(r => r.id === recordId);
      
      const { error } = await supabase
        .from('damage_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      // Update risk counts
      const riskKey = `${record.risk_level.toLowerCase()}_risks`;
      const updatedAudit = {
        ...audit,
        [riskKey]: Math.max(0, (audit[riskKey] || 0) - 1)
      };

      const { error: updateError } = await supabase
        .from('audits')
        .update(updatedAudit)
        .eq('id', auditId);

      if (updateError) throw updateError;
      
      setAudit(updatedAudit);
      setEditedAudit(updatedAudit);
      await refreshDamageRecords();
    } catch (error) {
      console.error('Error deleting damage record:', error);
      alert('Failed to delete damage record: ' + error.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    audit,
    damageRecords,
    loading,
    isEditing,
    editedAudit,
    setIsEditing,
    handleAuditChange,
    handleSaveAudit,
    handleAddDamageRecord,
    handleDeleteDamageRecord,
    handlePrint
  };
};
