import React, { useState, useEffect } from 'react';
import './ContactPage.css';
import Header from '../Header/Header';

const ContactPage = () => {
    const [contacts, setContacts] = useState([]); // Ensure it's initialized as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [range, setRange] = useState("1-9"); // Default range
    const [totalPages, setTotalPages] = useState(1); // Total pages (for pagination)

    // Function to fetch contacts for a given range
    const fetchContacts = async (range) => {
        setLoading(true);
        setError(null);

        const [startStr, endStr] = range.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);

        // Basic validation for range format
        if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
            setError("Invalid range format. Use 'start-end' with start >= 1 and end >= start.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://192.168.0.103:3000/contact/${start}-${end}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contacts');
            }
            const data = await response.json();
            console.log("Fetched Data:", data);  
            setContacts(data); 
            setTotalPages(1); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts(range);
    }, [range]);

    const handleRangeChange = (e) => {
        setRange(e.target.value);
    };

    const handleFetchByRange = () => {
        fetchContacts(range);
    };

    return (
        <div>
            <Header />
            <div className="contact-page">
                <h1 className="contact-page__heading">Contact Us</h1>

                <div className="contact-page__range-input">
                    <label htmlFor="range" className="contact-page__range-label">Enter Range (e.g., 1-9):</label>
                    <input
                        type="text"
                        id="range"
                        value={range}
                        onChange={handleRangeChange}
                        className="contact-page__range-input-field"
                        placeholder="1-9"
                    />
                    {/* <button onClick={handleFetchByRange} className="contact-page__range-button">Fetch Contacts</button> */}
                </div>

                {loading && <p className="contact-page__loading"></p>}
                {error && <p className="contact-page__error">{error}</p>}

                <div className="contact-page__list">
                    {contacts && contacts.length === 0 && !loading && <p className="contact-page__no-contacts">No contacts found.</p>}
                    {contacts && contacts.map((contact) => (
                        <div className="contact-page__item" key={contact.id}>
                            <h3 className="contact-page__item-name">
                                <i className="fas fa-user-circle"></i> <strong>Guardian Name:</strong> {contact.name}
                            </h3>
                            <p className="contact-page__item-email">
                                <i className="fas fa-envelope"></i> <strong>Email:</strong> {contact.email}
                            </p>
                            <p className="contact-page__item-message">
                                <i className="fas fa-comment-dots"></i> <strong>Message:</strong> {contact.message}
                            </p>
                            <p className="contact-page__item-phone">
                                <i className="fas fa-phone"></i> <strong>Phone:</strong> {contact.phone}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
