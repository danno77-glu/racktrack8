import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { sampleTemplate } from './sampleTemplate';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        if (!data?.length) {
          // Initialize with sample template if no templates exist
          const { data: newTemplate, error: insertError } = await supabase
            .from('templates')
            .insert({
              ...sampleTemplate,
              hidden: false,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setTemplates([newTemplate]);
        } else {
          setTemplates(data);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const saveTemplate = async (template) => {
    try {
      const templateData = {
        name: template.name,
        content: template.content,
        hidden: template.hidden || false,
        updated_at: new Date().toISOString()
      };

      if (template.id) {
        const { error } = await supabase
          .from('templates')
          .update(templateData)
          .eq('id', template.id)
          .select()
          .single();

        if (error) throw error;
        
        setTemplates(prev => prev.map(t => 
          t.id === template.id ? { ...t, ...templateData } : t
        ));
        setSelectedTemplate(prev => ({ ...prev, ...templateData }));
      } else {
        const { data, error } = await supabase
          .from('templates')
          .insert(templateData)
          .select()
          .single();

        if (error) throw error;
        setTemplates(prev => [...prev, data]);
        setSelectedTemplate(data);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  };

  const copyTemplate = async (template) => {
    try {
      const copyData = {
        name: `${template.name} (Copy)`,
        content: template.content,
        hidden: false,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('templates')
        .insert(copyData)
        .select()
        .single();

      if (error) throw error;
      setTemplates(prev => [...prev, data]);
      setSelectedTemplate(data);
    } catch (error) {
      console.error('Error copying template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (templateId) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    saveTemplate,
    copyTemplate,
    deleteTemplate,
    loading
  };
};
