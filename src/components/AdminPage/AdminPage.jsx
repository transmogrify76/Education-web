// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import informedConsentIcon from '../Assets/accept.png';
import timeIcon from '../Assets/time.png';
import menuIcon from '../Assets/menu.png';
import registrationIcon from '../Assets/registration.png';
import resultIcon from '../Assets/result.png';
import tcIcon from '../Assets/tc.png';
import roadIcon from '../Assets/bus.png';
import studentIcon from '../Assets/student.png';
import externalIcon from '../Assets/external.png';
import notilIcon from '../Assets/noti.png';
import thirdIcon from '../Assets/third.png';
import childIcon from '../Assets/child.png';
import circularIcon from '../Assets/circular.png';
import chatIcon from '../Assets/chat.png';
import medIcon from '../Assets/hospital.png';
import idIcon from '../Assets/student-id.png';
import calcIcon from '../Assets/schedule.png';
import attenIcon from '../Assets/attendence.png';
import feeIcon from '../Assets/fee.png';
import feeremIcon from '../Assets/payday.png';
import leaveIcon from '../Assets/exit.png';
import counIcon from '../Assets/discussion.png';
import behavIcon from '../Assets/persuasive.png';
import learningIcon from '../Assets/reading.png';
import './AdminPage.css';
import Header from '../Header/Header';
const AdminPage = () => {
  // Assuming icons is an array of objects with name and icon properties
  const icons = [
    { name: 'Consent forms', image: informedConsentIcon, className: 'btn-1', link: '/StudentRegisterPage' },]
//     { name: 'Time Table', image: timeIcon, className: 'btn-2'},
//     { name: 'Exit Slip Request', image: menuIcon, className: 'btn-3' },
//     { name: 'Registration Info', image: registrationIcon, className: 'btn-4' },
//     { name: 'Report Card PDF', image: resultIcon, className: 'btn-5',link: '/reportc' },
//     { name: 'TC Request', image: tcIcon, className: 'btn-6' },
//     { name: 'Transport request', image: roadIcon, className: 'btn-7' },
//     { name: 'Student profile', image: studentIcon, className: 'btn-8' },
//     { name: 'External report', image: externalIcon, className: 'btn-9', link: '/Externalr' },
//     { name: 'Notifications', image: notilIcon, className: 'btn-10' },
//     { name: 'Third Party Optinal Services', image: thirdIcon, className:'btn-11'},
//     { name: 'Parent Profile', image: childIcon, className: 'btn-12' },
//     { name: 'Circular', image: circularIcon, className: 'btn-13', link: '/Circular' },
//     { name: 'H2H', image: chatIcon, className: 'btn-14' },
//     { name: 'Medical', image: medIcon, className: 'btn-15' },
//     { name: 'Student ID Card', image: idIcon, className: 'btn-16'},
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


export default AdminPage;
