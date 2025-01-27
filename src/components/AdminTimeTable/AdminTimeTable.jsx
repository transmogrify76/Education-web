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
    professor: '',
    classId: '',
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:3000/class');
        const data = await response.json();
        setClassOptions(data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      const fetchSubjects = async () => {
        try {
          const response = await fetch(`http://localhost:3000/subjects/class/${formData.classId}`);
          const data = await response.json();
          setSubjectOptions(data);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    }
  }, [formData.classId]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3000/teacher');
        const data = await response.json();
        setTeacherOptions(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

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
    const time = `${formData.hour}:${formData.minute} ${formData.period}`;
    const submissionData = {
      day: formData.day,
      time,
      subject: formData.subject,
      professor: formData.professor,
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
      .then((data) => {
        console.log('Success:', data);
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

  return (
    <div>
      <Header />
      <div className="admin-timetable-page">
        {/* Left Side: Timetable Form */}
        <div className="form-container">
          <h1>Post Timetable</h1>
          {popupVisible && <div className="popup">Timetable posted successfully!</div>}
          <form className="timetable-form" onSubmit={handleSubmit}>
            {/* Day Selection */}
            <div className="form-group">
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

            {/* Time Selection */}
            <div className="form-group">
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

            {/* Class, Subject, and Teacher Selection */}
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Subject</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="professor">Professor:</label>
              <select
                name="professor"
                value={formData.professor}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Teacher</option>
                {teacherOptions.length > 0 ? (
                  teacherOptions.map((teacher) => (
                    <option key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No teachers available</option>
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">Post Timetable</button>
          </form>
        </div>

        {/* Right Side: Timetable List */}
        <div className="table-container">
          <h2>Timetable List</h2>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Professor</th>
                <th>Class</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No timetables available</td>
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
