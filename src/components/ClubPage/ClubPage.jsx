import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClubPage.css';

const clubs = [
  { id: 1, name: 'Art Club', description: 'Explore your creativity through various art forms.', amount: 50 },
  { id: 2, name: 'Science Club', description: 'Engage in scientific experiments and projects.', amount: 60 },
  { id: 3, name: 'Sports Club', description: 'Participate in different sports and physical activities.', amount: 40 },
  { id: 4, name: 'Music Club', description: 'Learn and play different musical instruments.', amount: 55 },
];

const ClubPage = () => {
  const [selectedClub, setSelectedClub] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleJoinNow = (club) => {
    navigate(`/Payment/${club.id}`, { state: { club } });
  };

  return (
    <div className="club-page">
      <header className="club-page-header">
        <h1>Our Clubs</h1>
      </header>
      <div className='half-page'>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <ul className="club-list">
          {clubs.map((club) => (
            <li key={club.id} onClick={() => setSelectedClub(club)}>
              {club.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="club-details">
        {selectedClub ? (
          <>
            <h2>{selectedClub.name}</h2>
            <p>{selectedClub.description}</p>
            <p><strong>Amount: ${selectedClub.amount}</strong></p>
            <button className="join-button" onClick={() => handleJoinNow(selectedClub)}>
              Join Now
              <span className="iconButton">+</span>
            </button>
          </>
        ) : (
          <p>Please select a club from the sidebar to see the details.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default ClubPage;
