import { useState } from 'react';
import { supabase } from '../../../supabase';

export const useTemplateVisibility = (onUpdate) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleVisibility = async (template) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('templates')
        .update({ 
          hidden: !template.hidden,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);

      if (error) throw error;
      
      onUpdate(template.id, { 
        hidden: !template.hidden,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error toggling template visibility:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { toggleVisibility, isUpdating };
};
