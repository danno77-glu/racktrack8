import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import DOMPurify from 'dompurify';
import html2pdf from 'html2pdf.js';
import './styles.css';

const PrintableAudit = ({ audit, damageRecords, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [processedContent, setProcessedContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('hidden', false)
          .order('name');

        if (error) throw error;
        
        if (data?.length) {
          setTemplates(data);
          setSelectedTemplate(data[0]); // Auto-select first template
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleDownload = async () => {
    if (!processedContent || !audit) return;

    const date = new Date(audit.audit_date);
    const formattedDate = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const filename = `${formattedDate}-${audit.company_name.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

    const element = document.createElement('div');
    element.innerHTML = processedContent;
    document.body.appendChild(element);

    // Process images before PDF generation
    const images = element.getElementsByTagName('img');
    for (let img of images) {
      img.style.maxWidth = '400px';
      img.style.maxHeight = '250px';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.style.margin = '10px auto';
      img.style.display = 'block';
    }

    const opt = {
      margin: [15, 15],
      filename: filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98,
        maxWidth: 400,
        maxHeight: 250
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const clonedImages = doc.getElementsByTagName('img');
          for (let img of clonedImages) {
            img.style.maxWidth = '400px';
            img.style.maxHeight = '250px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.style.objectFit = 'contain';
            img.style.margin = '10px auto';
            img.style.display = 'block';
          }
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: 'avoid-all' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      document.body.removeChild(element);
    }
  };

  // Process template when selected
  useEffect(() => {
    const processTemplate = async () => {
      if (!selectedTemplate || !audit) return;

      try {
        let content = selectedTemplate.content;

        // Replace basic audit fields
        const auditFields = {
          reference_number: audit.reference_number,
          audit_date: new Date(audit.audit_date).toLocaleDateString(),
          auditor_name: audit.auditor_name,
          site_name: audit.site_name,
          company_name: audit.company_name,
          red_risks: audit.red_risks || 0,
          amber_risks: audit.amber_risks || 0,
          green_risks: audit.green_risks || 0,
          notes: audit.notes || ''
        };

        // Replace audit fields
        Object.entries(auditFields).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          content = content.replace(regex, value);
        });

        // Process damage records
        if (content.includes('{{#each damage_records}}')) {
          let damageContent = '';
          damageRecords.forEach((record) => {
            let recordTemplate = content.match(/{{#each damage_records}}([\s\S]*?){{\/each}}/)[1];
            
            // Replace record fields
            const recordFields = {
              damage_type: record.damage_type,
              risk_level: record.risk_level,
              location_details: record.location_details,
              recommendation: record.recommendation,
              notes: record.notes || '',
              photo_url: record.photo_url || ''
            };

            Object.entries(recordFields).forEach(([key, value]) => {
              const regex = new RegExp(`{{${key}}}`, 'g');
              recordTemplate = recordTemplate.replace(regex, value);
            });

            // Process photo conditional
            if (record.photo_url) {
              recordTemplate = recordTemplate.replace(
                /{{#if photo_url}}([\s\S]*?){{\/if}}/g,
                '$1'
              );
            } else {
              recordTemplate = recordTemplate.replace(
                /{{#if photo_url}}[\s\S]*?{{\/if}}/g,
                ''
              );
            }

            damageContent += recordTemplate;
          });

          content = content.replace(
            /{{#each damage_records}}[\s\S]*?{{\/each}}/,
            damageContent
          );
        }

        // Clean up any remaining template tags
        content = content.replace(/{{#if\s+.*?}}.*?{{\/if}}/gs, '');
        content = content.replace(/{{.*?}}/g, '');

        // Sanitize content
        const sanitizedContent = DOMPurify.sanitize(content);
        setProcessedContent(sanitizedContent);
      } catch (error) {
        console.error('Error processing template:', error);
        setProcessedContent('<div class="error">Error processing template</div>');
      }
    };

    processTemplate();
  }, [selectedTemplate, audit, damageRecords]);

  if (loading) {
    return <div className="loading">Loading templates...</div>;
  }

  return (
    <div className="print-preview">
      <div className="preview-header no-print">
        <div className="preview-controls">
          <h2>Print Preview</h2>
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
        </div>
        <div className="preview-actions">
          <button 
            onClick={handleDownload} 
            className="print-btn"
            disabled={!processedContent}
          >
            Download PDF
          </button>
          <button onClick={onClose} className="close-btn">
            Close Preview
          </button>
        </div>
      </div>

      <div className="preview-container">
        {processedContent ? (
          <div 
            className="printable-content"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        ) : (
          <div className="no-preview">
            {templates.length ? 
              'Processing template...' : 
              'No templates available. Please create a template first.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintableAudit;
