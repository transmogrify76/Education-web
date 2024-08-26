import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav';
import './ExternalReport.css';
import Header from '../Header/Header';
const ExternalReport = () => {
  const { studentId } = useParams();
  
  return (
    <div className='for-header'>
      <Header/>
    <div className="e-dash">
      <Sidebar studentId={studentId} />
      <div className="content">
        <div className="external-report-container">
          <h3>Dear Parent, view your learner's external report card by selecting the required fields from the dropdown menu below.</h3>
          <div className="external-report">
            <div className="report-pair">
              <label htmlFor="academic-year">Academic year:</label>
              <select id="academic-year">
                <option value="2024-2025">2024-2025</option>
              </select>
            </div> 
            <div className="report-pair">
              <label htmlFor="report-card-level">Report card level:</label>
              <select id="report-card-level">
                <option value="NGRT 2023-24">NGRT 2023-24</option>
              </select>
            </div>
            <div className="report-pair">
              <label htmlFor="report-card">Report card:</label>
              <select id="report-card">
                <option value="NGRT">NGRT</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ExternalReport;
