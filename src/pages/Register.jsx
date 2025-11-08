import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import events from '../data/events';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // <-- replace with your URL

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RegisterPage() {
  const query = useQuery();
  const history = useHistory();
  const initialEventId = query.get('event') || events[0].id;
  const [eventId, setEventId] = useState(initialEventId);
  const selectedEvent = events.find(e => e.id === eventId) || events[0];
  const maxParticipants = Math.min(4, selectedEvent.maxParticipants || 1);

  const [participants, setParticipants] = useState(() => [{ name: '', cls: '', email: '', phone: '', registrationNo: '' }]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const formRef = useRef(null);
  const cardRef = useRef(null);
  const videoUrl = new URL('../../images/ac.mp4', import.meta.url).href;

  useEffect(() => {
    // Ensure participants array length is appropriate
    setParticipants(prev => {
      const arr = prev.slice(0, Math.max(1, maxParticipants));
      while (arr.length < 1) arr.push({ name: '', cls: '', email: '', phone: '' });
      return arr;
    });
  }, [eventId, maxParticipants]);

  // GSAP: dynamic import to avoid bundler issues; animate entrance and form actions if available
  useEffect(() => {
    let mounted = true;
    async function runAnim() {
      try {
        const mod = await import(/* @vite-ignore */ 'gsap').catch(() => null);
        const gsap = mod?.gsap || mod?.default || null;
        if (!mounted || !gsap) return;
        if (cardRef.current) {
          gsap.from(cardRef.current, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
        }
      } catch (err) {
        // ignore if GSAP not present
      }
    }
    runAnim();
    return () => { mounted = false; };
  }, []);

  function updateField(idx, field, value) {
    setParticipants(prev => {
      const copy = prev.slice();
      copy[idx] = { ...(copy[idx] || {}), [field]: value };
      return copy;
    });
  }

  async function addParticipant() {
    setParticipants(prev => (prev.length < maxParticipants ? [...prev, { name: '', cls: '', email: '', phone: '', registrationNo: '' }] : prev));
    // small GSAP pop on add if available
    (async () => {
      try {
        const mod = await import(/* @vite-ignore */ 'gsap').catch(() => null);
        const gsap = mod?.gsap || mod?.default || null;
        if (gsap && formRef.current) {
          gsap.fromTo(formRef.current, { scale: 0.995 }, { scale: 1, duration: 0.26, ease: 'back.out(1.2)' });
        }
      } catch {}
    })();
  }
  function removeParticipant(idx) {
    setParticipants(prev => prev.filter((_, i) => i !== idx));
    (async () => {
      try {
        const mod = await import(/* @vite-ignore */ 'gsap').catch(() => null);
        const gsap = mod?.gsap || mod?.default || null;
        if (gsap && formRef.current) gsap.to(formRef.current, { scale: 0.995, duration: 0.12, yoyo: true, repeat: 1 });
      } catch {}
    })();
  }

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

    const payload = {
      eventId,
      eventTitle: selectedEvent.title,
      participants, // registrationNo included per participant
      timestamp: new Date().toISOString(),
    };

    try {
      const resp = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error('Network response not OK');
      setMessage({ type: 'success', text: 'Registration submitted — thank you!' });

      // success animation using GSAP if available
      try {
        const mod = await import(/* @vite-ignore */ 'gsap').catch(() => null);
        const gsap = mod?.gsap || mod?.default || null;
        if (gsap && cardRef.current) {
          gsap.to(cardRef.current, { scale: 1.02, duration: 0.12, yoyo: true, repeat: 1 });
          gsap.to(cardRef.current, { opacity: 0.96, duration: 0.2, delay: 0.4 });
        }
      } catch {}

      setTimeout(() => history.push('/events'), 1400);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to send registration. Please try again later.' });
    } finally {
      setSending(false);
    }
  }

  async function handleCancel() {
    // try GSAP zoom out, then navigate to /events
    try {
      const mod = await import(/* @vite-ignore */ 'gsap').catch(() => null);
      const gsap = mod?.gsap || mod?.default || null;
      if (gsap && cardRef.current) {
        await new Promise(resolve => {
          gsap.to(cardRef.current, { scale: 0.88, opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: resolve });
        });
      }
    } catch (e) {
      // ignore animation errors
    } finally {
      history.push('/events');
    }
  }

  return (
    <div className="register-page" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Video background */}
      <video className="register-bg-video" src={videoUrl} autoPlay muted loop playsInline aria-hidden />

      <div className="register-bg-overlay" aria-hidden />

      <div ref={cardRef} className="register-card" role="region" aria-labelledby="register-heading">
        <h2 id="register-heading">Register for Event</h2>

        <form ref={formRef} onSubmit={handleSubmit}>
          <label className="field" style={{ position: 'relative' }}>
            Event
            <div className="event-select">
              {/* native select (kept for accessibility) */}
              <select value={eventId} onChange={e => setEventId(e.target.value)} className="input native-select">
                {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title} (max {Math.min(4, ev.maxParticipants)})</option>)}
              </select>

              {/* visible gradient event title (updates via state) */}
              <div className="event-display animated-gradient" aria-hidden>
                {selectedEvent.title} (max {Math.min(4, selectedEvent.maxParticipants)})
              </div>
            </div>
          </label>

          <div className="participants">
            {participants.map((p, idx) => (
              <fieldset key={idx} className="participant-fieldset">
                <legend>Participant {idx + 1}</legend>
                <div className="row">
                  <input placeholder="Name" value={p.name} onChange={e => updateField(idx, 'name', e.target.value)} required className="input" />
                  <input placeholder="Class" value={p.cls} onChange={e => updateField(idx, 'cls', e.target.value)} className="input small" />
                </div>
                <div className="row">
                  <input placeholder="Email" value={p.email} onChange={e => updateField(idx, 'email', e.target.value)} required className="input" />
                  <input placeholder="Phone" value={p.phone} onChange={e => updateField(idx, 'phone', e.target.value)} className="input small" />
                </div>

                {/* NEW: Registration No field */}
                <div className="row">
                  <input placeholder="Registration No" value={p.registrationNo} onChange={e => updateField(idx, 'registrationNo', e.target.value)} className="input" />
                </div>

                {idx > 0 && <button type="button" className="btn link" onClick={() => removeParticipant(idx)}>Remove</button>}
              </fieldset>
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
