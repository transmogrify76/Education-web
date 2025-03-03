import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TimeTable.css';
import Header from '../Header/Header';

const TimeTable = () => {
    const { parentId } = useParams();
    const [classNames, setClassNames] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState([])
    useEffect(() => {
        const fetchClassNames = async () => {
            try {
                const response = await axios.get('http://192.168.0.103:3000/class');
                setClassNames(response.data);
            } catch (error) {
                console.error('There was an error fetching the class names:', error);
            }
        };

        fetchClassNames();
    }, []);
    useEffect(() => {
        const fetchTimetable = async () => {
            if (selectedClass) {
                try {
                    const timetableResponse = await axios.get(`http://192.168.0.103:3000/timetable/class/${selectedClass}`);
                    setTimetable(timetableResponse.data);
                } catch (error) {
                    console.error('There was an error fetching the timetable:', error);
                }
            } else {
                setTimetable([]); 
            }
        };

        fetchTimetable();
    }, [selectedClass]);
    const groupedTimetable = {};
    timetable.forEach((entry) => {
        if (!groupedTimetable[entry.time]) {
            groupedTimetable[entry.time] = {};
        }
        groupedTimetable[entry.time][entry.day] = {
            subject: entry.subject,
            professor: entry.professor,
        };
    });

    return (
        <div>
            <Header/>

        <div className="timetable-container">
            <h2>Timetable</h2>

            <label htmlFor="class-dropdown">Select Class:</label>
            <select
                id="class-dropdown"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
            >
                <option value="">Select a class</option>
                {classNames.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                        {classItem.className}
                    </option>
                ))}
            </select>

            {Object.keys(groupedTimetable).length > 0 && (
                <div className="timetable">
                    <h3>Timetable for Class {selectedClass}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedTimetable).map((time) => (
                                <tr key={time}>
                                    <td>{time}</td>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                                        const { subject, professor } = groupedTimetable[time][day] || { subject: 'Free', professor: '' };
                                        return (
                                            <td key={day}>
                                                {subject !== 'Free' ? `${subject} (${professor})` : subject}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {Object.keys(groupedTimetable).length === 0 && selectedClass && (
                <p>No timetable available for this class.</p>
            )}
        </div>
        </div>
    );
};

export default TimeTable;
