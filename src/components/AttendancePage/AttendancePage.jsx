import React, { useState } from 'react';

const AttendancePage = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const handleChildSelect = (child) => {
    setSelectedChild(child);
  };

  const handleScan = () => {
    // Simulate scanning ID card
    const currentTime = new Date().toLocaleString();
    setAttendance([...attendance, { child: selectedChild, time: currentTime }]);
  };

  return (
    <div className="attendance-page">
      <h1 className="page-title">Student Attendance</h1>

      <div className="child-selection">
        <h2 className="section-title">Select Your Child</h2>
        <div className="child-list">
          <div className="child-item" onClick={() => handleChildSelect('John Doe')}>
            <span className="child-name">John Doe</span>
          </div>
          <div className="child-item" onClick={() => handleChildSelect('Jane Smith')}>
            <span className="child-name">Jane Smith</span>
          </div>
        </div>
      </div>

      <div className="scan-section">
        <h2 className="section-title">Scan ID Card</h2>
        <button className="scan-button" onClick={handleScan}>
          Scan
        </button>
      </div>

      <div className="attendance-list">
        <h2 className="section-title">Attendance</h2>
        {attendance.map((entry, index) => (
          <div key={index} className="attendance-entry">
            <span className="child-name">{entry.child}</span>
            <span className="time">{entry.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePage;