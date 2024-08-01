import React, { useState } from 'react';
import './Calen.css'; // Import your CSS file for styling

const Calen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonthDate = new Date(prevDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonthDate = new Date(prevDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(<div key={day} className="calendar-day">{day}</div>);
  }

  return (
    <div className="calendar-container">
      <div className="top-head">
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h2>
      </div>
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar">
        <div className="calendar-days">
          <div className="day-label">Sun</div>
          <div className="day-label">Mon</div>
          <div className="day-label">Tue</div>
          <div className="day-label">Wed</div>
          <div className="day-label">Thu</div>
          <div className="day-label">Fri</div>
          <div className="day-label">Sat</div>
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    </div>
  );
};

export default Calen;
