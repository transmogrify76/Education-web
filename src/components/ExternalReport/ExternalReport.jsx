import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../SideNav/SideNav';
import Header from '../Header/Header';
import './ExternalReport.css';

const ExternalReport = () => {
  const { studentId } = useParams();
  const [academicYear, setAcademicYear] = useState('');
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch result data by year when the search button is clicked
  const fetchResultDataByYear = async (year) => {
    try {
      const response = await axios.get(`http://localhost:3000/results/year/${year}`);
      setResultData(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch result data for the specified year');
      setResultData(null);
      console.error('Error fetching result data:', error);
    }
  };

  const handleYearChange = (e) => {
    setAcademicYear(e.target.value);
  };

  const handleSearch = () => {
    if (academicYear) {
      fetchResultDataByYear(academicYear);
    } else {
      setError('Please enter a valid year');
    }
  };

  const handleDownload = async (filePath) => {
    try {
      const response = await axios({
        url: `http://localhost:3000/${filePath}`,
        method: 'GET',
        responseType: 'blob', // Important for handling file downloads
      });

      // Create a Blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element, set its href to the object URL, and trigger a download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop()); // Extract filename from filePath
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download the file');
    }
  };

  return (
    <div className='for-header'>
      <Header />
      <div className="e-dash">
        <Sidebar studentId={studentId} />
        <div className="content">
          <div className="external-report-container">
            <h3>Search and download external report cards by entering the academic year.</h3>
            <div className="external-report">
              <div className="report-pair">
                <label htmlFor="academic-year">Academic year:</label>
                <input
                  type="number"
                  id="academic-year"
                  value={academicYear}
                  onChange={handleYearChange}
                  placeholder="Enter Year (e.g., 2021)"
                  min="2000"
                  max={new Date().getFullYear()} // Limits the input to the current year or earlier
                />
              </div>
              <button onClick={handleSearch} className="search-btn">Search</button>
            </div>

            {error ? (
              <p className="error-message">{error}</p>
            ) : resultData && resultData.length > 0 ? (
              <div className="result-section">
                <h4>Results for the Year {academicYear}</h4>
                {resultData.map((result) => (
                  <div key={result.id} className="result-item">
                    <p>Student: {result.student.name} (ID: {result.student.id})</p>
                    <p>Enrollment No: {result.student.enrollmentNo}</p>
                    <button
                      onClick={() => handleDownload(result.filePath)}
                      className="download-btn"
                    >
                      Download Result
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results found for the specified year.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalReport;
