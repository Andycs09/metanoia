import React, { useEffect } from 'react';
import { Howl } from 'howler';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import Register from './pages/Register'; // new
import Starfield from './components/Starfield'; // added
import { Routes, Route } from 'react-router-dom'; // add Routes/Route import (remove BrowserRouter import here if present)

const NotFound = () => (
  <main style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <div>
      <h2>404 — Page not found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
    </div>
  </main>
);

export default function App() {
  useEffect(() => {
    const sound = new Howl({
      src: ['/assets/uno-theme.mp3'], // add your mp3 in public/assets
      loop: true,
      volume: 0.2,
      autoplay: true,
    });
    sound.play();
    return () => sound.unload();
  }, []);

  return (
    <>
      {/* Global aurora wave background (site-wide) */}
      <div className="aurora-global" aria-hidden>
        <div className="aurora-wave aurora-wave--one" />
        <div className="aurora-wave aurora-wave--two" />
      </div>

      {/* Global interactive starfield (follows pointer / touch) */}
      <Starfield />

      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/register" element={<Register />} /> {/* added */}
          <Route path="*" element={<NotFound />} /> {/* catch-all */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}