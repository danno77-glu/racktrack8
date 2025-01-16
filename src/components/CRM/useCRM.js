import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export const useCRM = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const quotesData = data.map(quote => ({
          ...quote,
          status: quote.status || 'New'
        }));
        
        setQuotes(quotesData);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus })
        .eq('id', quoteId);

      if (error) throw error;

      setQuotes(prev =>
        prev.map(quote =>
          quote.id === quoteId ? { ...quote, status: newStatus } : quote
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return { quotes, loading, handleStatusChange };
};
