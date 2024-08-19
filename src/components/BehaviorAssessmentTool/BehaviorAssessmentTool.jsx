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
        <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BehaviorAssessmentTool;
// import React, { useState, useEffect } from 'react';
// import './BehaviorAssessmentTool.css';

// const BehaviorAssessmentTool = () => {
//   const [behaviorData, setBehaviorData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBehaviorData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/behavior-assessment');
//         if (!response.ok) {
//           // Log response status and status text
//           console.error('Network response was not ok:', response.status, response.statusText);
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setBehaviorData(data);
//       } catch (error) {
//         // Log error message
//         console.error('Fetch error:', error.message);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBehaviorData();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="page-container">
//       <header className="header">
//         <h1 className="header-title">Behavior Assessment Tool</h1>
//       </header>
//       <main className="main-content">
//         <div className="behavior-list">
//           {behaviorData.map((behavior, index) => (
//             <div key={index} className="behavior-item">
//               <h3 className="behavior-category">{behavior.category}</h3>
//               <p className="behavior-description">{behavior.description}</p>
//               <p className={`behavior-status ${behavior.status.replace(' ', '-').toLowerCase()}`}>
//                 {behavior.status} (Score: {behavior.score})
//               </p>
//             </div>
//           ))}
//         </div>
//       </main>
//       <footer className="footer">
//         <p className="footer-text">© 2024 Edu_Web. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default BehaviorAssessmentTool;

