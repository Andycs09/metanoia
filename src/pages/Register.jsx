import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import events from '../data/events';

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

// PERF + UX: styles (add flip lock + button-like anchors with bigger hit-area)
const REGISTER_STYLE = `
  .register-page { font-family: 'Stack Sans Notch', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
  .register-card {
    border: 10px solid gold;
    box-shadow: inset 0 0 0 6px rgba(255,0,0,0.95);
    background-clip: padding-box;
    contain: layout paint style;
    will-change: transform;
    opacity:0;
    transform:translateY(40px);
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
  .input { font-size:16px; color:#fff; }
  .input.small { font-size:16px; }
  .input.name { color:#ff2b2b; } .input.name::placeholder { color:rgba(255,43,43,0.7); }
  .input.cls { color:#2bd16a; } .input.cls::placeholder { color:rgba(43,209,106,0.7); }
  .input.email { color:#ffd92b; } .input.email::placeholder { color:rgba(255,217,43,0.8); }
  .input.phone { color:#3fb0ff; } .input.phone::placeholder { color:rgba(63,176,255,0.75); }
  .input.regno { color:#ffffff; } .input.regno::placeholder { color:rgba(255,255,255,0.65); }
  .input::placeholder, .input.small::placeholder { font-size:16px; opacity:1; }

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

  /* Ensure front/back stacking and pointer behavior when flipped */
  .flip-card.is-flipped .flip-card-front {
    pointer-events: none;
  }
  .flip-card.is-flipped .flip-card-back {
    pointer-events: auto;
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

  const formRef = useRef(null);
  const cardRef = useRef(null);

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
    <div className="register-page" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{REGISTER_STYLE}</style>
      <video
        ref={videoRef}
        className="register-bg-video"
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        fetchPriority="low"
        poster="/images/register-poster.jpg"
        style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'fixed', inset: 0, contain: 'layout paint', willChange: 'opacity' }}
        aria-hidden
      />

      <div className="register-bg-overlay" aria-hidden />

      <div ref={cardRef} className="register-card" role="region" aria-labelledby="register-heading">
        <h2 id="register-heading">Register for Event</h2>

        <form ref={formRef} onSubmit={handleSubmit}>
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

          <div className="controls">
            <button type="button" className="btn" onClick={addParticipant} disabled={participants.length >= maxParticipants}>Add participant</button>
            <button type="submit" className="btn primary" disabled={sending}>{sending ? 'Sending…' : 'Submit'}</button>
            {/* ANIMATED CANCEL */}
            <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
          </div>

          {message && <div className={`msg ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}
        </form>
      </div>
    </div>
  );
}
