import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Use useLocation to get query parameters
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
        parentId: '', // Add parentId to form data
        address: '', // Add address to form data
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
            const response = await fetch('http://localhost:3000/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    enrollmentNo: formData.studentId,
                    email: formData.email,
                    parentId: formData.parentId,
                    dob: formData.dob,
                    password: formData.password,
                    address: formData.address,
                    roleType: 'student', // RoleType is hardcoded to 'student'
                }),
            });

            if (response.ok) {
                setShowPopup(true);

                // Redirect to another page after a short delay to show the popup
                setTimeout(() => {
                    navigate('/success'); // Adjust this as needed
                }, 1500); // Adjust the delay as needed
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
                    Parent ID:
                    <input
                        type="text"
                        name="parentId"
                        value={formData.parentId}
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
