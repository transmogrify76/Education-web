import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './TimeTable.css';
import Header from '../Header/Header';
import Select from 'react-select';

const TimeTable = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [timetable, setTimetable] = useState([]);

    // Fetch students based on parent JWT
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const parentId = decoded.id;

                axios.get(`http://192.168.0.103:3000/parent/${parentId}`)
                    .then(res => {
                        if (res.data.students && res.data.students.length > 0) {
                            const studentOptions = res.data.students.map(student => ({
                                value: student.id,
                                label: `${student.name} (ID: ${student.id})`,
                            }));
                            setStudents(studentOptions);
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching parent/student info:', err);
                    });
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }
    }, []);

    // Fetch timetable when student is selected
    useEffect(() => {
        const fetchTimetableByStudent = async () => {
            if (selectedStudent) {
                try {
                    const res = await axios.get(`http://192.168.0.103:3000/timetable/by-student-id?studentId=${selectedStudent.value}`);
                    setTimetable(res.data);
                } catch (err) {
                    console.error('Error fetching timetable by student ID:', err);
                    setTimetable([]);
                }
            } else {
                setTimetable([]);
            }
        };

        fetchTimetableByStudent();
    }, [selectedStudent]);

    // Group timetable by time and day
    const groupedTimetable = {};
    timetable.forEach((entry) => {
        if (!groupedTimetable[entry.time]) {
            groupedTimetable[entry.time] = {};
        }
        groupedTimetable[entry.time][entry.day] = {
            subject: entry.subject,
            professor: entry.professor,
            endTime: entry.endTime
        };
    });

    return (
        <div>
            <Header />
            <div className="timetable-container">
                <h2>Timetable</h2>

                <div className="formGroup">
                    <label>Select Student:</label>
                    <Select
                        options={students}
                        value={selectedStudent}
                        onChange={(selected) => setSelectedStudent(selected)}
                        placeholder="Select a student"
                        isSearchable={false}
                    />
                </div>

                {Object.keys(groupedTimetable).length > 0 && (
                    <div className="timetable">
                        <h3>Timetable for Student ID {selectedStudent?.value}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time (Start - End)</th>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(groupedTimetable).map(([time, dayMap]) => {
                                    // Get endTime from first available day (assuming same time has consistent endTime)
                                    const entryWithEndTime = timetable.find(e => e.time === time);
                                    const timeRange = entryWithEndTime ? `${entryWithEndTime.time} - ${entryWithEndTime.endTime}` : time;

                                    return (
                                        <tr key={time}>
                                            <td>{timeRange}</td>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                                                const { subject, professor } = dayMap[day] || { subject: 'Free', professor: '' };
                                                return (
                                                    <td key={day}>
                                                        {subject !== 'Free' ? `${subject} (${professor})` : subject}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {Object.keys(groupedTimetable).length === 0 && selectedStudent && (
                    <p>No timetable available for this student.</p>
                )}
            </div>
        </div>
    );
};

export default TimeTable;
