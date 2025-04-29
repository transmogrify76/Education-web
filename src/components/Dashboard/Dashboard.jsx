import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLink } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
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
import './Dashboard.css';
import Header from '../Header/Header';

const Dashboard = () => {
  const { parentId } = useParams();
  const navigate = useNavigate();

  const renderIcon = (image) => {
    return typeof image === 'string' ? (
      <img src={image} className="icon" alt="icon" />
    ) : (
      <image className="icon" />
    );
  };

  const icons = [
    { name: 'Consent forms', image: informedConsentIcon, className: 'btn-1', link: `/consent` },
    { name: 'Time Table', image: timeIcon, className: 'btn-2', link: `/TimeTable` },
    { name: 'Exit Slip Request', image: menuIcon, className: 'btn-3', link: `/ExitSlipRequest` },
    { name: 'Virtual Meeting Link', image: FaLink, className: 'btn-25', link: `/ParentClassDataPage` },
    { name: 'TC Request', image: tcIcon, className: 'btn-6', link: `/TimeOfRequest` },
    { name: 'Transport request', image: roadIcon, className: 'btn-7', link: `/TransportRequest` },
    { name: 'Student profile', image: studentIcon, className: 'btn-8', link: `/StudentProfilePage` },
    { name: 'Notifications', image: notilIcon, className: 'btn-10', link: '/Notification' },
    { name: 'Third Party Optional Services', image: thirdIcon, className: 'btn-11', link: `/ThirdPartyServices` },
    { name: 'Parent Profile', image: childIcon, className: 'btn-12' },
    { name: 'Clubs', image: chatIcon, className: 'btn-14', link: '/ClubPage' },
    { name: 'Medical', image: medIcon, className: 'btn-15', link: '/Medical' },
    { name: 'Student ID Card', image: idIcon, className: 'btn-16', link: `/StudentIdCardPage` },
    { name: 'Calendar', image: calcIcon, className: 'btn-17', link: '/Calendar' },
    { name: 'Attendance', image: attenIcon, className: 'btn-18', link: "/Attendance" },
    { name: 'Online Fee Payment', image: feeIcon, className: 'btn-19', link: '/Paymentpage' },
    { name: 'Fee Reminder', image: feeremIcon, className: 'btn-20', link: `/FeeReminderPage` },
    { name: 'Student Leave Application', image: leaveIcon, className: 'btn-21', link: '/Leave' },
    { name: 'Parent counselling request', image: counIcon, className: 'btn-22', link: `/CounselingRequest` },
    { name: 'Behaviour assessment tool', image: behavIcon, className: 'btn-23', link: `/BehaviorAssessmentTool` },
    { name: 'Communication With Teacher',  className: 'btn-24', link: `/ParentMessages` },
  ];

  return (
    <div className="dashboard">
      <Header />
      <div className="btn-container">
        {icons.map(({ name, image, className, link }, index) => (
          <Link key={index} to={link} className={`button-card ${className}`}>
            {renderIcon(image)}
            <span>{name}</span>
          </Link>
        ))}
      </div>
      <div className="instruction-circle" onClick={() => navigate('/ParentInstructionPage')}> 
        ?
      </div>
    </div>
  );
};

export default Dashboard;
