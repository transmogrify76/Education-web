import React from 'react';
import './TransportRequest.css';

const TransportRequest = () => {
    return (
        <div className="transport-request-container">
            <header className="transport-request-header">
                <h1>Transport Request</h1>
            </header>
            <section className="transport-request-content">
                <h2>Request a School Bus</h2>
                <form className="transport-form">
                    <label htmlFor="student-name">Student's Name:</label>
                    <input type="text" id="student-name" name="studentName" required />

                    <label htmlFor="parent-name">Parent/Guardian's Name:</label>
                    <input type="text" id="parent-name" name="parentName" required />

                    <label htmlFor="contact-number">Contact Number:</label>
                    <input type="tel" id="contact-number" name="contactNumber" required />

                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" required />

                    <label htmlFor="pickup-location">Pick-up Location:</label>
                    <input type="text" id="pickup-location" name="pickupLocation" required />

                    <label htmlFor="dropoff-location">Drop-off Location:</label>
                    <input type="text" id="dropoff-location" name="dropoffLocation" required />

                    <label htmlFor="additional-info">Additional Information:</label>
                    <textarea id="additional-info" name="additionalInfo" rows="4"></textarea>

                    <button type="submit" className="btn">Submit Request</button>
                </form>

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
    );
};

export default TransportRequest;
