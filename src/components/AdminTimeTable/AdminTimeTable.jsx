import React, { useState, useEffect } from 'react';
import './AdminTimeTable.css';
import Header from '../Header/Header';

const AdminTimeTable = () => {
  const [formData, setFormData] = useState({
    day: '',
    hour: '',
    minute: '',
    period: 'AM',
    subject: '',
    professor: '', // professor ID
    classId: '',
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]); // Class options
  const [subjectOptions, setSubjectOptions] = useState([]); 
  const [teacherOptions, setTeacherOptions] = useState([]); // Teacher options
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/class');
        const data = await response.json();
        setClassOptions(data); // Set available classes
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      const fetchTeachers = async () => {
        try {
          const response = await fetch(`http://localhost:3000/class/${formData.classId}`);
          const data = await response.json();
          setTeacherOptions(data.teachers || []);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      };
      fetchTeachers();
    }
  }, [formData.classId]);

  useEffect(() => {
    if (formData.professor) {
      const fetchSubjects = async () => {
        try {
          const response = await fetch(`http://localhost:3000/teacher/${formData.professor}`);
          const data = await response.json();
          setSubjectOptions(data.subjects || []);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    }
  }, [formData.professor]);

  const fetchTimetables = async () => {
    try {
      const response = await fetch('http://localhost:3000/timetable');
      const data = await response.json();
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedTeacher = teacherOptions.find(teacher => teacher.id === Number(formData.professor));
    const teacherName = selectedTeacher ? selectedTeacher.name : 'Unknown Teacher';
    const time = `${formData.hour}:${formData.minute} ${formData.period}`;
    const submissionData = {
      day: formData.day,
      time,
      subject: formData.subject,
      professor: teacherName,
      classId: formData.classId,
    };

    fetch('http://localhost:3000/timetable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    })
      .then((response) => response.json())
      .then(() => {
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
        setFormData({
          day: '',
          hour: '',
          minute: '',
          period: 'AM',
          subject: '',
          professor: '',
          classId: '',
        });
        fetchTimetables();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/timetable/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTimetables();
      } else {
        console.error('Failed to delete timetable');
      }
    } catch (error) {
      console.error('Error deleting timetable:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="admin-timetable-page">
        <div className="form-container">
          <h1>Create Timetable</h1>
          {popupVisible && <div className="popup-message">Timetable posted successfully!</div>}
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="day">Day:</label>
              <select name="day" value={formData.day} onChange={handleChange} required>
                <option value="" disabled>Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="time">Time:</label>
              <div className="time-inputs">
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  placeholder="HH"
                  required
                />
                <span>:</span>
                <input
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  placeholder="MM"
                  required
                />
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  required
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="classId">Class:</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Class</option>
                {classOptions.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="professor">Teacher:</label>
              <select
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Teacher</option>
                {teacherOptions.length > 0 ? (
                  teacherOptions.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No teachers available</option>
                )}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="subject">Subject:</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Subject</option>
                {subjectOptions.length > 0 ? (
                  subjectOptions.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">Create Timetable</button>
          </form>
        </div>

        <div className="table-container">
          <h2>Timetable List</h2>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length > 0 ? (
                timetable.map((item) => (
                  <tr key={item.id}>
                    <td>{item.day}</td>
                    <td>{item.time}</td>
                    <td>{item.subject}</td>
                    <td>{item.professor}</td>
                    <td>{item.class.className}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="delete-button-one"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No timetables available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeTable;
