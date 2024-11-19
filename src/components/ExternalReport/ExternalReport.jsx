import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import logo from '../Assets/logo.png'; // Adjust this path as needed
import './ExternalReport.css';

const ExternalReport = () => {
  const { studentId } = useParams();
  const [studentInfo, setStudentInfo] = useState({ name: '', enrollmentNo: '', className: '' });
  const [results, setResults] = useState({}); // Store results by subject
  const pdfRef = useRef();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classResponse = await fetch('http://localhost:3000/class');
        const classData = await classResponse.json();

        let foundClass = '';
        classData.forEach(cls => {
          const studentInClass = cls.students.find(student => student.id === parseInt(studentId));
          if (studentInClass) {
            foundClass = cls.className;
            setStudentInfo(prevInfo => ({
              ...prevInfo,
              name: studentInClass.name,
              enrollmentNo: studentInClass.enrollmentNo,
              className: foundClass,
            }));
          }
        });
        if (!foundClass) {
          console.error("Student not found in any class.");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:3000/results/student/${studentId}`);
        const data = await response.json();

        const subjectMap = {};

        for (let i = 0; i < data.length; i++) {
          const { subject, marks, id } = data[i];

          if (!subjectMap[subject.name]) {
            subjectMap[subject.name] = { marks, id };
          } else {
            if (id > subjectMap[subject.name].id) {
              subjectMap[subject.name] = { marks, id };
            }
          }
        }

        setResults(subjectMap);
      } catch (error) {
        console.error("Error fetching result data:", error);
      }
    };

    fetchClassData();
    fetchResults();
  }, [studentId]);

  const generatePDF = () => {
    const element = pdfRef.current;

    // Hide the PDF button while generating the PDF
    document.querySelector(".pdf-button").style.display = "none";

    const opt = {
      margin:       1,
      filename:     `Result_${studentId}.pdf`,
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
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
      {/* This content will be hidden on screen but included in PDF */}
      <div className="pdf-header">
        <img src={logo} alt="EDU Web Logo" className="navbar-logo" />
        <h2>Edu Web School</h2>
      </div>

      <h1>Student Results</h1>
      <h3>Name: {studentInfo.name}</h3>
      <h4>Enrollment Number: {studentInfo.enrollmentNo}</h4>
      <h4>Class: {studentInfo.className}</h4>

      <table className="result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(results).map((subjectName, index) => (
            <tr key={index}>
              <td>{subjectName}</td>
              <td>{results[subjectName].marks ? results[subjectName].marks : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="pdf-button" onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default ExternalReport;
