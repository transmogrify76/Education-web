// Award.js
import React from 'react';
import './Award.css';

import Header from '../Header/Header';
import award1 from '../Assets/best.jpg';
import award2 from '../Assets/teacherex.jpg';
import award3 from '../Assets/studentAw.jpg';

const Award = () => {
    return (
        <div className="award-page">
            <Header />
            <div className="awards-container">
                <header className="awards-header">
                    <h1>Awards & Achievements</h1>
                </header>
                <section className="awards-intro">
                    <h2>Celebrating Excellence</h2>
                    <p>Our school is proud of the numerous awards and accolades we have received over the years. These honors reflect our commitment to academic excellence, personal growth, and community service. Here are some of our most notable awards:</p>
                </section>
                <section className="awards-list">
                    <div className="award-card">
                        <h3>National Academic Excellence Award</h3>
                        <p>Year: 2023</p>
                        <p>Details: Recognized for outstanding academic performance and innovative teaching methods.</p>
                    </div>
                    <div className="award-card">
                        <h3>Community Service Award</h3>
                        <p>Year: 2022</p>
                        <p>Details: Awarded for significant contributions to community service and outreach programs.</p>
                    </div>
                    <div className="award-card">
                        <h3>Best School Environment Award</h3>
                        <p>Year: 2021</p>
                        <p>Details: Acknowledged for creating a positive and supportive learning environment for students.</p>
                    </div>
                </section>
                <section className="awards-gallery">
                    <h2>Award Highlights</h2>
                    <div className="gallery-grid">
                        <div className="gallery-item">
                            <img src={award1} alt="Award Ceremony 1" />
                            <p>Annual Awards Ceremony 2023</p>
                        </div>
                        <div className="gallery-item">
                            <img src={award2} alt="Award Ceremony 2" />
                            <p>Community Service Recognition 2022</p>
                        </div>
                        <div className="gallery-item">
                            <img src={award3} alt="Award Ceremony 3" />
                            <p>Academic Achievement Celebration 2021</p>
                        </div>
                    </div>
                </section>
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

export default Award;
