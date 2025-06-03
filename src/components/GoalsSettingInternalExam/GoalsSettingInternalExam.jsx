import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../SideNav/SideNav';
import { FaTag } from 'react-icons/fa';
import './GoalsSettingInternalExam.css';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const GoalsSettingInternalExam = () => {
  const { studentId: paramStudentId } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [hasGoalSettingData, setHasGoalSettingData] = useState(false);

  // Decode JWT token to get student details
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const idFromToken = decodedToken.Id;
      setStudentId(idFromToken);

      setStudent({
        studentName: decodedToken.studentName,
        enrollmentNo: decodedToken.enrollmentNo,
        rollNo: decodedToken.rollNo,
        className: decodedToken.class.className,
        classId: decodedToken.class.id,
      });

      // Fetch subjects based on studentId
      fetch(`http://192.168.0.103:3000/goal-setting/current-subjects?studentId=${idFromToken}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch subjects by studentId');
          }
          return res.json();
        })
        .then((data) => {
          const structuredSubjects = data.map((subject) => ({
            name: subject.name?.toLowerCase() || '',
            prevGrade: '',
            suggestedTarget: '',
            targetForThisGrade: '',
          }));
          setSubjects(structuredSubjects);
        })
        .catch((error) => {
          console.error('Error fetching subjects:', error);
        });

    } catch (error) {
      console.error('Failed to decode JWT token:', error);
    }
  }, []);

  // Fetch goal-setting data for the student
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentIdToUse = paramStudentId || studentId;
        const response = await fetch(`http://192.168.0.103:3000/goal-setting/student/${studentIdToUse}`);

        if (response.status === 404) {
          setHasGoalSettingData(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch student goal-setting data');
        }

        const data = await response.json();
        setHasGoalSettingData(true);

        if (data.subjects && data.subjects.length > 0) {
          const updatedSubjects = subjects.map((subject) => {
            const match = data.subjects.find(
              (s) => s.name?.toLowerCase() === subject.name?.toLowerCase()
            );
            return match
              ? {
                  ...subject,
                  prevGrade: match.prevGrade || '',
                  suggestedTarget: match.suggestedTarget || '',
                  targetForThisGrade: match.targetForThisGrade || '',
                }
              : subject;
          });
          setSubjects(updatedSubjects);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if ((studentId || paramStudentId) && subjects.length > 0) {
      fetchStudentData();
    }
  }, [studentId, paramStudentId, subjects.length]);

  // Handle input changes for grades and targets
  const handleInputChange = (index, field, value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) return;
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: numericValue };
    setSubjects(updatedSubjects);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      // Loop through each subject and send individual POST requests or PATCH if data already exists
      for (const subject of subjects) {
        const payload = {
          studentId: studentId,
          subject: subject.name,
          achievement: `${parseFloat(subject.prevGrade || 0).toFixed(2)}%`,
          suggestedTarget: `${parseFloat(subject.suggestedTarget || 0).toFixed(2)}%`,
          myTarget: `${parseFloat(subject.targetForThisGrade || 0).toFixed(2)}%`,
        };

        // Check if the goal setting already exists for the subject
        const existingGoalSetting = await fetch(
          `http://192.168.0.103:3000/goal-setting/student/${studentId}?subject=${subject.name}`
        ).then((res) => res.json());

        if (existingGoalSetting && existingGoalSetting.id) {
          // If goal-setting already exists, PATCH the existing data
          const response = await fetch(
            `http://192.168.0.103:3000/goal-setting/student/${studentId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to update subject ${subject.name}`);
          }
        } else {
          // If goal-setting does not exist, POST new data
          const response = await fetch('http://192.168.0.103:3000/goal-setting', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Failed to submit subject ${subject.name}`);
          }
        }
      }

      alert('Goal setting submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting goal settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='for-header'>
      <Header />
      <div className='side-with'>
        <Sidebar studentId={studentId} />

        {student && (
          <div className="student-info">
            <h2>Student Information</h2>
            <p><strong>Name:</strong> {student.studentName}</p>
            <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
            <p><strong>Roll No:</strong> {student.rollNo}</p>
            <p><strong>Class:</strong> {student.className}</p>
            <p><strong>Class ID:</strong> {student.classId}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h1>Goals Settings Internal Exam</h1>
          <div className="table">
            <div className="table-header">
              <div className="header-cell-one"><FaTag /> Sr no</div>
              <div className="header-cell-two"><FaTag /> Subject</div>
              <div className="header-cell-three"><FaTag /> My achievement for previous grade</div>
              <div className="header-cell-four"><FaTag /> Suggested target for current grade</div>
              <div className="header-cell-five"><FaTag /> My target for this grade</div>
            </div>
            <div className="table-body">
              {subjects.map((subject, index) => (
                <div className="table-row" key={subject.name}>
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">{subject.name.toUpperCase()}</div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.prevGrade}
                      onChange={(e) => handleInputChange(index, 'prevGrade', e.target.value)}
                    />
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.suggestedTarget}
                      onChange={(e) => handleInputChange(index, 'suggestedTarget', e.target.value)}
                    />
                  </div>
                  <div className="table-cell">
                    <input
                      type="number"
                      value={subject.targetForThisGrade}
                      onChange={(e) => handleInputChange(index, 'targetForThisGrade', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalsSettingInternalExam;
