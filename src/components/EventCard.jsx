import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event, index = 0 }) {
  const [flipped, setFlipped] = useState(false);
  const [showPageBtn, setShowPageBtn] = useState(false);
  const navigate = useNavigate();
  const audioCtxRef = useRef(null);

  // CSS injected locally (safe if App.css isn't available)
  const CARD_CSS = `
    /* Top spacing from navbar + grid-friendly sizing */
    :root { --card-top-gap: clamp(72px, 12vh, 160px); }
    .flip-card {
      margin-block-start: var(--card-top-gap);
      display: inline-block;
      width: clamp(220px, 22vw, 280px); /* 4 across on wide screens */
      aspect-ratio: 3 / 4;
      margin-inline: clamp(8px, 1vw, 14px);
      vertical-align: top;
      transition: transform .6s;
    }

    /* Neutralize prior zig-zag transforms if still present */
    .flip-card.zig-left,
    .flip-card.zig-right { transform: none !important; }

    /* Flip mechanics */
    .flip-card { position: relative; perspective: 1200px; cursor: pointer; transform-style: preserve-3d; }
    .flip-face {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      border-radius: 14px;
      overflow: hidden;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
      transition: transform .8s cubic-bezier(.2,.8,.2,1);
      /* Thick black border on both faces */
      border: 12px solid #000;
      /* subtle inner rim + drop shadow for depth */
      box-shadow:
        inset 0 0 0 2px rgba(255,255,255,0.15),
        0 14px 28px rgba(0,0,0,0.45);
      background: #000; /* backdrop behind image edges */
    }
    .flip-front { transform: rotateY(0deg); z-index: 2; }
    .flip-back  { transform: rotateY(180deg); z-index: 1; pointer-events: none; }
    .flip-card.is-flipped .flip-front { transform: rotateY(-180deg); z-index: 1; pointer-events: none; }
    .flip-card.is-flipped .flip-back  { transform: rotateY(0deg); z-index: 3; pointer-events: auto; }

    /* Center overlay and tighten spacing */
    .flip-back .back-overlay {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 20px; gap: 10px;
      background: rgba(0,0,0,0.35); backdrop-filter: blur(2px);
    }
    .flip-back .back-title { font-size: 1.55rem; font-weight: 600; margin: 0; line-height: 1.2; color: #fff; }
    .flip-back .back-actions { display: flex; gap: 10px; margin: 0; flex-wrap: wrap; justify-content: center; }
    .flip-back .back-actions .btn { min-height: 34px; padding: 6px 14px; }
    .flip-back .back-short { max-width: 85%; margin: 0; font-size: .95rem; line-height: 1.3; color: #fff; }
    .flip-back .back-details { max-width: 85%; margin: 0; font-size: .85rem; line-height: 1.25; opacity: .85; color: #fff; }
    .flip-back .btn, .flip-back .back-overlay { pointer-events: auto; position: relative; z-index: 5; }

    /* Ensure images fill nicely inside bordered face */
    .full-image-wrapper, .flip-back-image-wrap { position: absolute; inset: 0; }
    .full-image-wrapper img, .flip-back-image-wrap img {
      width: 100%; height: 100%; object-fit: cover; display: block;
    }
  `;

  // imageSrc fallback to event.image
  let imageSrc = event.image || '';
  try {
    if (imageSrc && !imageSrc.startsWith('/')) {
      imageSrc = new URL(`../../images/${imageSrc}`, import.meta.url).href;
    }
  } catch {}
  const opImg = new URL('../../images/op.png', import.meta.url).href;

  useEffect(() => { if (flipped) setShowPageBtn(false); }, [flipped]);
  useEffect(() => {
    let t;
    if (flipped) t = setTimeout(() => setShowPageBtn(true), 620);
    return () => clearTimeout(t);
  }, [flipped]);

  // Play a short flip tone (~1.2s), different per-card hue/index
  function stopFlipSound() {
    const ctx = audioCtxRef.current;
    audioCtxRef.current = null;
    if (ctx) { try { ctx.close(); } catch {} }
  }
  function playFlipSound(duration = 1.2) {
    stopFlipSound();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // waveform and pitch by index
      const waveforms = ['sine', 'triangle', 'square', 'sawtooth'];
      osc.type = waveforms[index % waveforms.length] || 'sine';
      const base = 220;
      const freq = base * Math.pow(2, (index % 8) / 12);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // gentle envelope
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);

      setTimeout(() => stopFlipSound(), (duration + 0.1) * 1000);
    } catch {}
  }

  useEffect(() => () => stopFlipSound(), []);
  function handleCardClick(e) {
    if (e.target.closest('.back-actions')) return;
    playFlipSound(1.2);
    setFlipped(s => !s);
  }

  const navigateTo = (path, e) => {
    e.stopPropagation();
    navigate(path);
  };

  const hue = (index * 47) % 360;
  const registerBg = `linear-gradient(90deg, hsla(${hue},85%,60%,0.14), hsla(${(hue + 30) % 360},85%,60%,0.08))`;
  const registerBorder = `1px solid rgba(255,255,255,0.06)`;
  const zigClass = index % 2 === 0 ? 'zig-left' : 'zig-right';
  const zigOffsetPx = 18 * index; // vertical stagger

  return (
    <div
      className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
    >
      <style>{CARD_CSS}</style>

      {/* FRONT */}
      <div className="flip-face flip-front">
        <div className="full-image-wrapper">
          <img src={imageSrc} alt={event.title} />
          <div className="card-info-overlay">
            <h3>{event.title}</h3>
            <p>{event.short}</p>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div className="flip-face flip-back">
        <div className="flip-back-image-wrap" aria-hidden>
          <img src={opImg} alt="OP card" />
        </div>

        <div className="back-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="back-title" style={{ color: 'white' }}>{event.title}</div>

          <div className="back-actions" style={{ display: 'flex', gap: '12px' }}>
            <button className="btn" onClick={(e) => navigateTo(`/events/${event.id}`, e)}>
              Details
            </button>

            <button
              className="btn primary"
              onClick={(e) => navigateTo(`/register?event=${encodeURIComponent(event.id)}`, e)}
              style={{ background: registerBg, border: registerBorder }}
            >
              Register
            </button>

            {/* {showPageBtn && ( */}
              {/* // <button className="btn page" onClick={(e) => navigateTo(`/page`, e)> */}
              {/* //   Page */}
              {/* // </button> */}
            {/* // )} */}
          </div>

          <div className="back-short" style={{ color: 'white' }}>{event.short}</div>
          <div className="back-details" style={{ color: 'white' }} aria-live="polite">
            {event.details}
          </div>
        </div>
      </div>
    </div>
  );
}
