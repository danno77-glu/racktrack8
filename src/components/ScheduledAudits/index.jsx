import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './styles.css';
import { supabase } from '../../supabase';
import EditBookingModal from './EditBookingModal';

const DroppableDay = React.memo(({ 
  day = 1, 
  auditsForDay = [], 
  onEventClick = () => {} 
}) => (
  <Droppable droppableId={`day-${day}`} type="AUDIT">
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="calendar-day"
      >
        <span className="day-number">{day}</span>
        {auditsForDay.length > 0 ? (
          auditsForDay.map((audit, index) => (
            <Draggable 
              key={audit.id} 
              draggableId={String(audit.id)} 
              index={index}
            >
              {(provided) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className="audit-event"
                  style={{ 
                    backgroundColor: audit.auditors?.color || '#d3d3d3',
                    ...provided.draggableProps.style 
                  }}
                  onClick={() => onEventClick(audit)}
                >
                  {audit.customers.name} - {audit.customers.company}
                </div>
              )}
            </Draggable>
          ))
        ) : (
          <div className="audit-event no-audit">No Audits</div>
        )}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
));

const ScheduledAudits = () => {
  const [scheduledAudits, setScheduledAudits] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [auditors, setAuditors] = useState([]);
  const [error, setError] = useState(null);

  const fetchAuditors = useCallback(async () => {
    try {
      const { data, error: auditorsError } = await supabase
        .from('auditors')
        .select('*')
        .order('name');

      if (auditorsError) throw auditorsError;
      setAuditors(data || []);
    } catch (err) {
      console.error('Error fetching auditors:', err);
      setError('Failed to fetch auditors.');
    }
  }, []);

  const fetchScheduledAudits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: auditsError } = await supabase
        .from('scheduled_audits')
        .select(`
          *,
          customers!customer_id (name, company),
          auditors!auditor_id (name, color)
        `)
        .order('booking_date');

      if (auditsError) throw auditsError;
      setScheduledAudits(data || []);
    } catch (err) {
      console.error('Error fetching scheduled audits:', err);
      setError('Failed to fetch scheduled audits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditors();
    fetchScheduledAudits();
  }, [fetchAuditors, fetchScheduledAudits]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (year, month, day) => {
    const yyyy = year.toString();
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleBookingUpdate = async (updatedBooking) => {
    try {
      const { error: updateError } = await supabase
        .from('scheduled_audits')
        .update({
          booking_date: updatedBooking.booking_date,
          auditor_id: updatedBooking.auditor_id
        })
        .eq('id', updatedBooking.id);

      if (updateError) throw updateError;

      setScheduledAudits(prevAudits =>
        prevAudits.map(audit =>
          audit.id === updatedBooking.id ? { ...audit, booking_date: updatedBooking.booking_date, auditor_id: updatedBooking.auditor_id } : audit
        )
      );

      setEditingBooking(null);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking.');
    }
  };

  const handleBookingDelete = async (bookingId) => {
    try {
      const { error: deleteError } = await supabase
        .from('scheduled_audits')
        .delete()
        .eq('id', bookingId);

      if (deleteError) throw deleteError;

      setScheduledAudits(prevAudits => prevAudits.filter(audit => audit.id !== bookingId));
      setEditingBooking(null);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking.');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedAudit = scheduledAudits.find(audit => audit.id === draggableId);
    if (!draggedAudit) return;

    const newDay = parseInt(destination.droppableId.split('-')[1]);
    const formattedNewDate = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), newDay);

    try {
      const { error: updateError } = await supabase
        .from('scheduled_audits')
        .update({ booking_date: formattedNewDate })
        .eq('id', draggedAudit.id);

      if (updateError) throw updateError;

      setScheduledAudits(prevAudits => {
        const updatedAudits = prevAudits.map(audit =>
          audit.id === draggedAudit.id ? { ...audit, booking_date: formattedNewDate } : audit
        );
        return updatedAudits;
      });
    } catch (err) {
      console.error('Error updating audit date:', err);
      setError('Failed to update audit date.');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDate = formatDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const auditsForDay = scheduledAudits.filter(audit => audit.booking_date === formattedDate);

      days.push(
        <DroppableDay
          key={day}
          day={day}
          auditsForDay={auditsForDay}
          onEventClick={setEditingBooking}
        />
      );
    }

    return days;
  };

  if (loading) {
    return <div className="loading">Loading scheduled audits...</div>;
  }

  return (
    <div className="scheduled-audits">
      <h1>Scheduled Audits</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar">
          {renderCalendar()}
        </div>
      </DragDropContext>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSubmit={handleBookingUpdate}
          onDelete={handleBookingDelete}
          auditors={auditors}
        />
      )}
    </div>
  );
};

export default ScheduledAudits;
