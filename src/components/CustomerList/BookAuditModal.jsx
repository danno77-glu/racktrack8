import React, { useState, useEffect } from 'react';
    import './styles.css';
    import { supabase } from '../../supabase';

    const BookAuditModal = ({ customer, onClose, onSubmit }) => {
      const [bookingDate, setBookingDate] = useState('');
      const [auditors, setAuditors] = useState([]);
      const [selectedAuditor, setSelectedAuditor] = useState('');
      const [loading, setLoading] = useState(true);

      useEffect(() => {
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

        fetchAuditors();
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting booking with:', { customer, bookingDate, auditor: selectedAuditor });
        onSubmit({ customer, bookingDate, auditor: selectedAuditor });
        onClose();
      };

      if (loading) {
        return <div className="loading">Loading auditors...</div>;
      }

      return (
        <div className="book-audit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Book Audit for {customer.name}</h2>
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Auditor</label>
                <select
                  name="selectedAuditor"
                  value={selectedAuditor}
                  onChange={(e) => setSelectedAuditor(e.target.value)}
                  required
                >
                  <option value="">Select Auditor</option>
                  {auditors.map(auditor => (
                    <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-btn">Book Audit</button>
            </form>
          </div>
        </div>
      );
    };

    export default BookAuditModal;
