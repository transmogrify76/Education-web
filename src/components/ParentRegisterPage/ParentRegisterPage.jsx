import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentRegisterPage.css';
import Header from '../Header/Header';

const ParentRegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNo: '',
        address: '',
        password: '',
        roleType: 'parent',
        relationType: '',
        occupation: '',
    });

    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        const token = localStorage.getItem('authToken');

        if (!token) {
            setErrorMessage('You must be logged in as an admin to register a parent.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.103:3000/parent/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/admindashboard');
                }, 2000);
            } else {
                setErrorMessage(data.message || 'Registration failed. Please try again.');
                console.error('Registration error:', data.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <Header />
            <div className="register-page-containers">
                <form className="register-forms" onSubmit={handleSubmit}>
                    <h1 className="register-title">Parent Registration</h1>

                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                        Phone Number:
                        <input
                            type="tel"
                            name="phoneNo"
                            value={formData.phoneNo}
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
                        Relation to Student:
                        <input
                            type="text"
                            name="relationType"
                            value={formData.relationType}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Occupation:
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
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
                        <span className="popup-message">Parent registered successfully!</span>
                    </div>
                )}

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ParentRegisterPage;
