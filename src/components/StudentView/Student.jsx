import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav'; // Import the Sidebar component
import { FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck } from 'react-icons/fa';
import './Student.css'; // Import the CSS file for Student

function Student() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <div className="dashboard-containers">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="main-contents">
        <header className="dashboard-header">Dashboard</header>
        <div className="button-grid">
          <div onClick={() => navigate('/GoalsSettingInternalExam')} className="dashboard-button orange">
            Goal setting entry
          </div>
          <div onClick={() => navigate('/GoalSettingView')} className="dashboard-button purple">
            Goal Setting View
          </div>
          <div onClick={() => navigate('/ExternalReport')} className="dashboard-button blue">
            <FaFileAlt className="button-icon" /> External report
          </div>
          <div onClick={() => navigate('/ThirdPartyServicesStudent')} className="dashboard-button light-gray">
            <FaHandsHelping className="button-icon" /> Third Party Optional Services
          </div>
          <div onClick={() => navigate('/StudentWellbeingForm')} className="dashboard-button gray">
            Student Wellbeing Request
          </div>
          <div onClick={() => navigate('/Chatbot')} className="dashboard-button pink">
            <FaComments className="button-icon" /> Chat
          </div>
          <div onClick={() => navigate('/BehaviorAssessmentTool')} className="dashboard-button dark-blue">
            <FaClipboardCheck className="button-icon" /> Behavior assessment tool
          </div>
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
