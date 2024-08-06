import React from 'react';
import './FeeReminder.css';

const FeeReminder = () => {
  const feeDetails = [
    {
      term: 'Term 1',
      amount: '$500',
      dueDate: '2024-09-15',
      status: 'Due',
    },
    {
      term: 'Term 2',
      amount: '$500',
      dueDate: '2025-01-15',
      status: 'Paid',
    },
    {
      term: 'Term 3',
      amount: '$500',
      dueDate: '2025-05-15',
      status: 'Due',
    },
  ];

  const paymentOptions = [
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'PayPal',
  ];

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Fee Reminder</h1>
      </header>
      <main className="main-content">
        <section className="fee-details">
          <h2>Fee Details</h2>
          <table className="fee-table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((fee, index) => (
                <tr key={index}>
                  <td>{fee.term}</td>
                  <td>{fee.amount}</td>
                  <td>{fee.dueDate}</td>
                  <td className={`status ${fee.status.toLowerCase()}`}>{fee.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="payment-options">
          <h2>Payment Options</h2>
          <ul>
            {paymentOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FeeReminder;
