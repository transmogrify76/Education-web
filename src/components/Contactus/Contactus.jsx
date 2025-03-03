import React, { useState } from 'react';
import './Contactus.css';
import Header from '../Header/Header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contactus = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '', phone: '' });
    const [, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await axios.post('http://192.168.0.103:3000/contact', formData);
            if (response.status === 201) {
                toast.success('Message sent successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.error('Failed to send message. Please try again later.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again later.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        // Reset form fields
        setFormData({ name: '', email: '', message: '', phone: '' });
        setStatus('');
    };

    return (
        <div>
            <Header />
            <div className="contactUs-container">
                <header className="contactUs-header">
                    <div className="header-title-contact">CONTACT US</div>
                </header>
                <h2 className="connect-heading">Send your Queries</h2>
                <section className="contactUs-content">
                    <div className="contactInfo">
                        <h3>School Information</h3>
                        <ul>
                            <li><i className="fas fa-envelope"></i> <strong>Email:</strong> info@ourschool.edu</li>
                            <li><i className="fas fa-phone"></i> <strong>Phone:</strong> (123) 456-7890</li>
                            <li><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> 123 School St., Education City, ED 12345</li>
                        </ul>
                        <p>Feel free to fill out the contact form below, and we will get back to you as soon as possible.</p>
                    </div>
                    <form className="contactForm" onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="phone">Phone:</label> 
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <button type="submit" className="submit">Send Message</button>
                    </form>
                </section>
                <footer className="infra-footer">
                    <p>
                        <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                    </p>
                    <p className="footer-text">© 2024 Edu-Web. All rights reserved.</p>
                </footer>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Contactus;
