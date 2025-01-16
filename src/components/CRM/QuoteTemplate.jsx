import React from 'react';

const QuoteTemplate = ({ quote }) => (
  <div className="print-template">
    <h1>Mezzanine Floor Proposal</h1>
    <p>Reference Number: {quote.reference_number}</p>
    <p>Date: {new Date(quote.created_at).toLocaleDateString()}</p>

    <h2>Client Information</h2>
    <p>Customer: {quote.customer_name}</p>
    <p>Company: {quote.company_name}</p>
    <p>Email: {quote.email}</p>

    <p className="intro">
      Thank you for considering our services for your mezzanine floor project. Below is the detailed proposal outlining the key project specifications, pricing details, and terms of agreement. We are committed to delivering high-quality, durable, and customized solutions to meet your specific needs.
    </p>

    <h2>Project Specifications</h2>
    <table className="specs-table">
      <tbody>
        <tr>
          <td>Floor Size:</td>
          <td>{quote.floor_size} m²</td>
        </tr>
        <tr>
          <td>Floor Finish Height:</td>
          <td>{quote.floor_finish_height} mm</td>
        </tr>
        <tr>
          <td>Floor Capacity:</td>
          <td>{quote.floor_capacity} KPA</td>
        </tr>
        <tr>
          <td>Staircase:</td>
          <td>{quote.staircase}</td>
        </tr>
        <tr>
          <td>Handrail:</td>
          <td>{quote.handrail}</td>
        </tr>
        {quote.handrail_type !== 'No Handrail' && (
          <>
            <tr>
              <td>Handrail Type:</td>
              <td>{quote.handrail_type}</td>
            </tr>
            <tr>
              <td>Handrail Length:</td>
              <td>{quote.handrail_length} m</td>
            </tr>
          </>
        )}
        <tr>
          <td>Access Gate:</td>
          <td>{quote.access_gate}</td>
        </tr>
        {quote.access_gate !== 'No Gate' && (
          <tr>
            <td>Access Gate Type:</td>
            <td>{quote.access_gate_type}</td>
          </tr>
        )}
      </tbody>
    </table>

    <h2>Pricing Details</h2>
    <table className="pricing-table">
      <tbody>
        <tr>
          <td>Supply Type:</td>
          <td>{quote.supply_type}</td>
        </tr>
        <tr>
          <td>Total Price (AUD):</td>
          <td>${quote.total_price}</td>
        </tr>
      </tbody>
    </table>

    <div className="terms">
      <h2>Terms and Conditions</h2>
      <p>By submitting this proposal, we agree to provide the services as outlined. All project details and pricing are subject to final confirmation upon acceptance. This proposal is valid for 30 days from the transaction date. Any modifications to the scope of work may result in additional charges.</p>
      <p>If you have any questions or require further clarifications, please do not hesitate to contact us. We look forward to the opportunity to work with you and deliver a mezzanine floor solution that meets your requirements.</p>
    </div>

    <div className="signatures">
      <div>
        <p><strong>Authorized Signatory (Client):</strong> _________________________</p>
        <p><strong>Date:</strong> _________________________</p>
      </div>
      <div>
        <p><strong>Authorized Signatory (Company):</strong> _________________________</p>
        <p><strong>Date:</strong> _________________________</p>
      </div>
    </div>
  </div>
);

export default QuoteTemplate;
