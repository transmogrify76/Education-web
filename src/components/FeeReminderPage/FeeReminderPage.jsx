// import React, { useEffect, useState } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
// import './FeeReminderPage.css';
// import Header from '../Header/Header';
// import { useNavigate } from 'react-router-dom'; // For redirection if token is missing

// const FeeReminderPage = () => {
//   const [students, setStudents] = useState([]);
//   const [selectedStudentId, setSelectedStudentId] = useState('');
//   const [feeData, setFeeData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const paymentOptions = [
//     'Credit Card',
//     'Debit Card',
//     'Bank Transfer',
//     'PayPal',
//     'Razorpay'
//   ];

//   const navigate = useNavigate();

//   useEffect(() => {
//     const authToken = localStorage.getItem('authToken');
//     if (!authToken) {
//       setError('No authToken found');
//       navigate('/login'); // Redirect to login page if token is missing
//       return;
//     }

//     try {
//       // Decode the JWT token to get the parentId
//       const decodedToken = jwtDecode(authToken);
//       const parentId = decodedToken.id; // Assuming parentId is stored in token

//       const fetchStudentData = async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(`http://localhost:3000/parent/${parentId}`);
//           if (!response.ok) throw new Error('Network response was not ok');
//           const data = await response.json();
//           setStudents(data.students || []);
//         } catch (error) {
//           console.error('Error fetching student data:', error);
//           setError('Failed to fetch student data.');
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchStudentData();
//     } catch (error) {
//       console.error('Failed to decode authToken:', error);
//       setError('Failed to decode authToken');
//       setLoading(false); // Stop loading if token decoding fails
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const fetchFeeData = async () => {
//       if (!selectedStudentId) return;

//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         setFeeData(data || []);
//       } catch (error) {
//         console.error('Error fetching fee data:', error);
//         setError('Failed to fetch fee data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeeData();
//   }, [selectedStudentId]);

//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => console.log("Razorpay script loaded!");
//       script.onerror = () => alert("Failed to load Razorpay script");
//       document.body.appendChild(script);
//     };

//     loadRazorpayScript();
//   }, []);

//   const handlePayment = async (feeId, term, amount) => {
//     // Razorpay payment configuration
//     const options = {
//       key: 'rzp_test_nzmqxQYhvCH9rD', // Replace with your Razorpay test/live key
//       amount: amount, // Amount in paise (100 paise = 1 INR)
//       currency: 'INR',
//       name: 'School Fees Payment',
//       description: 'Payment for school fees',
//       handler: async (response) => {
//         alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
//         try {
//           // Update fee status to 'paid'
//           const updateResponse = await fetch(`http://localhost:3000/fee-reminder/update-latest/${selectedStudentId}`, {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ feeId, status: 'paid' }),
//           });
//           if (!updateResponse.ok) throw new Error('Failed to update fee status');
          
//           // Refresh fee data
//           const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
//           if (!updatedFeeResponse.ok) throw new Error('Failed to fetch updated fee data');
//           const updatedFeeData = await updatedFeeResponse.json();
//           setFeeData(updatedFeeData);
//         } catch (error) {
//           console.error('Error during fee update:', error);
//           setError('Failed to update fee status');
//         }
//       },
//       prefill: {
//         name: 'Student Name', // Replace with dynamic student name
//         email: 'student@example.com', // Replace with dynamic student email
//         contact: '1234567899', // Replace with dynamic student contact
//       },
//       notes: {
//         address: 'Student Address', // Replace with dynamic student address
//       },
//       theme: {
//         color: '#F37254',
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const handlePendingPayment = async (feeId, term) => {
//     try {
//       // Open the payment portal
//       window.open(
//         `https://payment-portal.com/pay?studentId=${selectedStudentId}&term=${term}`,
//         '_blank'
//       );

//       // Update fee status to 'Pending' first
//       const response = await fetch(`http://localhost:3000/fee-reminder/update-latest/${selectedStudentId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ feeId, status: 'Pending' }),
//       });
//       if (!response.ok) throw new Error('Failed to update fee status to Pending');

//       // Refresh fee data after updating to 'Pending'
//       const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
//       if (!updatedFeeResponse.ok) throw new Error('Failed to fetch updated fee data');
//       const updatedFeeData = await updatedFeeResponse.json();
//       setFeeData(updatedFeeData);
//     } catch (error) {
//       console.error('Error during pending payment process:', error);
//       setError('Failed to process pending payment.');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <Header />
//       <div className="fee-reminder-container">
//         <header className="page-header">
//           <div className="header-title">Fee Reminder</div>
//         </header>
//         <main className="content-main">
//           <section className="student-selector">
//             <label htmlFor="student-dropdown">Select Student:</label>
//             <select
//               id="student-dropdown"
//               value={selectedStudentId}
//               onChange={(e) => setSelectedStudentId(e.target.value)}
//             >
//               <option value="">Select Student</option>
//               {students.map((student) => (
//                 <option key={student.id} value={student.id}>
//                   {student.name}
//                 </option>
//               ))}
//             </select>
//           </section>

//           {selectedStudentId && (
//             <section className="fee-details-section">
//               <h2>Fee Details for Selected Student</h2>
//               <table className="fee-details-table">
//                 <thead>
//                   <tr>
//                     <th>Term</th>
//                     <th>Amount</th>
//                     <th>Due Date</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {feeData.length > 0 ? (
//                     feeData.map((fee) => (
//                       <tr key={fee.id}>
//                         <td>{fee.term}</td>
//                         <td>{fee.amount}</td>
//                         <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
//                         <td className={`fee-status ${fee.status.toLowerCase()}`}>{fee.status}</td>
//                         <td>
//                           {fee.status === 'Pending' && (
//                             <button
//                               className="payment-button"
//                               onClick={() => handlePayment(fee.id, fee.term, fee.amount)}
//                             >
//                               Pay Now
//                             </button>
//                           )}
//                           {fee.status === 'Pending' && (
//                             <button
//                               className="payment-button"
//                               onClick={() => handlePendingPayment(fee.id, fee.term)}
//                             >
//                               Process Pending Payment
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5">No fee details available</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </section>
//           )}
//           <section className="payment-options-section">
//             <h2>Payment Options</h2>
//             <ul>
//               {paymentOptions.map((option, index) => (
//                 <li key={index}>{option}</li>
//               ))}
//             </ul>
//           </section>
//           <div className="notice-section">
//             <p>Please ensure all fee payments are made by the due dates to avoid any late fees. For any queries, contact the school administration.</p>
//           </div>
//         </main>
//         <footer className="infra-footer">
//           <p className="footer-text">© 2024 School Management System. All rights reserved.</p>
//           <p>
//             <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default FeeReminderPage;


import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token
import './FeeReminderPage.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'; // For redirection if token is missing

const FeeReminderPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('No authToken found');
      navigate('/login'); // Redirect to login page if token is missing
      return;
    }

    try {
      // Decode the JWT token to get the parentId
      const decodedToken = jwtDecode(authToken);
      const parentId = decodedToken.id; // Assuming parentId is stored in token

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
    } catch (error) {
      console.error('Failed to decode authToken:', error);
      setError('Failed to decode authToken');
      setLoading(false); // Stop loading if token decoding fails
    }
  }, [navigate]);

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

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => console.log("Razorpay script loaded!");
      script.onerror = () => alert("Failed to load Razorpay script");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async (feeId, term, amount) => {
    // Razorpay payment configuration
    const options = {
      key: 'rzp_test_nzmqxQYhvCH9rD', // Replace with your Razorpay test/live key
      amount: amount, // Amount in paise (100 paise = 1 INR)
      currency: 'INR',
      name: 'School Fees Payment',
      description: 'Payment for school fees',
      handler: async (response) => {
        alert('Payment successful. Payment ID: ' + response.razorpay_payment_id);
        try {
          // Update fee status to 'paid'
          const updateResponse = await fetch(`http://localhost:3000/fee-reminder/update-latest/${selectedStudentId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feeId, status: 'paid' }),
          });
          if (!updateResponse.ok) throw new Error('Failed to update fee status');
          
          // Refresh fee data
          const updatedFeeResponse = await fetch(`http://localhost:3000/fee-reminder/student/${selectedStudentId}`);
          if (!updatedFeeResponse.ok) throw new Error('Failed to fetch updated fee data');
          const updatedFeeData = await updatedFeeResponse.json();
          setFeeData(updatedFeeData);
        } catch (error) {
          console.error('Error during fee update:', error);
          setError('Failed to update fee status');
        }
      },
      prefill: {
        name: 'Student Name', // Replace with dynamic student name
        email: 'student@example.com', // Replace with dynamic student email
        contact: '1234567899', // Replace with dynamic student contact
      },
      notes: {
        address: 'Student Address', // Replace with dynamic student address
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
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
                  {student.name}
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
                          {fee.status === 'Pending' && (
                            <button
                              className="payment-button"
                              onClick={() => handlePayment(fee.id, fee.term, fee.amount)}
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
