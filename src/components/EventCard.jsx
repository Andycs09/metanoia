import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegisterModal from './RegisterModal';

export default function EventCard({ event }) {
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  let imageSrc = event.image || '';
  try {
    if (imageSrc && !imageSrc.startsWith('/')) {
      imageSrc = new URL(`../../images/${imageSrc}`, import.meta.url).href;
    }
  } catch (err) {
    // fallback
  }

  function handleCardClick(e) {
    setFlipped((s) => !s);
  }

  function stopAnd(fn) {
    return (e) => {
      e.stopPropagation();
      fn && fn();
    };
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((s) => !s);
    }
  }

  return (
    <div
      className="flip-card"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={onKeyDown}
      aria-pressed={flipped}
    >
      <div className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* FRONT: full-bleed image with title overlay */}
        <div className="flip-card-front card">
          <div className="card-image">
            <img src={imageSrc} alt={event.title} />
            <div className="card-title-overlay">
              <span>{event.title}</span>
            </div>
          </div>
        </div>

        {/* BACK: details + actions (same size as front) */}
        <div className="flip-card-back card">
          <h3>{event.title}</h3>
          <p style={{ color: '#cfd6da' }}>{event.short}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Link
              to={`/events/${event.id}`}
              className="btn"
              onClick={stopAnd()}
              style={{ textDecoration: 'none' }}
            >
              Details
            </Link>

            <button
              type="button"
              className="btn"
              onClick={stopAnd(() => setOpen(true))}
              style={{ background: '#ff6b61' }}
            >
              Register
            </button>
          </div>
        </div>
      </div>

      <RegisterModal
        isOpen={open}
        onRequestClose={stopAnd(() => setOpen(false))}
        eventId={event.id}
        eventTitle={event.title}
      />
    </div>
  );
}
