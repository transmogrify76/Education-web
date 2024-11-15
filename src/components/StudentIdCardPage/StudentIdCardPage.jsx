import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import './StudentIdCardPage.css';
import Header from '../Header/Header'

const StudentIdCardPage = () => {
  const { parentId } = useParams();
  const [studentData, setStudentData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      console.log('Fetching data for parentId:', parentId); // Debug log
      try {
        const response = await fetch(`http://localhost:3000/parent/${parentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        setStudentData(data.students || []);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to fetch student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [parentId]);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseCard = () => {
    setSelectedStudent(null);
  };

  const handleDownload = () => {
    if (selectedStudent) {
      // Hide buttons
      const buttons = document.querySelectorAll(".download-btn, .close-btn");
      buttons.forEach(btn => btn.style.display = 'none');

      // Create a temporary container for the ID card
      const idCardContainer = document.createElement('div');
      idCardContainer.style.position = 'absolute';
      idCardContainer.style.top = '-9999px'; // Hide the container off-screen
      idCardContainer.innerHTML = document.querySelector("#id-card").outerHTML;
      document.body.appendChild(idCardContainer);

      html2canvas(idCardContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait', // Change to 'landscape' if needed
          unit: 'px',
          format: [230, 250] // Adjust the format to match the ID card size
        });
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(`student-id-card-${selectedStudent.id}.pdf`);
        
        // Clean up
        document.body.removeChild(idCardContainer);
        buttons.forEach(btn => btn.style.display = '');
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (studentData.length === 0) {
    return <p>No student data available.</p>;
  }

  return (
    <div>
      <Header/>
    <div className="id-card-page-container">
      <h1>Student ID Cards</h1>
      <div className="student-list">
        {studentData.map(student => (
          <button
            key={student.id}
            className="student-name-btn"
            onClick={() => handleStudentClick(student)}
          >
            {student.name}
          </button>
        ))}
      </div>
      {selectedStudent && (
        <div className="id-card-container">
          <div id="id-card" className="id-card">
            <h2>ID Card</h2>
            <div className="id-card-field"><strong>Name:</strong> {selectedStudent.name}</div>
            <div className="id-card-field"><strong>Enrollment No:</strong> {selectedStudent.enrollmentNo}</div>
            <div className="id-card-field"><strong>Date of Birth:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</div>
            <div className="id-card-field"><strong>Address:</strong> {selectedStudent.address}</div>
            <div className="id-card-field"><strong>School Name:</strong> Edu_web</div>
            <button className="close-btn" onClick={handleCloseCard}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default StudentIdCardPage;
