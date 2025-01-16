export const proposalStyles = `
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #1e293b;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
  }

  .header h1 {
    color: #2563eb;
    margin-bottom: 10px;
    font-size: 28px;
  }

  .header .reference {
    font-size: 16px;
    color: #64748b;
  }

  .info-section {
    margin-bottom: 30px;
  }

  .info-section h2 {
    color: #2563eb;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
    margin-bottom: 16px;
    font-size: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 12px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    background-color: #f8fafc;
    width: 40%;
    font-weight: 500;
  }

  td {
    background-color: white;
  }

  .terms {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #e5e7eb;
  }

  .terms h2 {
    color: #2563eb;
    margin-bottom: 16px;
    font-size: 20px;
  }

  .terms ol {
    padding-left: 20px;
  }

  .terms li {
    margin-bottom: 8px;
    color: #475569;
  }

  .signatures {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    gap: 40px;
  }

  .signature-block {
    flex: 1;
  }

  .signature-line {
    border-top: 1px solid #000;
    margin-top: 40px;
    padding-top: 8px;
  }

  .signature-title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .signature-date {
    color: #64748b;
    font-size: 14px;
  }

  @media print {
    body { 
      margin: 0; 
      padding: 20px; 
    }
    
    .header h1 { 
      color: #2563eb !important; 
    }
    
    .info-section h2 { 
      color: #2563eb !important; 
    }

    table { 
      page-break-inside: avoid; 
    }

    .signatures {
      page-break-inside: avoid;
    }
  }
`;
