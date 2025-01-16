import React, { useState, useEffect } from 'react';
    import './styles.css';
    import { supabase } from '../../supabase';

    const CustomerForm = ({ onClose, onSubmit, initialData }) => {
      const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        address: '',
        phone: '',
        next_audit_due: '',
        default_auditor: '',
        is_active: false,
        auto_marketing: false
      });
      const [loading, setLoading] = useState(false);
      const [auditors, setAuditors] = useState([]);

      useEffect(() => {
        if (initialData) {
          setFormData(prev => ({
            ...prev,
            ...initialData,
            is_active: initialData.is_active || false,
            auto_marketing: initialData.auto_marketing || false
          }));
        }
      }, [initialData]);

      useEffect(() => {
        const fetchAuditors = async () => {
          try {
            const { data, error } = await supabase
              .from('auditors')
              .select('*')
              .order('name');

            if (error) throw error;
            setAuditors(data || []);
          } catch (error) {
            console.error('Error fetching auditors:', error);
          }
        };

        fetchAuditors();
      }, []);

      const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          // Generate a unique ID for new customers
          const customerId = initialData?.id || crypto.randomUUID();
          await onSubmit({ ...formData, id: customerId });
          onClose();
        } catch (error) {
          console.error('Error submitting customer:', error);
          alert('Failed to submit customer: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="customer-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{initialData ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Next Audit Due</label>
                <input
                  type="date"
                  name="next_audit_due"
                  value={formData.next_audit_due}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Default Auditor</label>
                <select
                  name="default_auditor"
                  value={formData.default_auditor}
                  onChange={handleChange}
                >
                  <option value="">Select Auditor</option>
                  {auditors.map(auditor => (
                    <option key={auditor.id} value={auditor.name}>{auditor.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Active Customer</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Auto Marketing</label>
                <input
                  type="checkbox"
                  name="auto_marketing"
                  checked={formData.auto_marketing}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : initialData ? 'Update Customer' : 'Add Customer'}
              </button>
            </form>
          </div>
        </div>
      );
    };

    export default CustomerForm;
