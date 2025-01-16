export const professionalRepairQuote = {
      name: "Professional Repair Quote",
      content: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .repair-quote { max-width: 800px; margin: 40px auto; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total-price { margin-top: 20px; text-align: right; font-size: 1.2em; }
        </style>
      </head>
      <body>
        <div class="repair-quote">
          <h1>Repair Quote</h1>
          <p><strong>Reference:</strong> {{referenceNumber}}</p>
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Site:</strong> {{site_name}}</p>
          <p><strong>Company:</strong> {{company_name}}</p>
          <h2>Damage Records</h2>
          <table>
            <thead>
              <tr>
                <th>Damage Type</th>
                <th>Location</th>
                <th>Recommendation</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {{#each damage_records}}
                <tr>
                  <td>{{damage_type}}</td>
                  <td>{{location_details}}</td>
                  <td>{{recommendation}}</td>
                  <td>${{price}}</td>
                </tr>
              {{/each}}
            </tbody>
          </table>
          <div class="total-price">
            <strong>Total Price:</strong> {{totalPrice}}
          </div>
        </div>
      </body>
      </html>
      `
    };
