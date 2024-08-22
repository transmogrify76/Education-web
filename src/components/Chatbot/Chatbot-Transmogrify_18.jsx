import React from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import './Chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

function StaffMember({ imageSrc, name, role }) {
  return (
    <div className="staff-member">
      <img src={imageSrc} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

function Chatbot() {
  const { studentId } = useParams();
  // Example studentId, replace with actual logic to fetch or pass the studentId


  return (
    <div className="teaching-staff">
      <SideNav studentId={studentId} />
      <div className='chat-head'>
        <h1>Teaching Staff</h1>
      </div>
      <div className="main-content">
        <button className="new-button">
          <FontAwesomeIcon icon={faCommentDots} className="iconssss" />
          New
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
