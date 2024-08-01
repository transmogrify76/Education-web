import React, { useState } from 'react';
import './Reportc.css';

export default function Report() {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedReportCard, setSelectedReportCard] = useState('');

  // Sample options for academic years and report cards
  const academicYears = [
    { value: '2022-2023', label: '2022-2023' },
    { value: '2021-2022', label: '2021-2022' },
    // Add more options as needed
  ];

  const reportCards = [
    { value: 'report1', label: 'Report Card 1' },
    { value: 'report2', label: 'Report Card 2' },
    // Add more options as needed
  ];

  const handleViewPDF = () => {
    // Logic to handle viewing PDF
    console.log('View PDF button clicked');
  };

  return (
    <div className='report-container'>
      <h2 className='report-head'>Report Card</h2>
      <div className='report-para'>
        <p>Dear Parent, View your learner's report card by selecting the required fields from the dropdown menus below.</p>
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
        <div className='drop-btn'>
        <button onClick={handleViewPDF} className='view-pdf-button'>View PDF</button>
        </div>
      </div>
      
    </div>
  );
}
