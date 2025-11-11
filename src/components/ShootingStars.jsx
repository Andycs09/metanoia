import React, { useEffect, useRef } from 'react';
import './ShootingStars.css';

export default function ShootingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create shooting stars
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      
      // Random starting position (top and right areas of screen)
      const startX = 20 + Math.random() * 80;
      const startY = Math.random() * 40;
      
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;
      
      // Random animation delay and duration
      const delay = Math.random() * 3;
      const duration = 2.5 + Math.random() * 1.5;
      
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;
      
      container.appendChild(star);
      
      // Remove star after animation completes
      setTimeout(() => {
        if (star.parentNode === container) {
          container.removeChild(star);
        }
      }, (delay + duration) * 1000);
    };

    // Create initial batch of stars
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createShootingStar(), i * 500);
    }

    // Create new stars periodically
    const interval = setInterval(() => {
      createShootingStar();
    }, 2000);

    return () => {
      clearInterval(interval);
      // Clean up any remaining stars
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="shooting-stars-container" />;
}
