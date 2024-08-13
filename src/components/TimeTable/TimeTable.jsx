import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  font-family: 'Montserrat', sans-serif;
  padding: 20px;
  background-color: #f2f2f2;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #6A5ACD;
  font-size: 32px;
  margin-bottom: 20px;
`;

const Dropdown = styled.select`
  padding: 10px;
  font-size: 18px;
  margin-bottom: 20px;
  width: 100%;
`;

const TimetableContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
`;

const TimetableSlot = styled.div`
  margin-bottom: 10px;
`;

const Loading = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
`;

const TimeTable = () => {
  const { parentId } = useParams(); // Get parentId from the URL
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/parent/${parentId}`);
        setStudents(response.data.students || []); // Adjust according to your API response
      } catch (err) {
        console.error('Error fetching students:', err.response ? err.response.data : err.message);
        setError('Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [parentId]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedStudentId) return;

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/timetable', {
          params: { studentId: selectedStudentId }, // Sending studentId as query parameter
        });

        console.log('Timetable response:', response.data); // Debugging

        if (response.data && response.data.length > 0) {
          setTimetable(response.data); // Assuming the data is an array of timetable slots
        } else {
          setTimetable([]); // No timetable available
        }
      } catch (err) {
        console.error('Error fetching timetable:', err.response ? err.response.data : err.message);
        setError('Failed to fetch timetable.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [selectedStudentId]);

  const handleStudentChange = (e) => {
    setSelectedStudentId(e.target.value);
  };

  if (loading) return <Loading>Loading...</Loading>;

  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>Student Timetable</Title>
      <Dropdown value={selectedStudentId} onChange={handleStudentChange}>
        <option value="">Select Student</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} (ID: {student.id})
          </option>
        ))}
      </Dropdown>

      {selectedStudentId && timetable.length > 0 && (
        <TimetableContainer>
          {timetable.map((slot) => (
            <TimetableSlot key={slot.id}>
              <p><strong>Day:</strong> {slot.day}</p>
              <p><strong>Time:</strong> {slot.time}</p>
              <p><strong>Subject:</strong> {slot.subject}</p>
              <p><strong>Professor:</strong> {slot.professor}</p>
            </TimetableSlot>
          ))}
        </TimetableContainer>
      )}

      {selectedStudentId && timetable.length === 0 && (
        <p>No timetable available for this student.</p>
      )}
    </Container>
  );
};

export default TimeTable;
