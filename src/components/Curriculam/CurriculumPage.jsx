import React, { useState } from 'react';
import './CurriculumPage.css';
import Header from '../Header/Header';



const subjects = {
    prePrimary: {
        title: 'Pre-Primary Education',
        description: 'Our pre-primary curriculum focuses on developing basic motor skills, language abilities, and social skills through play-based learning.',
    },
    primary: {
        title: 'Primary Education',
        description: 'In primary education, students engage in foundational subjects such as mathematics, science, and language arts with an emphasis on critical thinking and problem-solving.',
    },
    secondary: {
        title: 'Secondary Education',
        description: 'Secondary education includes more advanced subjects and aims to prepare students for higher education or vocational training. Subjects include mathematics, science, literature, and more.',
    },
    highSecondary: {
        title: 'High Secondary Education',
        description: 'High secondary education prepares students for college and careers with specialized subjects and advanced coursework in areas of interest.',
    },
};

const additionalCourses = {
    robotics: {
        title: 'Robotics',
        description: 'Explore the exciting world of robotics with hands-on projects and advanced technology.',
    },
    creativeWriting: {
        title: 'Creative Writing',
        description: 'Enhance your writing skills through creative exercises and storytelling workshops.',
    },
    musicAppreciation: {
        title: 'Music Appreciation',
        description: 'Dive into the world of music with classes on theory, history, and appreciation.',
    },
    advancedProgramming: {
        title: 'Advanced Programming',
        description: 'Learn advanced programming concepts and languages through practical coding exercises.',
    },
    artDesign: {
        title: 'Art & Design',
        description: 'Unleash your creativity with courses in drawing, painting, and digital design.',
    },
};

const CurriculumPage = () => {
    const [selectedOption, setSelectedOption] = useState('prePrimary');
    const [activeCourse, setActiveCourse] = useState('robotics');

    return (
        <div>
            <Header/>
        <div className="curriculum-page-container">
            <div className="header-containers">
                <h1 className="header-title">Our Curriculum</h1>
            </div>
            <h2 className='heading-course'>All CLASSES </h2>
            <div className="main-content-curiculum">
                <div className="sidebar">
                    <ul>
                        <li onClick={() => setSelectedOption('prePrimary')}>Pre-Primary</li>
                        <li onClick={() => setSelectedOption('primary')}>Primary</li>
                        <li onClick={() => setSelectedOption('secondary')}>Secondary</li>
                        <li onClick={() => setSelectedOption('highSecondary')}>High Secondary</li>
                    </ul>
                </div>
                <div className="content-area">
                    <h2>{subjects[selectedOption].title}</h2>
                    <p>{subjects[selectedOption].description}</p>
                </div>
            </div>
            <h2 className="heading-course">ADDITIONAL COURSE </h2>
            <div className="additional-courses-sections">
                <div className="courses-navbar">
                    <ul>
                        <li onClick={() => setActiveCourse('robotics')}>Robotics</li>
                        <li onClick={() => setActiveCourse('creativeWriting')}>Creative Writing</li>
                        <li onClick={() => setActiveCourse('musicAppreciation')}>Music Appreciation</li>
                        <li onClick={() => setActiveCourse('advancedProgramming')}>Advanced Programming</li>
                        <li onClick={() => setActiveCourse('artDesign')}>Art & Design</li>
                    </ul>
                </div>
                <div className="course-content">
                    <h2>{additionalCourses[activeCourse].title}</h2>
                    <p>{additionalCourses[activeCourse].description}</p>
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

export default CurriculumPage;
