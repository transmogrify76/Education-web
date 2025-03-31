import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './StudentRegisterPage.css';
import Header from '../Header/Header';

const StudentRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        className: '', 
        studentId: '',
        email: '',
        password: '',
        parentEmail: '',
        address: '',
        gender: '', 
        rollNo: '' 
    });

    const [showPopup, setShowPopup] = useState(false);
    const [classes, setClasses] = useState([]); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://192.168.0.103:3000/class');
                const data = await response.json();

                if (response.ok) {
                    setClasses(data); 
                } else {
                    console.error('Failed to fetch classes:', data.message);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []); 

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
            const token = localStorage.getItem('authToken'); 

            if (!token) {
                alert('You must be logged in as an admin to register a student');
                return;
            }

            const response = await fetch('http://192.168.0.103:3000/student/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    enrollmentNo: formData.studentId,
                    email: formData.email,
                    parentEmail: formData.parentEmail,
                    dob: formData.dob,
                    password: formData.password,
                    address: formData.address,
                    gender: formData.gender, 
                    roleType: 'student',
                    class: formData.className, 
                    rollNo: formData.rollNo,
                }),
            });

            if (response.ok) {
                setShowPopup(true);

                setTimeout(() => {
                    navigate('/admindashboard'); 

                }, 1500);
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div>
            <Header/>
        <div className="register-page-containers">
            <form className="register-forms" onSubmit={handleSubmit}>
                <h1 className="register-title">Student Registration</h1>
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
                    <select
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Class</option>
                        {classes.map((classItem, index) => (
                            <option key={index} value={classItem.className}>
                                {classItem.className}
                            </option>
                        ))}
                    </select>
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
                    Roll Number:
                    <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
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
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
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
        </div>
    );
};

export default StudentRegisterPage;
