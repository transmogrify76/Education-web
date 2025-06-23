import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './TeacherTimetable.css';
import Header from "../Header/Header";

const TeacherTimetable = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setTeacherId(id);

      axios
        .get(`http://192.168.0.103:3000/teacher/${id}`)
        .then((res) => {
          setClasses(res.data.classes || []);
        })
        .catch(() => setError('Failed to fetch teacher classes.'));
    } catch (err) {
      setError('Invalid token.');
    }
  }, []);

  useEffect(() => {
    if (!teacherId || !selectedClassId) return;

    axios
      .get(`http://192.168.0.103:3000/timetable/by-teacher-and-class/?teacherId=${teacherId}&classId=${selectedClassId}`)
      .then((res) => setTimetable(res.data || []))
      .catch(() => setError('Failed to fetch timetable.'));
  }, [teacherId, selectedClassId]);

  // Group entries by day
  const groupedByDay = timetable.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {});

  return (
    <div>
        <Header/>

    <div className="timetable-container">
      <h2>Teacher Timetable</h2>

      {error && <p className="error">{error}</p>}

      {teacherId && (
        <div className="section">
          <label htmlFor="classSelect"><strong>Select Class:</strong></label>
          <select
            id="classSelect"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="dropdown"
          >
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                Class {cls.className}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedClassId && Object.keys(groupedByDay).length === 0 && (
        <p>No timetable found for the selected class.</p>
      )}

      {Object.keys(groupedByDay).length > 0 && (
        <table className="timetable">
          <thead>
            <tr>
              <th>Day</th>
              <th>Subject</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByDay).map(([day, entries]) => (
              entries.map((entry, index) => (
                <tr key={entry.id}>
                  {index === 0 && (
                    <td rowSpan={entries.length} className="day-cell">
                      {day}
                    </td>
                  )}
                  <td>{entry.subject}</td>
                  <td>{entry.time}</td>
                  <td>{entry.endTime}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      )}
    </div>
        </div>
  );
};

export default TeacherTimetable;
