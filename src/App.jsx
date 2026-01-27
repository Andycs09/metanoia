import React, { useEffect } from 'react';
import { Howl } from 'howler';
import Header from './components/Header';
import GlobalFooter from './components/GlobalFooter';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import ScheduleUpdate from './pages/ScheduleUpdate';
import Register from './pages/Register';
import UnoGame from './pages/UnoGame';
import UnoRegister from './pages/UnoRegister';
import NotFound from './pages/NotFound';
import Starfield from './components/Starfield';
import ShootingStars from './components/ShootingStars';
import Preloader from './components/Preloader';
import { Routes, Route, useLocation } from 'react-router-dom';

const NotFoundComponent = () => <NotFound />;

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isScheduleUpdatePage = location.pathname === '/schedule_update';

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
      {/* Preloader - Shows before site loads */}
      <Preloader />

      {/* Global aurora wave background (site-wide) */}
      <div className="aurora-global" aria-hidden>
        <div className="aurora-wave aurora-wave--one" />
        <div className="aurora-wave aurora-wave--two" />
      </div>

      {/* Global interactive starfield (follows pointer / touch) */}
      {/* <Starfield /> */}

      {/* Global shooting stars animation */}
      <ShootingStars />

      {/* Hide default header on home page and schedule update page */}
      {!isHomePage && !isScheduleUpdatePage && <Header />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule_update" element={<ScheduleUpdate />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game/register" element={<UnoRegister />} />
          <Route path="/game" element={<UnoGame />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </main>
      
      {/* Hide footer on schedule update page */}
      {!isScheduleUpdatePage && <GlobalFooter />}
    </>
  );
}
