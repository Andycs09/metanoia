import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/GlobalNav.css';
import unoverseLogoImg from '../assets/unoverse logo.jpg';
import christLogoImg from '../assets/christ logo.png';
import samagraLogoImg from '../assets/samagra logo .png';
import departmentLogoImg from '../assets/department.png';
import audioFile from '../assets/yes.mp3';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(audioFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  return (
    <nav className={`global-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left side logos */}
        <div className="navbar-left-logos">
          <img src={departmentLogoImg} alt="Department Logo" className="department-logo" />
          <img src={samagraLogoImg} alt="Samagra Logo" className="samagra-logo" />
          <img src={unoverseLogoImg} alt="UnoVerse Logo" className="unoverse-logo" />
        </div>

        {/* Center - Navigation Links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/schedule">Schedule</Link></li>
          <li><Link to="/game">Play UNO</Link></li>
        </ul>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Right side */}
        <div className="navbar-right-section">
          <button
            className="audio-toggle-btn"
            onClick={toggleAudio}
            aria-label={audioPlaying ? "Pause audio" : "Play audio"}
          >
            {audioPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          <img src={christLogoImg} alt="Christ Logo" />
        </div>
      </div>
    </nav>
  );
}
