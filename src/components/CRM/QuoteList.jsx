import React from 'react';
import StatusSelect from './StatusSelect';
import QuoteActions from './QuoteActions';

const QuoteList = ({ quotes, onStatusChange }) => (
  <table>
    <thead>
      <tr>
        <th>Reference Number</th>
        <th>Customer Name</th>
        <th>Company</th>
        <th>Email</th>
        <th>Status</th>
        <th>Floor Size</th>
        <th>Total Price</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {quotes.map(quote => (
        <tr key={quote.id}>
          <td>{quote.reference_number}</td>
          <td>{quote.customer_name}</td>
          <td>{quote.company_name}</td>
          <td>{quote.email}</td>
          <td>
            <StatusSelect 
              currentStatus={quote.status} 
              onChange={(newStatus) => onStatusChange(quote.id, newStatus)} 
            />
          </td>
          <td>{quote.floor_size} m²</td>
          <td>${quote.total_price}</td>
          <td>{new Date(quote.created_at).toLocaleString()}</td>
          <td>
            <QuoteActions quote={quote} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default QuoteList;
