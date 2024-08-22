import React from 'react';
import Sidebar from '../SideNav/SideNav';
import './StudentWellbeingForm.css';

const StudentWellbeingForm = () => {
  return (
    <div className="containerss">
      <Sidebar />
      <div className="student-wellbeing-form">
        <h2 className="form-heading">Student Wellbeing</h2>
        <div className="form-group">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" className="input-box" />
          </div>
          <div className="form-field">
            <label htmlFor="enroll">Enroll:</label>
            <input type="text" id="enroll" className="input-box" />
          </div>
          <div className="form-field">
            <label htmlFor="class">Class:</label>
            <input type="text" id="class" className="input-box" />
          </div>
        </div>
        <div className="form-group">
          <div className="form-field difficulty-section">
            <label>I have difficulty with:<span className="required">*</span></label>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" />
                I need your help
              </label>
              <label>
                <input type="checkbox" />
                I am managing at present but I need to talk
              </label>
            </div>
          </div>
          <div className="form-field talk-section">
            <label>I need to briefly talk about:<span className="required">*</span></label>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" />
                I can wait for a week
              </label>
            </div>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="what-have-i-done">What have I done to try and solve the problem:</label>
          <textarea id="what-have-i-done" className="input-box"></textarea>
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
