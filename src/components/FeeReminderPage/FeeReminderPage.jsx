import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FeeReminderPage.css';

const FeeReminderPage = () => {
  const { parentId } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [feeData, setFeeData] = useState({});
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
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudentData(data.students || []);

        // Fetch fee data for each student
        const feeDataMap = {};
        await Promise.all(
          data.students.map(async (student) => {
            try {
              const feeResponse = await fetch(
                `http://localhost:3000/fee-reminder?studentId=${student.id}`
              );
              if (!feeResponse.ok) {
                throw new Error('Network response was not ok');
              }
              const feeData = await feeResponse.json();
              feeDataMap[student.id] = feeData;
              console.log(`Fetched fee data for student ${student.id}:`, feeData); // Debug log
            } catch (error) {
              console.error('Error fetching fee data:', error);
              setError('Failed to fetch fee data.');
            }
          })
        );
        setFeeData(feeDataMap);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [parentId]);

  const handlePayment = async (studentId, feeId, term) => {
    try {
      // Open the payment portal
      window.open(
        `https://payment-portal.com/pay?studentId=${studentId}&term=${term}`,
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
      // Optionally, you can refetch the data to reflect the changes
      const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder?studentId=${studentId}`);
      const updatedFeeData = await updatedFeeResponse.json();
      console.log(`Updated fee data for student ${studentId}:`, updatedFeeData); // Debug log
      setFeeData(prevFeeData => ({
        ...prevFeeData,
        [studentId]: updatedFeeData
      }));
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

  if (studentData.length === 0) {
    return <p>No student data available for the specified parent.</p>;
  }

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Fee Reminder</h1>
      </header>
      <main className="main-content">
        {studentData.map((student) => {
          const fees = feeData[student.id] || [];
          return (
            <section key={student.id} className="student-section">
              <h2>{student.name}'s Fee Details</h2>
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
                  {fees.map((fee) => (
                    <tr key={fee.id}>
                      <td>{fee.term}</td>
                      <td>{fee.amount}</td> {/* Ensure this is being populated */}
                      <td>{fee.dueDate}</td>
                      <td className={`status ${fee.status.toLowerCase()}`}>{fee.status}</td>
                      <td>
                        {fee.status === 'Due' && (
                          <button
                            className="pay-button"
                            onClick={() => handlePayment(student.id, fee.id, fee.term)}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 && (
                    <tr>
                      <td colSpan="5">No fee details available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          );
        })}
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
