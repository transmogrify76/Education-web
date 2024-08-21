import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Plogin.css';

export default function Plogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (email === '' || password === '') {
            setMessage('Please enter both email and password.');
        } else {
            try {
                const response = await fetch('http://localhost:3000/parent/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                if (response.ok) {
                    const data = await response.json(); // Parse JSON response
                    const parentId = data.parentId; // Extract parentId from response

                    setMessage(`Login successful! Welcome.`);
                    setTimeout(() => {
                        navigate(`/dashboard/${parentId}`); // Redirect with parentId in URL
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    setMessage(`Login failed: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setMessage(`Error: ${error.message}`);
            }
        }
    }

    return (
        <div className="plogin-container">
            <div className="plogin-card">
                <h2>Parents Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-groups">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-groups">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="submit" type="submit">Login</button>
                </form>
                <div className="button-bottom">
                    <button className="forgot-password-buttons" onClick={() => navigate('/forgetpassword')}>Forgot Password?</button>
                </div>
                <p className="message">{message}</p>
            </div>
        </div>
    );
}
