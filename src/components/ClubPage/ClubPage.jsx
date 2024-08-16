import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClubPage.css';

const clubs = [
  {
    id: 1,
    name: 'Art Club',
    description: 'Explore your creativity through various art forms such as painting, drawing, sculpting, and digital art. Participate in exhibitions and collaborate with fellow artists to enhance your skills and create beautiful art. The club offers workshops and events to inspire your artistic journey.',
    amount: 50,
    photoUrl: 'https://example.com/art-club.jpg'
  },
  {
    id: 2,
    name: 'Science Club',
    description: 'Engage in scientific experiments and projects that span various disciplines including biology, chemistry, physics, and environmental science. Discover new scientific concepts through hands-on experiments, guest lectures, and field trips. Perfect for those passionate about science and discovery.',
    amount: 60,
    photoUrl: 'https://example.com/science-club.jpg'
  },
  {
    id: 3,
    name: 'Sports Club',
    description: 'Participate in a wide range of sports and physical activities, from team sports like soccer and basketball to individual sports like tennis and swimming. Improve your fitness, learn new skills, and compete in friendly matches and tournaments. Join to stay active and make new friends.',
    amount: 40,
    photoUrl: 'https://example.com/sports-club.jpg'
  },
  {
    id: 4,
    name: 'Music Club',
    description: 'Learn and play different musical instruments, including guitar, piano, drums, and more. Join various ensembles, attend workshops, and perform at school events. Whether you’re a beginner or an experienced musician, there’s something for everyone in our vibrant music community.',
    amount: 55,
    photoUrl: 'https://example.com/music-club.jpg'
  },
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
      <header className="club-page-headers">
        <h3 className="our">Our Clubs</h3>
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
            <img src={selectedClub.photoUrl} alt={`${selectedClub.name} photo`} className="club-photo" />
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
