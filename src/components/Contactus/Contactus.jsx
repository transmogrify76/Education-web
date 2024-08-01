import React from 'react';
import './Contactus.css';

const Contactus = () => {
    return (
        <div className="contact-us-container">
            <header className="contact-us-header">
                <h1>Contact Us</h1>
            </header>
            <h2 className="connect-heading">Let's Connect</h2>
            <section className="contact-us-content">
                <div className="contact-info">
                    <h3>School Information</h3>
                    <ul>
                        <li><i className="fas fa-envelope"></i> <strong>Email:</strong> info@ourschool.edu</li>
                        <li><i className="fas fa-phone"></i> <strong>Phone:</strong> (123) 456-7890</li>
                        <li><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> 123 School St., Education City, ED 12345</li>
                    </ul>
                    <p>Feel free to fill out the contact form below, and we will get back to you as soon as possible.</p>
                </div>
                <form className="contact-form">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />

                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" rows="4" required></textarea>

                    <button type="submit">Send Message</button>
                </form>
            </section>
            <footer className="contact-us-footer">
                <p>&copy; 2024 Wdu-web. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Contactus;
