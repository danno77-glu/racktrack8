export const logoTemplate = {
  name: "Logo Business Quote",
  content: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Keep existing styles */
    ${proposalStyles}
  </style>
</head>
<body>
  <!-- Keep existing header and client info sections -->

  <div class="info-section">
    <h2>Project Specifications</h2>
    <table>
      <tr>
        <th>{{floorSizeLabel}}</th>
        <td>{{floorSize}}{{#if floorSize}} m²{{/if}}</td>
      </tr>
      <tr>
        <th>{{floorFinishHeightLabel}}</th>
        <td>{{floorFinishHeight}}{{#if floorFinishHeight}} mm{{/if}}</td>
      </tr>
      <tr>
        <th>{{floorCapacityLabel}}</th>
        <td>{{floorCapacity}}{{#if floorCapacity}} KPA{{/if}}</td>
      </tr>
      <tr>
        <th>{{deckingTypeLabel}}</th>
        <td>{{deckingType}}</td>
      </tr>
      <tr>
        <th>{{staircaseLabel}}</th>
        <td>{{staircase}}</td>
      </tr>
      <tr>
        <th>{{handrailTypeLabel}}</th>
        <td>{{handrailType}}</td>
      </tr>
      {{#if handrailLength}}
      <tr>
        <th>{{handrailLengthLabel}}</th>
        <td>{{handrailLength}} m</td>
      </tr>
      {{/if}}
      <tr>
        <th>{{accessGateTypeLabel}}</th>
        <td>{{accessGateType}}</td>
      </tr>
    </table>
  </div>

  <!-- Keep existing pricing, terms and signatures sections -->
</body>
</html>`
};
