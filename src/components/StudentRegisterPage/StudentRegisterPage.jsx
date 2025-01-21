import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Initialize useNavigate
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
        parentEmail: '', // Replace parentId with parentEmail
        address: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken'); // Get token from localStorage (if needed)

            if (!token) {
                alert('You must be logged in as an admin to register a student');
                return;
            }

            const response = await fetch('http://localhost:3000/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add Authorization header with Bearer token
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    enrollmentNo: formData.studentId,
                    email: formData.email,
                    parentEmail: formData.parentEmail,
                    dob: formData.dob,
                    password: formData.password,
                    address: formData.address,
                    roleType: 'student',
                    class: formData.className, // Added class
                    rollNo: formData.studentId, // Added rollNo (assuming it's the same as studentId)
                }),
            });

            if (response.ok) {
                setShowPopup(true);

                // Redirect to StudentView page after a short delay to show the popup
                setTimeout(() => {
                    navigate('/studentview'); // Adjust this to your desired route
                }, 1500);
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData.message);
                // Handle error message appropriately
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Handle fetch error appropriately
        }
    };

    return (
        <div className="register-page-containers">
            <form className="register-forms" onSubmit={handleSubmit}>
                <h1 className="register-title">Student Registration</h1>
                {/* Form Fields */}
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
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Parent Email:
                    <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
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
