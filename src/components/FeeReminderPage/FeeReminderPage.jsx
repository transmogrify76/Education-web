import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FeeReminderPage.css';

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

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched students:', data.students); // Log fetched student data
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

  // Fetch fee data for the selected student
  useEffect(() => {
    const fetchFeeData = async () => {
      if (!selectedStudentId) return;

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/fee-reminder?studentId=${selectedStudentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched fee data:', data); // Log fetched fee data
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

      // Update the fee status to 'Paid'
      const response = await fetch(`http://localhost:3000/fee-reminder/${feeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'paid' }),
      });
      if (!response.ok) {
        throw new Error('Failed to update fee status');
      }

      // Refetch the fee data to reflect changes
      const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder?studentId=${selectedStudentId}`);
      const updatedFeeData = await updatedFeeResponse.json();
      console.log('Updated fee data:', updatedFeeData); // Log updated fee data
      setFeeData(updatedFeeData);
    } catch (error) {
      console.error('Error updating fee status:', error);
      setError('Failed to update fee status.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Fee Reminder</h1>
      </header>
      <main className="main-content">
        <section className="student-selection">
          <label htmlFor="student-select">Select Student:</label>
          <select
            id="student-select"
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
          <section className="student-fee-details">
            <h2>Fee Details for Selected Student</h2>
            <table className="fee-table">
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
                      <td className={`status ${fee.status.toLowerCase()}`}>{fee.status}</td>
                      <td>
                        {fee.status === 'Due' && (
                          <button
                            className="pay-button"
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
        
        <section className="payment-options">
          <h2>Payment Options</h2>
          <ul>
            {paymentOptions.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </section>
        <div className="caution">
          <p>Please ensure all fee payments are made by the due dates to avoid any late fees. For any queries, contact the school administration.</p>
        </div>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FeeReminderPage;
