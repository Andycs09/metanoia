import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterModal from './RegisterModal';

export default function EventCard({ event, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  let imageSrc = event.image || '';
  try {
    if (imageSrc && !imageSrc.startsWith('/')) {
      imageSrc = new URL(`../../images/${imageSrc}`, import.meta.url).href;
    }
  } catch (err) {
    // fallback to event.image
  }

  function playFlipSound(i = 0) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // choose waveform based on index for variety
      const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
      osc.type = waveforms[i % waveforms.length] || 'sine';

      // map index to a musical interval for distinct pitches
      const baseFreq = 220; // A3
      const freq = baseFreq * Math.pow(2, (i % 12) / 12); // semitone steps
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      // quick attack and decay
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);

      // close context shortly after to free resources
      setTimeout(() => {
        try { ctx.close(); } catch (e) { /* ignore */ }
      }, 1000);
    } catch (err) {
      // fallback: small console log if audio fails (e.g., blocked)
      console.warn('Audio playback failed', err);
    }
  }

  useEffect(() => {
    if (flipped) {
      playFlipSound(index);
    }
  }, [flipped, index]);

  function handleCardClick() {
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
        {/* FRONT: full-bleed image with info overlay */}
        <div className="flip-card-front">
          <div className="full-image-wrapper">
            <img src={imageSrc} alt={event.title} />
            <div className="card-info-overlay">
              <h3>{event.title}</h3>
              <p>{event.short}</p>
            </div>
          </div>
        </div>

        {/* BACK: top row (title + actions) + short + scrollable details */}
        <div className="flip-card-back">
          <div className="back-top">
            <div className="back-title">{event.title}</div>
            <div className="back-actions">
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

          <div className="back-short">{event.short}</div>

          <div className="back-details" aria-live="polite">
            {event.details}
          </div>
        </div>
      </div>

      <RegisterModal isOpen={open} onRequestClose={stopAnd(() => setOpen(false))} eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
