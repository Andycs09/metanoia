import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import events from '../data/events';

// Import home page background theme
import bgImage from '../assets/home page theme.png';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // <-- replace with your URL

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// PERF: move video URL compute outside component
const videoUrl = new URL('../../images/ac.mp4', import.meta.url).href;

// PERF: cache GSAP dynamic import (avoid multiple network + parse)
let gsapPromise;
function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import(/* @vite-ignore */ 'gsap').catch(() => null);
  }
  return gsapPromise.then(mod => mod?.gsap || mod?.default || null);
}

// Clean, responsive register page styles
const REGISTER_STYLE = `
  .register-page { 
    font-family: 'Poppins', sans-serif; 
    color: #e2e8f0;
  }
  .register-card {
    background: rgba(128, 128, 128, 0.3);
    border: 4px solid #0080ff;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 0 30px rgba(0, 128, 255, 0.3);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    opacity: 0;
    transform: translateY(40px);
    position: relative;
    z-index: 1;
    max-width: 700px;
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 70vh;
  }
  
  .register-header {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 100%;
    text-align: center;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .register-header.hidden {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
    pointer-events: none;
  }
  
  .register-card h2 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 0;
    background: linear-gradient(45deg, #1a237e, #ffffff, #9c27b0, #e91e63, #1a237e);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba(156, 39, 176, 0.5), 0 0 40px rgba(26, 35, 126, 0.3);
    animation: gradientShift 3s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(156, 39, 176, 0.6));
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .participants {
    max-height: none;
    overflow: visible;
  }
  
  .participant-fieldset {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .participant-fieldset legend {
    color: #00d4ff;
    font-weight: 600;
    padding: 0 0.5rem;
  }
  
  /* Form content area */
  .form-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  /* Card footer for controls */
  .card-footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 2px solid rgba(0, 128, 255, 0.3);
    background: rgba(0, 0, 0, 0.2);
    margin: 1.5rem -2rem -2rem -2rem;
    padding: 1.5rem 2rem;
    border-radius: 0 0 16px 16px;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .register-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(128, 128, 128, 0.3);
    border-top: 2px solid #0080ff;
    padding: 1rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 100;
  }
  @keyframes cardEnter { 0% { opacity:0; transform:translateY(40px); } 100% { opacity:1; transform:translateY(0); } }
  .register-card.enter { animation: cardEnter .9s cubic-bezier(.17,.67,.33,1) forwards; }

  /* Existing flip helpers */
  .register-bg-overlay { pointer-events:none; }

  /* --- Flip-card interaction fixes --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  .flip-card .flip-front, .flip-card .flip-back { backface-visibility: hidden; transform-style: preserve-3d; }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Stay flipped while focused OR explicitly locked via .is-flipped class (no :hover) */
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  /* Ensure front/back pointer-events are controlled by class, not hover */
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  /* Button-like anchors inside cards (bigger hit-area) */
  .flip-card .card-actions a,
  .flip-card a.card-btn,
  .flip-card a.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    min-height: 36px;
    border-radius: 10px;
    background: rgba(0,0,0,.55);
    color: #fff;
    text-decoration: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  .flip-card .card-actions a:focus-visible,
  .flip-card a.card-btn:focus-visible,
  .flip-card a.btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(255,255,255,.4);
  }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { 
    font-size:16px; 
    color:#fff; 
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
  }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }
  .input:focus {
    outline: none;
    border-color: #0080ff;
    box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
  }
  
  .native-select { 
    background: transparent; 
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: #fff;
  }
  .native-select:focus {
    outline: none;
    border-color: #0080ff;
    box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
  }
  .event-display {
    background: transparent;
    border: 1px solid rgba(0, 128, 255, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    color: #0080ff;
  }

  .flip-card.locked .flip-inner { transform: rotateY(180deg); }

  .back-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  .back-actions button.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    min-height: 38px;
    border-radius: 10px;
    background: rgba(0,0,0,.55);
    color:#fff;
    font: inherit;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.15);
    text-decoration: none;
  }
  .back-actions button.btn.primary {
    background: linear-gradient(90deg, rgba(240,202,66,0.14), rgba(191,240,66,0.08));
    border:1px solid rgba(255,255,255,0.18);
  }
  .back-actions button.btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.4);
  }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { font-size:16px; color:#fff; }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }

  /* --- Flip-card interaction fixes (global) --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  /* Stay flipped while hovered OR any child (buttons) is focused */
  .flip-card:hover .flip-inner,
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  .flip-card .flip-front, .flip-card .flip-back {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Route clicks to back; prevent front from stealing events when flipped */
  .flip-card:hover .flip-front,
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:hover .flip-back,
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  /* Ensure front/back stacking and pointer behavior when flipped */
  .flip-card.is-flipped .flip-card-front {
    pointer-events: none;
  }
  .flip-card.is-flipped .flip-card-back {
    pointer-events: auto;
  }

  /* Reliable 3D flip layout and stacking (ensures back face can receive clicks) */
  .flip-card {
    position: relative;
    perspective: 1000px;
  }
  .flip-card-inner,
  .flip-card .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform .6s;
  }
  /* when flipped (JS toggles .is-flipped on .flip-card) rotate inner */
  .flip-card.is-flipped .flip-card-inner,
  .flip-card.is-flipped .flip-inner {
    transform: rotateY(180deg);
  }

  /* front/back are absolute stacked faces */
  .flip-card-front,
  .flip-front,
  .flip-card-back,
  .flip-back {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* front sits above by default */
  .flip-card-front,
  .flip-front {
    z-index: 2;
    transform: rotateY(0deg);
  }

  /* back rotated and placed behind; when flipped it will be above due to z-index logic in JS */
  .flip-card-back,
  .flip-back {
    transform: rotateY(180deg);
    z-index: 1;
    pointer-events: none; /* disabled by default */
  }

  /* when flipped, allow back to receive pointer events */
  .flip-card.is-flipped .flip-card-back,
  .flip-card.is-flipped .flip-back {
    pointer-events: auto;
    z-index: 3;
  }

  /* ensure buttons area is interactive */
  .back-actions { display:flex; gap:12px; }
  .back-actions .btn { pointer-events: auto; }

  /* --- Register form styles --- */
  .native-select, .native-select option { color:#000; }
  .input { font-size:16px; color:#fff; }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }

  /* --- Flip-card interaction fixes (global) --- */
  .flip-card { position: relative; perspective: 1000px; }
  .flip-card .flip-inner { transform-style: preserve-3d; transition: transform .6s; }
  /* Stay flipped while hovered OR any child (buttons) is focused */
  .flip-card:hover .flip-inner,
  .flip-card:focus-within .flip-inner,
  .flip-card.is-flipped .flip-inner { transform: rotateY(180deg); }

  .flip-card .flip-front, .flip-card .flip-back {
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  .flip-card .flip-back { transform: rotateY(180deg); }

  /* Route clicks to back; prevent front from stealing events when flipped */
  .flip-card:hover .flip-front,
  .flip-card:focus-within .flip-front,
  .flip-card.is-flipped .flip-front { pointer-events: none; }
  .flip-card:hover .flip-back,
  .flip-card:focus-within .flip-back,
  .flip-card.is-flipped .flip-back { pointer-events: auto; }

  
  /* Mobile and responsive design */
  @media (max-width: 768px) {
    .register-header {
      top: 70px;
    }
    
    .register-header h2 {
      font-size: 1.2rem;
      letter-spacing: 1px;
      padding: 0 1rem;
    }
    
    .register-card {
      width: 95%;
      padding: 1rem;
      margin-top: 5rem;
      max-height: calc(100vh - 200px);
      border-radius: 15px;
    }
    
    .participant-fieldset {
      padding: 1rem;
      margin-bottom: 1rem;
    }
    
    .participant-fieldset legend {
      font-size: 1rem;
    }
    
    .row {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .input {
      padding: 0.875rem;
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .native-select {
      padding: 0.875rem;
      font-size: 16px;
    }
    
    .event-display {
      padding: 0.875rem;
      font-size: 0.9rem;
    }
    
    .controls {
      flex-direction: column;
      gap: 0.75rem;
      padding: 0 1rem;
    }
    
    .btn {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      min-height: 48px; /* Touch-friendly size */
    }
    
    .card-footer {
      padding: 1rem;
      margin: 1rem -1rem -1rem -1rem;
    }
    
    .msg {
      margin: 1rem 0;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .register-page {
      padding: 1rem 0.5rem;
      padding-top: 4rem;
    }
    
    .register-header {
      top: 60px;
    }
    
    .register-header h2 {
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
    
    .register-card {
      width: 98%;
      padding: 0.75rem;
      margin-top: 4rem;
      max-height: calc(100vh - 180px);
    }
    
    .participant-fieldset {
      padding: 0.75rem;
      border-radius: 8px;
    }
    
    .participant-fieldset legend {
      font-size: 0.9rem;
      padding: 0 0.25rem;
    }
    
    .input, .native-select {
      padding: 0.75rem;
      border-radius: 6px;
    }
    
    .event-display {
      padding: 0.75rem;
      border-radius: 6px;
    }
    
    .controls {
      gap: 0.5rem;
    }
    
    .btn {
      padding: 0.875rem;
      font-size: 0.9rem;
      border-radius: 6px;
    }
    
    .btn.link {
      padding: 0.5rem;
      font-size: 0.85rem;
    }
  }
  
  @media (max-width: 360px) {
    .register-header h2 {
      font-size: 0.9rem;
    }
    
    .register-card {
      padding: 0.5rem;
      border-radius: 10px;
      margin-top: 3.5rem;
    }
    
    .participant-fieldset {
      padding: 0.5rem;
    }
    
    .input, .native-select, .event-display {
      padding: 0.625rem;
      font-size: 14px;
    }
    
    .btn {
      padding: 0.75rem;
      font-size: 0.85rem;
    }
  }
  
  /* Landscape orientation adjustments */
  @media (max-height: 600px) and (orientation: landscape) {
    .register-card {
      max-height: calc(100vh - 140px);
      margin-top: 3rem;
    }
    
    .register-header {
      top: 50px;
    }
    
    .register-header h2 {
      font-size: 1.1rem;
    }
    
    .participant-fieldset {
      margin-bottom: 0.75rem;
      padding: 1rem;
    }
  }
`;

