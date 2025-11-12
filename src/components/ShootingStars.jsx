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
      const startX = 30 + Math.random() * 70;
      const startY = Math.random() * 30;
      
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;
      
      // Slower animation with more variation
      const delay = Math.random() * 4;
      const duration = 4 + Math.random() * 3; // Slower: 4-7 seconds
      
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;
      
      // Random size variation for more natural look
      const size = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x
      star.style.transform = `scale(${size})`;
      
      container.appendChild(star);
      
      // Remove star after animation completes
      setTimeout(() => {
        if (star.parentNode === container) {
          container.removeChild(star);
        }
      }, (delay + duration) * 1000);
    };

    // Create initial batch of stars (fewer for slower effect)
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createShootingStar(), i * 800);
    }

    // Create new stars periodically (less frequent)
    const interval = setInterval(() => {
      createShootingStar();
    }, 3500);

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
