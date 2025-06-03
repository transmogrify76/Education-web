import React, { useState, useEffect } from 'react';
import './AdminTimeTable.css';
import Header from '../Header/Header';

const AdminTimeTable = () => {
  const [formData, setFormData] = useState({
    day: '',
    hour: '',
    minute: '',
    period: 'AM',
    endHour: '',
    endMinute: '',
    endPeriod: 'AM',
    subject: '',
    teacherId: '',
    classId: '',
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  // Fetch all classes
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

  // Fetch teachers for selected class
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

  // Fetch subjects for selected teacher
  useEffect(() => {
    if (formData.teacherId) {
      const fetchSubjects = async () => {
        try {
          const response = await fetch(`http://localhost:3000/teacher/${formData.teacherId}`);
          const data = await response.json();
          setSubjectOptions(data.subjects || []);
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      };
      fetchSubjects();
    }
  }, [formData.teacherId]);

  // Fetch timetable by classId
  const fetchTimetables = async (classId) => {
    if (!classId) {
      setTimetable([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/timetable/class/${classId}`);
      const data = await response.json();
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClassFilterChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    fetchTimetables(classId); // Fetch timetable for selected class
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTeacher = teacherOptions.find(
      (teacher) => teacher.id === Number(formData.teacherId)
    );
    const teacherName = selectedTeacher ? selectedTeacher.name : 'Unknown Teacher';

    const time = `${formData.hour}:${formData.minute} ${formData.period}`;
    const endTime = `${formData.endHour}:${formData.endMinute} ${formData.endPeriod}`;

    const submissionData = {
      day: formData.day,
      time,
      endTime,
      subject: formData.subject,
      professor: teacherName,
      classId: Number(formData.classId),
      teacherId: Number(formData.teacherId),
    };

    fetch('http://localhost:3000/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    })
      .then((res) => res.json())
      .then(() => {
        setPopupVisible(true);
        setTimeout(() => setPopupVisible(false), 3000);
        setFormData({
          day: '',
          hour: '',
          minute: '',
          period: 'AM',
          endHour: '',
          endMinute: '',
          endPeriod: 'AM',
          subject: '',
          teacherId: '',
          classId: '',
        });
        if (selectedClass) {
          fetchTimetables(selectedClass);
        }
      })
      .catch((err) => console.error('Error:', err));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/timetable/${id}`, {
        method: 'DELETE',
      });
      if (response.ok && selectedClass) {
        fetchTimetables(selectedClass);
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
            {/* Day */}
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

            {/* Start Time */}
            <div className="form-field">
              <label>Start Time:</label>
              <div className="time-inputs">
                <input type="number" name="hour" value={formData.hour} onChange={handleChange} min="1" max="12" placeholder="HH" required />
                <span>:</span>
                <input type="number" name="minute" value={formData.minute} onChange={handleChange} min="0" max="59" placeholder="MM" required />
                <select name="period" value={formData.period} onChange={handleChange} required>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* End Time */}
            <div className="form-field">
              <label>End Time:</label>
              <div className="time-inputs">
                <input type="number" name="endHour" value={formData.endHour} onChange={handleChange} min="1" max="12" placeholder="HH" required />
                <span>:</span>
                <input type="number" name="endMinute" value={formData.endMinute} onChange={handleChange} min="0" max="59" placeholder="MM" required />
                <select name="endPeriod" value={formData.endPeriod} onChange={handleChange} required>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Class */}
            <div className="form-field">
              <label>Class:</label>
              <select name="classId" value={formData.classId} onChange={handleChange} required>
                <option value="" disabled>Select Class</option>
                {classOptions.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.className}</option>
                ))}
              </select>
            </div>

            {/* Teacher */}
            <div className="form-field">
              <label>Teacher:</label>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
                <option value="" disabled>Select Teacher</option>
                {teacherOptions.length ? (
                  teacherOptions.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))
                ) : (
                  <option disabled>No teachers available</option>
                )}
              </select>
            </div>

            {/* Subject */}
            <div className="form-field">
              <label>Subject:</label>
              <select name="subject" value={formData.subject} onChange={handleChange} required>
                <option value="" disabled>Select Subject</option>
                {subjectOptions.length ? (
                  subjectOptions.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))
                ) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
            </div>

            <button type="submit" className="submit-button">Create Timetable</button>
          </form>
        </div>

        {/* Class Filter */}
        <div className="class-filter">
          <h2>Filter Timetable by Class</h2>
          <select value={selectedClass} onChange={handleClassFilterChange}>
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.className}</option>
            ))}
          </select>
        </div>

        {/* Timetable List */}
        <div className="table-container">
          <h2>Timetable List</h2>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>End Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetable.length ? (
                timetable.map((item) => (
                  <tr key={item.id}>
                    <td>{item.day}</td>
                    <td>{item.time}</td>
                    <td>{item.endTime}</td>
                    <td>{item.subject}</td>
                    <td>{item.professor}</td>
                    <td>{item.class.className}</td>
                    <td>
                      <button onClick={() => handleDelete(item.id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No timetables available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeTable
