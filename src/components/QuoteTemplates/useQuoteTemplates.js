import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { generatePDF } from './utils/pdfGenerator';
import { processTemplate } from './utils/templateProcessor';
import { useSettings } from '../../contexts/SettingsContext';

export const useQuoteTemplates = (quote) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('hidden', false);

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    setSelectedTemplate(templates.find(t => t.id === selectedTemplateId));
  }, [selectedTemplateId, templates]);

  const handlePrint = async () => {
    if (!selectedTemplate || !quote || !settings) return;

    try {
      const content = await processTemplate(selectedTemplate, quote, settings);
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .quote-preview { max-width: 800px; margin: 40px auto; }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Error printing template:', error);
    }
  };

  const handleDownload = async () => {
    if (!selectedTemplate || !quote || !settings) return;

    try {
      const content = await processTemplate(selectedTemplate, quote, settings);
      await generatePDF({
        content,
        filename: `quote-${quote.reference_number}.pdf`
      });
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  return {
    templates,
    selectedTemplateId,
    selectedTemplate,
    setSelectedTemplateId,
    handlePrint,
    handleDownload
  };
};
