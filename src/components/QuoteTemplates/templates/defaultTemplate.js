import { proposalStyles } from './styles';
import { ASSET_PATHS } from '../../../utils/assetPaths';

export const defaultTemplate = {
  name: "Standard Mezzanine Quote",
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${proposalStyles}
    .logo {
      display: block;
      width: 200px;
      height: auto;
      margin: 0 auto 2rem;
      object-fit: contain;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .meta {
      color: #64748b;
      margin-top: 1rem;
    }
    
    .meta p {
      margin: 0.25rem 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${ASSET_PATHS.COMPANY_LOGO}" alt="Company Logo" class="logo">
    <h1>Mezzanine Floor Quotation</h1>
    <div class="meta">
      <p><strong>Quote Reference:</strong> {{referenceNumber}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Sales Consultant:</strong> {{consultantName}}</p>
    </div>
  </div>

  <div class="section">
    <h2>Client Information</h2>
    <table>
      <tr>
        <th>Customer Name</th>
        <td>{{customerName}}</td>
      </tr>
      <tr>
        <th>Company Name</th>
        <td>{{companyName}}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>{{email}}</td>
      </tr>
    </table>
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
        <th>Steel Finish</th>
        <td>{{steelFinish}}</td>
      </tr>
      <tr>
        <th>Staircase</th>
        <td>{{staircase}}</td>
      </tr>
      {{#if handrailType}}
      <tr>
        <th>Handrail Type</th>
        <td>{{handrailType}}</td>
      </tr>
      {{#if handrailLength}}
      <tr>
        <th>Handrail Length</th>
        <td>{{handrailLength}} m</td>
      </tr>
      {{/if}}
      {{/if}}
      {{#if accessGate}}
      <tr>
        <th>Access Gate Type</th>
        <td>{{accessGateType}}</td>
      </tr>
      {{/if}}
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
