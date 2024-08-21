// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck } from 'react-icons/fa';
import './SideNav.css'; // Import the CSS file for Sidebar

function SideNav() {
  return (
    <nav className="sidebar">
      <ul>
        <li className="sidebar-item">
          <Link to="/StudentView">
            <FaTachometerAlt className="sidebar-icon" />
            Dashboard
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to="/GoalsSettingInternalExam">Goal setting entry</Link>
        </li>
        <li className="sidebar-items">
          <Link to="/GoalSettingView">Goal Setting View</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/external-report">
            <FaFileAlt className="sidebar-icon" />
            External report
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/third-party-services">
            <FaHandsHelping className="sidebar-icon" />
            Third Party Optional Services
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to="/student-wellbeing-request">Student Wellbeing Request</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/chat">
            <FaComments className="sidebar-icon" />
            Chat
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/behavior-assessment-tool">
            <FaClipboardCheck className="sidebar-icon" />
            Behavior assessment tool
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
