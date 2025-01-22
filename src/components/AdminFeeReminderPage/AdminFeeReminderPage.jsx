// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Header from '../Header/Header';

// const AdminFeeReminderPage = () => {
//   const [feeReminders, setFeeReminders] = useState([]);
//   const [newReminder, setNewReminder] = useState({
//     term: '',
//     amount: '',
//     dueDate: '',
//     status: 'Pending',
//     studentId: '',
//   });

//   useEffect(() => {
//     // Fetch all fee reminders from the backend
//     axios.get('http://localhost:3000/fee-reminder')
//       .then(response => setFeeReminders(response.data))
//       .catch(error => console.error('Error fetching fee reminders:', error));
//   }, []);

//   const handleApproval = (studentId, status) => {
//     // Send patch request to update the fee reminder status
//     axios.patch(`http://localhost:3000/fee-reminder/update-latest/${studentId}`, { status })
//       .then(() => {
//         // Refresh fee reminders
//         axios.get('http://localhost:3000/fee-reminder')
//           .then(response => setFeeReminders(response.data))
//           .catch(error => console.error('Error fetching updated fee reminders:', error));
//       })
//       .catch(error => console.error('Error updating fee reminder:', error));
//   };

//   const handleCreate = (e) => {
//     e.preventDefault();
//     // Send POST request to create a new fee reminder
//     axios.post('http://localhost:3000/fee-reminder', newReminder)
//       .then(response => {
//         setFeeReminders([...feeReminders, response.data]);
//         setNewReminder({ term: '', amount: '', dueDate: '', status: 'Pending', studentId: '' });
//       })
//       .catch(error => console.error('Error creating fee reminder:', error));
//   };

//   const handleInputChange = (e) => {
//     setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
//   };

//   return (
//     <div>
//       <Header/>
//     <div className="admin-fee-reminder-page">
//       <h1>Admin Fee Reminder Management</h1>

//       {/* Table to display fee reminders */}
//       <table>
//         <thead>
//           <tr>
//             <th>Student ID</th>
//             <th>Student Name</th>
//             <th>Term</th>
//             <th>Amount</th>
//             <th>Due Date</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {feeReminders.map((reminder) => (
//             <tr key={reminder.id}>
//               <td>{reminder.student ? reminder.student.id : 'N/A'}</td>
//               <td>{reminder.student ? reminder.student.name : 'N/A'}</td>
//               <td>{reminder.term}</td>
//               <td>{reminder.amount || 'N/A'}</td>
//               <td>{new Date(reminder.dueDate).toLocaleDateString()}</td>
//               <td>{reminder.status}</td>
//               <td>
//                 {reminder.status === 'Pending' && (
//                   <>
//                     <button onClick={() => handleApproval(reminder.student.id, 'Approved')}>Approve</button>
//                     <button onClick={() => handleApproval(reminder.student.id, 'Declined')}>Decline</button>
//                   </>
//                 )}
//                 {reminder.status === 'Approved' && (
//                   <button onClick={() => handleApproval(reminder.student.id, 'Pending')}>Mark as Pending</button>
//                 )}
//                 {reminder.status === 'Declined' && (
//                   <button onClick={() => handleApproval(reminder.student.id, 'Pending')}>Mark as Pending</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Form to create a new fee reminder */}
//       <form onSubmit={handleCreate}>
//         <h2>Create New Fee Reminder</h2>
//         <div>
//           <label>Term:</label>
//           <input
//             type="text"
//             name="term"
//             value={newReminder.term}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Amount:</label>
//           <input
//             type="text"
//             name="amount"
//             value={newReminder.amount}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Due Date:</label>
//           <input
//             type="date"
//             name="dueDate"
//             value={newReminder.dueDate}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div>
//           <label>Status:</label>
//           <select
//             name="status"
//             value={newReminder.status}
//             onChange={handleInputChange}
//           >
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Declined">Declined</option>
//           </select>
//         </div>
//         <div>
//           <label>Student ID:</label>
//           <input
//             type="number"
//             name="studentId"
//             value={newReminder.studentId}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <button type="submit">Create Fee Reminder</button>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default AdminFeeReminderPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header/Header';

