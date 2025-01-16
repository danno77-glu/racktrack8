export const professionalTemplate = {
  name: "Professional Quote Template",
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* ... (keep existing styles) ... */
  </style>
</head>
<body>
  <div class="header">
    <h1>Mezzanine Floor Quotation</h1>
    <div class="meta">
      <p>Reference: {{referenceNumber}}</p>
      <p>Date: {{date}}</p>
      <p>Sales Consultant: {{consultantName}}</p>
    </div>
  </div>

  <div class="section">
    <h2>Project Specifications</h2>
    <table>
      <tr>
        <th>Floor Size</th>
        <td>{{floorSize}}</td>
      </tr>
      <tr>
        <th>Floor Finish Height</th>
        <td>{{floorFinishHeight}}</td>
      </tr>
      <tr>
        <th>Floor Capacity</th>
        <td>{{floorCapacity}}</td>
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
      {{#if handrail}}
      {{#if handrailType}}
      <tr>
        <th>Handrail Type</th>
        <td>{{handrailType}}</td>
      </tr>
      {{/if}}
      {{#if handrailLength}}
      <tr>
        <th>Handrail Length</th>
        <td>{{handrailLength}}</td>
      </tr>
      {{/if}}
      {{/if}}
      <tr>
        <th>Access Gate</th>
        <td>{{accessGate}}</td>
      </tr>
      {{#if accessGate}}
      {{#if accessGateType}}
      <tr>
        <th>Access Gate Type</th>
        <td>{{accessGateType}}</td>
      </tr>
      {{/if}}
      {{/if}}
    </table>
  </div>

  <!-- ... (keep rest of template the same) ... -->
</body>
</html>`
};
