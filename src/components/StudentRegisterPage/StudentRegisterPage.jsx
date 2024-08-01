import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './StudentRegisterPage.css';

const StudentRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        className: '',
        studentId: '',
        email: '',
        password: '',
    });

    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to server
        console.log('Form submitted:', formData);

        setShowPopup(true); // Show popup on form submission

        // Redirect to parent registration page after a short delay to show the popup
        setTimeout(() => {
            navigate(`/ParentRegisterPage?studentId=${formData.studentId}`);
        }, 1500); // Adjust the delay as needed
    };

    return (
        <div className="register-page-containers">
            <h1 className="register-title">Student Registration</h1>
            <form className="register-forms" onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Class:
                    <input
                        type="text"
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Student ID:
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" className="submit-button">Register</button>
            </form>
            {showPopup && (
                <div className="popup">
                    <span className="popup-icon">✔</span>
                    <span className="popup-message">Student registered successfully!</span>
                </div>
            )}
        </div>
    );
};

export default StudentRegisterPage;
