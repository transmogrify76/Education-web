import React, { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import html2pdf from 'html2pdf.js';
import logo from '../Assets/logo.png';
import './ExternalReport.css';

const ExternalReport = () => {
  const [studentInfo, setStudentInfo] = useState({ name: '', enrollmentNo: '', className: '' });
  const [allResults, setAllResults] = useState([]); // All raw results
  const [filteredResults, setFilteredResults] = useState({});
  const [studentId, setStudentId] = useState(null);
  const [year, setYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const pdfRef = useRef();

  useEffect(() => {
    // Get studentId from JWT
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setStudentId(decodedToken.Id);
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!studentId) return;

    const fetchClassData = async () => {
      try {
        const classResponse = await fetch('http://192.168.0.103:3000/class');
        const classData = await classResponse.json();

        for (const cls of classData) {
          const student = cls.students.find((s) => s.id === studentId);
          if (student) {
            setStudentInfo({
              name: student.name,
              enrollmentNo: student.enrollmentNo,
              className: cls.className,
            });
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    const fetchResults = async () => {
      try {
        const response = await fetch(`http://192.168.0.103:3000/results/student/${studentId}`);
        const data = await response.json();

        setAllResults(data);

        // Extract available years
        const years = Array.from(new Set(data.map((res) => res.year)));
        setAvailableYears(years.sort((a, b) => b - a));

        // Set default selected year to latest
        if (years.length > 0) {
          setYear(years[0]);
        }
      } catch (error) {
        console.error("Error fetching result data:", error);
      }
    };

    fetchClassData();
    fetchResults();
  }, [studentId]);

  // Filter results when year or allResults change
  useEffect(() => {
    if (!year || allResults.length === 0) return;

    const subjectMap = {};

    const filtered = allResults.filter((res) => res.year === Number(year));

    for (let i = 0; i < filtered.length; i++) {
      const { subject, marks, id } = filtered[i];
      if (!subjectMap[subject.name] || id > subjectMap[subject.name].id) {
        subjectMap[subject.name] = { marks, id };
      }
    }

    setFilteredResults(subjectMap);
  }, [year, allResults]);

  const generatePDF = () => {
    const element = pdfRef.current;
    document.querySelector(".pdf-button").style.display = "none";

    const opt = {
      margin: 1,
      filename: `Result_${studentInfo.name}_${year}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        document.querySelector(".pdf-button").style.display = "inline-block";
      });
  };

  return (
    <div className="result-page" ref={pdfRef}>
      <div className="pdf-header">
        <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
        <h2>Edu Web School</h2>
      </div>

      <h1>Student Results</h1>
      <h3>Name: {studentInfo.name}</h3>
      <h4>Enrollment Number: {studentInfo.enrollmentNo}</h4>
      <h4>Class: {studentInfo.className}</h4>

      {/* Year selector */}
      <div className="form-group">
        <label htmlFor="yearSelect">Select Year</label>
        <select
          id="yearSelect"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <table className="result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filteredResults).length > 0 ? (
            Object.keys(filteredResults).map((subjectName, index) => (
              <tr key={index}>
                <td>{subjectName}</td>
                <td>{filteredResults[subjectName].marks ?? 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No results found for {year}</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="pdf-button" onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default ExternalReport;
