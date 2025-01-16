import React, { useState, useEffect } from 'react';
    import './styles.css';
    import { supabase } from '../../supabase';
    import { processTemplate } from '../../utils/templateProcessor';
    import { generatePDF } from '../QuoteTemplates/utils/pdfGenerator';

    const RepairQuoteModal = ({ audit, damageRecords, onClose }) => {
      const [processedContent, setProcessedContent] = useState('');
      const [loading, setLoading] = useState(true);
      const [templates, setTemplates] = useState([]);
      const [selectedTemplate, setSelectedTemplate] = useState(null);
      const [damagePrices, setDamagePrices] = useState({});
      const [localPrices, setLocalPrices] = useState({});

      useEffect(() => {
        const fetchTemplates = async () => {
          try {
            const { data, error } = await supabase
              .from('templates')
              .select('*')
              .eq('hidden', false)
              .order('name');

            if (error) throw error;
            setTemplates(data || []);
            if (data && data.length > 0) {
              setSelectedTemplate(data[0]);
            }
          } catch (error) {
            console.error('Error fetching templates:', error);
          }
        };

        const fetchDamagePrices = async () => {
          try {
            const { data, error } = await supabase
              .from('settings')
              .select('value')
              .eq('key', 'damagePrices')
              .single();

            if (error) throw error;
            setDamagePrices(data?.value || {});
            setLocalPrices(data?.value || {});
          } catch (error) {
            console.error('Error fetching damage prices:', error);
          }
        };

        fetchTemplates();
        fetchDamagePrices();
      }, []);

      useEffect(() => {
        const generateQuote = async () => {
          setLoading(true);
          try {
            if (!selectedTemplate) {
              setProcessedContent('<div class="no-preview">Select a template to preview the quote.</div>');
              return;
            }

            let content = await processTemplate(selectedTemplate, audit, damageRecords, localPrices);
            setProcessedContent(content);
          } catch (error) {
            console.error('Error generating repair quote:', error);
            setProcessedContent('<div class="error">Error generating repair quote.</div>');
          } finally {
            setLoading(false);
          }
        };

        generateQuote();
      }, [audit, damageRecords, selectedTemplate, localPrices]);

      const handleLocalPriceChange = (e, damageType) => {
        const newPrice = e.target.value;
        setLocalPrices(prevPrices => ({
          ...prevPrices,
          [damageType]: newPrice
        }));
      };

      const handleDownload = async () => {
        if (!processedContent || !audit) return;
        try {
          await generatePDF({
            content: processedContent,
            filename: `repair-quote-${audit.reference_number}.pdf`
          });
        } catch (error) {
          console.error('Error downloading PDF:', error);
        }
      };

      if (loading) {
        return <div className="loading">Generating repair quote...</div>;
      }

      return (
        <div className="repair-quote-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Repair Quote</h2>
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="template-selector">
                <label>Select Template:</label>
                <select
                  value={selectedTemplate?.id || ''}
                  onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value))}
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              {processedContent ? (
                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
              ) : (
                <div className="no-preview">No repair quote available.</div>
              )}
              {Object.keys(localPrices).length > 0 && (
                <div className="price-adjustments">
                  <h3>Adjust Prices</h3>
                  <div className="price-grid">
                    {damageRecords.map((record) => (
                      <div key={record.id} className="price-item">
                        <label>{record.damage_type}</label>
                        <input
                          type="number"
                          value={localPrices[record.damage_type] || 0}
                          onChange={(e) => handleLocalPriceChange(e, record.damage_type)}
                          className="price-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={handleDownload} className="print-btn" disabled={!processedContent}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      );
    };

    export default RepairQuoteModal;
