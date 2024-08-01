import React from 'react';
import Header from '../Header/Header';
import potr from './potr.jpg';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <div className="home-text">
          <h1 className="home-heading">Learn without Limits</h1>
          <p>
            Explore a diverse range of courses, from academic subjects to practical skills.
            <br />
            Join our community, expand your knowledge, and unlock new opportunities. 
            <span className="typing-animation">Start your journey with us today!</span>
          </p>
        </div>
        {/* <div className="home-image">
          <img src={potr} alt="potr" />
        </div> */}
      </div>
      <div className="rating-container">
        <div className="rating-animation">
          <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span className="rating-text"> 5.0</span>
        </div>
        <p className="rating-description">Rated by 1000+ users</p>
      </div>
    </div>
  );
};

export default Home;
