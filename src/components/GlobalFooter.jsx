import React from 'react';
import '../styles/GlobalFooter.css';
import departmentLogoImg from '../assets/department.png';
import samagraLogoImg from '../assets/samagra logo .png';
import unoverseLogoImg from '../assets/unoverse logo.jpg';

export default function GlobalFooter() {
  return (
    <footer className="global-footer">
      <div className="footer-container">
        <div className="footer-logos">
          <img src={departmentLogoImg} alt="Department of Computer Science" className="footer-logo" />
          <img src={samagraLogoImg} alt="Samagra" className="footer-logo" />
          <img src={unoverseLogoImg} alt="UnoVerse" className="footer-logo" />
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/samagra_cs/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/samagra-cs/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="samagra.cs@christuniversity.in" aria-label="Email">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
