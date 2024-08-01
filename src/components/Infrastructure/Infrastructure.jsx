import React, { useEffect } from 'react';
import './Infrastructure.css';
import sc1 from '../Assets/schoolone.jpg';
import sc2 from '../Assets/schooltwo.jpg';
import sc3 from '../Assets/schoolthree.jpg';
import sc4 from '../Assets/schoolfour.jpg';

const Infrastructure = () => {
    useEffect(() => {
        let slideIndex = 0;
        const showSlides = () => {
            const slides = document.getElementsByClassName("slide");
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1 }    
            slides[slideIndex-1].style.display = "block";  
            setTimeout(showSlides, 3000); // Change image every 2 seconds
        }
        showSlides();

        // Scroll Animation
        const handleScroll = () => {
            const cards = document.querySelectorAll('.info-card');
            const triggerBottom = window.innerHeight / 5 * 4;

            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < triggerBottom) {
                    card.classList.add('scroll-animate');
                } else {
                    card.classList.remove('scroll-animate');
                }
            });
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="infrastructure-page-container">
            <div className="header-container">
                <h1 className="header-title">Our School Infrastructure</h1>
            </div>
            <div className="main-content">
                <div className="slideshow-container">
                    <div className="slide fade show">
                        <img src={sc1} alt="School Infrastructure 1" className="slide-image" />
                    </div>
                    <div className="slide fade">
                        <img src={sc2} alt="School Infrastructure 2" className="slide-image" />
                    </div>
                    <div className="slide fade">
                        <img src={sc3} alt="School Infrastructure 3" className="slide-image" />
                    </div>
                    <div className="slide fade">
                        <img src={sc4
                            
                        } alt="School Infrastructure 3" className="slide-image" />
                    </div>
                </div>

                <div className="description-container">
                    <div className="info-card scroll-animate">
                        <p>
                            Welcome to our school! Our state-of-the-art facilities provide an exceptional learning environment for students. Our campus includes modern classrooms, advanced laboratories, expansive sports fields, and a well-stocked library.
                        </p>
                    </div>
                    <div className="info-card scroll-animate">
                        <p>
                            We pride ourselves on maintaining a safe, clean, and innovative campus that supports the academic and extracurricular growth of our students. Explore our gallery to see the facilities that make our school special.
                        </p>
                    </div>
                    <div className="info-card scroll-animate">
                        <p>
                            For more information or to arrange a visit, please contact us.
                        </p>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2024 Edu - Web. All rights reserved.</p>
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </footer>
        </div>
    );
};

export default Infrastructure;
