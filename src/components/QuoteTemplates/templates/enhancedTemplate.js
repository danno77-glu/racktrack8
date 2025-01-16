import { quoteStyles } from './styles/quoteStyles';

export const enhancedTemplate = {
  name: "Enhanced Professional Quote",
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${quoteStyles}</style>
</head>
<body>
  <!-- Previous sections remain unchanged -->

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
      <tr>
        <th>Access Gate</th>
        <td>{{accessGate}}</td>
      </tr>
    </table>
  </div>

  <!-- Rest of the template remains unchanged -->
</body>
</html>`
};
