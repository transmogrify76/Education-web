import React, { useState } from 'react';
import './AdminTimeTable.css'
import Header from '../Header/Header';
const AdminTimeTable = () => {
  const [formData, setFormData] = useState({
    day: '',
    hour: '',
    minute: '',
    period: 'AM',
    subject: '',
    professor: '',
    studentId: ''
  });
  const [popupVisible, setPopupVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const time = `${formData.hour}:${formData.minute} ${formData.period}`;
    
    const submissionData = {
      day: formData.day,
      time: time,
      subject: formData.subject,
      professor: formData.professor,
      studentId: formData.studentId,
    };

    fetch('http://localhost:3000/timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setPopupVisible(true); // Show the popup
        setTimeout(() => setPopupVisible(false), 3000); // Hide after 3 seconds
        setFormData({ day: '', hour: '', minute: '', period: 'AM', subject: '', professor: '', studentId: '' }); // Clear the form
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <Header/>
    <div className="admin-timetable-page">
      <h1>Post Timetable</h1>
      {popupVisible && <div className="popup">Timetable posted successfully!</div>}
      <form className="timetable-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="day">Day:</label>
          <select name="day" value={formData.day} onChange={handleChange} required>
            <option value="" disabled>Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <div className="time-inputs">
            <input 
              type="number" 
              name="hour" 
              value={formData.hour} 
              onChange={handleChange} 
              min="1" 
              max="12" 
              placeholder="HH" 
              required 
            />
            <span>:</span>
            <input 
              type="number" 
              name="minute" 
              value={formData.minute} 
              onChange={handleChange} 
              min="0" 
              max="59" 
              placeholder="MM" 
              required 
            />
            <select 
              name="period" 
              value={formData.period} 
              onChange={handleChange} 
              required
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="professor">Professor:</label>
          <input type="text" name="professor" value={formData.professor} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="studentId">Student ID:</label>
          <input type="number" name="studentId" value={formData.studentId} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button">Post Timetable</button>
      </form>
    </div>
    </div>
  );
};

export default AdminTimeTable;
