import React from 'react';

export const Dashboard = () => {
  // Assuming icons is an array of objects with name and icon properties
  const icons = [
    { name: 'Consent forms', img: '../src', className: 'btn-1' },
    { name: 'Time Table', icon: 'icon2', className: 'btn-2' },
    { name: 'Exit Slip Request', icon: 'icon3', className: 'btn-3' },
    { name: 'Registration Info', icon: 'icon4', className: 'btn-4' },
    { name: 'Report Card PDF', icon: 'icon5', className: 'btn-5' },
    { name: 'TC Request', image: '/inormed-consent.png', className: 'btn-6' },
    { name: 'Transport request', icon: 'icon7', className: 'btn-7' },
    { name: 'Student profile', icon: 'icon8', className: 'btn-8' },
    { name: 'External report', icon: 'icon9', className: 'btn-9' },
    { name: 'Notifications', icon: 'icon10', className: 'btn-10' },
    { name: 'Third Party Optinal Services', icon: 'icon11', className: 'btn-11' },
    { name: 'Parent Profile', icon: 'icon12', className: 'btn-12' },
    { name: 'Circular', icon: 'icon13', className: 'btn-13' },
    { name: 'H2H', icon: 'icon14', className: 'btn-14' },
    { name: 'Medical', icon: 'icon15', className: 'btn-15' },
    { name: 'Student ID Card', icon: 'icon16', className: 'btn-16' },
    { name: 'Calender', icon: 'icon17', className: 'btn-17' },
    { name: 'Attendance', icon: 'icon18', className: 'btn-18' },
    { name: 'Online Fee Payment', icon: 'icon19', className: 'btn-19' },
    { name: 'Fee Reminder', icon: 'icon20', className: 'btn-20' },
    { name: 'Student Leave Application', icon: 'icon21', className: 'btn-21' },
    { name: 'Parrent counselling request', icon: 'icon22', className: 'btn-22' },
    { name: 'Behaviour assesment tool', icon: 'icon23', className: 'btn-23' },
    { name: 'The learning that was', icon: 'icon24', className: 'btn-24' },
  ];

  return (
    <div className="dashboard">
      <div className="head">
        Dashboard
      </div>
      <div className="btn-container">
        {icons.map(({ name, image, className }, index) => (
          <button key={index} className={`button-card ${className}`}>
            <img src={image} className="icon" />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
