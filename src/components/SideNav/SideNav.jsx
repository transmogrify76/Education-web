import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck, FaEnvelope } from 'react-icons/fa';
import './SideNav.css'; // Import the CSS file for Sidebar

function SideNav({ studentId }) {
  if (!studentId) {
    console.error('No studentId provided to SideNav');
    return null; // or handle error appropriately
  }

  return (
    <nav className="sidebar">
      <ul>
        <li className="sidebar-item">
          <Link to={`/StudentView/${studentId}`}>
            <FaTachometerAlt className="sidebar-icon" />
            Dashboard
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/GoalsSettingInternalExam/${studentId}`}>
            Goal setting entry
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/GoalSettingView/${studentId}`}>
            Goal Setting View
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ExternalReport/${studentId}`}>
            <FaFileAlt className="sidebar-icon" />
            External report
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ThirdPartyServicesStudent/${studentId}`}>
            <FaHandsHelping className="sidebar-icon" />
            Third Party Optional Services
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/StudentWellbeingForm/${studentId}`}>
            Student Wellbeing Request
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/Chatbot/${studentId}`}>
            <FaComments className="sidebar-icon" />
            Chat
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/BehaviorAssessmentPage/${studentId}`}>
            <FaClipboardCheck className="sidebar-icon" />
            Behavior assessment tool
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/StudentMessages/${studentId}`}>
            <FaEnvelope className="sidebar-icon" />
            Communication With Teacher
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
