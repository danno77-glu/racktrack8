export const quoteStyles = `
  :root {
    --primary: #2563eb;
    --secondary: #1e40af;
    --text: #1e293b;
    --border: #e2e8f0;
    --background: #ffffff;
  }

  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text);
    max-width: 210mm;
    margin: 0 auto;
    padding: 20mm;
    background: var(--background);
  }

  .logo {
    display: block;
    width: 200px;
    height: auto;
    margin: 0 auto 1.5rem;
    object-fit: contain;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--border);
  }

  .header h1 {
    color: var(--primary);
    font-size: 24px;
    margin-bottom: 1rem;
  }

  .header .meta {
    color: #64748b;
    font-size: 14px;
  }

  /* Rest of the styles remain unchanged */
  ${quoteStyles}

  @media print {
    body {
      padding: 0;
      margin: 20mm;
    }

    .logo {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .section {
      page-break-inside: avoid;
    }

    .signatures {
      page-break-inside: avoid;
    }
  }
`;
