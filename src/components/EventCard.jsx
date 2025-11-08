import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

  let imageSrc = event.image || '';
  try {
    if (imageSrc && !imageSrc.startsWith('/')) {
      imageSrc = new URL(`../../images/${imageSrc}`, import.meta.url).href;
    }
  } catch (err) {
    // fallback to event.image
  }

  // full-path to the OP image in the project's images folder
  const opImg = new URL('../../images/op.png', import.meta.url).href;

  // play a short tone using WebAudio; different waveform/frequency per index
  function playFlipSound(i = 0) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
      osc.type = waveforms[i % waveforms.length] || 'sine';

      const baseFreq = 220;
      const freq = baseFreq * Math.pow(2, (i % 12) / 12);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);

      setTimeout(() => {
        try { ctx.close(); } catch (e) {}
      }, 1000);
    } catch (err) {
      console.warn('Audio playback failed', err);
    }
  }

  useEffect(() => {
    if (flipped) playFlipSound(index);
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

  // compute a translucent/transparent gradient per card based on index
  const hue = (index * 47) % 360;
  const registerBg = `linear-gradient(90deg, hsla(${hue},85%,60%,0.14), hsla(${(hue + 30) % 360},85%,60%,0.08))`;
  const registerBorder = `1px solid rgba(255,255,255,0.06)`;

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

        {/* BACK: show OP image full-bleed; keep details overlay on top */}
        <div className="flip-card-back">
          {/* OP image fills the back */}
          <div className="flip-back-image-wrap" aria-hidden>
            <img src={opImg} alt="OP card" />
          </div>

          {/* overlay content (title, short, actions) remains usable */}
          <div className="back-overlay" style={{ color: 'white' }}>
            <div className="back-top" style={{ color: 'white' }} >
              <div className="back-title" style={{ color: 'white' }} >{event.title}</div>
              <div className="back-actions">
                <Link to={`/events/${event.id}`} className="btn" onClick={stopAnd()} style={{ textDecoration: 'none' }}>
                  Details
                </Link>

                {/* Register button uses per-card translucent background */}
                <Link
                  to={`/register?event=${encodeURIComponent(event.id)}`}
                  className="btn primary"
                  onClick={stopAnd()}
                  style={{ textDecoration: 'none', background: registerBg, border: registerBorder }}
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="back-short" style={{ color: 'white' }}>{event.short}</div>

            <div className="back-details" style={{ color: 'white' }} aria-live="polite">
              {event.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
