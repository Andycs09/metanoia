import React from 'react';
import EventCard from '../components/EventCard';
import events from '../data/events';
// import the gif from the src/data folder (file name includes spaces)
import heroGif from '../data/Untitled video - Made with Clipchamp.gif';

export default function Home(){
  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">UNOVERSE</h1>
          <p className="hero-sub">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <div className="hero-cta">
            <button className="btn">GET STARTED</button>
          </div>
        </div>

        <div className="hero-image-wrap" aria-hidden>
          {/* use the imported gif */}
          <img className="hero-image" src={heroGif} alt="UNOVERSE hero" />
        </div>
      </section>

      <section className="featured" style={{ paddingTop: '48px' }}>
        <h2 style={{ marginBottom: 12 }}>Featured Events</h2>
        <div className="events-grid">
          {events.slice(0, 4).map(ev => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </section>
    </div>
  );
}
