import React from 'react';
import Header from '../Header/Header';
import './Home.css';

const Home = () => {
  return (
    <div>
<span>
        <Header />
        </span>
      <div className="homepage-container-home">
        <div className="homepage-content-home">
          <div className="homepage-text-home">
            <h1 className="homepage-heading-home">Learn without Limits</h1>
            <h3>
              Explore a diverse range of courses, from academic subjects to practical skills.
              <br />
              Join our community, expand your knowledge, and unlock new opportunities. 
              <span className="typing-animation">Start your journey with us today !</span>
            </h3>
          </div>
        </div>
        <div className="rating-section">
          <div className="rating-animation">
            <span className="rating-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="rating-value"> 5.0</span>
          </div>
          <p className="rating-text">Rated by 1000+ users</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
