import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './ParentRegisterPage.css';

const ParentRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
        aadharNo: '',
        password: '',
        studentId: '', // This will be populated from URL params
        studentName: '', // Add student name
        address: '', // Add address
    });

    const location = useLocation(); // Use location to get query params
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        // Extract studentId from query parameters
        const queryParams = new URLSearchParams(location.search);
        const studentId = queryParams.get('studentId');
        if (studentId) {
            setFormData(prevState => ({
                ...prevState,
                studentId,
            }));
        }
    }, [location.search]);

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
            const response = await fetch('http://localhost:3000/parent/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.firstName + ' ' + formData.lastName,
                    studentName: formData.studentName, // Include student name
                    email: formData.email,
                    phoneNo: formData.phone,
                    address: formData.address, // Include address
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Assuming the API returns the generated ID
                console.log('Parent registration successful:', data);
                // Navigate to the StudentRegisterPage with the generated ID
                navigate(`/studentregisterpage?parentId=${data.id}`);
            } else {
                console.error('Registration failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="parent-register-page-container">
            <h1 className="register-title">Parent Registration</h1>
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
                    Phone:
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
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
                    Aadhar Number:
                    <input
                        type="text"
                        name="aadharNo"
                        value={formData.aadharNo}
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
                    Student Name:
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
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
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default ParentRegisterPage;
