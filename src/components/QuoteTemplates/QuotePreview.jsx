import React, { useState, useEffect } from 'react';
    import { useSettings } from '../../contexts/SettingsContext';
    import { processTemplate } from './utils/templateProcessor';
    import './styles.css';

    const QuotePreview = ({ template, quote }) => {
      const { settings, loading } = useSettings();
      const [processedContent, setProcessedContent] = useState('');
      const [localPrices, setLocalPrices] = useState({});
      const [error, setError] = useState(null);

      useEffect(() => {
        if (settings?.damagePrices) {
          setLocalPrices(settings.damagePrices);
        }
      }, [settings]);

      useEffect(() => {
        const processContent = async () => {
          if (!template || !quote || !settings) return;
          
          try {
            const content = await processTemplate(template, quote, [], localPrices);
            setProcessedContent(content);
            setError(null);
          } catch (err) {
            console.error('Error processing template:', err);
            setError('Error processing template');
          }
        };

        processContent();
      }, [template, quote, settings, localPrices]);

      const handlePriceChange = (e, damageType) => {
        const newPrice = e.target.value;
        setLocalPrices(prevPrices => ({
          ...prevPrices,
          [damageType]: newPrice
        }));
      };

      if (loading) {
        return (
          <div className="quote-preview loading">
            Loading template...
          </div>
        );
      }

      if (error) {
        return (
          <div className="quote-preview error">
            {error}
          </div>
        );
      }

      if (!processedContent) {
        return (
          <div className="quote-preview empty">
            Select a template to preview the quote
          </div>
        );
      }

      return (
        <div className="quote-preview">
          <div 
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: processedContent }} 
          />
          {Object.keys(localPrices).length > 0 && (
            <div className="price-adjustments">
              <h3>Adjust Prices</h3>
              <div className="price-grid">
                {Object.entries(localPrices).map(([damageType, price]) => (
                  <div key={damageType} className="price-item">
                    <label>{damageType}</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => handlePriceChange(e, damageType)}
                      className="price-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    export default QuotePreview;
