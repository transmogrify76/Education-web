import React from 'react';
import './Chatbot.css';

function chatbot() {
  return (
    
    <div className="teaching-staff">
      <div className="new-staff">New</div>
      <div className="staff-member">
        <img src="staff-member-image.jpg" alt="Staff Member" />
        <h3>John Doe</h3>
        <p>Teacher</p>
      </div>
      <div className="staff-member">
        <img src="staff-member-image2.jpg" alt="Staff Member" />
        <h3>Jane Smith</h3>
        <p>Principal</p>
      </div>
      {/* Add more staff member details here */}
    </div>
  );
}

export default chatbot;