import { useEffect, useState } from 'react';
import './Preloader.css';
import unoLogoImg from '../assets/logo.png';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const container = document.querySelector('.preloader');
      if (!container) return;

      for (let i = 0; i < 30; i++) {
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

    // Animate progress counter
    const duration = 1800; // 1.8 seconds
    const steps = 100;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(currentStep, 100);
      setProgress(newProgress);

      if (currentStep >= 100) {
        clearInterval(progressInterval);
      }
    }, stepDuration);

    // Simulate loading time (minimum 1.8 seconds)
    const minLoadTime = 1800;
    const startTime = Date.now();

    // Wait for page to load
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
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
          <span className="loading-percentage">{progress}%</span>
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
