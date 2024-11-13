import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import './ExternalReport.css';

const ExternalReport = () => {
  const { studentId } = useParams();
  const [studentInfo, setStudentInfo] = useState({ name: '', enrollmentNo: '', className: '' });
  const [subjects, setSubjects] = useState([]);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classResponse = await fetch(`http://localhost:3000/class`);
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
        const response = await fetch(`http://localhost:3000/result/${studentId}`);
        const data = await response.json();

        const subjectMap = {};

        data.forEach(subject => {
          const { subjectName, marks } = subject;

          if (Array.isArray(marks) && marks.length > 0) {
            const recentMark = marks.reduce((latest, current) => {
              return new Date(current.date) > new Date(latest.date) ? current : latest;
            });

            subjectMap[subjectName] = recentMark;
          } else {
            subjectMap[subjectName] = marks;
          }
        });

        const updatedSubjects = Object.keys(subjectMap).map(subjectName => ({
          subjectName,
          marks: subjectMap[subjectName],
        }));

        setSubjects(updatedSubjects);
      } catch (error) {
        console.error("Error fetching result data:", error);
      }
    };

    fetchClassData();
    fetchResults();
  }, [studentId]); // Fetch data whenever studentId changes

  // Update a subject when modified
  const handleSubjectUpdate = (subjectName, newMarks) => {
    setSubjects(prevSubjects => {
      const updatedSubjects = prevSubjects.map(subject =>
        subject.subjectName === subjectName
          ? { ...subject, marks: newMarks } // Update marks for the edited subject
          : subject
      );
      return updatedSubjects;
    });
  };

  const generatePDF = () => {
    const element = pdfRef.current;

    document.querySelector(".pdf-button").style.display = "none";

    html2pdf()
      .from(element)
      .save(`Result_${studentId}.pdf`)
      .then(() => {
        document.querySelector(".pdf-button").style.display = "inline-block";
      });
  };

  return (
    <div className="result-page" ref={pdfRef}>
      <h1>Student Results</h1>
      <h2>Name: {studentInfo.name}</h2>
      <h3>Enrollment Number: {studentInfo.enrollmentNo}</h3>
      <h3>Class: {studentInfo.className}</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.subjectName}</td>
              <td>{subject.marks ? subject.marks : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="pdf-button" onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default ExternalReport;
