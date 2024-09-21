import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './AdminPage.css';

const AdminPage = () => {
  const { admin_id } = useParams();

  const icons = [
    { name: 'Parent Registration', icon: 'fas fa-user-tie', className: 'btn-1', link: '/Parentregisterpage' },
    { name: 'Student Registration', icon: 'fas fa-user-graduate', className: 'btn-2', link: '/studentregisterpage' },
    { name: 'Teacher Registration', icon: 'fas fa-chalkboard-teacher', className: 'btn-3', link: '/teacherregister' },
    { name: 'TimeTable Post', icon: 'fas fa-calendar-day', className: 'btn-10', link: '/AdminTimeTable' },
    { name: 'Update Transfer Certificate', icon: 'fas fa-certificate', className: 'btn-5', link: '/UpdateTc' },
    { name: 'Update Exit Slip', icon: 'fas fa-sign-out-alt', className: 'btn-6', link: '/ExitSlipUpdate' },
    { name: 'Transport Request Update', icon: 'fas fa-bus', className: 'btn-7', link: '/TransportRequestUpdatePage' },
    { name: 'Third Party Service Update', icon: 'fas fa-external-link-alt', className: 'btn-8', link: '/ThirdPartyServicesUpdatePage' },
    { name: 'Notification Page Update', icon: 'fas fa-bell', className: 'btn-9', link: '/NotificationPage' },
    { name: 'Leave Status Update', icon: 'fas fa-calendar-check', className: 'btn-10', link: '/UpdateLeaveStatus' },
    { name: 'Consent Forms', icon: 'fas fa-file-alt', className: 'btn-11', link: '/ConsentFormPage' },
    { name: 'Report Card Update', icon: 'fas fa-file', className: 'btn-12', link: '/' },
    { name: 'Student Messages', icon: 'fas fa-comments', className: 'btn-13', link: `/AdminChat/${admin_id}` },
    { name: 'Student Wellbeing Request', icon: 'fas fa-heart', className: 'btn-14', link: '/AdminWellbeingRequests' },
    { name: 'Behavior Assessment Tools', icon: 'fas fa-behavior', className: 'btn-15', link: '/AdminBehaviorAssessment' },
    { name: 'Class Management Page', icon: 'fas fa-users', className: 'btn-16', link: '/AdminClassMAnagementPage' },
    { name: 'Result Upload', icon: 'fas fa-upload', className: 'btn-17', link: '/UploadResults' },
    { name: 'Fee Reminder Update', icon: 'fas fa-money-bill-alt', className: 'btn-19', link: '/AdminFeeReminderPage' }
  ];

  return (
    <div className="dashboard">
      <Header />
      <div className="btn-container">
        {icons.map(({ name, icon, className, link }, index) => (
          <Link key={index} to={link} className={`button-card ${className}`}>
            <i className={icon}></i>
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
