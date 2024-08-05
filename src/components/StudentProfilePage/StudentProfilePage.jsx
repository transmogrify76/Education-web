// StudentProfilePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentProfilePage.css';
const StudentProfilePage = () => {
  const { parentId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Ensure you have the correct API endpoint and query parameters
        const response = await fetch(`http://localhost:3000/students?parentId=${parentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudents(data);
        if (data.length === 0) {
          setError('No students found.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [parentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="student-profile-container">
      <h1>Student Profiles</h1>
      <div className="student-list">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <p><strong>ID:</strong> {student.id}</p>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Grade:</strong> {student.grade}</p>
            <p><strong>Address:</strong> {student.address}</p>
            {/* Add more fields as necessary */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfilePage;
