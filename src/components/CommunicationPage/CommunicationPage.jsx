import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

const CommunicationPage = () => {
    const { teacherId } = useParams(); // Access route parameter here
    const [recipientType, setRecipientType] = useState('student');
    const [recipients, setRecipients] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recipientId, setRecipientId] = useState('');

    useEffect(() => {
        if (recipientType === 'parent') {
            axios.get('http://localhost:3000/parent')
                .then(response => setRecipients(response.data))
                .catch(error => console.error('Error fetching parents:', error));
        } else if (recipientType === 'student') {
            axios.get('http://localhost:3000/student')
                .then(response => setRecipients(response.data))
                .catch(error => console.error('Error fetching students:', error));
        }
    }, [recipientType]);

    const handleSendCommunication = () => {
        const communicationData = {
            title,
            content,
            recipientType,
            recipientId
        };

        axios.post(`http://localhost:3000/communication/send-communication/${teacherId}`, communicationData)
            .then(response => alert('Communication sent successfully!'))
            .catch(error => console.error('Error sending communication:', error));
    };

    return (
        <div className="communication-container">
            <h1>Create Communication</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Recipient Type:</label>
                    <select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                    </select>
                </div>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
                <div>
                    <label>Select Recipient:</label>
                    <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
                        <option value="">Select...</option>
                        {recipients.map((recipient) => (
                            <option key={recipient.id} value={recipient.id}>
                                {recipient.name || recipient.id}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="button" onClick={handleSendCommunication}>Send Communication</button>
            </form>
        </div>
    );
};

export default CommunicationPage;
