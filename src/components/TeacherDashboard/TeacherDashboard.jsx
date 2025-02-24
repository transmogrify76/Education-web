// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChalkboardTeacher, faUserGraduate, faClipboardList, faFileUpload, faComments, faCalendarAlt, faBook, faStar, faFolderOpen, faLink, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Added faCheckCircle
import './TeacherDashboard.css';
import Header from '../Header/Header';

const TeacherDashboard = () => {
  const { teacherId } = useParams();

  const icons = [
    // { name: 'Class Management', icon: faChalkboardTeacher, className: 'btn-1', link: `/ClassManagementPage` },
    // { name: 'Student Management', icon: faUserGraduate, className: 'btn-2', link: '/TeacherStudentManagementPage' },
    { name: 'Upload Assignment', icon: faClipboardList, className: 'btn-3', link: '/AssignmentPostPage' },
    { name: 'Upload Result for Students', icon: faFileUpload, className: 'btn-4', link: '/UploadResults' },
    { name: 'Make Communications', icon: faComments, className: 'btn-5', link: `/CommunicationPage` },
    { name: 'Post Events for Students', icon: faCalendarAlt, className: 'btn-6', link: '/TeacherPage' },
    { name: 'Resource Creation Page', icon: faBook, className: 'btn-7', link: `/CreateResourcePage` },
    { name: 'Give Grades or Remarks', icon: faStar, className: 'btn-8', link: '/GradePage' },
    { name: 'Submitted Assignments', icon: faFolderOpen, className: 'btn-9', link: '/SubmittedAssignment' },
    { name: 'E-Book Upload', icon: faBook, className: 'btn-10', link: '/ebookpage' },
    { name: 'Google Meeting Link', icon: faLink, className: 'btn-100', link: '/CreateMeeting' },
    { name: 'Subject Add ', icon: faFolderOpen, className: 'btn-25', link: '/SubjectEdit' },
    { name: 'Attendance', icon: faCheckCircle, className: 'btn-11', link: '/AttendancePage' } // Added Attendance option
  ];

  return (
    <div className="dashboard">
      <Header />
      <div className="btn-container">
        {icons.map(({ name, icon, className, link }, index) => (
          <Link key={index} to={link} className={`button-card ${className}`}>
            <FontAwesomeIcon icon={icon} className="icon" />
            <span>{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
