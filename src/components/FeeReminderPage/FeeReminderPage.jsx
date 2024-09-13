import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FeeReminderPage.css';
import Header from '../Header/Header';

const FeeReminderPage = () => {
  const { parentId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paymentOptions = [
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'PayPal',
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [parentId]);

  useEffect(() => {
    const fetchFeeData = async () => {
      if (!selectedStudentId) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFeeData(data || []);
      } catch (error) {
        console.error('Error fetching fee data:', error);
        setError('Failed to fetch fee data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, [selectedStudentId]);

  const handlePayment = async (feeId, term) => {
    try {
      // Open the payment portal
      window.open(
        `https://payment-portal.com/pay?studentId=${selectedStudentId}&term=${term}`,
        '_blank'
      );

      // Update fee status to 'paid'
      const response = await fetch(`http://localhost:3000/fee-reminder/update-latest/${selectedStudentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feeId, status: 'paid' }),
      });
      if (!response.ok) throw new Error('Failed to update fee status');

      // Refresh fee data
      const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
      if (!updatedFeeResponse.ok) throw new Error('Failed to fetch updated fee data');
      const updatedFeeData = await updatedFeeResponse.json();
      setFeeData(updatedFeeData);
    } catch (error) {
      console.error('Error during payment process:', error);
      setError('Failed to process payment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header/>
    <div className="fee-reminder-container">
      <header className="page-header">
        <div className="header-title">Fee Reminder</div>
      </header>
      <main className="content-main">
        <section className="student-selector">
          <label htmlFor="student-dropdown">Select Student:</label>
          <select
            id="student-dropdown"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} (ID: {student.id})
              </option>
            ))}
          </select>
        </section>

        {selectedStudentId && (
          <section className="fee-details-section">
            <h2>Fee Details for Selected Student</h2>
            <table className="fee-details-table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feeData.length > 0 ? (
                  feeData.map((fee) => (
                    <tr key={fee.id}>
                      <td>{fee.term}</td>
                      <td>{fee.amount}</td>
                      <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                      <td className={`fee-status ${fee.status.toLowerCase()}`}>{fee.status}</td>
                      <td>
                        {fee.status === 'Due' && (
                          <button
                            className="payment-button"
                            onClick={() => handlePayment(fee.id, fee.term)}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No fee details available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
        <section className="payment-options-section">
          <h2>Payment Options</h2>
          <ul>
            {paymentOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </section>
        <div className="notice-section">
          <p>Please ensure all fee payments are made by the due dates to avoid any late fees. For any queries, contact the school administration.</p>
        </div>
      </main>
      <footer className="infra-footer">
        <p className="footer-text">© 2024 School Management System. All rights reserved.</p>
        <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
      </footer>
    </div>
          
    </div>
  );
};

export default FeeReminderPage;
