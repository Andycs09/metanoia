import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Howl } from 'howler';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Schedule from './pages/Schedule';
import Starfield from './components/Starfield';

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
    <div className="app unoverse-theme">
      <Starfield intensity={1.0} sparkPerMove={4} /> {/* interactive background */}
      <Header />
      <main>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/events" exact component={Events} />
          <Route path="/events/:id" component={EventDetail} />
          <Route path="/schedule" component={Schedule} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}