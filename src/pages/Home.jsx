import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import events from '../data/events';
import EventCard from '../components/EventCard';

// Import assets
import bgImage from '../assets/home page theme.png';
import unoverseLogoImg from '../assets/unoverse logo.jpg';
import christLogoImg from '../assets/christ logo.png';
import samagraLogoImg from '../assets/samagra logo .png';
import unoLogoImg from '../assets/logo.png';
import googleLogoImg from '../assets/google.png';

import audioFile from '../assets/yes.mp3';

// Import UNO cards from images folder
const unoCards = [
  '/images/card_1_c185b98b.png',
  '/images/card_2_c305cb2a.png',
  '/images/card_3_4dab2dee.png',
  '/images/card_4_fc0ce148.png',
  '/images/card_5_dd7a31d0.png',
  '/images/card_6_1ad3c40f.png',
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const audioRef = useRef(null);
  const carouselRef = useRef(null);

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

  // Sequential cyclic carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll effect for carousel
  useEffect(() => {
    if (carouselRef.current) {
      const cardWidth = 240; // Fixed card width (reduced)
      const gap = 32; // 2rem gap
      
      // Calculate the offset to center the current card
      const containerWidth = window.innerWidth;
      const centerOffset = (containerWidth / 2) - (cardWidth / 2);
      const slideOffset = currentSlide * (cardWidth + gap);
      const totalOffset = slideOffset - centerOffset;
      
      carouselRef.current.style.transform = `translateX(-${Math.max(0, totalOffset)}px)`;
    }
  }, [currentSlide]);

  return (
    <div className="unoverse-home" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Custom Navbar */}
      <nav className={`unoverse-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={unoverseLogoImg} alt="UnoVerse Logo" />
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/schedule">Schedule</Link></li>
            <li><Link to="/game">Play UNO</Link></li>
          </ul>

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

      {/* Hero Section */}
      <section className="hero-section">
        {/* Shooting Stars */}
        <div className="shooting-stars">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="shooting-star" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>

        {/* Floating UNO Cards */}
        <div className="floating-cards">
          {unoCards.map((card, index) => (
            <img
              key={index}
              src={card}
              alt={`UNO Card ${index + 1}`}
              className={`floating-card card-${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-content">
          {/* Top: Department Text */}
          <h2 className="department-title">DEPARTMENT OF COMPUTER SCIENCE</h2>

          {/* Samagra and Google Collaboration */}
          <div className="collab-section">
            <div className="collab-logos-horizontal">
              <img src={samagraLogoImg} alt="Samagra" className="samagra-logo" />
              <span className="collab-x">✕</span>
              <img src={googleLogoImg} alt="Google India" className="google-logo" />
            </div>
          </div>

          {/* UNO Logo */}
          <div className="uno-logo-container">
            <img src={unoLogoImg} alt="UNO Logo" className="uno-logo" />
          </div>

          {/* Event Date */}
          <p className="event-date">24th-25th November,2025 <br /> (Monday & Tuesday)</p>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <Link to="/events" className="cta-button primary">Explore Events</Link>
            <Link to="/about" className="cta-button secondary">About UnoVerse</Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-events-section">
        <div className="section-container">
          <h2 className="section-title">Featured Events</h2>
          <div className="carousel-container">
            <div className="events-carousel" ref={carouselRef}>
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <EventCard event={event} index={index} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {events.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
