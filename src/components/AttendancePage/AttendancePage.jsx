import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendancePage.css';
import Header from '../Header/Header';
import { jwtDecode } from 'jwt-decode';

const AttendancePage = () => {
  const [formData, setFormData] = useState({
    date: '',
    status: '', // 'present' or 'absent'
  });

  const [classNames, setClassNames] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // State to control success modal visibility

  const token = localStorage.getItem('authToken');

  // Decode teacher ID from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTeacherId(decoded.id);
      } catch (err) {
        console.error('Error decoding token:', err);
        setFetchError('Authentication error. Please log in again.');
      }
    }
  }, [token]);

  // Fetch classes assigned to teacher
  useEffect(() => {
    if (!teacherId) return;

    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/teacher/${teacherId}`);
        if (Array.isArray(response.data.classes)) {
          setClassNames(response.data.classes);
        } else {
          setFetchError('Invalid class data received.');
        }
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
        setFetchError('Failed to fetch your assigned classes.');
      }
    };

    fetchTeacherClasses();
  }, [teacherId]);

  // Fetch students for a class
  const fetchStudentsForClass = async (classId) => {
    try {
      const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students for class:', error);
      setFetchError('Failed to fetch students for this class.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassChange = (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    setSelectedStudent('');
    setAttendanceHistory([]);
    fetchStudentsForClass(selectedClassId);
  };

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    setAttendanceHistory([]);
    setFetchError(null);

    if (studentId) {
      try {
        const response = await axios.get(`http://192.168.0.103:3000/attendance?studentId=${studentId}`);
        const data = response.data.filter((record) => record.date !== null);
        setAttendanceHistory(data);
      } catch (error) {
        console.error('Error fetching attendance history:', error);
        setFetchError('');
        setAttendanceHistory([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get today's date in the correct format (yyyy-mm-dd)
    const todayDate = new Date().toISOString().split('T')[0];

    // Ensure the selected date is today's date
    if (formData.date !== todayDate) {
      setFetchError('You can only mark attendance for today.');
      return;
    }

    if (!formData.status) {
      setFetchError('Please select Present or Absent.');
      return;
    }

    const payload = {
      studentId: selectedStudent,
      classId: selectedClass,
      date: formData.date,
      present: formData.status === 'present',
      absent: formData.status === 'absent',
    };

    try {
      await axios.post('http://192.168.0.103:3000/attendance', payload);
      setFetchError(null);
      setShowSuccess(true); // Show success message
      handleStudentChange({ target: { value: selectedStudent } }); // Refresh data

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setFetchError('');
    }
  };

  // Success Modal Component
  const SuccessModal = ({ message, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="attendance-page">
        <h1 className="page-title">Mark Attendance</h1>
        {fetchError && <p className="error">{fetchError}</p>}

        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-group">
            <label htmlFor="classSelect">Select Class:</label>
            <select
              id="classSelect"
              value={selectedClass}
              onChange={handleClassChange}
              required
            >
              <option value="">--Select a Class--</option>
              {classNames.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div className="form-group">
              <label htmlFor="studentSelect">Select Student:</label>
              <select
                id="studentSelect"
                value={selectedStudent}
                onChange={handleStudentChange}
                required
              >
                <option value="">--Select a Student--</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Attendance Status:</label>
            <div className="radio-group">
              <label htmlFor="present">
                <input
                  type="radio"
                  id="present"
                  name="status"
                  value="present"
                  checked={formData.status === 'present'}
                  onChange={handleInputChange}
                />
                Present
              </label>
              <label htmlFor="absent">
                <input
                  type="radio"
                  id="absent"
                  name="status"
                  value="absent"
                  checked={formData.status === 'absent'}
                  onChange={handleInputChange}
                />
                Absent
              </label>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit Attendance
          </button>
        </form>

        {/* Attendance History Section */}
        {selectedStudent && (
          <div className="attendance-history">
            <h2>
              Attendance History for{' '}
              {students.find((s) => s.id.toString() === selectedStudent)?.name}
            </h2>
            {attendanceHistory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td className={record.present ? 'status-present' : 'status-absent'}>
                        {record.present ? 'Present' : 'Absent'}
                      </td>
                      <td>{record.classEntity?.className || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-attendance">No attendance data available for this student.</p>
            )}
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && <SuccessModal message="Attendance has been submitted" onClose={() => setShowSuccess(false)} />}
      </div>
    </div>
  );
};

export default AttendancePage;
