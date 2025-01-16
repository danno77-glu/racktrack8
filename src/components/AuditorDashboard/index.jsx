import React, { useState, useEffect } from 'react';
    import { supabase } from '../../supabase';
    import './styles.css';
    import Next7DaysAudits from './Next7DaysAudits';
    import PastBookedAudits from './PastBookedAudits';

    const AuditorDashboard = () => {
      const [auditors, setAuditors] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [pastBookedAudits, setPastBookedAudits] = useState([]);

      useEffect(() => {
        const fetchAuditorStats = async () => {
          try {
            setLoading(true);

            const { data, error } = await supabase.rpc('get_auditor_stats').select('*');

            if (error) throw error;

            const sortedData = data.sort((a, b) => b.completed_audits - a.completed_audits);
            setAuditors(sortedData);
          } catch (error) {
            console.error('Error fetching auditor stats:', error);
            setError('Failed to fetch auditor stats.');
          } finally {
            setLoading(false);
          }
        };

        const fetchPastBookedAudits = async () => {
          try {
            const today = new Date();

            const { data, error } = await supabase
              .from('scheduled_audits')
              .select(`
                id,
                booking_date,
                customers!customer_id (id, name, company, email, address, phone, next_audit_due, default_auditor, is_active, auto_marketing),
                auditors!auditor_id (name)
              `)
              .lt('booking_date', today.toISOString().split('T')[0])
              .order('booking_date', { ascending: true });

            if (error) throw error;

            // Filter out audits that have been completed
            const filteredAudits = await Promise.all(
              data.map(async (audit) => {
                const { data: completedAudit, error: completedError } = await supabase
                  .from('audits')
                  .select('id')
                  .eq('site_name', audit.customers.name)
                  .eq('company_name', audit.customers.company)
                  .eq('audit_date', audit.booking_date)
                  .single();

                if (completedError) {
                  console.error('Error checking for completed audit:', completedError);
                  return audit; // Return the audit if there's an error
                }

                return completedAudit ? null : audit; // Return null if completed
              })
            );

            setPastBookedAudits(filteredAudits.filter(audit => audit));
          } catch (error) {
            console.error('Error fetching past booked audits:', error);
            setError('Failed to fetch past booked audits.');
          }
        };

        fetchAuditorStats();
        fetchPastBookedAudits();
      }, []);

      if (loading) {
        return <div className="loading">Loading dashboard...</div>;
      }

      if (error) {
        return <div className="error">{error}</div>;
      }

      return (
        <div className="auditor-dashboard">
          <h1>Auditor Dashboard</h1>

          <div className="scoreboard">
            <h2>Scoreboard</h2>
            <table>
              <thead>
                <tr>
                  <th>Auditor</th>
                  <th>Completed</th>
                  <th>Booked</th>
                  <th>Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {auditors.map(auditor => (
                  <tr key={auditor.auditor_id}>
                    <td>{auditor.auditor_name}</td>
                    <td>{auditor.completed_audits}</td>
                    <td>{auditor.booked_audits}</td>
                    <td>{pastBookedAudits.filter(audit => audit?.auditors?.name === auditor.auditor_name).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Next7DaysAudits />
          <PastBookedAudits audits={pastBookedAudits} />
        </div>
      );
    };

    export default AuditorDashboard;
