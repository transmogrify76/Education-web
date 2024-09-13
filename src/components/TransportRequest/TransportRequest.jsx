import React, { useState } from 'react';
import './TransportRequest.css';
import axios from 'axios';
import Header from '../Header/Header';

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

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/transport-request', formData);
            setResponseMessage('Request submitted successfully!');
            setFormData({
                studentName: '',
                parentName: '',
                contactNumber: '',
                address: '',
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
                    <label htmlFor="student-name">Student's Name:</label>
                    <input 
                        type="text" 
                        id="student-name" 
                        name="studentName" 
                        value={formData.studentName} 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="parent-name">Parent/Guardian's Name:</label>
                    <input 
                        type="text" 
                        id="parent-name" 
                        name="parentName" 
                        value={formData.parentName} 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="contact-number">Contact Number:</label>
                    <input 
                        type="tel" 
                        id="contact-number" 
                        name="contactNumber" 
                        value={formData.contactNumber} 
                        onChange={handleChange} 
                        required 
                    />

                    <label htmlFor="address">Address:</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required 
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
                        <li><strong>Charges:</strong> $100 per month</li>
                        <li><strong>Contact for Queries:</strong> transport@ourschool.edu</li>
                    </ul>
                </div>
            </section>
        </div>
        </div>
    );
};

export default TransportRequest;
