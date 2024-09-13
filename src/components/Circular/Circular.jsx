import React, { useState } from 'react';
import './Circular.css'; // Assuming you have a CSS file named Circular.css
import Header from '../Header/Header'

const Circular = () => {
  const [currentVisible, setCurrentVisible] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month
  const [selectedQuantity, setSelectedQuantity] = useState(1); // Default quantity is set to 1
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value));
  };

  const handleAcademicYearChange = (event) => {
    setSelectedAcademicYear(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    // Logic for searching based on fromDate, toDate, selectedMonth, selectedQuantity, and selectedAcademicYear
    console.log('Searching...');
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setSelectedMonth('');
    setSelectedQuantity(1);
    setSelectedAcademicYear('');
    setSearchTerm('');
    // Additional logic for resetting other state or form fields if needed
  };

  // Array of quantities for dropdown from 1 to 10
  const quantityOptions = Array.from({ length: 10 }, (_, index) => index + 1);

  // Sample academic years for dropdown (replace with actual data)
  const academicYearOptions = [
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2020-2021',
    '2019-2020',
    '2018-2019'
  ];

  // Array of months for dropdown
  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <Header/>
    <div className="circular-file-container">
      <div className="options-panel">
        <div className="options-top">
          <button
            className={currentVisible ? 'active' : ''}
            onClick={() => setCurrentVisible(true)}
          >
            Current
          </button>
          <button
            className={!currentVisible ? 'active' : ''}
            onClick={() => setCurrentVisible(false)}
          >
            Archive
          </button>
        </div>
        <div className="options-bottom">
          {!currentVisible ? (
            <React.Fragment>
              <div className="option">
                <label htmlFor="academicYear">Academic Year:</label>
                <select
                  id="academicYear"
                  value={selectedAcademicYear}
                  onChange={handleAcademicYearChange}
                >
                  <option value="">Select Academic Year</option>
                  {academicYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="option">
                <label htmlFor="selectedMonth">Month:</label>
                <select
                  id="selectedMonth"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="">Select Month</option>
                  {monthOptions.map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="option">
                <label htmlFor="fromDate">From Date:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={handleFromDateChange}
                />
              </div>
              <div className="option">
                <label htmlFor="toDate">To Date:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={handleToDateChange}
                />
              </div>
            </React.Fragment>
          )}
          <div className="buttons-row">
            <button className="search-button" onClick={handleSearch}>Search</button>
            <button className="reset-button" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
      <div className="options-bottom">
        <div className="option">
          <select
            id="quantity"
            value={selectedQuantity}
            onChange={handleQuantityChange}
            className="quantity-select"
          >
            {quantityOptions.map((quantity) => (
              <option key={quantity} value={quantity}>
                {quantity}
              </option>
            ))}
          </select>
        </div>
        <div className="search-bar">
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>
      </div>     
    </div>
    </div>
  );
};

export default Circular;
