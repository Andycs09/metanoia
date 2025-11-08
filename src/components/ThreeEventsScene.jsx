import React, { useEffect, useRef, useState } from 'react';
import events from '../data/events';

export default function ThreeEventsScene({
  cols = 4,
  rows = 2,
  spacingX = 3.2,
  spacingY = 0,
  spacingZ = 2.6,
}) {
  const mountRef = useRef(null);
  const overlayRef = useRef(null);
  const cameraRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | failed

  useEffect(() => {
    let mounted = true;
    let renderer = null;
    let scene = null;
    let camera = null;
    let composer = null;
    let raf = null;
    let meshes = [];
    let raycaster;
    let pointer = { x: -9999, y: -9999 };

    async function init() {
      try {
        // dynamic imports (only at runtime)
        // use literal import strings with /* @vite-ignore */ to avoid Vite's static analysis
        const THREE = await import(/* @vite-ignore */ 'three').catch(() => { throw new Error('three not available'); });
        const post = await import(/* @vite-ignore */ 'postprocessing').catch(() => ({}));
        const EffectComposer = post.EffectComposer, BloomEffect = post.BloomEffect, EffectPass = post.EffectPass, RenderPass = post.RenderPass;
        const gsapMod = await import(/* @vite-ignore */ 'gsap').catch(() => ({}));
        const gsap = gsapMod.gsap || gsapMod.default || null;

        if (!mounted) return;

        const container = mountRef.current;
        if (!container) return;

        // renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(container.clientWidth, container.clientHeight, false);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.domElement.style.display = 'block';
        container.appendChild(renderer.domElement);

        // scene + camera
        scene = new THREE.Scene();
        scene.background = new THREE.Color('#000000');
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 200);
        camera.position.set(0, 1.6, 12);
        cameraRef.current = camera;

        // lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambient);
        const spotLeft = new THREE.SpotLight(0x203a8f, 0.6, 40, Math.PI / 6, 0.4, 1);
        spotLeft.position.set(-10, 8, 10);
        scene.add(spotLeft);
        const spotRight = new THREE.SpotLight(0xff6b5a, 0.45, 40, Math.PI / 6, 0.6, 1);
        spotRight.position.set(12, 6, 8);
        scene.add(spotRight);

        // postprocessing (optional)
        if (EffectComposer && RenderPass && EffectPass && BloomEffect) {
          try {
            composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);
            const bloom = new BloomEffect({ intensity: 0.18, luminanceThreshold: 0.6, kernelSize: 2 });
            const effectPass = new EffectPass(camera, bloom);
            effectPass.renderToScreen = true;
            composer.addPass(effectPass);
          } catch (err) {
            composer = null;
          }
        }

        // geometry / texture loader
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        const geom = new THREE.PlaneGeometry(1.8, 2.6, 1, 1);

        function imgUrl(filename) {
          try { return new URL(`../../images/${filename}`, import.meta.url).href; } catch { return filename; }
        }

        // build mesh grid
        meshes = [];
        let idx = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (idx >= events.length) break;
            const ev = events[idx];
            const texUrl = imgUrl(ev.image);
            const tex = loader.load(texUrl);
            tex.encoding = THREE.sRGBEncoding;
            tex.anisotropy = 4;
            const mat = new THREE.MeshStandardMaterial({
              map: tex,
              metalness: 0.08,
              roughness: 0.36,
              envMapIntensity: 0.8,
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.userData = { eventIndex: idx, event: ev };
            const centerX = (cols - 1) / 2;
            mesh.position.x = (c - centerX) * spacingX;
            mesh.position.y = spacingY - 6; // start lower for fly-in
            mesh.position.z = -r * spacingZ;
            mesh.rotation.z = (Math.random() - 0.5) * 0.02;
            mesh.rotation.x = (Math.random() - 0.5) * 0.03;
            mesh.scale.set(1.02, 1.02, 1.02);
            scene.add(mesh);
            meshes.push(mesh);

            // staggered fly-in if gsap available
            if (gsap) {
              gsap.to(mesh.position, { duration: 1.0, y: spacingY, ease: 'power3.out', delay: idx * 0.06 });
              gsap.fromTo(mesh.rotation, { y: -0.8 }, { y: 0, duration: 1.0, delay: idx * 0.06, ease: 'power3.out' });
            } else {
              // fallback instant position
              mesh.position.y = spacingY;
            }

            idx++;
          }
        }

        // helpers
        raycaster = new THREE.Raycaster();

        // pointer handling
        function onPointerMove(e) {
          const rect = renderer.domElement.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          pointer.x = x; pointer.y = y;
        }
        function onPointerDown(e) { onPointerMove(e); }

        renderer.domElement.style.touchAction = 'none';
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });

        // resize
        function onResize() {
          const w = container.clientWidth, h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          if (composer && composer.setSize) composer.setSize(w, h);
        }
        window.addEventListener('resize', onResize);

        // animation loop
        const clock = new THREE.Clock();
        let offsets = meshes.map(() => Math.random() * Math.PI * 2);
        function animate() {
          const t = clock.getElapsedTime();

          meshes.forEach((m, i) => {
            const floatY = Math.sin(t * 0.9 + offsets[i]) * 0.18;
            m.position.y = spacingY + floatY;
            const px = pointer.x, py = pointer.y;
            const mx = m.position.x, mz = m.position.z;
            const dist = Math.sqrt(Math.pow(px - (mx / (spacingX * cols)), 2) + Math.pow(py - (mz / (spacingZ * rows)), 2));
            const att = Math.max(0.12, 1 - Math.min(1, dist * 1.6));
            m.rotation.x = (py * 0.12) * att + Math.sin(t * 0.6 + offsets[i]) * 0.01;
            m.rotation.y = (px * 0.14) * att;
          });

          // raycast hover scale
          raycaster.setFromCamera(pointer, camera);
          const intersects = raycaster.intersectObjects(meshes, false);
          meshes.forEach(m => m.scale.lerp(new THREE.Vector3(1.02, 1.02, 1.02), 0.06));
          if (intersects.length > 0) {
            const hit = intersects[0].object;
            hit.scale.lerp(new THREE.Vector3(1.09, 1.09, 1.09), 0.12);
            if (hit.material && hit.material.emissive) hit.material.emissive.setHex(0x111111);
          }

          if (composer && composer.render) composer.render(clock.getDelta());
          else renderer.render(scene, camera);

          raf = requestAnimationFrame(animate);
        }
        raf = requestAnimationFrame(animate);

        // click -> focus camera
        function onClick(e) {
          const rect = renderer.domElement.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          pointer.x = x; pointer.y = y;
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects(meshes, false);
          if (hits.length > 0) {
            const hit = hits[0].object;
            const idx = hit.userData.eventIndex;
            // Zoom using gsap if available
            if (gsap) {
              const target = hit.position.clone().add(new THREE.Vector3(0, 0, 1.8));
              gsap.to(camera.position, { x: target.x, y: target.y + 0.1, z: target.z + 0.8, duration: 1.0, ease: 'power3.out' });
              if (overlayRef.current) overlayRef.current.style.opacity = '0.6';
            } else {
              camera.position.set(hit.position.x, hit.position.y + 0.1, hit.position.z + 1.8);
            }
          } else {
            // reset
            if (gsap) gsap.to(camera.position, { x: 0, y: 1.6, z: 12, duration: 0.9, ease: 'power3.out' });
            else camera.position.set(0, 1.6, 12);
            if (overlayRef.current) overlayRef.current.style.opacity = '0';
          }
        }
        renderer.domElement.addEventListener('pointerdown', onClick, { passive: true });

        // store references for cleanup
        // expose to outer scope
        // set loaded
        if (mounted) setStatus('ready');

        // cleanup function
        const cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('resize', onResize);
          renderer.domElement.removeEventListener('pointerdown', onClick);
          meshes.forEach(m => {
            if (m.geometry) m.geometry.dispose();
            if (m.material) {
              if (m.material.map) m.material.map.dispose();
              m.material.dispose();
            }
            scene.remove(m);
          });
          if (composer && composer.dispose) try { composer.dispose(); } catch {}
          try { renderer.forceContextLoss(); } catch {}
          try { container.removeChild(renderer.domElement); } catch {}
        };

        // attach cleanup to outer scope
        (mountRef.current || {}).__three_cleanup = cleanup;
      } catch (err) {
        console.warn('ThreeEventsScene runtime import failed or initialization error:', err);
        if (mounted) setStatus('failed');
      }
    } // end init

    init();

    return () => {
      mounted = false;
      // call cleanup if available
      try {
        const c = mountRef.current;
        if (c && c.__three_cleanup) c.__three_cleanup();
      } catch {}
    };
  }, [cols, rows, spacingX, spacingY, spacingZ]);

  // Render: container + dim overlay + optional messages
  return (
    <div className="three-scene-wrap" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} className="three-canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 10 }} />
      <div ref={overlayRef} className="three-dim-overlay" style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.32s ease', background: 'rgba(0,0,0,0.6)' }} />
      {status === 'loading' && (
        <div style={{ position: 'absolute', zIndex: 40, left: 12, top: 12, color: '#cfd6da' }}>Loading 3D view…</div>
      )}
      {status === 'failed' && (
        <div style={{ position: 'absolute', zIndex: 40, left: 12, top: 12, color: '#ffb4b4' }}>
          3D view unavailable — showing fallback grid below.
        </div>
      )}
    </div>
  );
}
