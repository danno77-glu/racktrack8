import React, { useState, useEffect, useCallback } from 'react';
    import './styles.css';
    import CustomerForm from './CustomerForm';
    import BookAuditModal from './BookAuditModal';
    import { supabase } from '../../supabase';

    const CustomerList = () => {
      const [showForm, setShowForm] = useState(false);
      const [customers, setCustomers] = useState([]);
      const [editingCustomer, setEditingCustomer] = useState(null);
      const [showBookingModal, setShowBookingModal] = useState(null);
      const [scheduledAudits, setScheduledAudits] = useState([]);
      const [loading, setLoading] = useState(true);

      const fetchCustomers = useCallback(async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name');

          if (error) throw error;
          setCustomers(data || []);
        } catch (error) {
          console.error('Error fetching customers:', error);
        } finally {
          setLoading(false);
        }
      }, []);

      const fetchScheduledAudits = useCallback(async () => {
        try {
          const { data, error } = await supabase
            .from('scheduled_audits')
            .select('*');

          if (error) throw error;
          setScheduledAudits(data || []);
        } catch (error) {
          console.error('Error fetching scheduled audits:', error);
        }
      }, []);

      useEffect(() => {
        fetchCustomers();
        fetchScheduledAudits();
      }, [fetchCustomers, fetchScheduledAudits]);

      const handleAddCustomerClick = () => {
        setShowForm(true);
        setEditingCustomer(null);
      };

      const handleFormClose = () => {
        setShowForm(false);
        setEditingCustomer(null);
      };

      const handleAddCustomer = async (newCustomer) => {
        try {
          const { data, error } = await supabase
            .from('customers')
            .insert(newCustomer)
            .select()
            .single();

          if (error) throw error;
          setCustomers(prev => [...prev, data]);
          setShowForm(false);
        } catch (error) {
          console.error('Error adding customer:', error);
        }
      };

      const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
      };

      const handleUpdateCustomer = async (updatedCustomer) => {
        try {
          const { data, error } = await supabase
            .from('customers')
            .update(updatedCustomer)
            .eq('id', editingCustomer.id)
            .select()
            .single();

          if (error) throw error;
          setCustomers(prev =>
            prev.map(customer =>
              customer.id === editingCustomer.id ? data : customer
            )
          );
          setShowForm(false);
          setEditingCustomer(null);
        } catch (error) {
          console.error('Error updating customer:', error);
        }
      };

      const handleBookAudit = (customer) => {
        setShowBookingModal(customer);
      };

      const handleBookingClose = () => {
        setShowBookingModal(null);
      };

      const handleBookingSubmit = async (booking) => {
        try {
          console.log('Submitting booking:', booking);
          // Convert the selected date to UTC before sending
          const selectedDate = new Date(booking.bookingDate);
          const utcDate = new Date(
            Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate())
          );
          const formattedDate = utcDate.toISOString().slice(0, 10);

          const { data, error } = await supabase
            .from('scheduled_audits')
            .insert({
              customer_id: booking.customer.id,
              booking_date: formattedDate,
              auditor_id: booking.auditor
            })
            .select()
            .single();

          if (error) throw error;

          console.log('Booking created:', data);
          // Update local state to trigger re-render
          setScheduledAudits(prev => [...prev, data]);
          setShowBookingModal(null);
          // Fetch scheduled audits again to update the calendar (in ScheduledAudits component)
          // Consider using a shared state or context to avoid prop drilling
          fetchScheduledAudits();
        } catch (error) {
          console.error('Error booking audit:', error);
        }
      };

      if (loading) {
        return <div className="loading">Loading customers...</div>;
      }

      return (
        <div className="customer-list">
          <div className="list-header">
            <h1>Customer List</h1>
            <button className="add-customer-btn" onClick={handleAddCustomerClick}>Add Customer</button>
          </div>
          {showForm && (
            <CustomerForm
              onClose={handleFormClose}
              onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
              initialData={editingCustomer}
            />
          )}
          {showBookingModal && (
            <BookAuditModal
              customer={showBookingModal}
              onClose={handleBookingClose}
              onSubmit={handleBookingSubmit}
            />
          )}
          
          <div className="customer-table">
            {customers.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Next Audit Due</th>
                    <th>Default Auditor</th>
                    <th>Active</th>
                    <th>Auto Marketing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index}>
                      <td>{customer.name}</td>
                      <td>{customer.company}</td>
                      <td>{customer.email}</td>
                      <td>{customer.address}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.next_audit_due}</td>
                      <td>{customer.default_auditor}</td>
                      <td>{customer.is_active ? 'Yes' : 'No'}</td>
                      <td>{customer.auto_marketing ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className="edit-customer-btn"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          Edit
                        </button>
                        <button
                          className="book-audit-btn"
                          onClick={() => handleBookAudit(customer)}
                        >
                          Book Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No customers added yet.</p>
            )}
          </div>
        </div>
      );
    };

    export default CustomerList;
