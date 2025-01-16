import { quoteStyles } from './styles/quoteStyles';

export const newTemplate = {
  name: "Professional Mezzanine Quote",
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${quoteStyles}</style>
</head>
<body>
  <div class="header">
    <h1>Mezzanine Floor Quotation</h1>
    <div class="meta">
      <p><strong>Quote Reference:</strong> {{referenceNumber}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Sales Consultant:</strong> {{consultantName}}</p>
    </div>
  </div>

  <div class="section">
    <h2>Project Specifications</h2>
    <table>
      <tr>
        <th>Floor Size</th>
        <td>{{floorSize}} m²</td>
      </tr>
      <tr>
        <th>Floor Finish Height</th>
        <td>{{floorFinishHeight}} mm</td>
      </tr>
      <tr>
        <th>Floor Capacity</th>
        <td>{{floorCapacity}} KPA</td>
      </tr>
      <tr>
        <th>Decking Type</th>
        <td>{{deckingType}}</td>
      </tr>
      <tr>
        <th>Staircase</th>
        <td>{{staircase}}</td>
      </tr>
      <tr>
        <th>Handrail</th>
        <td>{{handrail}}</td>
      </tr>
      <tr>
        <th>Access Gate</th>
        <td>{{accessGate}}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>Pricing Details</h2>
    <table>
      <tr>
        <th>Supply Type</th>
        <td>{{supplyType}}</td>
      </tr>
      <tr>
        <th>Total Price (excl. GST)</th>
        <td>{{totalPrice}}</td>
      </tr>
    </table>
  </div>

  <div class="terms">
    <h2>Terms and Conditions</h2>
    <ol>
      <li>This quotation is valid for 30 days from the date of issue.</li>
      <li>All prices are in Australian Dollars (AUD) and exclude GST unless otherwise stated.</li>
      <li>Payment terms: 50% deposit upon order confirmation, remaining 50% upon completion.</li>
      <li>Delivery timeframe will be confirmed upon order placement.</li>
      <li>Installation schedule to be coordinated with client's site requirements.</li>
      <li>Any variations to the specified requirements may result in price adjustments.</li>
    </ol>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line">
        <div class="signature-title">Client Signature</div>
        <div class="signature-date">Date: _________________</div>
      </div>
    </div>
    <div class="signature-block">
      <div class="signature-line">
        <div class="signature-title">Company Representative</div>
        <div class="signature-date">Date: _________________</div>
      </div>
    </div>
  </div>
</body>
</html>`
};
