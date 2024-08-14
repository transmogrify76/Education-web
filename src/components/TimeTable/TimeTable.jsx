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
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columns for Monday to Friday */
  gap: 10px;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  background-color: #6A5ACD;
  color: white;
  padding: 10px;
`;

const TimetableSlot = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
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
      if (!selectedStudentId) return; // Exit if no student is selected

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/timetable/student/' + selectedStudentId);

        if (response.data && response.data.length > 0) {
          const sortedTimetable = response.data.sort((a, b) => {
            // Assuming `time` is a string in the format 'HH:MM AM/PM'
            return new Date(`1970/01/01 ${a.time}`).getTime() - new Date(`1970/01/01 ${b.time}`).getTime();
          });
          setTimetable(sortedTimetable); // Set sorted timetable data
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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Organize timetable data by day
  const timetableByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = timetable.filter(slot => slot.day === day);
    return acc;
  }, {});

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

      {selectedStudentId && (
        <TimetableContainer>
          {daysOfWeek.map((day) => (
            <div key={day}>
              <DayHeader>{day}</DayHeader>
              {timetableByDay[day].length > 0 ? (
                timetableByDay[day].map((slot) => (
                  <TimetableSlot key={slot.id}>
                    <p><strong>Time:</strong> {slot.time}</p>
                    <p><strong>Subject:</strong> {slot.subject}</p>
                    <p><strong>Professor:</strong> {slot.professor}</p>
                  </TimetableSlot>
                ))
              ) : (
                <p>No classes for this day.</p>
              )}
            </div>
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
