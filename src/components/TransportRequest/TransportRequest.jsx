import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed
import './TransportRequest.css';
import Header from '../Header/Header';
import Select from 'react-select'; // Import react-select for dropdown

const TransportRequest = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        studentName: '',
        parentName: '',
        contactNumber: '',
        address: '',
        pickupLocation: '',
        dropoffLocation: '',
        additionalInfo: '',
    });

    // State to handle response messages
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    // State for parent details and student options
    const [parentDetails, setParentDetails] = useState({}); // Parent details
    const [studentOptions, setStudentOptions] = useState([]); // Options for students (children)
    const [selectedStudent, setSelectedStudent] = useState(null); // Selected student

    useEffect(() => {
        // Get the token from local storage
        const token = localStorage.getItem('authToken');
        
        if (token) {
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.id;

            // Fetch parent details from API using parent ID
            axios.get(`http://192.168.0.103:3000/parent/${userIdFromToken}`)
                .then(response => {
                    const parentData = response.data;
                    setParentDetails(parentData); // Set parent details
                    setFormData({
                        ...formData,
                        parentName: parentData.name,
                        contactNumber: parentData.phoneNo,
                        address: parentData.address,
                    });

                    // If there are children, set the children dropdown options
                    if (parentData.students && parentData.students.length > 0) {
                        const childrenOptions = parentData.students.map(child => ({
                            value: child.id,
                            label: `${child.name} (ID: ${child.id})`, // Include student ID in the label
                        }));
                        setStudentOptions(childrenOptions);
                    }
                })
                .catch(error => {
                    console.error('Error fetching parent details:', error);
                    alert('Failed to fetch parent details');
                });
        }
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle student selection change
    const handleStudentChange = (selectedOption) => {
        setSelectedStudent(selectedOption);
        setFormData({
            ...formData,
            studentName: selectedOption ? selectedOption.label.split(' (ID:')[0] : '',
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.0.103:3000/transport-request', formData);
            setResponseMessage('Request submitted successfully!');
            setFormData({
                studentName: '',
                pickupLocation: '',
                dropoffLocation: '',
                additionalInfo: '',
            });
        } catch (error) {
            setError('Failed to submit request. Please try again.');
        }
    };

    return (
        <div>
            <Header/>
            <div className="transport-request-container">
                <header className="transport-request-header">
                    <h1>Transport Request</h1>
                </header>
                <section className="transport-request-content">
                    <h2>Request a School Bus</h2>
                    <form className="transport-form" onSubmit={handleSubmit}>
                        <label>Parent/Guardian's Name:</label>
                        <input 
                            type="text" 
                            value={formData.parentName} 
                            readOnly
                            className="formInput"
                        />

                        <label>Select a Student:</label>
                        <Select
                            options={studentOptions}
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            placeholder="Please select a student"
                            isSearchable={false}
                        />

                        {studentOptions.length === 0 && (
                            <div>
                                <label htmlFor="student-name">Student's Name:</label>
                                <input 
                                    type="text" 
                                    id="student-name" 
                                    name="studentName" 
                                    value={formData.studentName} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        )}

                        <label>Contact Number:</label>
                        <input 
                            type="tel" 
                            value={formData.contactNumber} 
                            readOnly
                            className="formInput"
                        />

                        <label>Address:</label>
                        <input 
                            type="text" 
                            value={formData.address} 
                            readOnly
                            className="formInput"
                        />

                        <label htmlFor="pickup-location">Pick-up Location:</label>
                        <input 
                            type="text" 
                            id="pickup-location" 
                            name="pickupLocation" 
                            value={formData.pickupLocation} 
                            onChange={handleChange} 
                            required 
                        />

                        <label htmlFor="dropoff-location">Drop-off Location:</label>
                        <input 
                            type="text" 
                            id="dropoff-location" 
                            name="dropoffLocation" 
                            value={formData.dropoffLocation} 
                            onChange={handleChange} 
                            required 
                        />

                        <label htmlFor="additional-info">Additional Information:</label>
                        <textarea 
                            id="additional-info" 
                            name="additionalInfo" 
                            value={formData.additionalInfo} 
                            onChange={handleChange} 
                            rows="4" 
                        ></textarea>

                        <button type="submit" className="btn">Submit Request</button>
                    </form>

                    {responseMessage && <p className="response-message">{responseMessage}</p>}
                    {error && <p className="error-message">{error}</p>}

                    <div className="bus-info">
                        <h3>Bus Timing and Charges</h3>
                        <ul>
                            <li><strong>Morning Pickup:</strong> 7:00 AM - 8:00 AM</li>
                            <li><strong>Afternoon Drop-off:</strong> 4:30 PM - 6:00 PM</li>
                            <li><strong>Charges:</strong> 3000 per month</li>
                            <li><strong>Contact for Queries:</strong> transport@ourschool.edu</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TransportRequest;