// NEW: memoized participant fieldset component to reduce re-renders
const ParticipantFieldset = React.memo(function ParticipantFieldset({ idx, data, updateField, removeParticipant, removable }) {
  return (
    <fieldset className="participant-fieldset">
      <legend>Participant {idx + 1}</legend>
      <div className="row">
        <input placeholder="Name" value={data.name} onChange={e => updateField(idx, 'name', e.target.value)} required className="input name" />
        <input placeholder="Class" value={data.cls} onChange={e => updateField(idx, 'cls', e.target.value)} className="input cls" />
      </div>
      <div className="row">
        <input placeholder="Email" value={data.email} onChange={e => updateField(idx, 'email', e.target.value)} required className="input email" />
        <input placeholder="Phone" value={data.phone} onChange={e => updateField(idx, 'phone', e.target.value)} className="input phone" />
      </div>
      <div className="row">
        <input placeholder="Registration No" value={data.registrationNo} onChange={e => updateField(idx, 'registrationNo', e.target.value)} className="input regno" />
      </div>
      {removable && <button type="button" className="btn link" onClick={() => removeParticipant(idx)}>Remove</button>}
    </fieldset>
  );
});

export default function RegisterPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const initialEventId = query.get('event') || events[0].id;
  const [eventId, setEventId] = useState(initialEventId);
  const videoRef = useRef(null);

  // MEMO: compute selectedEvent + maxParticipants once per eventId change
  const selectedEvent = useMemo(() => events.find(e => e.id === eventId) || events[0], [eventId]);
  const maxParticipants = useMemo(() => Math.min(4, selectedEvent.maxParticipants || 1), [selectedEvent]);
  // MEMO: static event option data
  const eventOptions = useMemo(() => events.map(ev => ({
    id: ev.id,
    title: ev.title,
    max: Math.min(4, ev.maxParticipants || 1)
  })), []);

  const [participants, setParticipants] = useState(() => [{ name: '', cls: '', email: '', phone: '', registrationNo: '' }]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  const formRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Normalize participants only if limit changed
    setParticipants(prev => {
      const limit = Math.max(1, maxParticipants);
      if (prev.length === limit && prev.every(p => 'registrationNo' in p)) return prev;
      let arr = prev.slice(0, limit);
      if (arr.length === 0) arr = [{ name: '', cls: '', email: '', phone: '', registrationNo: '' }];
      return arr.map(p => ({ registrationNo: p.registrationNo || '', ...p }));
    });
  }, [eventId, maxParticipants]);

  // DEFER GSAP entrance: CSS anim first, then upgrade after first interaction
  useEffect(() => {
    if (cardRef.current) cardRef.current.classList.add('enter');
    const firstInteraction = () => {
      loadGsap().then(gsap => {
        if (gsap && cardRef.current) gsap.set(cardRef.current, { opacity: 1, y: 0 });
      });
    };
    window.addEventListener('pointerdown', firstInteraction, { passive: true, once: true });
  }, []);

  // SEO: dynamic title + meta description
  useEffect(() => {
    document.title = `${selectedEvent.title} Registration`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = `Register participants for ${selectedEvent.title}.`;
  }, [selectedEvent.title]);

  // Scroll handler for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;
      
      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current && headerVisible) {
          // Scrolling down - hide header
          setHeaderVisible(false);
        } else if (currentScrollY < lastScrollY.current && !headerVisible) {
          // Scrolling up - show header
          setHeaderVisible(true);
        }
      } else {
        // At top of page - always show header
        if (!headerVisible) setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerVisible]);

  // Reduced motion & visibility pause for video
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && videoRef.current) videoRef.current.pause();
    function handleVis() {
      if (!videoRef.current) return;
      if (document.hidden) videoRef.current.pause();
      else if (!prefersReducedMotion) videoRef.current.play();
    }
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  // CALLBACKS: stabilize to reduce child re-renders
  const updateField = useCallback((idx, field, value) => {
    setParticipants(prev => {
      const copy = prev.slice();
      copy[idx] = { ...(copy[idx] || {}), [field]: value };
      return copy;
    });
  }, []);

  const addParticipant = useCallback(() => {
    setParticipants(prev => (prev.length < maxParticipants ? [...prev, { name: '', cls: '', email: '', phone: '', registrationNo: '' }] : prev));
    loadGsap().then(gsap => {
      if (gsap && formRef.current) gsap.fromTo(formRef.current, { scale: 0.995 }, { scale: 1, duration: 0.26, ease: 'back.out(1.2)' });
    });
  }, [maxParticipants]);

  const removeParticipant = useCallback((idx) => {
    setParticipants(prev => prev.filter((_, i) => i !== idx));
    loadGsap().then(gsap => {
      if (gsap && formRef.current) gsap.to(formRef.current, { scale: 0.995, duration: 0.12, yoyo: true, repeat: 1 });
    });
  }, []);

  useEffect(() => {
    performance.mark?.('register-mounted');
    try {
      performance.measure?.('register-render-to-mounted', 'register-render-start', 'register-mounted');
    } catch {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setMessage(null);

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.name || !p.email) {
        setMessage({ type: 'error', text: `Participant ${i+1}: name and email required.` });
        setSending(false);
        return;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const payload = {
      eventId,
      eventTitle: selectedEvent.title,
      participants,
      timestamp: new Date().toISOString(),
    };

    try {
      const resp = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!resp.ok) throw new Error('Network response not OK');
      setMessage({ type: 'success', text: 'Registration submitted — thank you!' });

      // success animation using GSAP if available
      try {
        const gsap = await loadGsap();
        if (gsap && cardRef.current) {
          gsap.to(cardRef.current, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1 });
          gsap.to(cardRef.current, { opacity: 0.96, duration: 0.2, delay: 0.4 });
        }
      } catch {}

      setTimeout(() => navigate('/events'), 1400);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to send registration. Please try again later.' });
    } finally {
      setSending(false);
    }
  }

  async function handleCancel() {
    try {
      const gsap = await loadGsap();
      if (gsap && cardRef.current) {
        await new Promise(resolve => {
          gsap.to(cardRef.current, { scale: 0.88, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: resolve });
        });
      }
    } catch {}
    finally {
      navigate('/events');
    }
  }

  return (
    <div className="register-page" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      padding: '2rem 1rem',
      paddingTop: '120px',
      paddingBottom: '2rem',
      display: 'flex', 
      alignItems: 'flex-start', 
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll',
      overflowY: 'auto'
    }}>
      <style>{REGISTER_STYLE}</style>
      
      {/* Background overlay for better readability - more blue tint */}
      <div className="register-bg-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 50, 100, 0.6)',
        zIndex: 0,
        pointerEvents: 'none'
      }} aria-hidden />

      {/* Header positioned at top middle */}
      <div ref={headerRef} className={`register-header ${!headerVisible ? 'hidden' : ''}`}>
        <h2 id="register-heading">Register for Event</h2>
      </div>

      <div ref={cardRef} className="register-card" role="region" aria-labelledby="register-heading" style={{ marginTop: '6rem' }}>
        
        <div className="form-content">
          <form ref={formRef} id="register-form" onSubmit={handleSubmit}>
          <label className="field" style={{ position: 'relative' }}>
            Event
            <div className="event-select">
              <select value={eventId} onChange={e => setEventId(e.target.value)} className="input native-select">
                {eventOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.title} (max {opt.max})</option>
                ))}
              </select>
              <div className="event-display animated-gradient" aria-hidden>
                {selectedEvent.title} (max {maxParticipants})
              </div>
            </div>
          </label>

          <div className="participants">
            {participants.map((p, idx) => (
              <ParticipantFieldset
                key={idx}
                idx={idx}
                data={p}
                updateField={updateField}
                removeParticipant={removeParticipant}
                removable={idx > 0}
              />
            ))}
          </div>

          {message && <div className={`msg ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}
        </form>
      </div>

        {/* Card Footer with participant buttons */}
        <div className="card-footer">
          <div className="controls">
            <button type="button" className="btn" onClick={addParticipant} disabled={participants.length >= maxParticipants}>Add participant</button>
            <button type="submit" form={formRef.current?.id || 'register-form'} className="btn primary" disabled={sending}>{sending ? 'Sending…' : 'Submit'}</button>
            <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
