import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFeeReminderPage = () => {
  const [feeReminders, setFeeReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    term: '',
    amount: '',
    dueDate: '',
    status: 'Pending',
    studentId: '',
  });

  useEffect(() => {
    // Fetch all fee reminders from the backend
    axios.get('http://localhost:3000/fee-reminder')
      .then(response => setFeeReminders(response.data))
      .catch(error => console.error('Error fetching fee reminders:', error));
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
    // Send POST request to create a new fee reminder
    axios.post('http://localhost:3000/fee-reminder', newReminder)
      .then(response => {
        setFeeReminders([...feeReminders, response.data]);
        setNewReminder({ term: '', amount: '', dueDate: '', status: 'Pending', studentId: '' });
      })
      .catch(error => console.error('Error creating fee reminder:', error));
  };

  const handleInputChange = (e) => {
    setNewReminder({ ...newReminder, [e.target.name]: e.target.value });
  };

  return (
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
        <div>
          <label>Student ID:</label>
          <input
            type="number"
            name="studentId"
            value={newReminder.studentId}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Fee Reminder</button>
      </form>
    </div>
  );
};

export default AdminFeeReminderPage;
