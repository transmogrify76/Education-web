import React from 'react';
import './Medical.css';
import doctor1 from '../Assets/ipanwita.jpg';
import doctor2 from '../Assets/ayan.jpg';
import doctor3 from '../Assets/barnali.jpg';

const doctors = [
    {
        name: 'Dr. Dipanwita Roy',
        specialty: 'Pediatrician',
        description: 'Dr. Dipanwita Roy has over 7 years of experience in pediatric medicine and is dedicated to providing the best care for children.',
        image: doctor1
    },
    {
        name: 'Dr Ayan Chakraborty',
        specialty: 'Dentist',
        description: 'Dr Ayan Chakraborty specializes in pediatric dentistry, ensuring that children have healthy and bright smiles.',
        image: doctor2
    },
    {
        name: 'Dr. Barnali Ghose',
        specialty: 'Psychologist',
        description: 'Dr. Barnali provides psychological support and counseling to help students manage stress and emotional challenges.',
        image: doctor3
    }
];

const medicalEvents = [
    {
        title: 'Health Checkup Camp',
        date: 'September 20, 2024',
        description: 'A free health checkup camp for all students, including general health screenings and dental checkups.'
    },
    {
        title: 'Mental Health Awareness Seminar',
        date: 'October 10, 2024',
        description: 'An informative seminar on mental health awareness and support, conducted by our school psychologist.'
    }
];

const quotes = [
    '“Health is the greatest gift.” - Buddha',
    '“The groundwork for all happiness is good health.” - Leigh Hunt',
    '“To keep the body in good health is a duty.” - Buddha'
];

const Medical = () => {
    return (
        <div className="medical-page-containers">
            <div className="header-container-medical">
                <h1 className="header-title">Our Medical Support</h1>
            </div>
            <div className="main-contents">
                <div className="doctors-container">
                    <h2 className="section-title">Meet Our Doctors</h2>
                    {doctors.map((doctor, index) => (
                        <div key={index} className="doctor-card">
                            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                            <h3>{doctor.name}</h3>
                            <p><strong>Specialty:</strong> {doctor.specialty}</p>
                            <p>{doctor.description}</p>
                        </div>
                    ))}
                </div>
                <div className="events-container">
                    <h2 className="section-title">Upcoming Medical Events</h2>
                    {medicalEvents.map((event, index) => (
                        <div key={index} className="event-card">
                            <h3>{event.title}</h3>
                            <p><strong>Date:</strong> {event.date}</p>
                            <p>{event.description}</p>
                        </div>
                    ))}
                </div>
                <div className="quotes-container">
                    <h2 className="section-title">Health Quotes</h2>
                    {quotes.map((quote, index) => (
                        <div key={index} className="quote-card">
                            <p>{quote}</p>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2024 School Name. All rights reserved.</p>
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </footer>
        </div>
    );
};

export default Medical;
