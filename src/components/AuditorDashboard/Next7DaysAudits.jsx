import React, { useState, useEffect } from 'react';
    import { supabase } from '../../supabase';
    import { useNavigate } from 'react-router-dom';

    const Next7DaysAudits = () => {
      const [audits, setAudits] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchNext7DaysAudits = async () => {
          try {
            setLoading(true);

            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            const { data, error } = await supabase
              .from('scheduled_audits')
              .select(`
                id,
                booking_date,
                customers!customer_id (id, name, company, email, address, phone, next_audit_due, default_auditor, is_active, auto_marketing),
                auditors!auditor_id (name)
              `)
              .gte('booking_date', today.toISOString().split('T')[0])
              .lte('booking_date', nextWeek.toISOString().split('T')[0])
              .order('booking_date', { ascending: true });

            if (error) throw error;

            // Filter out audits that have been completed
            const filteredAudits = data.filter(audit => {
              const auditDate = new Date(audit.booking_date);
              const todayStart = new Date(today);
              todayStart.setHours(0, 0, 0, 0);
              return auditDate >= todayStart;
            });

            setAudits(filteredAudits || []);
          } catch (error) {
            console.error('Error fetching next 7 days audits:', error);
            setError('Failed to fetch upcoming audits.');
          } finally {
            setLoading(false);
          }
        };

        fetchNext7DaysAudits();
      }, []);

      const handleStartAudit = (audit) => {
        navigate('/', { state: { audit } });
      };

      if (loading) {
        return <div className="loading">Loading upcoming audits...</div>;
      }

      if (error) {
        return <div className="error">{error}</div>;
      }

      return (
        <div className="next-7-days-audits">
          <h2>Upcoming Audits (Next 7 Days)</h2>
          {audits.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Company</th>
                  <th>Auditor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map(audit => (
                  <tr key={audit.id}>
                    <td>{new Date(audit.booking_date).toLocaleDateString()}</td>
                    <td>{audit.customers.name}</td>
                    <td>{audit.customers.company}</td>
                    <td>{audit.auditors.name}</td>
                    <td>
                      <button onClick={() => handleStartAudit(audit)}>
                        Start Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No upcoming audits in the next 7 days.</p>
          )}
        </div>
      );
    };

    export default Next7DaysAudits;
