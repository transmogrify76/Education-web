import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Initialize useNavigate
import './StudentRegisterPage.css';

const StudentRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        className: '', // Default to empty until user selects a class
        studentId: '',
        email: '',
        password: '',
        parentEmail: '',
        address: '',
        gender: '', // New field for gender
    });

    const [showPopup, setShowPopup] = useState(false);
    const [classes, setClasses] = useState([]); // To store fetched classes
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch classes from the API when the component mounts
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:3000/class');
                const data = await response.json();

                if (response.ok) {
                    setClasses(data); // Assuming the response contains an array of classes
                } else {
                    console.error('Failed to fetch classes:', data.message);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []); // Empty dependency array ensures this runs once when the component mounts

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
                    gender: formData.gender, // Include gender in the request
                    roleType: 'student',
                    class: formData.className, // Send selected class
                    rollNo: formData.studentId, // Assuming it's the same as studentId
                }),
            });

            if (response.ok) {
                setShowPopup(true);

                // Redirect to StudentView page after a short delay to show the popup
                setTimeout(() => {
                    navigate('/admindashboard'); // Adjust this to your desired route
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
                    <select
                        name="className"
                        value={formData.className}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Class</option>
                        {classes.map((classItem, index) => (
                            <option key={index} value={classItem.className}>
                                {classItem.className} {/* Assuming `className` is the field in the API response */}
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
    );
};

export default StudentRegisterPage;
