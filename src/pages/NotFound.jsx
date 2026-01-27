import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/home page theme.png';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="not-found-overlay"></div>
      
      <div className="not-found-container">
        <div className="not-found-content">
          {/* 404 Number */}
          <div className="error-code">
            <span className="error-digit">4</span>
            <span className="error-digit">0</span>
            <span className="error-digit">4</span>
          </div>
          
          {/* UNO Cards Animation */}
          <div className="floating-cards-404">
            <div className="card-404 card-red">UNO</div>
            <div className="card-404 card-blue">UNO</div>
            <div className="card-404 card-green">UNO</div>
            <div className="card-404 card-yellow">UNO</div>
          </div>
          
          {/* Error Message */}
          <div className="error-message">
            <h1>Page Not Found</h1>
            <p>Looks like this page got skipped! The page you're looking for doesn't exist in the UNOVerse.</p>
          </div>
          
          {/* Action Buttons */}
          <div className="error-actions">
            <Link to="/" className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Back to Home
            </Link>
            <Link to="/events" className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              View Events
            </Link>
          </div>
          
          {/* Fun UNO Message */}
          <div className="uno-message">
            <p>🎮 Don't worry, even in UNO sometimes you have to draw cards!</p>
          </div>
        </div>
      </div>
    </div>
  );
}