import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { GiTeacher as TeacherIcon } from 'react-icons/gi';

// Styled components
const Container = styled.div`
  font-family: 'Montserrat', sans-serif;
  padding: 20px;
  background-color: #f2f2f2;
`;

const Title = styled.h1`
  text-align: center;
  color: #6A5ACD;
  font-size: 32px;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 1px solid #ddd;
`;

const TableHeader = styled.th`
  background-color: #6A5ACD;
  color: white;
  font-size: 18px;
  padding: 16px;
  border: 1px solid #ddd;
  text-align: center;
`;

const TableData = styled.td`
  font-size: 16px;
  color: #333;
  padding: 16px;
  border: 1px solid #ddd;
  text-align: center;
`;

const SubjectIcon = styled.span`
  font-size: 18px;
  color: #6A5ACD;
  margin-right: 5px;
`;

const Professor = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 5px;
    color: #9b59b6;
  }
`;

const Subject = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #6A5ACD;
  text-align: center;
`;

const Dropdown = styled.select`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const TimeTable = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parentId = 1; // Replace with actual parent ID

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timings = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM'
  ];

  useEffect(() => {
    // Fetch students data
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/parent/${parentId}`);
        setStudents(response.data.students); // Adjust according to your API response
        setSelectedStudentId(response.data.students[0]?.id || '');
      } catch (err) {
        setError('Failed to fetch students.');
      }
    };

    fetchStudents();
  }, [parentId]);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedStudentId) return;

      setLoading(true);
      setError(null);

      const tempTimetable = {};

      for (let time of timings) {
        tempTimetable[time] = {};

        for (let day of days) {
          try {
            const response = await axios.post('http://localhost:3000/timetable', {
              day,
              time,
              studentId: selectedStudentId
            });

            tempTimetable[time][day] = response.data;
          } catch (err) {
            setError(`Error fetching timetable for ${day} at ${time}: ${err.message}`);
          }
        }
      }

      setTimetable(tempTimetable);
      setLoading(false);
    };

    fetchTimetable();
  }, [selectedStudentId]);

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>Student Time Table</Title>
      <Dropdown
        value={selectedStudentId}
        onChange={(e) => setSelectedStudentId(e.target.value)}
      >
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name}
          </option>
        ))}
      </Dropdown>
      <Table>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            {days.map((day) => (
              <TableHeader key={day}>{day}</TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {timings.map((time) => (
            <tr key={time}>
              <TableData>{time}</TableData>
              {days.map((day) => (
                <TableData key={`${day}-${time}`}>
                  {timetable[time] && timetable[time][day] ? (
                    <>
                      <SubjectIcon>💻</SubjectIcon>
                      <Subject>{timetable[time][day].subject}</Subject>
                      <Professor><TeacherIcon /> {timetable[time][day].professor}</Professor>
                    </>
                  ) : (
                    'No Class'
                  )}
                </TableData>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TimeTable;
