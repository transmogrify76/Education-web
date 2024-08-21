// Student.js
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav'; // Import the Sidebar component
import { FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck } from 'react-icons/fa';
import './Student.css'; // Import the CSS file for Student

function Student() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="main-content">
        <header className="dashboard-header">Dashboard</header>
        <div className="button-grid">
          <Link to="/GoalsSettingInternalExam">
            <button className="dashboard-button orange">
              Goal setting entry
            </button>
          </Link>
          <Link to="/GoalSettingView">
            <button className="dashboard-button purple">
              Goal Setting View
            </button>
          </Link>
          <Link to="/external-report">
            <button className="dashboard-button blue">
              <FaFileAlt className="button-icon" /> External report
            </button>
          </Link>
          <Link to="/third-party-services">
            <button className="dashboard-button light-gray">
              <FaHandsHelping className="button-icon" /> Third Party Optional Services
            </button>
          </Link>
          <Link to="/student-wellbeing-request">
            <button className="dashboard-button gray">
              Student Wellbeing Request
            </button>
          </Link>
          <Link to="/chat">
            <button className="dashboard-button pink">
              <FaComments className="button-icon" /> Chat
            </button>
          </Link>
          <Link to="/behavior-assessment-tool">
            <button className="dashboard-button dark-blue">
              <FaClipboardCheck className="button-icon" /> Behavior assessment tool
            </button>
          </Link>
        </div>
        <div className="alerts-section">
          <h2 className="alerts-header">
            ALERTS <span className="alerts-subheader">(Newest 5)</span>
          </h2>
          {/* Alerts content can be added here */}
        </div>
      </div>
    </div>
  );
}

export default Student;
