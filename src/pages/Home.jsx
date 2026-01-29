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
import departmentLogoImg from '../assets/department.png';
import unoLogoImg from '../assets/logo.png';
import audioFile from '../assets/yes.mp3';
import card1 from '../assets/card_1_c185b98b.png';
import card2 from '../assets/uno7.png';
import card3 from '../assets/card_3_4dab2dee.png';
import card4 from '../assets/card_4_fc0ce148.png';
import card5 from '../assets/unoflip.png';
import card6 from '../assets/card_2.png';

const unoCards = [card1, card2, card3, card4, card5, card6];


// Import UNO cards from images folder


export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHeaderElements, setShowHeaderElements] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const audioRef = useRef(null);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Hide header elements when scrolled down more than 200px
      setShowHeaderElements(window.scrollY < 200);
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

  // Drag/Swipe handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches?.[0]?.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX || e.touches?.[0]?.pageX;
    const walk = (startX - x) * 2;

    if (Math.abs(walk) > 50) {
      if (walk > 0 && currentSlide < events.length - 1) {
        setCurrentSlide(currentSlide + 1);
        setIsDragging(false);
      } else if (walk < 0 && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="unoverse-home" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Custom Navbar */}
      <nav className={`unoverse-navbar ${scrolled ? 'scrolled' : ''}`}>
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
              className="notification-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-label="Toggle notifications"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">+1</span>
            </button>
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

      {/* Notification Panel */}
      {notificationOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Event Notifications</h3>
            <button 
              className="close-notification"
              onClick={() => setNotificationOpen(false)}
              aria-label="Close notifications"
            >
              ×
            </button>
          </div>
          <div className="notification-content">
            {events.slice(0, 3).map((event, index) => (
              <Link 
                key={event.id} 
                to={`/events/${event.id}`}
                className="notification-item"
                onClick={() => setNotificationOpen(false)}
              >
                <div className="notification-icon">🎮</div>
                <div className="notification-details">
                  <h4>{event.title}</h4>
                  <p>{event.short}</p>
                  <span className="notification-time">Just now</span>
                </div>
              </Link>
            ))}
            <div className="notification-footer">
              <Link to="/events" onClick={() => setNotificationOpen(false)}>
                View All Events →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
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
          {/* Top: Department Text - Hidden when scrolled */}
          {showHeaderElements && (
            <h2 className="department-title">DEPARTMENT OF COMPUTER SCIENCE</h2>
          )}

          {/* Samagra and Google Collaboration - Below department title */}
          {/* {showHeaderElements && (
            <div className="collab-section-below-title">
              <div className="collab-logos-horizontal">
                <img src={samagraLogoImg} alt="Samagra" className="samagra-logo" />
                <span className="collab-x">✕</span>
                <img src={googleLogoImg} alt="Google India" className="google-logo" />
              </div>
            </div>
          )} */}

          {/* UNO Logo */}
          <div className="uno-logo-container">
            <img src={unoLogoImg} alt="UNO Logo" className="uno-logo" />
          </div>

          {/* Event Date */}
          <p className="event-date">30th-31st January, 2026</p>

          {/* CTA Buttons */}
          <div className="hero-cta">
            <Link to="/events" className="cta-button primary">Explore Events</Link>
            <Link to="/about" className="cta-button secondary">About Metanoia</Link>
          </div>
        </div>
      </section>





      {/* Featured Events Section */}
      <section className="featured-events-section">
        <div className="section-container">
          <h2 className="section-title">Featured Events</h2>
          <div
            className="carousel-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="events-carousel" ref={carouselRef}>
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <EventCard event={event} index={index} disableZigZag={true} />
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
