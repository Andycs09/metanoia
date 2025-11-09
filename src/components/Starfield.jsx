import React, { useEffect, useRef } from 'react';

export default function Starfield({ maxParticles = 600 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, down: false });
  const palette = ['#ffffff', '#ff5a5a', '#5ab8ff', '#ffd166']; // white, red, blue, gold

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'starfield-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '120'; // above aurora but below UI header if needed (adjust)
    canvas.style.pointerEvents = 'none';
    canvasRef.current = canvas;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0, height = 0;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }
    resize();

    let lastTime = performance.now();

    function spawn(x, y, count = 6, pressure = 1) {
      const particles = particlesRef.current;
      for (let i = 0; i < count; i++) {
        if (particles.length > maxParticles) break;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 160 + 40) * (0.6 + 0.8 * pressure);
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed * (0.012 + Math.random() * 0.02),
          vy: Math.sin(angle) * speed * (0.012 + Math.random() * 0.02) - (Math.random() * 0.6),
          life: 0,
          ttl: 700 + Math.random() * 600,
          size: 1 + Math.random() * 3,
          color: palette[Math.floor(Math.random() * palette.length)],
          drift: (Math.random() - 0.5) * 0.06
        });
      }
    }

    function step(now) {
      const dt = Math.min(40, now - lastTime);
      lastTime = now;
      // fade canvas slightly for trails
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        const t = p.life / p.ttl;
        if (t >= 1) {
          particles.splice(i, 1);
          continue;
        }
        // physics
        p.vx += p.drift * (dt * 0.06);
        p.vy += 0.02 * dt * 0.01; // slight gravity
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;

        // draw
        const alpha = Math.max(0, 1 - t);
        const size = p.size * (1 + 0.6 * (1 - t));
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.95;
        ctx.moveTo(p.x + size, p.y);
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // subtle follow-spawn: if pointer is moving, spawn a few each frame
      const ptr = pointerRef.current;
      if (ptr.x >= 0 && ptr.y >= 0 && (ptr.moved || ptr.down)) {
        // spawn rate depends on movement/pressure
        const amt = ptr.down ? 10 : (ptr.moved ? 4 : 0);
        spawn(ptr.x, ptr.y, amt, ptr.pressure || 1);
        ptr.moved = false;
      }

      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    // pointer handlers on window so UI isn't blocked by canvas pointer-events: none
    let lastX = 0, lastY = 0, lastMoveTime = 0;
    function onPointerMove(e) {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      pointerRef.current.x = x;
      pointerRef.current.y = y;
      pointerRef.current.moved = Math.hypot(x - lastX, y - lastY) > 1;
      pointerRef.current.pressure = e.pressure || 1;
      lastX = x; lastY = y; lastMoveTime = now;
    }
    function onPointerDown(e) {
      pointerRef.current.down = true;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.pressure = e.pressure || 1;
      // bigger burst on click
      spawn(pointerRef.current.x, pointerRef.current.y, 28, pointerRef.current.pressure);
    }
    function onPointerUp() {
      pointerRef.current.down = false;
    }

    function onTouchMove(e) {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      pointerRef.current.x = t.clientX;
      pointerRef.current.y = t.clientY;
      pointerRef.current.moved = true;
      pointerRef.current.pressure = t.force || 1;
    }
    function onTouchStart(e) {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      pointerRef.current.x = t.clientX;
      pointerRef.current.y = t.clientY;
      pointerRef.current.down = true;
      pointerRef.current.pressure = t.force || 1;
      spawn(pointerRef.current.x, pointerRef.current.y, 36, pointerRef.current.pressure);
    }
    function onTouchEnd() {
      pointerRef.current.down = false;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', resize);
      try { document.body.removeChild(canvas); } catch (e) {}
    };
  }, [maxParticles]);

  return null; // canvas is appended to body directly
}
