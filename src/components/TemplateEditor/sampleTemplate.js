export const sampleTemplate = {
  name: "Default Rack Audit Template",
  content: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* ... (keep existing styles) ... */
    .header-logo {
      display: block;
      width: auto;
      height: 60px;
      margin: 0 auto 1.5rem;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="/assets/images/logo1.png" alt="Company Logo" class="header-logo" />
    <h1>Rack Audit Report</h1>
    <div class="meta">
      <p><strong>Reference:</strong> {{reference_number}}</p>
      <p><strong>Date:</strong> {{audit_date}}</p>
    </div>
  </div>

  <!-- ... (rest of the template remains the same) ... -->
</body>
</html>`
};
