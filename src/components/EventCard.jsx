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
      width: clamp(220px, 22vw, 280px);
      aspect-ratio: 3 / 4;
      margin-inline: clamp(8px, 1vw, 14px);
      vertical-align: top;
      transition: transform .6s;
    }

    /* Zig-zag positioning - more pronounced */
    .flip-card.zig-left {
      transform: translateY(-30px) !important;
    }
    .flip-card.zig-right {
      transform: translateY(30px) !important;
    }
    
    .flip-card.is-flipped.zig-left {
      transform: translateY(-30px) !important;
    }
    .flip-card.is-flipped.zig-right {
      transform: translateY(30px) !important;
    }

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

    /* Center overlay - no dark layer, perfectly centered */
    .flip-back .back-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 14px;
      background: transparent;
    }
    
    .flip-back .back-title { 
      font-size: 1.5rem; 
      font-weight: 900; 
      margin: 0; 
      line-height: 1.2; 
      color: #fff;
      text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
    }
    
    .flip-back .back-actions { 
      display: flex; 
      gap: 12px; 
      margin: 8px 0; 
      flex-wrap: wrap; 
      justify-content: center; 
    }
    
    .flip-back .back-actions .btn { 
      min-height: 38px; 
      padding: 10px 20px;
      font-weight: 700;
      border-radius: 8px;
      background: white;
      border: 2px solid rgba(0,0,0,0.2);
      color: #000;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    
    .flip-back .back-actions .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(0,0,0,0.2) 30%, 
        rgba(0,0,0,0.3) 50%, 
        rgba(0,0,0,0.2) 70%, 
        transparent);
      animation: btnFlow 2.5s ease-in-out infinite;
      transform: skewX(-20deg);
    }
    
    @keyframes btnFlow {
      0% { left: -150%; }
      100% { left: 150%; }
    }
    
    .flip-back .back-actions .btn:hover {
      background: #f5f5f5;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 6px 12px rgba(0,0,0,0.4);
      animation: btnPulse 0.6s ease-in-out;
    }
    
    @keyframes btnPulse {
      0%, 100% { transform: translateY(-3px) scale(1.05); }
      50% { transform: translateY(-5px) scale(1.08); }
    }
    
    .flip-back .back-actions .btn.primary {
      background: linear-gradient(135deg, #ff6b6b, #ff4757);
      border-color: #ff4757;
      color: white;
      animation: btnGlow 2s ease-in-out infinite;
    }
    
    @keyframes btnGlow {
      0%, 100% { box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3); }
      50% { box-shadow: 0 4px 15px rgba(255, 71, 87, 0.6); }
    }
    
    .flip-back .back-actions .btn.primary::before {
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255,255,255,0.3) 30%, 
        rgba(255,255,255,0.5) 50%, 
        rgba(255,255,255,0.3) 70%, 
        transparent);
    }
    
    .flip-back .back-actions .btn.primary:hover {
      background: linear-gradient(135deg, #ff4757, #ff3838);
      box-shadow: 0 6px 20px rgba(255, 71, 87, 0.8);
      transform: translateY(-3px) scale(1.05);
      animation: btnPulse 0.6s ease-in-out, btnGlow 2s ease-in-out infinite;
    }
    
    .flip-back .back-actions .btn:active {
      transform: translateY(-1px) scale(1.02);
      transition: transform 0.1s;
    }
    
    .flip-back .back-short { 
      width: 100%;
      margin: 0; 
      font-size: 1rem; 
      line-height: 1.4; 
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      font-weight: 600;
    }
    
    .flip-back .back-details { 
      width: 100%;
      margin: 0; 
      font-size: .9rem; 
      line-height: 1.3; 
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    }
    
    .flip-back .btn, .flip-back .back-overlay { 
      pointer-events: auto; 
      position: relative; 
      z-index: 5; 
    }

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
  function playFlipSound(duration = 1.8) {
    stopFlipSound();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create a pleasant musical flip sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Musical notes based on card index
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C major scale
      const baseNote = notes[index % notes.length];
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';
      
      // Create chord effect
      osc1.frequency.setValueAtTime(baseNote, ctx.currentTime);
      osc2.frequency.setValueAtTime(baseNote * 1.25, ctx.currentTime); // Major third
      osc3.frequency.setValueAtTime(baseNote * 1.5, ctx.currentTime); // Perfect fifth
      
      // Add slight pitch bend
      osc1.frequency.exponentialRampToValueAtTime(baseNote * 1.02, ctx.currentTime + duration);
      osc2.frequency.exponentialRampToValueAtTime(baseNote * 1.27, ctx.currentTime + duration);
      osc3.frequency.exponentialRampToValueAtTime(baseNote * 1.52, ctx.currentTime + duration);

      // Low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);

      // Smooth envelope
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc3.start();
      osc1.stop(ctx.currentTime + duration + 0.05);
      osc2.stop(ctx.currentTime + duration + 0.05);
      osc3.stop(ctx.currentTime + duration + 0.05);

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

  return (
    <div
      className={`flip-card ${zigClass} ${flipped ? 'is-flipped' : ''}`}
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
