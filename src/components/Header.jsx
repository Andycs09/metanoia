import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div style={{fontWeight:800, fontSize:20}}>UNOVERSE</div>
      <nav>
        <Link to="/" style={{marginRight:16}}>Home</Link>
        <Link to="/about" style={{marginRight:16}}>About</Link>
        <Link to="/events" style={{marginRight:16}}>Events</Link>
        <Link to="/schedule">Schedule</Link>
      </nav>
    </header>
  );
}
