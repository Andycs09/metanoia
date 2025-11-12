import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Import all UNO card images from assets/img folder (front side)
import uno1 from '../assets/img/uno (1).png';
import uno2 from '../assets/img/uno (2).png';
import uno3 from '../assets/img/uno (3).png';
import uno4 from '../assets/img/uno (4).png';
import uno5 from '../assets/img/uno (5).png';
import uno6 from '../assets/img/uno (6).png';
import uno7 from '../assets/img/uno (7).png';

// Import special replacement images
import aImage from '../assets/img/a.png';
import bImage from '../assets/img/b.png';

// Import all UNO card images from assets/img2 folder (back side when flipped)
import img2_1 from '../assets/img2/img (1).jpg';
import img2_2 from '../assets/img2/img (2).jpg';
import img2_3 from '../assets/img2/img (3).jpg';
import img2_4 from '../assets/img2/img (4).jpg';
import img2_5 from '../assets/img2/img (5).jpg';
import img2_6 from '../assets/img2/img (6).jpg';

export default function EventCard({ event, index = 0, disableZigZag = false }) {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const audioCtxRef = useRef(null);

  // CSS injected locally (safe if App.css isn't available)
  const CARD_CSS = `
    /* Top spacing from navbar + grid-friendly sizing */
    :root { --card-top-gap: clamp(40px, 6vh, 80px); }
    .flip-card {
      margin-block-start: var(--card-top-gap);
      display: inline-block;
      width: clamp(220px, 22vw, 280px);
      aspect-ratio: 3 / 4;
      margin-inline: clamp(8px, 1vw, 14px);
      vertical-align: top;
      transition: transform .6s;
      background: none;
      border: none;
      padding: 0;
    }

    /* Zig-zag positioning - more pronounced */
    .flip-card.zig-left {
      transform: translateY(-15px) !important;
    }
    .flip-card.zig-right {
      transform: translateY(15px) !important;
    }
    
    .flip-card.is-flipped.zig-left {
      transform: translateY(-15px) !important;
    }
    .flip-card.is-flipped.zig-right {
      transform: translateY(15px) !important;
    }

    /* Flip mechanics */
    .flip-card { 
      position: relative; 
      perspective: 1200px; 
      cursor: pointer; 
      transform-style: preserve-3d;
      background: none !important;
      border: none !important;
      outline: none !important;
    }
    .flip-face {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      border-radius: 0;
      overflow: visible;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
      transition: transform .8s cubic-bezier(.2,.8,.2,1);
      border: none;
      box-shadow: none;
      background: none;
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

    /* UNO Card Back Design */
    .uno-back-design {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 14px;
      overflow: hidden;
    }
    
    .uno-back-content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    /* Decorative dots */
    .decorative-dots {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .dot {
      position: absolute;
      border-radius: 50%;
      opacity: 0.8;
    }
    
    .dot-1 { width: 20px; height: 20px; background: #FFD700; top: 15%; left: 20%; }
    .dot-2 { width: 15px; height: 15px; background: #00BFFF; top: 25%; right: 15%; }
    .dot-3 { width: 18px; height: 18px; background: #FF6347; top: 35%; left: 10%; }
    .dot-4 { width: 12px; height: 12px; background: #32CD32; bottom: 30%; right: 20%; }
    .dot-5 { width: 16px; height: 16px; background: #FF69B4; bottom: 20%; left: 25%; }
    .dot-6 { width: 14px; height: 14px; background: #FFA500; top: 45%; right: 30%; }
    
    /* Main red oval */
    .red-oval {
      width: 80%;
      height: 60%;
      background: #DC143C;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 0 0 20px rgba(220, 20, 60, 0.5);
    }
    
    .event-text {
      text-align: center;
      color: white;
      z-index: 2;
    }
    
    .event-name {
      font-family: 'Arial Black', sans-serif;
      font-size: 1.5rem;
      font-weight: 900;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* Bottom text */
    .uno-bottom-text {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: 'Arial Black', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      text-align: center;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    }
    
    /* Circle content overlay */
    .circle-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 10;
      pointer-events: none;
    }
    
    .circle-title {
      font-family: 'Arial Black', sans-serif;
      font-size: 1.1rem;
      font-weight: 900;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
      margin-bottom: 8px;
      line-height: 1.1;
      text-transform: uppercase;
    }
    
    .circle-description {
      font-size: 0.8rem;
      color: white;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
      line-height: 1.2;
      font-weight: 600;
    }
    
    /* Button layout - positioned vertically at bottom right */
    .flip-back .card-buttons {
      position: absolute;
      bottom: 8px;
      right: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 15;
    }
    
    .flip-back .card-btn {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      pointer-events: auto;
      position: relative;
      overflow: hidden;
      min-width: 85px;
      text-align: center;
    }
    
    .flip-back .card-btn.details {
      background: linear-gradient(135deg, #ffffff, #e3f2fd, #bbdefb);
      background-size: 200% 200%;
      color: #1565c0;
      border: 1px solid #2196f3;
      box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
      animation: blueWhiteFlow 3s ease-in-out infinite;
    }
    
    .flip-back .card-btn.register {
      background: linear-gradient(135deg, #2196f3, #1976d2, #0d47a1);
      background-size: 200% 200%;
      color: white;
      border: 1px solid #1976d2;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.4);
      animation: blueGradientFlow 3s ease-in-out infinite;
    }
    
    @keyframes blueWhiteFlow {
      0% { 
        background-position: 0% 50%;
        box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
        transform: scale(1);
      }
      50% { 
        background-position: 100% 50%;
        box-shadow: 0 4px 10px rgba(33, 150, 243, 0.5);
        transform: scale(1.02);
      }
      100% { 
        background-position: 0% 50%;
        box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
        transform: scale(1);
      }
    }
    
    @keyframes blueGradientFlow {
      0% { 
        background-position: 0% 50%;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.4);
        transform: scale(1);
      }
      50% { 
        background-position: 100% 50%;
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.6);
        transform: scale(1.02);
      }
      100% { 
        background-position: 0% 50%;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.4);
        transform: scale(1);
      }
    }
    
    .flip-back .card-btn.details::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.6) 50%, 
        transparent);
      animation: whiteShine 2.5s ease-in-out infinite;
      transition: all 0.3s;
    }
    
    .flip-back .card-btn.register::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.4) 50%, 
        transparent);
      animation: blueShine 2.5s ease-in-out infinite;
      transition: all 0.3s;
    }
    
    @keyframes whiteShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes blueShine {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    .flip-back .card-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .flip-back .card-btn.details:hover {
      background: linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9);
      background-size: 200% 200%;
      animation: blueWhiteFlow 1.5s ease-in-out infinite, hoverPulse 0.6s ease-in-out;
      box-shadow: 0 6px 14px rgba(33, 150, 243, 0.6);
      color: #0d47a1;
    }
    
    .flip-back .card-btn.register:hover {
      background: linear-gradient(135deg, #0d47a1, #1565c0, #1976d2);
      background-size: 200% 200%;
      animation: blueGradientFlow 1.5s ease-in-out infinite, hoverPulse 0.6s ease-in-out;
      box-shadow: 0 6px 16px rgba(25, 118, 210, 0.7);
    }
    
    @keyframes hoverPulse {
      0%, 100% { transform: translateY(-2px) scale(1.05); }
      50% { transform: translateY(-4px) scale(1.08); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: translateY(-3px) scale(1.05); }
      50% { transform: translateY(-5px) scale(1.08); }
    }
    
    .flip-back .card-btn:active {
      transform: translateY(-1px) scale(1.02);
      transition: transform 0.1s;
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
      .circle-title {
        font-size: 0.9rem;
        margin-bottom: 6px;
      }
      
      .circle-description {
        font-size: 0.7rem;
        line-height: 1.1;
      }
      
      .flip-back .card-btn {
        padding: 6px 12px;
        font-size: 0.7rem;
        min-width: 75px;
      }
      
      .flip-back .card-buttons {
        bottom: 6px;
        right: 6px;
        gap: 5px;
      }
    }
    
    @media (max-width: 480px) {
      .circle-title {
        font-size: 0.8rem;
        margin-bottom: 4px;
      }
      
      .circle-description {
        font-size: 0.65rem;
      }
      
      .flip-back .card-btn {
        padding: 5px 10px;
        font-size: 0.65rem;
        min-width: 65px;
      }
      
      .flip-back .card-buttons {
        bottom: 5px;
        right: 5px;
        gap: 4px;
      }
    }

    /* Image IS the card - no container */
    .full-image-wrapper { 
      position: absolute; 
      inset: 0; 
      background: none;
      border: none;
      border-radius: 0;
    }
    .full-image-wrapper img {
      width: 100%; 
      height: 100%; 
      object-fit: contain; 
      display: block;
      border: none;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  `;

  // Event data with titles and descriptions
  const eventData = [
    {
      title: "UNO Reverse Alibi",
      description: "Solve the case… but only after flipping the clues."
    },
    {
      title: "Wild Card Auction", 
      description: "Pick your players, flip your luck"
    },
    {
      title: "UNO Frame: Capture the Colors",
      description: "See the world in four colors — Red, Blue, Green, Yellow."
    },
    {
      title: "Draw 4 Arena (Online Gaming)",
      description: "Play hard. Flip harder"
    },
    {
      title: "Skip the Obvious",
      description: "Follow the clues… unless the card tells you to skip."
    },
    {
      title: "UNO Reverse Alibi (Murder Mystery)",
      description: "Solve the case… but only after flipping the clues"
    },
    {
      title: "Logic Reverse: The Brain Battle",
      description: "Outsmart. Outthink. UNO-reverse your opponent."
    },
    {
      title: "Color Chaos Quiz",
      description: "Guess. Climb. But beware… one snake can reverse it all"
    }
  ];

  const currentEventData = eventData[index % eventData.length];

  // Array of imported UNO card images for front side
  const unoImages = [uno1, uno2, uno3, uno4, uno5, uno6, uno7];
  
  // Array of imported UNO card images for back side (when flipped)
  const img2Images = [img2_1, img2_2, img2_3, img2_4, img2_5, img2_6];
  
  // Get image based on card index (cycles through available images)
  // Replace images for cards 4 and 7 with a.jpg and b.jpg
  let frontImageSrc;
  if (index === 4) {
    frontImageSrc = aImage;
  } else if (index === 7) {
    frontImageSrc = bImage;
  } else {
    frontImageSrc = unoImages[index % unoImages.length];
  }
  
  const backImageSrc = img2Images[index % img2Images.length];



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

  const zigClass = disableZigZag ? '' : (index % 2 === 0 ? 'zig-left' : 'zig-right');

  // UNO card colors based on index
  const cardColors = [
    '#4CAF50', // Green
    '#F44336', // Red  
    '#2196F3', // Blue
    '#FFEB3B', // Yellow
    '#F44336', // Red
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#9C27B0'  // Purple
  ];
  
  const cardColor = cardColors[index % cardColors.length];
  
  // Special card designs for certain events
  const getCardDesign = () => {
    if (event.id === 'music') {
      return {
        background: `linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)`,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 3s ease infinite'
      };
    }
    
    if (event.id === 'cosplay') {
      return {
        background: `linear-gradient(135deg, ${cardColor}dd, ${cardColor}aa, ${cardColor}dd)`,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `
      };
    }
    
    return {
      background: `linear-gradient(135deg, ${cardColor}, ${cardColor}dd)`
    };
  };

  return (
    <div
      className={`flip-card ${zigClass} ${flipped ? 'is-flipped' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
    >
      <style>{CARD_CSS}</style>

      {/* FRONT - Clean card image */}
      <div className="flip-face flip-front">
        <div className="full-image-wrapper">
          <img src={frontImageSrc} alt={event.title} />
        </div>
      </div>

      {/* BACK - Different image from img2 folder with content in circle */}
      <div className="flip-face flip-back">
        <div className="full-image-wrapper">
          <img src={backImageSrc} alt={`${currentEventData.title} - Details`} />
        </div>
        
        {/* Content inside the circle */}
        <div className="circle-content">
          <div className="circle-title">{currentEventData.title}</div>
          <div className="circle-description">{currentEventData.description}</div>
        </div>
        
        {/* New button layout at bottom - only render when flipped */}
        {flipped && (
          <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
            <button 
              className="card-btn details" 
              onClick={(e) => navigateTo(`/events/${event.id}`, e)}
            >
              Details
            </button>
            <button 
              className="card-btn register" 
              onClick={(e) => navigateTo(`/register?event=${encodeURIComponent(event.id)}`, e)}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
