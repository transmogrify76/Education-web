import React, { useState } from 'react';
import './Calendar.css'; // Import your CSS file for styling

const Calendar = () => {
  const [date, setDate] = useState(new Date());

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Determine the starting day index in daysOfWeek
  const startDayIndex = daysOfWeek.indexOf('Sunday'); // Start index assuming start from Sunday
  const offset = (firstDayOfMonth - startDayIndex + 7) % 7; // Calculate offset to shift start

  // Rotate daysOfWeek array based on startDayIndex
  const rotatedDaysOfWeek = [...daysOfWeek.slice(offset), ...daysOfWeek.slice(0, offset)];

  // Create an array representing the days in the current month
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const goToPreviousMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-top">
        <h2 className="calendar-month-year">{months[currentMonth]} {currentYear}</h2>
      </div>
      <div className="calendar-navigation">
        <button className="calendar-navigation-button" onClick={goToPreviousMonth}>{'<'}</button>
        <button className="calendar-navigation-button" onClick={goToNextMonth}>{'>'}</button>
      </div>
      <div className="calendar">
        <div className="calendar-days">
          {rotatedDaysOfWeek.map(day => (
            <div key={day} className="calendar-day">{day.slice(0, 3)}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {Array(offset)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day empty"></div>
            ))}
          {monthDays.map(day => (
            <div key={day} className="calendar-day">{day}</div>
          ))}
        </div>
      </div>
      <div className="calendar-info">
        <div className="calendar-info-item">Month: {months[currentMonth]}</div>
        <div className="calendar-info-item">Week: {Math.ceil((offset + daysInMonth) / 7)}</div>
        <div className="calendar-info-item">Day: {daysOfWeek[firstDayOfMonth]}</div>
      </div>
    </div>
  );
};

export default Calendar;
