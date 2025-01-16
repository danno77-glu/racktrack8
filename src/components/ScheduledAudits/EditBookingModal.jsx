import React, { useState, useEffect } from 'react';
import './styles.css';
import { formatDate } from '../../utils/dateFormatting';

const EditBookingModal = ({ booking, onClose, onSubmit, onDelete, auditors }) => {
  const [formData, setFormData] = useState({
    bookingDate: '',
    selectedAuditor: ''
  });

  useEffect(() => {
    if (booking) {
      console.log('EditBookingModal - Booking received:', booking);
      setFormData({
        bookingDate: booking.booking_date,
        selectedAuditor: booking.auditor_id
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert the selected date to UTC before sending
    const selectedDate = new Date(formData.bookingDate);
    const utcDate = new Date(
      Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate())
    );
    const formattedDate = utcDate.toISOString().slice(0, 10);

    console.log('EditBookingModal - Submitting booking:', { ...booking, booking_date: formattedDate, auditor_id: formData.selectedAuditor });
    onSubmit({ ...booking, booking_date: formattedDate, auditor_id: formData.selectedAuditor });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      console.log('EditBookingModal - Deleting booking:', booking.id);
      onDelete(booking.id);
    }
  };

  return (
    <div className="edit-booking-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Booking</h2>
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
              value={formData.bookingDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Auditor</label>
            <select
              name="selectedAuditor"
              value={formData.selectedAuditor}
              onChange={handleChange}
              required
            >
              <option value="">Select Auditor</option>
              {auditors.map(auditor => (
                <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn">Update Booking</button>
            <button type="button" onClick={handleDelete} className="delete-btn">Delete Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;
