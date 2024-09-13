import React, { useState, useEffect } from 'react';
import './Attendance.css';
import Header from '../Header/Header'
const Attendance = () => {
    const [students, setStudents] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('2024-07');

    // Dummy data to start with
    useEffect(() => {
        setStudents([
            {
                id: '001', 
                name: 'Ravi Kumar', 
                attendance: {
                    '2024-07-01': '08:00:00',
                    '2024-07-02': '08:05:00',
                    '2024-07-03': '08:10:00',
                    '2024-07-04': '08:00:00',
                    '2024-07-05': '08:05:00',
                    '2024-07-06': '08:10:00',
                    '2024-07-07': '08:00:00',
                    '2024-07-08': '08:05:00',
                    '2024-07-09': '08:10:00',
                    '2024-07-10': '08:00:00',
                    '2024-07-11': '08:05:00',
                    '2024-07-12': '08:10:00',
                    '2024-07-13': '08:00:00',
                    '2024-07-14': '08:05:00',
                    '2024-07-15': '08:10:00',
                    '2024-07-16': '08:00:00',
                    '2024-07-17': '08:05:00',
                    '2024-07-18': '08:10:00',
                    '2024-07-19': '08:00:00',
                    '2024-07-20': '08:05:00',
                    '2024-07-21': '08:10:00',
                    '2024-07-22': '08:00:00',
                    '2024-07-23': '08:05:00',
                    '2024-07-24': '08:10:00',
                    '2024-07-25': '08:00:00',
                    '2024-07-26': '08:05:00',
                    '2024-07-27': '08:10:00',
                    '2024-07-28': '08:00:00',
                    '2024-07-29': '08:05:00',
                    '2024-07-30': '08:10:00',
                    '2024-07-31': '08:00:00'
                }
            },
            {
                id: '002', 
                name: 'Puja Kumari', 
                attendance: {
                    '2024-07-01': '08:10:00',
                    '2024-07-02': '08:15:00',
                    '2024-07-03': '08:20:00',
                    '2024-07-04': '08:10:00',
                    '2024-07-05': '08:15:00',
                    '2024-07-06': '08:20:00',
                    '2024-07-07': '08:10:00',
                    '2024-07-08': '08:15:00',
                    '2024-07-09': '08:20:00',
                    '2024-07-10': '08:10:00',
                    '2024-07-11': '08:15:00',
                    '2024-07-12': '08:20:00',
                    '2024-07-13': '08:10:00',
                    '2024-07-14': '08:15:00',
                    '2024-07-15': '08:20:00',
                    '2024-07-16': '08:10:00',
                    '2024-07-17': '08:15:00',
                    '2024-07-18': '08:20:00',
                    '2024-07-19': '08:10:00',
                    '2024-07-20': '08:15:00',
                    '2024-07-21': '08:20:00',
                    '2024-07-22': '08:10:00',
                    '2024-07-23': '08:15:00',
                    '2024-07-24': '08:20:00',
                    '2024-07-25': '08:10:00',
                    '2024-07-26': '08:15:00',
                    '2024-07-27': '08:20:00',
                    '2024-07-28': '08:10:00',
                    '2024-07-29': '08:15:00',
                    '2024-07-30': '08:20:00',
                    '2024-07-31': '08:10:00'
                }
            },
            {
                id: '003', 
                name: 'Dipak Kumar', 
                attendance: {
                    '2024-07-01': '08:20:00',
                    '2024-07-02': '08:25:00',
                    '2024-07-03': '08:30:00',
                    '2024-07-04': '08:20:00',
                    '2024-07-05': '08:25:00',
                    '2024-07-06': '08:30:00',
                    '2024-07-07': '08:20:00',
                    '2024-07-08': '08:25:00',
                    '2024-07-09': '08:30:00',
                    '2024-07-10': '08:20:00',
                    '2024-07-11': '08:25:00',
                    '2024-07-12': '08:30:00',
                    '2024-07-13': '08:20:00',
                    '2024-07-14': '08:25:00',
                    '2024-07-15': '08:30:00',
                    '2024-07-16': '08:20:00',
                    '2024-07-17': '08:25:00',
                    '2024-07-18': '08:30:00',
                    '2024-07-19': '08:20:00',
                    '2024-07-20': '08:25:00',
                    '2024-07-21': '08:30:00',
                    '2024-07-22': '08:20:00',
                    '2024-07-23': '08:25:00',
                    '2024-07-24': '08:30:00',
                    '2024-07-25': '08:20:00',
                    '2024-07-26': '08:25:00',
                    '2024-07-27': '08:30:00',
                    '2024-07-28': '08:20:00',
                    '2024-07-29': '08:25:00',
                    '2024-07-30': '08:30:00',
                    '2024-07-31': '08:20:00'
                }
            }
        ]);
    }, []);

    const handleParentSelect = (e) => {
        setSelectedChild(e.target.value);
    };

    const handleMonthSelect = (e) => {
        setSelectedMonth(e.target.value);
    };

    const selectedStudent = students.find(student => student.id === selectedChild);
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div>
            <Header/>
        <div className="attendance-page">
            <h1>Bus Attendance</h1>
            <div className="select-student">
                <label htmlFor="student-select">Select Your Child:</label>
                <select id="student-select" onChange={handleParentSelect}>
                    <option value="">-- Select --</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="select-month">
                <label htmlFor="month-select">Select Month:</label>
                <select id="month-select" onChange={handleMonthSelect}>
                    <option value="2024-07">July 2024</option>
                    <option value="2024-08">August 2024</option>
                    {/* Add more months as needed */}
                </select>
            </div>
            {selectedChild && selectedStudent && (
                <div className="attendance-records">
                    <h2>Attendance Records for {selectedStudent.name}</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Attendance Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daysInMonth.map(day => {
                                    const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                                    const attendanceTime = selectedStudent.attendance[dateKey];
                                    return attendanceTime ? (
                                        <tr key={day} className={`attendance-row day-${day % 3}`}>
                                            <td>{dateKey}</td>
                                            <td>{attendanceTime}</td>
                                        </tr>
                                    ) : null;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Attendance;
