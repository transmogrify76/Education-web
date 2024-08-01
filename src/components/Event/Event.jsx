import React from 'react';
import './Event.css';
import Header from '../Header/Header';

const events = [
    {
        title: 'Annual Science Fair',
        date: 'August 10, 2024',
        description: 'Join us for our Annual Science Fair showcasing student projects and experiments.',
    },
    {
        title: 'Sports Day',
        date: 'September 15, 2024',
        description: 'A day full of sports and fun activities for students and their families.',
    },
    {
        title: 'Parent-Teacher Meetings',
        date: 'October 5, 2024',
        description: 'Meet with teachers to discuss student progress and achievements.',
    },
];

const holidays = [
    {
        title: 'Winter Break',
        date: 'December 20, 2024 - January 5, 2025',
        description: 'Enjoy the winter break with family and friends!',
    },
    {
        title: 'Spring Break',
        date: 'April 1 - April 7, 2025',
        description: 'A week off for relaxation and family time.',
    },
    {
        title: 'Summer Vacation',
        date: 'June 10 - August 20, 2025',
        description: 'Long summer vacation to enjoy various activities and relaxation.',
    },
];

const Event = () => {
    return (
        <div>
           <Header />
        <div className="events-page-container">
            <div className="header-container-event">
                <h1 className="header-title">Upcoming Events & Holidays</h1>
            </div>
            <div className="main-content">
                <div className="events-container">
                    <h2 className="section-title">Upcoming Events</h2>
                    {events.map((event, index) => (
                        <div key={index} className="event-card">
                            <h3>{event.title}</h3>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </div>
                <div className="holidays-container">
                    <h2 className="section-title">Upcoming Holidays</h2>
                    {holidays.map((holiday, index) => (
                        <div key={index} className="holiday-card">
                            <h3>{holiday.title}</h3>
                            <p><strong>Date:</strong> {holiday.date}</p>
                            <p>{holiday.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2024 Edu-Web. All rights reserved.</p>
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </footer>
        </div>
        </div>
    );
};

export default Event;

