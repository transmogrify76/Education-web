import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from '../Header/Header';
import './CommunicationPage.css'; // Import the CSS file for styles

const CommunicationPage = () => {
    const [teacherId, setTeacherId] = useState(null);
    const [recipientType, setRecipientType] = useState('student');
    const [recipients, setRecipients] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [parentInfo, setParentInfo] = useState(null);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setTeacherId(decodedToken.id);
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
        }
    }, [token]);

    useEffect(() => {
        if (teacherId) {
            axios.get('http://192.168.0.103:3000/class', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setClasses(response.data))
            .catch(error => console.error('Error fetching classes:', error));
        }
    }, [token, teacherId]);

    const fetchStudentsForClass = async (classId) => {
        try {
            const response = await axios.get(`http://192.168.0.103:3000/class/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const studentsWithParents = response.data.students.map(student => ({
                ...student,
                parentName: student.parent ? student.parent.name : 'N/A',
                parentId: student.parent ? student.parent.id : null
            }));

            setRecipients(studentsWithParents);
        } catch (error) {
            console.error('Error fetching students for class:', error);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchStudentsForClass(selectedClass);
        } else {
            setRecipients([]);
        }
    }, [selectedClass]);

    const handleRecipientChange = (e) => {
        const selectedRecipient = e.target.value;
        setRecipientId(selectedRecipient);

        if (recipientType === 'student') {
            const selectedStudent = recipients.find(student => student.id === selectedRecipient);
            if (selectedStudent) {
                setParentInfo(selectedStudent.parent || null);
            }
        } else if (recipientType === 'parent') {
            const selectedParent = recipients.find(student => student.parentId && student.parentId === selectedRecipient);
            if (selectedParent) {
                setRecipientId(selectedParent.parentId);
            }
        }
    };

    const handleSendCommunication = () => {
        const communicationData = {
            title,
            content,
            recipientType,
            recipientId,
        };

        axios.post(`http://192.168.0.103:3000/communication/send-communication/${teacherId}`, communicationData)
            .then(response => alert('Communication sent successfully!'))
            .catch(error => console.error('Error sending communication:', error));
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Open Sans', sans-serif" }}>
            <Header />
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#2c3e50' }}>Create Communication</h1>
            <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Recipient Type:</label>
                    <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)} style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7' }}>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7', minHeight: '120px' }} />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Select Class:</label>
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7' }}>
                        <option value="">Select Class...</option>
                        {classes.map((classItem) => (
                            <option key={classItem.id} value={classItem.id}>
                                {classItem.className}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Select Recipient:</label>
                    <select value={recipientId} onChange={handleRecipientChange} style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7' }}>
                        <option value="">Select...</option>
                        {recipients.length > 0 ? (
                            recipients.map((recipient) => (
                                recipientType === 'student' ? (
                                    <option key={recipient.id} value={recipient.id}>
                                        {recipient.name}
                                    </option>
                                ) : (
                                    recipient.parentId && (
                                        <option key={recipient.parentId} value={recipient.parentId}>
                                            {recipient.parentName} - {recipient.name}
                                        </option>
                                    )
                                )
                            ))
                        ) : (
                            <option value="">No recipients available</option>
                        )}
                    </select>
                </div>

                {recipientType === 'student' && parentInfo && (
                    <div>
                        <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '5px', color: '#34495e' }}>Parent: </label>
                        <input type="text" value={parentInfo.name} readOnly style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', fontSize: '14px', border: '2px solid #BDC3C7' }} />
                    </div>
                )}

                {/* Updated Button */}
                <button type="button" onClick={handleSendCommunication} className="send-button">
                    <span>Send Communication</span>
                </button>
            </form>
        </div>
    );
};

export default CommunicationPage;
