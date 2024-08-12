import React, { useState } from 'react';
import './Externalr';
export default function Externalr(){
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedReportCardLevel, setSelectedReportCardLevel] = useState('');
  const [selectedReportCard, setSelectedReportCard] = useState('');

  // Sample options for academic years, report card levels, and report cards
  const academicYears = [
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' },
    // Add more options as needed
  ];

  const reportCardLevels = [
    { value: 'level1', label: 'Level 1' },
    { value: 'level2', label: 'Level 2' },
    // Add more options as needed
  ];

  const reportCards = [
    { value: 'report1', label: 'Report Card 1' },
    { value: 'report2', label: 'Report Card 2' },
    // Add more options as needed
  ];

  return (
    <div className='report-container'>
      <h2 className='report-head'>External Report</h2>
      <div className='report-para'>
        <p>Dear Parent, view the external report card by selecting the required fields from the dropdown menus below.</p>
      </div>
      <div className='dropdowns-container'>
        <div className='dropdown'>
          <label className='dropdown-label'>Academic Year:</label>
          <select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className='dropdown-select'
          >
            <option value=''>Please select</option>
            {academicYears.map(year => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>
        <div className='dropdown'>
          <label className='dropdown-label'>Report Card Level:</label>
          <select
            value={selectedReportCardLevel}
            onChange={(e) => setSelectedReportCardLevel(e.target.value)}
            className='dropdown-select'
          >
            <option value=''>Please select</option>
            {reportCardLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        <div className='dropdown'>
          <label className='dropdown-label'>Report Card:</label>
          <select
            value={selectedReportCard}
            onChange={(e) => setSelectedReportCard(e.target.value)}
            className='dropdown-select'
          >
            <option value=''>Please select</option>
            {reportCards.map(card => (
              <option key={card.value} value={card.value}>{card.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}