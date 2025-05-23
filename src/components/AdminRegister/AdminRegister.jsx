import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './AdminRegister.css';
import Header from '../Header/Header';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        employeeId: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://192.168.0.103:3000/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    employeeNo: formData.employeeId,
                    email: formData.email,
                    password: formData.password,
                    roleType: "admin" // Ensure roleType matches your backend's expected field name
                })
            });

            if (response.ok) {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/alogin'); // Redirect to admin login page
                }, 2000);
            } else {
                const errorData = await response.json();
                setMessage(`Registration failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <Header/>
        <div className="register-page-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1 className="form-title">Admin Register</h1>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn">Register</button>
                <p className="login-link">
                Already have an account? <Link to="/alogin">Login here</Link>
            </p>
                {message && <p className="message">{message}</p>}
            </form>
            {showPopup && (
                <div className="popup">
                    <span className="popup-icon">✔</span>
                    <span className="popup-message">Registration successful!</span>
                </div>
            )}
           
        </div>
        </div>
    );
};

export default AdminRegister;