const AdminFeeReminderPage = () => {
  const [feeReminders, setFeeReminders] = useState([]);
  const [students, setStudents] = useState([]); // To store students' data
  const [newReminder, setNewReminder] = useState({
    term: '',
    amount: '',
    dueDate: '',
    status: 'Pending',
    studentId: '', // store studentId here
  });
  const [token, setToken] = useState('');  // Store the auth token (you'll likely retrieve this after login)

  // Fetch fee reminders and students' details
  useEffect(() => {
    // Assume you store token in localStorage after login, and retrieve it here
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }

    // Fetch fee reminders
    axios.get('http://localhost:3000/fee-reminder')
      .then(response => setFeeReminders(response.data))
      .catch(error => console.error('Error fetching fee reminders:', error));

    // Fetch students' data (with authorization token)
    if (storedToken) {
      axios.get('http://localhost:3000/student', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        }
      })
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
    } else {
      console.error('Authorization token missing');
    }
  }, []);

  const handleApproval = (studentId, status) => {
    // Send patch request to update the fee reminder status
    axios.patch(`http://localhost:3000/fee-reminder/update-latest/${studentId}`, { status })
      .then(() => {
        // Refresh fee reminders
        axios.get('http://localhost:3000/fee-reminder')
          .then(response => setFeeReminders(response.data))
          .catch(error => console.error('Error fetching updated fee reminders:', error));
      })
      .catch(error => console.error('Error updating fee reminder:', error));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    // Send POST request to create a new fee reminder with the studentId selected
    axios.post('http://localhost:3000/fee-reminder', newReminder, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the authorization token in headers
      }
    })
      .then(response => {
        setFeeReminders([...feeReminders, response.data]);
        setNewReminder({ term: '', amount: '', dueDate: '', status: 'Pending', studentId: '' });
      })
      .catch(error => console.error('Error creating fee reminder:', error));
  };

  const handleInputChange = (e) => {
    setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
  };

  // Handle student selection by name
  const handleStudentSelection = (e) => {
    const selectedStudentName = e.target.value;
    const selectedStudent = students.find(student => student.name === selectedStudentName);
    if (selectedStudent) {
      setNewReminder({ ...newReminder, studentId: selectedStudent.id });
    } else {
      setNewReminder({ ...newReminder, studentId: '' });
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-fee-reminder-page">
        <h1>Admin Fee Reminder Management</h1>

        {/* Table to display fee reminders */}
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Term</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feeReminders.map((reminder) => (
              <tr key={reminder.id}>
                <td>{reminder.student ? reminder.student.id : 'N/A'}</td>
                <td>{reminder.student ? reminder.student.name : 'N/A'}</td>
                <td>{reminder.term}</td>
                <td>{reminder.amount || 'N/A'}</td>
                <td>{new Date(reminder.dueDate).toLocaleDateString()}</td>
                <td>{reminder.status}</td>
                <td>
                  {reminder.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApproval(reminder.student.id, 'Approved')}>Approve</button>
                      <button onClick={() => handleApproval(reminder.student.id, 'Declined')}>Decline</button>
                    </>
                  )}
                  {reminder.status === 'Approved' && (
                    <button onClick={() => handleApproval(reminder.student.id, 'Pending')}>Mark as Pending</button>
                  )}
                  {reminder.status === 'Declined' && (
                    <button onClick={() => handleApproval(reminder.student.id, 'Pending')}>Mark as Pending</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form to create a new fee reminder */}
        <form onSubmit={handleCreate}>
          <h2>Create New Fee Reminder</h2>
          <div>
            <label>Term:</label>
            <input
              type="text"
              name="term"
              value={newReminder.term}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="text"
              name="amount"
              value={newReminder.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={newReminder.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={newReminder.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          
          {/* Dropdown to select student name */}
          <div>
            <label>Student Name:</label>
            <select
              name="studentName"
              value={students.find(student => student.id === newReminder.studentId)?.name || ''}
              onChange={handleStudentSelection}
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit">Create Fee Reminder</button>
        </form>
      </div>
    </div>
  );
};

export default AdminFeeReminderPage;
