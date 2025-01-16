export const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* ... (keep existing styles) ... */
  </style>
</head>
<body>
  <div class="header">
    <h1>Mezzanine Floor Quotation</h1>
    <p>Reference: {{referenceNumber}}</p>
    <p>Date: {{date}}</p>
  </div>

  <div class="info-section">
    <h2>Client Information</h2>
    <table>
      <tr>
        <th>{{customerNameLabel}}:</th>
        <td>{{customerName}}</td>
      </tr>
      <tr>
        <th>{{companyNameLabel}}:</th>
        <td>{{companyName}}</td>
      </tr>
      <tr>
        <th>{{emailLabel}}:</th>
        <td>{{email}}</td>
      </tr>
    </table>
  </div>

  <div class="info-section">
    <h2>Project Specifications</h2>
    <table>
      <tr>
        <th>{{floorSizeLabel}}:</th>
        <td>{{floorSize}} m²</td>
      </tr>
      <tr>
        <th>{{floorFinishHeightLabel}}:</th>
        <td>{{floorFinishHeight}} mm</td>
      </tr>
      <tr>
        <th>{{floorCapacityLabel}}:</th>
        <td>{{floorCapacity}} KPA</td>
      </tr>
      <tr>
        <th>{{deckingTypeLabel}}:</th>
        <td>{{deckingType}}</td>
      </tr>
      <tr>
        <th>{{staircaseLabel}}:</th>
        <td>{{staircase}}</td>
      </tr>
      {{#if handrail}}
      <tr>
        <th>{{handrailTypeLabel}}:</th>
        <td>{{handrailType}}</td>
      </tr>
      <tr>
        <th>{{handrailLengthLabel}}:</th>
        <td>{{handrailLength}} m</td>
      </tr>
      {{/if}}
      {{#if accessGate}}
      <tr>
        <th>{{accessGateTypeLabel}}:</th>
        <td>{{accessGateType}}</td>
      </tr>
      {{/if}}
    </table>
  </div>

  <div class="info-section">
    <h2>Pricing Details</h2>
    <table>
      <tr>
        <th>{{supplyTypeLabel}}:</th>
        <td>{{supplyType}}</td>
      </tr>
      <tr>
        <th>{{totalPriceLabel}}:</th>
        <td>{{totalPrice}}</td>
      </tr>
    </table>
  </div>

  <!-- ... (keep existing signature and terms sections) ... -->
</body>
</html>
`;
