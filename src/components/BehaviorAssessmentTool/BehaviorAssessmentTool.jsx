import React from 'react';
import './BehaviorAssessmentTool.css';

const BehaviorAssessmentTool = () => {
  const behaviorData = [
    {
      category: 'Participation',
      description: 'Engages actively in class activities and discussions.',
      status: 'Excellent',
    },
    {
      category: 'Homework',
      description: 'Completes homework on time and with good quality.',
      status: 'Good',
    },
    {
      category: 'Conduct',
      description: 'Shows respect towards teachers and peers.',
      status: 'Satisfactory',
    },
    {
      category: 'Punctuality',
      description: 'Arrives on time for classes and meetings.',
      status: 'Needs Improvement',
    },
    {
      category: 'Teamwork',
      description: 'Works well with others and contributes to group projects.',
      status: 'Excellent',
    },
    {
      category: 'Responsibility',
      description: 'Takes responsibility for own actions and learning.',
      status: 'Good',
    },
    {
      category: 'Communication',
      description: 'Communicates effectively with peers and teachers.',
      status: 'Satisfactory',
    },
    {
      category: 'Respect',
      description: 'Shows respect for school property and the environment.',
      status: 'Excellent',
    },
  ];

  return (
    <div className="page-container">
      <header className="header">
        <h1 className="header-title">Behavior Assessment Tool</h1>
      </header>
      <main className="main-content">
        <div className="behavior-list">
          {behaviorData.map((behavior, index) => (
            <div key={index} className="behavior-item">
              <h3 className="behavior-category">{behavior.category}</h3>
              <p className="behavior-description">{behavior.description}</p>
              <p className={`behavior-status ${behavior.status.replace(' ', '-').toLowerCase()}`}>{behavior.status}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BehaviorAssessmentTool;
