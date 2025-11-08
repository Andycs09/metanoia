import React, { useEffect, useRef } from 'react';

export default function Starfield({
  intensity = 1.0, // global intensity multiplier
  sparkPerMove = 4, // how many sparks per pointer move
}) {
  const ref = useRef();
  const particles = useRef([]);
  const stars = useRef([]);
  const pointer = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, down: false });
  const raf = useRef();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const container = ref.current;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });

    let DPR = Math.max(1, window.devicePixelRatio || 1);

    function resize() {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initStars();
    }

    function rand(min = 0, max = 1) { return Math.random() * (max - min) + min; }

    // color palette: white, red, blue, gold
    const palette = ['#ffffff', '#ff3b30', '#1e90ff', '#ffd700'];

    // convert hex color to rgba string with alpha
    function hexToRgba(hex, a = 1) {
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${a})`;
    }

    // background stars
    function initStars() {
      stars.current = [];
      const count = Math.floor(80 * intensity * (window.innerWidth / 1200));
      for (let i = 0; i < count; i++) {
        stars.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: rand(0.4, 1.8),
          alpha: rand(0.06, 0.35),
          tw: Math.random() * Math.PI * 2,
          twSpeed: rand(0.001, 0.008),
        });
      }
    }

    function spawnSpark(x, y, vx = 0, vy = 0) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(0.6, 3.6) * (pointer.current.down ? 1.6 : 1.0) * intensity;
      const color = palette[Math.floor(rand(0, palette.length))];
      particles.current.push({
        x, y,
        vx: vx * 0.2 + Math.cos(angle) * speed,
        vy: vy * 0.2 + Math.sin(angle) * speed - rand(0.2, 1.6),
        life: Math.floor(rand(28, 68)),
        ttl: Math.floor(rand(28, 68)),
        r: rand(1.2, 5.6),
        color,
        glow: rand(6, 18),
      });
    }

    // spawn a burst (on pointer down or heavy move)
    function spawnBurst(x, y, n = 8) {
      for (let i = 0; i < n; i++) spawnSpark(x, y);
    }

    // pointer handling without blocking UI: listen on window and let canvas be pointer-events:none
    let lastX = 0, lastY = 0;
    function onPointerMove(e) {
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || lastX;
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || lastY;
      pointer.current.vx = (x - lastX);
      pointer.current.vy = (y - lastY);
      pointer.current.x = x;
      pointer.current.y = y;
      lastX = x; lastY = y;
      // spawn a few sparks depending on movement
      const moves = sparkPerMove + Math.min(6, Math.abs(pointer.current.vx) / 8 + Math.abs(pointer.current.vy) / 8);
      for (let i = 0; i < moves; i++) {
        spawnSpark(x + rand(-8,8), y + rand(-8,8), pointer.current.vx * (0.1 + Math.random()*0.2), pointer.current.vy * (0.1 + Math.random()*0.2));
      }
    }
    function onPointerDown(e) {
      pointer.current.down = true;
      const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || pointer.current.x;
      const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || pointer.current.y;
      spawnBurst(x, y, 14);
    }
    function onPointerUp() { pointer.current.down = false; }

    // animation loop
    function step() {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // draw subtle background glow
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(8,10,18,0.0)');
      g.addColorStop(1, 'rgba(4,6,12,0.12)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // draw stars
      for (let s of stars.current) {
        s.tw += s.twSpeed;
        const a = s.alpha * (0.6 + 0.4 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // update & draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy += 0.03; // gravity subtle
        p.life--;
        const t = 1 - p.life / p.ttl;
        const alpha = Math.max(0, Math.min(1, (1 - t) * 1.1));

        // draw glow using particle color
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(p.color, alpha * 0.25);
        ctx.arc(p.x, p.y, p.r * 3.0, 0, Math.PI * 2);
        ctx.fill();

        // draw core using particle color at full alpha
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(p.color, alpha);
        ctx.arc(p.x, p.y, Math.max(0.8, p.r * (1 - t * 0.8)), 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0 || p.x < -50 || p.y < -50 || p.x > w + 50 || p.y > h + 50) {
          particles.current.splice(i, 1);
        }
      }

      raf.current = requestAnimationFrame(step);
    }

    // init
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    // fallback for touch events if pointer events not supported
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    raf.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchend', onPointerUp);
      // remove canvas
      try { container.removeChild(canvas); } catch (e) {}
    };
  }, [intensity, sparkPerMove]);

  // container is an empty div used to mount the canvas
  return <div ref={ref} className="starfield-container" aria-hidden="true" />;
}
