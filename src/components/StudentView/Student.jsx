import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav'; 
import { FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck } from 'react-icons/fa';
import './Student.css'; // Import the CSS file for Student

function Student() {
  const { studentId } = useParams(); 
  const navigate = useNavigate();

  return (
    <div className="dashboard-containers">
      {/* Pass studentId as a prop to SideNav */}
      <SideNav studentId={studentId} />

      {/* Main content */}
      <div className="main-contents">
        <header className="dashboard-header">Dashboard</header>
        <div className="button-grid">
          <div onClick={() => navigate(`/GoalsSettingInternalExam/${studentId}`)} className="dashboard-button orange">
            Goal setting entry
          </div>
          <div onClick={() => navigate(`/GoalSettingView/${studentId}`)} className="dashboard-button purple">
            Goal Setting View
          </div>
          <div onClick={() => navigate(`/ExternalReport/${studentId}`)} className="dashboard-button blue">
            <FaFileAlt className="button-icon" /> External report
          </div>
          <div onClick={() => navigate(`/ThirdPartyServicesStudent/${studentId}`)} className="dashboard-button light-gray">
            <FaHandsHelping className="button-icon" /> Third Party Optional Services
          </div>
          <div onClick={() => navigate(`/StudentWellbeingForm/${studentId}`)} className="dashboard-button gray">
            Student Wellbeing Request
          </div>
          <div onClick={() => navigate(`/Chatbot/${studentId}`)} className="dashboard-button pink">
            <FaComments className="button-icon" /> Chat
          </div>
          <div onClick={() => navigate(`/BehaviorAssessmentPage/${studentId}`)} className="dashboard-button dark-blue">
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
