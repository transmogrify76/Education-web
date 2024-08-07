import React from 'react';
import styled from 'styled-components';
import { GiTeacher as TeacherIcon } from 'react-icons/gi';

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

const TimeTable = () => {
  return (
    <Container>
      <Title>Student Time Table</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader></TableHeader>
            <TableHeader>Monday</TableHeader>
            <TableHeader>Tuesday</TableHeader>
            <TableHeader>Wednesday</TableHeader>
            <TableHeader>Thursday</TableHeader>
            <TableHeader>Friday</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableData>9:00 AM - 10:00 AM</TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
          </tr>
          <tr>
            <TableData>10:00 AM - 11:00 AM</TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
          </tr>
          <tr>
            <TableData>11:00 AM - 12:00 PM</TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
          </tr>
          <tr>
            <TableData>12:00 PM - 1:00 PM</TableData>
            <TableData colSpan={5}>Lunch Break</TableData>
          </tr>
          <tr>
            <TableData>1:00 PM - 2:00 PM</TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
          </tr>
          <tr>
            <TableData>2:00 PM - 3:00 PM</TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
          </tr>
          <tr>
            <TableData>3:00 PM - 4:00 PM</TableData>
            <TableData>
              <SubjectIcon>🧪</SubjectIcon>
              <Subject>Chemistry</Subject>
              <Professor><TeacherIcon /> Dr. Michael Johnson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>💻</SubjectIcon>
              <Subject>Computer Science</Subject>
              <Professor><TeacherIcon /> Dr. David Wilson</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>📚</SubjectIcon>
              <Subject>Mathematics</Subject>
              <Professor><TeacherIcon /> Dr. John Doe</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🔬</SubjectIcon>
              <Subject>Physics</Subject>
              <Professor><TeacherIcon /> Dr. Jane Smith</Professor>
            </TableData>
            <TableData>
              <SubjectIcon>🌱</SubjectIcon>
              <Subject>Biology</Subject>
              <Professor><TeacherIcon /> Dr. Emily Davis</Professor>
            </TableData>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default TimeTable;