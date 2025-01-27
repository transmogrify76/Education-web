import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaFileAlt, FaHandsHelping, FaComments, FaClipboardCheck, FaEnvelope } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import './SideNav.css'; // Import the CSS file for Sidebar

function SideNav() {
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    // Get the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Decode the token to get the studentId
        const decodedToken = jwtDecode(authToken); // Correct usage
        setStudentId(decodedToken.Id); // Access the correct field (Id) in the decoded token
      } catch (error) {
        console.error('Failed to decode authToken:', error);
      }
    }
  }, []);

  // If studentId is not available, show a loading message or handle the error
  if (!studentId) {
    return <div>Loading...</div>; // Or handle it in another way
  }

  return (
    <nav className="sidebar">
      <ul>
        <li className="sidebar-item">
          <Link to={`/StudentView`}>
            <FaTachometerAlt className="sidebar-icon" />
            Dashboard
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/GoalsSettingInternalExam`}>
            Goal setting entry
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/GoalSettingView`}>
            Goal Setting View
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ExternalReport`}>
            <FaFileAlt className="sidebar-icon" />
            External report
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ThirdPartyServicesStudent`}>
            <FaHandsHelping className="sidebar-icon" />
            Third Party Optional Services
          </Link>
        </li>
        <li className="sidebar-items">
          <Link to={`/StudentWellbeingForm`}>
            Student Wellbeing Request
          </Link>
        </li>
        {/* <li className="sidebar-item">
          <Link to={`/Chatbot`}>
            <FaComments className="sidebar-icon" />
            Chat
          </Link>
        </li> */}
        <li className="sidebar-item">
          <Link to={`/BehaviorAssessmentPage`}>
            <FaClipboardCheck className="sidebar-icon" />
            Behavior assessment tool
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/StudentMessages`}>
            <FaEnvelope className="sidebar-icon" />
            Communication With Teacher
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/AssignmentSubmissionPage`}>
            <FaClipboardCheck className="sidebar-icon" />
            Assignment Submission
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ResourceShowPage`}>
            <FaFileAlt className="sidebar-icon" />
            Resource of the Class
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/StudentGradesPage`}>
            <FaClipboardCheck className="sidebar-icon" />
            All Grades
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to={`/ShowEbookPage`}>
            <FaClipboardCheck className="sidebar-icon" />
            E Books
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
