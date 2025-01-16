import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase';

export const useAuditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditData, setAuditData] = useState({
    reference_number: '',
    auditor_name: '',
    site_name: '',
    company_name: '',
    audit_date: new Date().toISOString().split('T')[0],
    notes: '',
    red_risks: 0,
    amber_risks: 0,
    green_risks: 0,
  });
  const [damageRecords, setDamageRecords] = useState([]);

  useEffect(() => {
    const initializeReferenceNumber = async () => {
      try {
        const { data, error } = await supabase
          .from('audits')
          .select('reference_number')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        // Get current date components
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        
        // Generate new reference number
        const datePrefix = `RA${year}${month}${day}`;
        let sequence = '001';
        
        if (data && data.length > 0) {
          const lastRef = data[0].reference_number;
          if (lastRef.startsWith(datePrefix)) {
            // Increment sequence if we already have audits today
            const lastSeq = parseInt(lastRef.slice(-3));
            sequence = (lastSeq + 1).toString().padStart(3, '0');
          }
        }
        
        setAuditData(prev => ({
          ...prev,
          reference_number: `${datePrefix}${sequence}`
        }));
      } catch (error) {
        console.error('Error initializing reference number:', error);
      }
    };

    // Initialize form with scheduled audit data if available
    if (location.state?.audit) {
      const { audit } = location.state;
      setAuditData(prev => ({
        ...prev,
        auditor_name: audit.auditors.name,
        site_name: audit.customers.name,
        company_name: audit.customers.company,
        audit_date: audit.booking_date
      }));
    }

    // Initialize reference number when form loads
    initializeReferenceNumber();
  }, [location.state]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsSubmitting(true);

      // Calculate risk counts
      const riskCounts = damageRecords.reduce((acc, record) => {
        const key = `${record.risk_level.toLowerCase()}_risks`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, { red_risks: 0, amber_risks: 0, green_risks: 0 });

      // Create audit record
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .insert([{
          ...auditData,
          ...riskCounts,
          status: 'Submitted'
        }])
        .select()
        .single();

      if (auditError) throw auditError;

      // Create damage records
      if (damageRecords.length > 0) {
        const { error: damageError } = await supabase
          .from('damage_records')
          .insert(
            damageRecords.map(record => ({
              ...record,
              audit_id: audit.id
            }))
          );

        if (damageError) throw damageError;
      }

      // If this was a scheduled audit
      if (location.state?.audit) {
        const { audit: scheduledAudit } = location.state;
        
        // Calculate next audit due date (12 months from current audit date)
        const currentDate = new Date(auditData.audit_date);
        const nextAuditDue = new Date(currentDate);
        nextAuditDue.setFullYear(nextAuditDue.getFullYear() + 1);
        
        // Update customer's next audit due date
        const { error: customerError } = await supabase
          .from('customers')
          .update({ 
            next_audit_due: nextAuditDue.toISOString().split('T')[0]
          })
          .eq('id', scheduledAudit.customers.id);

        if (customerError) throw customerError;

        // Delete the scheduled audit
        await supabase
          .from('scheduled_audits')
          .delete()
          .eq('id', scheduledAudit.id);
      }

      navigate('/audits');
    } catch (error) {
      console.error('Error submitting audit:', error);
      alert('Error submitting audit: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuditChange = (e) => {
    const { name, value } = e.target;
    setAuditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDamage = (record) => {
    setDamageRecords(prev => [...prev, record]);
  };

  const handleRemoveDamage = (index) => {
    setDamageRecords(prev => prev.filter((_, i) => i !== index));
  };

  return {
    auditData,
    setAuditData,
    damageRecords,
    handleAuditChange,
    handleAddDamage,
    handleRemoveDamage,
    handleSubmit,
    isSubmitting
  };
};
