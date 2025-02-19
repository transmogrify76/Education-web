import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { useParams } from 'react-router-dom';
// import SideNav from '../SideNav/SideNav';

const SubjectManagement = () => {
    const { studentId } = useParams();
    const [classes, setClasses] = useState([]);  // Ensure classes is initialized as an empty array
    const [selectedClass, setSelectedClass] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [message, setMessage] = useState('');
    const [subjects, setSubjects] = useState([]);  // State for storing subjects for the selected class

    useEffect(() => {
        // Fetch classes data
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:3000/class');
                const data = await response.json();

                // Check if the response is an array before using .map()
                if (Array.isArray(data)) {
                    setClasses(data);  // Set the classes if it's a valid array
                } else {
                    setMessage('Error: Classes data is not in the expected format.');
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
                setMessage('Error fetching classes. Please try again later.');
            }
        };

        fetchClasses();
    }, []);

    // Fetch subjects whenever the selected class changes
    useEffect(() => {
        const fetchSubjects = async () => {
            if (selectedClass) {
                try {
                    const response = await fetch(`http://localhost:3000/subjects/class/${selectedClass}`);
                    const data = await response.json();

                    // Check if the response is an array before updating the subjects state
                    if (Array.isArray(data)) {
                        setSubjects(data);  // Set the subjects for the selected class
                    } else {
                        setMessage('Error: Subjects data is not in the expected format.');
                    }
                } catch (error) {
                    console.error('Error fetching subjects:', error);
                    setMessage('Error fetching subjects. Please try again later.');
                }
            } else {
                setSubjects([]);  // Clear subjects if no class is selected
            }
        };

        fetchSubjects();
    }, [selectedClass]);  // Run this effect whenever `selectedClass` changes

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedClass || !subjectName) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/subjects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: subjectName,
                    classId: parseInt(selectedClass),
                }),
            });

            if (response.ok) {
                const newSubject = await response.json();  // Get the new subject from the response
                setSubjects((prevSubjects) => [...prevSubjects, newSubject]);  // Add the new subject to the list
                setMessage('Subject added successfully!');
                setSubjectName('');  // Clear the input field for the subject name
            } else {
                const data = await response.json();
                setMessage(`Error: ${data.message || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage('Error submitting the form. Please try again.');
        }
    };

    return (
        <div className="subject-edit-page">
            <div>
                <Header />
            </div>
            {/* <SideNav studentId={studentId} /> */}
            <h1>Add Subject to Class</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="classSelect">Select Class</label>
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        required
                    >
                        <option value="">Select a class</option>
                        {Array.isArray(classes) && classes.length > 0 ? (
                            classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.className}
                                </option>
                            ))
                        ) : (
                            <option disabled>No classes available</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="subjectName">Subject Name</label>
                    <input
                        type="text"
                        id="subjectName"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        placeholder="Enter subject name"
                        required
                    />
                </div>

                <button type="submit">Add Subject</button>
            </form>

            {message && <div className="message">{message}</div>}

            {/* Show the list of subjects if a class is selected */}
            {selectedClass && (
                <div className="subjects-list">
                    <h2>Subjects in this Class:</h2>
                    {subjects.length > 0 ? (
                        <ul>
                            {subjects.map((subject) => (
                                <li key={subject.id}>{subject.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No subjects available for this class.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
