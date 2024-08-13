import React, { useState, useEffect } from 'react';
import './Calendar.css';

// List of fixed school holidays
const fixedHolidays = [
  { month: 0, day: 1, name: 'New Year\'s Day' }, // January 1
  { month: 0, day: 23, name: 'Netaji Subhas Chandra Bose Jayanti' }, // January 23
  { month: 0, day: 26, name: 'Republic Day' }, // January 26
  { month: 7, day: 15, name: 'Independence Day' }, // August 15
  { month: 9, day: 2, name: 'Gandhi Jayanti' }, // October 2
  { month: 11, day: 25, name: 'Christmas Day' } // December 25
];

// Function to calculate Good Friday date
const calculateGoodFriday = (year) => {
  const getEasterSunday = (year) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  };
  
  const easterSunday = getEasterSunday(year);
  const goodFriday = new Date(easterSunday);
  goodFriday.setDate(easterSunday.getDate() - 2); // Good Friday is 2 days before Easter Sunday
  return goodFriday;
};

const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

const generateCalendarDays = (year, month) => {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Fill the initial empty days
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Fill the actual days of the month
  for (let i = 1; i <= lastDate; i++) {
    days.push(i);
  }

  return days;
};

// Function to get holidays for a specific year and month
const getHolidaysForMonth = (year, month) => {
  const holidays = [...fixedHolidays];
  const goodFriday = calculateGoodFriday(year);
  
  // Adding Good Friday to holidays list
  if (goodFriday.getMonth() === month) {
    holidays.push({ month: goodFriday.getMonth(), day: goodFriday.getDate(), name: 'Good Friday' });
  }
  
  return holidays
    .filter(holiday => holiday.month === month)
    .map(holiday => ({
      ...holiday,
      date: `${year}-${month + 1}-${holiday.day < 10 ? `0${holiday.day}` : holiday.day}`
    }));
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setHolidays(getHolidaysForMonth(year, month));
  }, [currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);
  const monthName = getMonthName(month);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h1>{monthName} {year}</h1>
        <div className="calendar-controls">
          <button onClick={handlePreviousMonth} disabled={month === 0 && year === new Date().getFullYear() && month === new Date().getMonth()}>
            &lt; Previous
          </button>
          <button onClick={handleNextMonth}>
            Next &gt;
          </button>
        </div>
      </header>
      <div className="calendar-body">
        <div className="calendar-grid">
          <div className="calendar-day day-name">Sun</div>
          <div className="calendar-day day-name">Mon</div>
          <div className="calendar-day day-name">Tue</div>
          <div className="calendar-day day-name">Wed</div>
          <div className="calendar-day day-name">Thu</div>
          <div className="calendar-day day-name">Fri</div>
          <div className="calendar-day day-name">Sat</div>
          {days.map((day, index) => {
            const date = day ? `${year}-${month + 1}-${day < 10 ? `0${day}` : day}` : null;
            const isHoliday = holidays.some(holiday => holiday.date === date);

            return (
              <div
                key={index}
                className={`calendar-day${day === null ? ' empty' : ''}${index % 7 === 0 ? ' sunday' : ''}${isHoliday ? ' holiday' : ''}`}
              >
                {day || ''}
                {isHoliday && <span className="holiday-name">{holidays.find(holiday => holiday.date === date).name}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
