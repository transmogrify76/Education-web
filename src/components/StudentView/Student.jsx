import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav'; 
import { FaFileAlt, FaHandsHelping, FaComments,FaClipboardCheck,FaLink,FaBook } from 'react-icons/fa';
import './Student.css'; 
import Header from '../Header/Header';
import {jwtDecode} from 'jwt-decode'; 

function Student() {
  const [studentId, setStudentId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken); 
        setStudentId(decodedToken.id); 
      } catch (error) {
        console.error('Failed to decode authToken:', error);
      }
    } else {
      console.error('No authToken found in localStorage');
    }
  }, []);

  return (
    <div className='for-header'>
      <Header/>
      <div className="dashboard-containers">
        <SideNav studentId={studentId} /> 
        
        <div className="main-contents">
          <header className="dashboard-header">Dashboard</header>
          <div className="button-grid">
            <div onClick={() => navigate(`/GoalsSettingInternalExam`)} className="dashboard-button orange">
              Goal setting entry
            </div>
            <div onClick={() => navigate(`/GoalSettingView`)} className="dashboard-button purple">
              Goal Setting View
            </div>
            <div onClick={() => navigate(`/ExternalReport`)} className="dashboard-button blue">
              <FaFileAlt className="button-icon" /> External report
            </div>
            <div onClick={() => navigate(`/ThirdPartyServicesStudent`)} className="dashboard-button light-gray">
              <FaHandsHelping className="button-icon" /> Third Party Optional Services
            </div>
            <div onClick={() => navigate(`/StudentWellbeingForm`)} className="dashboard-button gray">
              Student Wellbeing Request
            </div>
            {/* <div onClick={() => navigate(`/Chatbot`)} className="dashboard-button pink">
              <FaComments className="button-icon" /> Chat
            </div> */}
            <div onClick={() => navigate(`/BehaviorAssessmentPage`)} className="dashboard-button dark-blue">
              <FaClipboardCheck className="button-icon" /> Behavior assessment tool
            </div>
            <div onClick={() => navigate(`/StudentMessages`)} className="dashboard-button dark-violet">
              <FaComments className="button-icon" /> Communication With Teacher
            </div>
            <div onClick={() => navigate(`/AssignmentSubmissionPage`)} className="dashboard-button light-gray">
              <FaClipboardCheck className="button-icon" /> Assignment Submission
            </div>
            <div onClick={() => navigate(`/ResourceShowPage`)} className="dashboard-button dark-violet">
              <FaComments className="button-icon" /> Resource of the class
            </div>
            <div onClick={() => navigate(`/StudentGradesPage`)} className="dashboard-button orange">
              <FaClipboardCheck className="button-icon" /> All Grades
            </div>
            <div onClick={() => navigate(`/ShowEbookPage`)} className="dashboard-button light-gray">
              <FaBook className="button-icon" /> E-Books
            </div>
            <div onClick={() => navigate(`/ParentClassDataPage`)} className="dashboard-button dark-violet">
              <FaLink className="button-icon" /> Virtual Meeting Link
            </div>
            <div onClick={() => navigate(`/Profile`)} className="dashboard-button dark-blue">
               Student Profile
            </div>
          </div>
          <div className="alerts-section">
            <h2 className="alerts-header">
              ALERTS <span className="alerts-subheader">(Newest 5)</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
