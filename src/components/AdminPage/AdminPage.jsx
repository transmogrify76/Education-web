// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
import calcIcon from '../Assets/schedule.png';
import attenIcon from '../Assets/attendence.png';
// import feeIcon from '../Assets/fee.png';
// import feeremIcon from '../Assets/payday.png';
// import leaveIcon from '../Assets/exit.png';
// import counIcon from '../Assets/discussion.png';
// import behavIcon from '../Assets/persuasive.png';
// import learningIcon from '../Assets/reading.png';
import './AdminPage.css';
import Header from '../Header/Header';
const AdminPage = () => {
  const { admin_id,} = useParams();
  // Assuming icons is an array of objects with name and icon properties
  const icons = [
    { name: 'Parent Registration', image: informedConsentIcon, className: 'btn-1', link: '/Parentregisterpage' },
    { name: 'Student Registration', image: informedConsentIcon, className: 'btn-2', link: '/studentregisterpage'},
    { name: 'Teacher Registration', image: informedConsentIcon, className: 'btn-3', link: '/teacherregister' },
    { name: 'TimeTable post', image: informedConsentIcon, className: 'btn-4', link: '/AdminTimeTable' },
    { name: 'Update Transfer Certificate', image: informedConsentIcon, className: 'btn-5',link: '/UpdateTc' },
    { name: 'Update Exit Slip', image: informedConsentIcon, className: 'btn-6', link: '/ExitSlipUpdate' },
    { name: 'Transport request Update', image: informedConsentIcon, className: 'btn-7',link:'/TransportRequestUpdatePage' },
    { name: 'Third Party Service Update', image: informedConsentIcon, className: 'btn-8', link: '/ThirdPartyServicesUpdatePage' },
    { name: 'Notification Page Update', image: informedConsentIcon, className: 'btn-9', link: '/NotificationPage' },
    { name: 'Leave Status Update', image: informedConsentIcon, className: 'btn-10', link: '/UpdateLeaveStatus' },
    { name: 'Consent froms', image: thirdIcon, className:'btn-11' , link: '/ConsentFormPage'},
    { name: 'Report card Update', image: childIcon, className: 'btn-12', link: '/' },
    { name: 'Student Messages', image: chatIcon, className: 'btn-13', link: `/AdminChat/${admin_id}` },
    { name: 'Student Wellbieng Request', image: chatIcon, className: 'btn-14',link:'/AdminWellbeingRequests' },
    { name: 'Behavior Assesment Tools ', image: informedConsentIcon, className: 'btn-15', link: '/AdminBehaviorAssessment' },
    { name: 'Class management Page', image: idIcon, className: 'btn-16', link: '/AdminClassMAnagementPage'},
    { name: 'Result Upload', image: calcIcon, className: 'btn-17', link: '/UploadResults' },
    { name: 'Fee Reminder Update', image: attenIcon, className: 'btn-18', link: '/AdminFeeReminderPage' }]
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


export default AdminPage;
