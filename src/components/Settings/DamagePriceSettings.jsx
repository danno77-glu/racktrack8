import React from 'react';
    import './styles.css';

    const DamagePriceSettings = ({ damagePrices, onUpdate }) => {
      const handlePriceChange = (e, damageType) => {
        const newPrice = e.target.value;
        onUpdate(prevPrices => ({
          ...prevPrices,
          [damageType]: newPrice
        }));
      };

      return (
        <div className="settings-group">
          <h2>Damage Prices</h2>
          <div className="damage-prices-grid">
            {damagePrices && Object.entries(damagePrices).map(([damageType, price]) => (
              <div key={damageType} className="damage-price-item">
                <label>{damageType}</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => handlePriceChange(e, damageType)}
                  className="setting-input"
                  min="0"
                />
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default DamagePriceSettings;
