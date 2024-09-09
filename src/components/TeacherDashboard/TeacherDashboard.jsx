// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import informedConsentIcon from '../Assets/accept.png';
// import timeIcon from '../Assets/time.png';
// import menuIcon from '../Assets/menu.png';
// import registrationIcon from '../Assets/registration.png';
// import resultIcon from '../Assets/result.png';
// import tcIcon from '../Assets/tc.png';
// import roadIcon from '../Assets/bus.png';
// import studentIcon from '../Assets/student.png';
// import externalIcon from '../Assets/external.png';
// import notilIcon from '../Assets/noti.png';
import thirdIcon from '../Assets/third.png';
import childIcon from '../Assets/child.png';
// import circularIcon from '../Assets/circular.png';
import chatIcon from '../Assets/chat.png';
// import medIcon from '../Assets/hospital.png';
import idIcon from '../Assets/student-id.png';
// import calcIcon from '../Assets/schedule.png';
// import attenIcon from '../Assets/attendence.png';
// import feeIcon from '../Assets/fee.png';
// import feeremIcon from '../Assets/payday.png';
// import leaveIcon from '../Assets/exit.png';
// import counIcon from '../Assets/discussion.png';
// import behavIcon from '../Assets/persuasive.png';
// import learningIcon from '../Assets/reading.png';
import './TeacherDashboard.css';
import Header from '../Header/Header';
const TeacherDashboard = () => {
    const { teacherId,} = useParams();
//   const { admin_id,} = useParams();
  // Assuming icons is an array of objects with name and icon properties
  const icons = [
    { name: 'Class Management', image: informedConsentIcon, className: 'btn-1', link: `/ClassManagementPage/${teacherId}` },
    { name: 'Student Management', image: informedConsentIcon, className: 'btn-2', link: '/TeacherStudentManagementPage'},
    { name: 'Upload Assignment', image: informedConsentIcon, className: 'btn-3', link: '/AssignmentPostPage' },
    { name: 'Upload Result for Students', image: idIcon, className: 'btn-16', link: '/UploadTeacherResults'},
    { name: 'Make Communications', image: informedConsentIcon, className: 'btn-5',link: `/CommunicationPage/${teacherId}` },
    { name: 'Post Events for students', image: informedConsentIcon, className: 'btn-6', link: '/TeacherPage' },
    { name: 'Reasource Creation Page', image: informedConsentIcon, className: 'btn-7',link:`/CreateResourcePage/${teacherId}` },
    { name: 'Give Grade or remarks for student', image: informedConsentIcon, className: 'btn-8', link: '/GradePage' },
    { name: 'Create Assignment for student', image: informedConsentIcon, className: 'btn-9', link: '/AssignmentPostPage' }]
    // { name: 'Leave Status Update', image: informedConsentIcon, className: 'btn-10', link: '/UpdateLeaveStatus' },
    // { name: 'Consent froms', image: thirdIcon, className:'btn-11' , link: '/ConsentFormPage'},
    // { name: 'Report card Update', image: childIcon, className: 'btn-12', link: '/' },
    // { name: 'Student Messages', image: chatIcon, className: 'btn-13', link: `/AdminChat` },
    // { name: 'Student Wellbieng Request', image: chatIcon, className: 'btn-14',link:'/AdminWellbeingRequests' },
    // { name: 'Behavior Assesment Tools ', image: informedConsentIcon, className: 'btn-15', link: '/AdminBehaviorAssessment' }]
    // { name: 'Upload Result for Students', image: idIcon, className: 'btn-16', link: '/UploadTeacherResults'}]
//     { name: 'Calendar', image: calcIcon, className: 'btn-17', link: '/Calen' },
//     { name: 'Attendance', image: attenIcon, className: 'btn-18' },
//     { name: 'Online Fee Payment', image: feeIcon, className: 'btn-19' },
//     { name: 'Fee Reminder', image: feeremIcon, className: 'btn-20' },
//     { name: 'Student Leave Application', image: leaveIcon, className: 'btn-21', link: '/Leave'},
//     { name: 'Parent counselling request', image: counIcon, className: 'btn-22' },
//     { name: 'Behaviour assesment tool', image: behavIcon, className: 'btn-23' },
//     { name: 'The learning that was', image: learningIcon, className: 'btn-24' },
//   ];

  return (
    <div className="dashboard">
      <Header/>
      <div className="btn-container">
        {icons.map(({ name, image, className, link }, index) => (
          <Link key={index} to={link} className={`button-card ${className}`}>
            <img src={image} className="icon" alt={name} />
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}


export default TeacherDashboard;
