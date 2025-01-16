export const specificationsSection = `
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
`;
