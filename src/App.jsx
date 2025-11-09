import React, { useEffect } from 'react';
import { Howl } from 'howler';
import Header from './components/Header';
import GlobalFooter from './components/GlobalFooter';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import Register from './pages/Register';
import UnoGame from './pages/UnoGame';
import UnoRegister from './pages/UnoRegister';
import Starfield from './components/Starfield';
import { Routes, Route, useLocation } from 'react-router-dom';

const NotFound = () => (
  <main style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <div>
      <h2>404 — Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  </main>
);

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const sound = new Howl({
      src: ['/assets/uno-theme.mp3'],
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

      {/* Hide default header on home page since it has custom navbar */}
      {!isHomePage && <Header />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game/register" element={<UnoRegister />} />
          <Route path="/game" element={<UnoGame />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <GlobalFooter />
    </>
  );
}
