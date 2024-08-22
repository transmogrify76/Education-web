import React from 'react';
import Sidebar from '../SideNav/SideNav';
import './ThirdPartyServicesStudent.css';

const ThirdPartyServicesStudent = () => {
  // Example studentId, replace with actual logic to fetch or pass the studentId
  const studentId = 12345;

  return (
    <div className="page-containerss">
      <Sidebar studentId={studentId} />
      <h1>Third Party Optional Services</h1>
    </div>
  );
};

export default ThirdPartyServicesStudent;
