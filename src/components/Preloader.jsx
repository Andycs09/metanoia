import { useEffect, useState } from 'react';
import './Preloader.css';
import unoLogoImg from '../assets/logo.png';

// Import UNO cards
const unoCards = [
  '/images/card_1_c185b98b.png',
  '/images/card_3_4dab2dee.png',
  '/images/card_4_fc0ce148.png',
  '/images/card_6_1ad3c40f.png',
  'src/assets/uno7.png',
  'src/assets/unoflip.png',
];

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const container = document.querySelector('.preloader');
      if (!container) return;

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'preloader-particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = '0';
        
        // Random delay and duration
        particle.style.animationDelay = `${Math.random() * 4}s`;
        particle.style.animationDuration = `${3 + Math.random() * 3}s`;
        
        // Random color
        const colors = ['#00d4ff', '#ff006e', '#ffbe0b', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
      }
    };

    createParticles();

    // Simulate loading time (minimum 2 seconds)
    const minLoadTime = 2000;
    const startTime = Date.now();

    // Wait for page to load
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
      {/* UNO Cards Splash Animation */}
      <div className="preloader-cards">
        {unoCards.map((card, index) => (
          <img
            key={index}
            src={card}
            alt={`UNO Card ${index + 1}`}
            className="preloader-card"
          />
        ))}
      </div>

      <div className="preloader-content">
        {/* Logo */}
        <div className="preloader-logo">
          <img src={unoLogoImg} alt="UnoVerse Logo" />
        </div>

        {/* Loading Text */}
        <div className="preloader-text">Loading UnoVerse</div>

        {/* Spinner */}
        <div className="preloader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
}
