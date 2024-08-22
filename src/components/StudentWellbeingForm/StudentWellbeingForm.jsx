import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav';
import './StudentWellbeingForm.css';

const StudentWellbeingForm = () => {
  const { studentId } = useParams(); // Fetch studentId from URL parameters
  const [studentData, setStudentData] = useState({
    name: '',
    enroll: '',
    class: ''
  });

  useEffect(() => {
    // Fetch student data from API using studentId
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/student-data/${studentId}`);
        const data = await response.json();
        setStudentData({
          name: data.name,
          enroll: data.enroll,
          class: data.class
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]); // Add studentId to dependency array

  return (
    <div className="containerss">
      <Sidebar studentId={studentId} /> {/* Pass studentId to Sidebar */}
      <div className="student-wellbeing-form">
        <h2 className="form-heading">Student Wellbeing</h2>

        <div className="form-group">
          <div className="form-fields">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" className="input-box" value={studentData.name} readOnly />
          </div>
          <div className="form-fields">
            <label htmlFor="enroll">Enroll:</label>
            <input type="text" id="enroll" className="input-box" value={studentData.enroll} readOnly />
          </div>
          <div className="form-fields">
            <label htmlFor="class">Class:</label>
            <input type="text" id="class" className="input-box" value={studentData.class} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>I have difficulty with:</label>
            <textarea className="input-box"></textarea>
          </div>
          <div className="form-field">
            <label>I need to briefly talk about:</label>
            <textarea className="input-box"></textarea>
          </div>
          <div className="form-field">
            <label>What have I done to try and solve the problem:</label>
            <textarea className="input-box"></textarea>
          </div>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input type="checkbox" />
            I need your help
          </label>
          <label>
            <input type="checkbox" />
            I am managing at present but I need to talk
          </label>
          <label>
            <input type="checkbox" />
            I can wait for a week
          </label>
        </div>
        
        <div className="form-actions">
          <button className="save-button">Save</button>
          <button className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default StudentWellbeingForm;
