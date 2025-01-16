import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useSettings } from '../../contexts/SettingsContext';

export const useQuoteForm = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    reference_number: '',
    consultant_name: '',
    customer_name: '',
    company_name: '',
    email: '',
    floor_size: '',
    floor_finish_height: '',
    floor_capacity: '',
    decking_type: '',
    steel_finish: '',
    staircase: '',
    handrail_type: 'No Handrail',
    handrail_length: '',
    access_gate: 'No Gate',
    supply_type: '',
    total_price: ''
  });

  useEffect(() => {
    const initializeReferenceNumber = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('reference_number')
          .order('reference_number', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        const lastReference = data.length ? parseInt(data[0].reference_number) : 410000;
        setFormData(prev => ({
          ...prev,
          reference_number: (lastReference + 1).toString()
        }));
      } catch (error) {
        console.error('Error initializing reference number:', error);
      }
    };

    initializeReferenceNumber();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      access_gate_type: name === 'access_gate' ? value : prev.access_gate_type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('quotes')
        .insert({
          ...formData,
          total_price: parseFloat(formData.total_price),
          handrail: formData.handrail_type !== 'No Handrail' && formData.handrail_length
            ? `${formData.handrail_length}m of ${formData.handrail_type}`
            : formData.handrail_type,
          access_gate_type: formData.access_gate !== 'No Gate' ? formData.access_gate : 'No Gate'
        });

      if (error) throw error;
      
      alert('Quote submitted successfully!');
      
      // Reset form with new reference number
      setFormData(prev => ({
        ...prev,
        reference_number: (parseInt(prev.reference_number) + 1).toString(),
        consultant_name: '',
        customer_name: '',
        company_name: '',
        email: '',
        floor_size: '',
        floor_finish_height: '',
        floor_capacity: '',
        decking_type: '',
        steel_finish: '',
        staircase: '',
        handrail_type: 'No Handrail',
        handrail_length: '',
        access_gate: 'No Gate',
        access_gate_type: 'No Gate',
        supply_type: '',
        total_price: ''
      }));
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote: ' + error.message);
    }
  };

  return { formData, handleChange, handleSubmit };
};
