import React, { useEffect, useState } from 'react';
import events from '../data/events';
import EventCard from '../components/EventCard';

export default function Events(){
  const [ThreeSceneComp, setThreeSceneComp] = useState(null);
  const [threeLoadError, setThreeLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    // dynamic import so build-time bundler doesn't require "three" unless/til it's used
    import('../components/ThreeEventsScene.jsx')
      .then(mod => {
        if (mounted && mod && mod.default) setThreeSceneComp(() => mod.default);
      })
      .catch(err => {
        // three or postprocessing not installed / failed to load — fallback to grid
        console.warn('ThreeEventsScene failed to load:', err);
        if (mounted) setThreeLoadError(true);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="events-page">
      <h2>All Events</h2>

      {/* Three.js immersive scene: only render if dynamic import succeeded */}
      {ThreeSceneComp && !threeLoadError ? (
        <section style={{ height: 680, marginBottom: 28 }}>
          <ThreeSceneComp />
        </section>
      ) : (
        // optional message when three failed to load (keeps UI friendly)
        threeLoadError ? (
          <div style={{ marginBottom: 18, color: '#cfd6da' }}>
            Interactive 3D view unavailable — showing standard event grid.
          </div>
        ) : (
          <div style={{ marginBottom: 18, color: '#cfd6da' }}>
            Loading interactive view...
          </div>
        )
      )}

      {/* Fallback grid (kept for accessibility / no-webgl fallback) */}
      <div className="events-grid" aria-hidden={ThreeSceneComp && !threeLoadError}>
        {events.map((ev, i) => (
          <EventCard key={ev.id} event={ev} index={i} />
        ))}
      </div>
    </div>
  );
}
